import {
    assertCompleteCanonicalPost,
    assertApprovedRemoteUser,
    assertEligibleOwnedDraft,
    acfValuesFromCreateInput,
    nonPatchedStateMatches,
    patchMatchesPost,
    PolicyViolation,
    CanonicalReadbackViolation,
    validateCreateInput,
    validateTrashInput,
    validateUpdateInput
} from './policy';
import type {
    AuditRecord,
    AuditSink,
    CanonicalPost,
    CreateMarketingDraftInput,
    ExecutorResult,
    OperationKind,
    OperationLedger,
    OperationLedgerRecord,
    ReadMarketingPostInput,
    RemotePostSchema,
    RemoteUser,
    ReconciliationState,
    TrashMarketingDraftInput,
    UpdateMarketingDraftInput
} from './types';
import {
    CREATE_CHANGED_FIELDS,
    DEFAULT_PROHIBITED_CAPABILITIES,
    FIXED_TAXONOMY,
    REQUIRED_ACF_FIELDS,
    type ExpectedIdentityPolicy,
    type ManagedPostLifecycle
} from './types';
import type { CredentialProvider, CreateDraftTransportInput, CredentialHandle, WordPressTransport } from './transport';

export interface WordPressExecutorDependencies {
    transport: WordPressTransport;
    credentials: CredentialProvider;
    ledger: OperationLedger;
    audit: AuditSink;
    machineUserId: number;
    identityPolicy?: ExpectedIdentityPolicy;
    invokingClient?: string;
}

interface CanonicalReadSuccess {
    kind: 'success';
    post: CanonicalPost;
}

interface CanonicalReadFailure {
    kind: 'failure';
    status: 'ambiguous' | 'readback_failed';
    reason: string;
    reconciliation?: ReconciliationState;
}

type CanonicalRead = CanonicalReadSuccess | CanonicalReadFailure;

function success<T>(operationId: string, value: T): ExecutorResult<T> {
    return { status: 'verified_success', operationId, value };
}

function failure<T>(
    operationId: string,
    status: ExecutorResult<T>['status'],
    reason: string,
    reconciliation?: ReconciliationState
): ExecutorResult<T> {
    return { status, operationId, reason, reconciliation };
}

function materialStateEqual(a: CanonicalPost, b: CanonicalPost): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function patchFields(patch: UpdateMarketingDraftInput['patch']): string[] {
    return Object.keys(patch);
}

function nowIso(): string {
    return new Date().toISOString();
}

export class WordPressDraftCrudExecutor {
    #transport: WordPressTransport;
    #credentials: CredentialProvider;
    #ledger: OperationLedger;
    #audit: AuditSink;
    #machineUserId: number;
    #identityPolicy: ExpectedIdentityPolicy;
    #invokingClient: string;

    constructor(dependencies: WordPressExecutorDependencies) {
        this.#transport = dependencies.transport;
        this.#credentials = dependencies.credentials;
        this.#ledger = dependencies.ledger;
        this.#audit = dependencies.audit;
        this.#machineUserId = dependencies.machineUserId;
        this.#identityPolicy = dependencies.identityPolicy ?? {
            expectedUserId: dependencies.machineUserId,
            approvedRole: 'contributor',
            prohibitedCapabilities: DEFAULT_PROHIBITED_CAPABILITIES
        };
        this.#invokingClient = dependencies.invokingClient ?? 'clo-131-test-client';
    }

    async readMarketingPost(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        let parsed: ReadMarketingPostInput;
        try {
            parsed = this.validateReadInput(input);
        } catch (error) {
            if (error instanceof PolicyViolation) {
                return failure<CanonicalPost>('unavailable', 'policy_rejected', error.message);
            }
            return failure<CanonicalPost>('unavailable', 'policy_rejected', 'Invalid read request.');
        }

        const read = await this.readCanonicalPair(parsed.postId, parsed.context ?? 'view');
        const result =
            read.kind === 'success'
                ? success(parsed.operationId, read.post)
                : failure<CanonicalPost>(parsed.operationId, read.status, read.reason, read.reconciliation);
        this.writeAudit(parsed.operationId, 'readMarketingPost', result, {
            targetPostId: parsed.postId,
            changedFields: [],
            verification: read.kind === 'success' ? 'passed' : 'failed'
        });
        return result;
    }

    async readIdentity(input: unknown): Promise<ExecutorResult<RemoteUser>> {
        let operationId: string;
        try {
            operationId = this.validateOperationOnlyInput(input);
        } catch {
            return failure<RemoteUser>('unavailable', 'policy_rejected', 'Invalid identity-read request.');
        }

        try {
            const response = await this.withCredential(credential =>
                this.#transport.getCurrentUser({ context: 'edit' }, credential)
            );
            let result: ExecutorResult<RemoteUser>;
            if (response.kind === 'error') {
                result = failure<RemoteUser>(operationId, 'readback_failed', 'WordPress identity read failed.');
            } else {
                try {
                    assertApprovedRemoteUser(response.value, this.#identityPolicy);
                    result = success(operationId, response.value);
                } catch (error) {
                    result = failure<RemoteUser>(
                        operationId,
                        error instanceof PolicyViolation ? 'policy_rejected' : 'readback_failed',
                        'WordPress identity did not satisfy the approved executor boundary.'
                    );
                }
            }
            this.writeAudit(operationId, 'readIdentity', result, {
                changedFields: [],
                verification: result.status === 'verified_success' ? 'passed' : 'failed'
            });
            return result;
        } catch {
            const result = failure<RemoteUser>(operationId, 'readback_failed', 'WordPress identity read failed.');
            this.writeAudit(operationId, 'readIdentity', result, {
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }
    }

    async readPostSchema(input: unknown): Promise<ExecutorResult<RemotePostSchema>> {
        let operationId: string;
        let context: 'view' | 'edit';
        try {
            const parsed = this.validateSchemaInput(input);
            operationId = parsed.operationId;
            context = parsed.context;
        } catch {
            return failure<RemotePostSchema>('unavailable', 'policy_rejected', 'Invalid schema-read request.');
        }

        try {
            const response = await this.withCredential(credential =>
                this.#transport.getPostSchema({ context }, credential)
            );
            if (response.kind === 'error') {
                return failure<RemotePostSchema>(operationId, 'readback_failed', 'WordPress post schema read failed.');
            }
            if (!REQUIRED_ACF_FIELDS.every(field => response.value.acfFields.includes(field))) {
                return failure<RemotePostSchema>(
                    operationId,
                    'readback_failed',
                    'Required ACF fields are not registered in the read schema.'
                );
            }
            const result = success(operationId, response.value);
            this.writeAudit(operationId, 'readPostSchema', result, {
                changedFields: [],
                verification: 'passed'
            });
            return result;
        } catch {
            return failure<RemotePostSchema>(operationId, 'readback_failed', 'WordPress post schema read failed.');
        }
    }

    async createMarketingDraft(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        let parsed: CreateMarketingDraftInput;
        try {
            parsed = validateCreateInput(input);
        } catch (error) {
            return failure(
                this.safeOperationId(input),
                'policy_rejected',
                error instanceof Error ? error.message : 'Invalid create request.'
            );
        }

        const existing = this.#ledger.get(parsed.operationId);
        if (existing) {
            if (existing.operation !== 'createMarketingDraft') {
                return failure<CanonicalPost>(
                    parsed.operationId,
                    'policy_rejected',
                    'Operation ID is already reserved for another operation.'
                );
            }
            const result = await this.reconcileCreate(parsed, existing);
            if (result.status === 'verified_success' && result.value) {
                this.finishLedger(parsed.operationId, result, result.value);
            }
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                targetPostId: result.value?.id,
                changedFields: [...CREATE_CHANGED_FIELDS],
                verification: result.status === 'verified_success' ? 'reconciled' : 'failed',
                reconciliation: result.reconciliation
            });
            return result;
        }

        this.#ledger.put({
            operationId: parsed.operationId,
            operation: 'createMarketingDraft',
            machineUserId: this.#machineUserId,
            phase: 'intent',
            changedFields: [...CREATE_CHANGED_FIELDS]
        });

        let preflight: Awaited<ReturnType<WordPressTransport['findDraftForOperation']>>;
        try {
            preflight = await this.withCredential(credential =>
                this.#transport.findDraftForOperation(
                    { operationId: parsed.operationId, authorId: this.#machineUserId },
                    credential
                )
            );
        } catch {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                'readback_failed',
                'Create preflight could not establish canonical state.',
                'unknown'
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                changedFields: [...CREATE_CHANGED_FIELDS],
                verification: 'failed',
                reconciliation: 'unknown'
            });
            return result;
        }
        if (preflight.kind === 'error') {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                'readback_failed',
                'Create preflight could not establish canonical state.',
                'unknown'
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                changedFields: [...CREATE_CHANGED_FIELDS],
                verification: 'failed',
                reconciliation: 'unknown'
            });
            return result;
        }
        if (preflight.value) {
            const canonical = await this.readCanonicalPair(preflight.value.id, 'edit');
            const result =
                canonical.kind === 'success'
                    ? this.verifyCreatedPost(parsed, canonical.post)
                    : failure<CanonicalPost>(
                          parsed.operationId,
                          'partial_mutation',
                          'Existing draft identity was found but required canonical fields did not verify.',
                          'partial'
                      );
            this.finishLedger(
                parsed.operationId,
                result,
                canonical.kind === 'success' ? canonical.post : preflight.value
            );
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                targetPostId: canonical.kind === 'success' ? canonical.post.id : preflight.value.id,
                changedFields: [...CREATE_CHANGED_FIELDS],
                postStateVersion:
                    canonical.kind === 'success' ? canonical.post.modifiedGmt : preflight.value.modifiedGmt,
                verification: result.status === 'verified_success' ? 'reconciled' : 'failed',
                reconciliation: result.reconciliation
            });
            return result;
        }

        this.markAttempted(parsed.operationId);
        const createInput: CreateDraftTransportInput = {
            ...parsed,
            status: 'draft',
            categories: [FIXED_TAXONOMY.categoryId],
            tags: [FIXED_TAXONOMY.tagId]
        };
        let created: Awaited<ReturnType<WordPressTransport['createDraft']>>;
        try {
            created = await this.withCredential(credential => this.#transport.createDraft(createInput, credential));
        } catch {
            const result = await this.reconcileCreateAfterError(parsed);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                targetPostId: result.value?.id,
                changedFields: [...CREATE_CHANGED_FIELDS],
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }
        if (created.kind === 'error') {
            const result = await this.reconcileCreateAfterError(parsed);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
                targetPostId: result.value?.id,
                changedFields: [...CREATE_CHANGED_FIELDS],
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }

        const read = await this.readCanonicalPair(created.value.postId, 'edit');
        const result =
            read.kind === 'failure'
                ? failure<CanonicalPost>(
                      parsed.operationId,
                      read.status,
                      'Create completed but canonical verification did not complete.',
                      read.reconciliation
                  )
                : this.verifyCreatedPost(parsed, read.post);
        this.finishLedger(parsed.operationId, result, read.kind === 'success' ? read.post : undefined);
        this.writeAudit(parsed.operationId, 'createMarketingDraft', result, {
            targetPostId: read.kind === 'success' ? read.post.id : created.value.postId,
            changedFields: [...CREATE_CHANGED_FIELDS],
            postStateVersion: read.kind === 'success' ? read.post.modifiedGmt : undefined,
            verification: result.status === 'verified_success' ? 'passed' : 'failed',
            reconciliation: result.reconciliation
        });
        return result;
    }

    async updateMarketingDraft(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        let parsed: UpdateMarketingDraftInput;
        try {
            parsed = validateUpdateInput(input);
        } catch (error) {
            return failure(
                this.safeOperationId(input),
                'policy_rejected',
                error instanceof Error ? error.message : 'Invalid update request.'
            );
        }

        const existing = this.#ledger.get(parsed.operationId);
        if (existing) {
            if (existing.operation !== 'updateMarketingDraft') {
                return failure<CanonicalPost>(
                    parsed.operationId,
                    'policy_rejected',
                    'Operation ID is already reserved for another operation.'
                );
            }
            const result = await this.reconcileExistingUpdate(parsed, existing);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                changedFields: patchFields(parsed.patch),
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }

        this.#ledger.put({
            operationId: parsed.operationId,
            operation: 'updateMarketingDraft',
            phase: 'intent',
            targetPostId: parsed.postId,
            preStateVersion: parsed.expectedModifiedGmt,
            changedFields: patchFields(parsed.patch)
        });

        const managedState = this.checkManagedPost(parsed.operationId, parsed.postId);
        if (managedState) {
            this.finishLedger(parsed.operationId, managedState);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', managedState, {
                targetPostId: parsed.postId,
                preStateVersion: parsed.expectedModifiedGmt,
                changedFields: patchFields(parsed.patch),
                verification: 'failed'
            });
            return managedState;
        }

        const before = await this.readCanonicalPair(parsed.postId, 'edit');
        if (before.kind === 'failure') {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                before.status,
                'Update pre-read did not produce safe canonical state.',
                before.reconciliation
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: parsed.expectedModifiedGmt,
                changedFields: patchFields(parsed.patch),
                verification: 'failed'
            });
            return result;
        }
        const eligibility = this.checkEligibility(parsed.operationId, before.post, parsed);
        if (eligibility) {
            this.finishLedger(parsed.operationId, eligibility);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', eligibility, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: patchFields(parsed.patch),
                verification: 'failed'
            });
            return eligibility;
        }

        const immediate = await this.readCanonicalPair(parsed.postId, 'edit');
        if (immediate.kind === 'failure') {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                immediate.status,
                'Immediate pre-write reread did not produce safe canonical state.',
                immediate.reconciliation
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: patchFields(parsed.patch),
                verification: 'failed'
            });
            return result;
        }
        if (immediate.post.modifiedGmt !== before.post.modifiedGmt) {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                'conflict',
                'Update precondition changed before the write.'
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: patchFields(parsed.patch),
                verification: 'failed'
            });
            return result;
        }

        this.markAttempted(parsed.operationId);
        let updated: Awaited<ReturnType<WordPressTransport['updateDraft']>>;
        try {
            updated = await this.withCredential(credential =>
                this.#transport.updateDraft(
                    {
                        postId: parsed.postId,
                        expectedModifiedGmt: parsed.expectedModifiedGmt,
                        patch: parsed.patch
                    },
                    credential
                )
            );
        } catch {
            const result = await this.reconcileUpdateAfterError(parsed, before.post);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: patchFields(parsed.patch),
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }
        if (updated.kind === 'error') {
            const result = await this.reconcileUpdateAfterError(parsed, before.post);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: patchFields(parsed.patch),
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }

        const after = await this.readCanonicalPair(parsed.postId, 'edit');
        const result =
            after.kind === 'failure'
                ? failure<CanonicalPost>(
                      parsed.operationId,
                      after.status,
                      'Update completed but canonical verification did not complete.',
                      after.reconciliation
                  )
                : this.verifyUpdatedPost(parsed, before.post, after.post);
        this.finishLedger(parsed.operationId, result, after.kind === 'success' ? after.post : undefined);
        this.writeAudit(parsed.operationId, 'updateMarketingDraft', result, {
            targetPostId: parsed.postId,
            preStateVersion: before.post.modifiedGmt,
            changedFields: patchFields(parsed.patch),
            postStateVersion: after.kind === 'success' ? after.post.modifiedGmt : undefined,
            verification: result.status === 'verified_success' ? 'passed' : 'failed'
        });
        return result;
    }

    async trashMarketingDraft(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        let parsed: TrashMarketingDraftInput;
        try {
            parsed = validateTrashInput(input);
        } catch (error) {
            const operationId = this.safeOperationId(input);
            const result = failure<CanonicalPost>(
                operationId,
                'policy_rejected',
                error instanceof Error ? error.message : 'Invalid trash request.'
            );
            this.writeAudit(operationId, 'trashMarketingDraft', result, {
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }

        const existing = this.#ledger.get(parsed.operationId);
        if (existing) {
            if (existing.operation !== 'trashMarketingDraft') {
                const result = failure<CanonicalPost>(
                    parsed.operationId,
                    'policy_rejected',
                    'Operation ID is already reserved for another operation.'
                );
                this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                    targetPostId: parsed.postId,
                    preStateVersion: parsed.expectedModifiedGmt,
                    changedFields: [],
                    verification: 'failed'
                });
                return result;
            }
            const result = await this.reconcileExistingTrash(parsed, existing);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: parsed.expectedModifiedGmt,
                changedFields: [],
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }

        this.#ledger.put({
            operationId: parsed.operationId,
            operation: 'trashMarketingDraft',
            phase: 'intent',
            targetPostId: parsed.postId,
            preStateVersion: parsed.expectedModifiedGmt,
            changedFields: []
        });
        const managedState = this.checkManagedPost(parsed.operationId, parsed.postId);
        if (managedState) {
            this.finishLedger(parsed.operationId, managedState);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', managedState, {
                targetPostId: parsed.postId,
                preStateVersion: parsed.expectedModifiedGmt,
                changedFields: [],
                verification: 'failed'
            });
            return managedState;
        }
        const before = await this.readCanonicalPair(parsed.postId, 'edit');
        if (before.kind === 'failure') {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                before.status,
                'Trash pre-read did not produce safe canonical state.',
                before.reconciliation
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: parsed.expectedModifiedGmt,
                changedFields: [],
                verification: 'failed',
                reconciliation: result.reconciliation
            });
            return result;
        }
        const eligibility = this.checkEligibility(parsed.operationId, before.post, parsed);
        if (eligibility) {
            this.finishLedger(parsed.operationId, eligibility);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', eligibility, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: [],
                verification: 'failed'
            });
            return eligibility;
        }
        if (before.post.modifiedGmt !== parsed.expectedModifiedGmt) {
            const result = failure<CanonicalPost>(
                parsed.operationId,
                'conflict',
                'Trash precondition does not match canonical version.'
            );
            this.finishLedger(parsed.operationId, result);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }

        this.markAttempted(parsed.operationId);
        let trashed: Awaited<ReturnType<WordPressTransport['trashDraft']>>;
        try {
            trashed = await this.withCredential(credential =>
                this.#transport.trashDraft(
                    {
                        postId: parsed.postId,
                        expectedModifiedGmt: parsed.expectedModifiedGmt
                    },
                    credential
                )
            );
        } catch {
            const result = await this.reconcileTrashAfterError(parsed);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: [],
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }
        if (trashed.kind === 'error') {
            const result = await this.reconcileTrashAfterError(parsed);
            this.finishLedger(parsed.operationId, result, result.value);
            this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
                targetPostId: parsed.postId,
                preStateVersion: before.post.modifiedGmt,
                changedFields: [],
                postStateVersion: result.value?.modifiedGmt,
                verification: 'reconciled',
                reconciliation: result.reconciliation
            });
            return result;
        }
        const after = await this.readCanonicalPair(parsed.postId, 'edit');
        const result =
            after.kind === 'success' && after.post.status === 'trash'
                ? success(parsed.operationId, after.post)
                : after.kind === 'failure'
                  ? failure<CanonicalPost>(
                        parsed.operationId,
                        after.status,
                        'Trash completed but Trash-state verification did not complete.',
                        after.reconciliation
                    )
                  : failure<CanonicalPost>(
                        parsed.operationId,
                        'partial_mutation',
                        'Trash completed without the required Trash-state readback.',
                        'partial'
                    );
        this.finishLedger(parsed.operationId, result, after.kind === 'success' ? after.post : undefined);
        this.writeAudit(parsed.operationId, 'trashMarketingDraft', result, {
            targetPostId: parsed.postId,
            preStateVersion: before.post.modifiedGmt,
            changedFields: [],
            postStateVersion: after.kind === 'success' ? after.post.modifiedGmt : undefined,
            verification: result.status === 'verified_success' ? 'passed' : 'failed',
            reconciliation: result.reconciliation
        });
        return result;
    }

    private async reconcileCreate(
        input: CreateMarketingDraftInput,
        record: OperationLedgerRecord
    ): Promise<ExecutorResult<CanonicalPost>> {
        if (record.phase === 'completed' && record.status === 'verified_success' && record.targetPostId) {
            const read = await this.readCanonicalPair(record.targetPostId, 'edit');
            if (read.kind === 'success') return this.verifyCreatedPost(input, read.post);
        }
        return this.reconcileCreateAfterError(input);
    }

    private async reconcileCreateAfterError(input: CreateMarketingDraftInput): Promise<ExecutorResult<CanonicalPost>> {
        let found: Awaited<ReturnType<WordPressTransport['findDraftForOperation']>>;
        try {
            found = await this.withCredential(credential =>
                this.#transport.findDraftForOperation(
                    { operationId: input.operationId, authorId: this.#machineUserId },
                    credential
                )
            );
        } catch {
            return failure(
                input.operationId,
                'ambiguous',
                'Create result and reconciliation are both unresolved; no retry permitted.',
                'unknown'
            );
        }
        if (found.kind === 'error') {
            return failure(
                input.operationId,
                'ambiguous',
                'Create result and reconciliation are both unresolved; no retry permitted.',
                'unknown'
            );
        }
        if (!found.value) {
            return failure(
                input.operationId,
                'ambiguous',
                'Create may or may not have occurred; no retry permitted.',
                'absent_but_uncertain'
            );
        }
        const canonical = await this.readCanonicalPair(found.value.id, 'edit');
        if (canonical.kind === 'failure') {
            return failure(
                input.operationId,
                'partial_mutation',
                'Create reconciliation found a post but required canonical fields did not verify.',
                'partial'
            );
        }
        return this.verifyCreatedPost(input, canonical.post);
    }

    private verifyCreatedPost(input: CreateMarketingDraftInput, post: CanonicalPost): ExecutorResult<CanonicalPost> {
        try {
            assertCompleteCanonicalPost(post, post.id);
            if (
                post.status !== 'draft' ||
                post.authorId !== this.#machineUserId ||
                JSON.stringify(post.categories) !== JSON.stringify([FIXED_TAXONOMY.categoryId]) ||
                JSON.stringify(post.tags) !== JSON.stringify([FIXED_TAXONOMY.tagId]) ||
                JSON.stringify(post.acf) !== JSON.stringify(acfValuesFromCreateInput(input)) ||
                post.title !== input.title ||
                post.content !== input.content
            ) {
                return failure(
                    input.operationId,
                    'partial_mutation',
                    'Draft readback did not match the approved create contract.',
                    'partial'
                );
            }
            return success(input.operationId, post);
        } catch (error) {
            return failure(
                input.operationId,
                error instanceof CanonicalReadbackViolation ? 'readback_failed' : 'partial_mutation',
                'Draft readback was incomplete or did not match the approved contract.',
                'unknown'
            );
        }
    }

    private async reconcileExistingUpdate(
        input: UpdateMarketingDraftInput,
        record: OperationLedgerRecord
    ): Promise<ExecutorResult<CanonicalPost>> {
        if (record.phase === 'intent') {
            return failure(
                input.operationId,
                'ambiguous',
                'Existing operation intent requires reconciliation before retry.',
                'unknown'
            );
        }
        return this.reconcileUpdateAfterError(input);
    }

    private async reconcileUpdateAfterError(
        input: UpdateMarketingDraftInput,
        before?: CanonicalPost
    ): Promise<ExecutorResult<CanonicalPost>> {
        const after = await this.readCanonicalPair(input.postId, 'edit');
        if (after.kind === 'failure') {
            return failure(
                input.operationId,
                'ambiguous',
                'Update result and reconciliation are unresolved; no retry permitted.',
                'unknown'
            );
        }
        if (after.post.status !== 'draft' || after.post.authorId !== this.#machineUserId) {
            return failure(
                input.operationId,
                'partial_mutation',
                'Update reconciliation found an ineligible post.',
                'partial'
            );
        }
        if (patchMatchesPost(after.post, input.patch)) {
            return success(input.operationId, after.post);
        }
        if (before && materialStateEqual(before, after.post)) {
            return {
                status: 'verified_no_mutation',
                operationId: input.operationId,
                value: after.post
            };
        }
        return failure(
            input.operationId,
            'partial_mutation',
            'Update reconciliation found a partial or mismatched mutation.',
            'partial'
        );
    }

    private verifyUpdatedPost(
        input: UpdateMarketingDraftInput,
        before: CanonicalPost,
        after: CanonicalPost
    ): ExecutorResult<CanonicalPost> {
        try {
            assertCompleteCanonicalPost(after, input.postId);
            if (after.status !== 'draft' || after.authorId !== this.#machineUserId) {
                return failure(
                    input.operationId,
                    'partial_mutation',
                    'Updated post is no longer an eligible machine draft.',
                    'partial'
                );
            }
            if (!patchMatchesPost(after, input.patch)) {
                return failure(
                    input.operationId,
                    'partial_mutation',
                    'Updated fields did not match canonical readback.',
                    'partial'
                );
            }
            if (!nonPatchedStateMatches(before, after, input.patch)) {
                return failure(
                    input.operationId,
                    'partial_mutation',
                    'An unrelated field changed during the update.',
                    'partial'
                );
            }
            return success(input.operationId, after);
        } catch {
            return failure(input.operationId, 'readback_failed', 'Updated post readback was incomplete.', 'unknown');
        }
    }

    private async reconcileExistingTrash(
        input: TrashMarketingDraftInput,
        _record: OperationLedgerRecord
    ): Promise<ExecutorResult<CanonicalPost>> {
        return this.reconcileTrashAfterError(input);
    }

    private async reconcileTrashAfterError(input: TrashMarketingDraftInput): Promise<ExecutorResult<CanonicalPost>> {
        const after = await this.readCanonicalPair(input.postId, 'edit');
        if (after.kind === 'failure') {
            return failure(
                input.operationId,
                'ambiguous',
                'Trash result and reconciliation are unresolved; no retry permitted.',
                'unknown'
            );
        }
        if (after.post.status === 'trash') return success(input.operationId, after.post);
        if (after.post.status === 'draft' && after.post.modifiedGmt === input.expectedModifiedGmt) {
            return { status: 'verified_no_mutation', operationId: input.operationId, value: after.post };
        }
        return failure(
            input.operationId,
            'partial_mutation',
            'Trash reconciliation found an unexpected post state.',
            'partial'
        );
    }

    private checkEligibility<T extends { postId: number; expectedModifiedGmt: string }>(
        operationId: string,
        post: CanonicalPost,
        input: T
    ): ExecutorResult<CanonicalPost> | undefined {
        const managedState = this.checkManagedPost(operationId, post.id);
        if (managedState) return managedState;
        try {
            assertEligibleOwnedDraft(post, this.#machineUserId, 'updateMarketingDraft');
        } catch {
            return failure(operationId, 'policy_rejected', 'Post is not an owned, non-public machine draft.');
        }
        if (post.modifiedGmt !== input.expectedModifiedGmt) {
            return failure(operationId, 'conflict', 'Expected post version does not match canonical state.');
        }
        return undefined;
    }

    private checkManagedPost(operationId: string, postId: number): ExecutorResult<CanonicalPost> | undefined {
        try {
            const managed = this.#ledger.getManagedPost(postId, this.#machineUserId);
            if (!managed || managed.managedLifecycle !== 'managed_active') {
                return failure(operationId, 'policy_rejected', 'Post is not a verified executor-managed draft.');
            }
        } catch {
            return failure(operationId, 'policy_rejected', 'Managed-post state was unavailable; mutation rejected.');
        }
        return undefined;
    }

    private async readCanonicalPair(postId: number, context: 'view' | 'edit'): Promise<CanonicalRead> {
        try {
            return await this.#credentials.withCredential(async credential => {
                const schema = await this.#transport.getPostSchema({ context }, credential);
                if (schema.kind === 'error') {
                    return {
                        kind: 'failure',
                        status: 'readback_failed',
                        reason: 'Required WordPress schema could not be read.'
                    } satisfies CanonicalReadFailure;
                }
                if (!REQUIRED_ACF_FIELDS.every(field => schema.value.acfFields.includes(field))) {
                    return {
                        kind: 'failure',
                        status: 'readback_failed',
                        reason: 'Required ACF fields are not registered in the read schema.'
                    } satisfies CanonicalReadFailure;
                }

                const normal = await this.#transport.getPost({ postId, context, freshness: 'normal' }, credential);
                const directed = await this.#transport.getPost({ postId, context, freshness: 'directed' }, credential);
                if (normal.kind === 'error' || directed.kind === 'error') {
                    return {
                        kind: 'failure',
                        status: 'readback_failed',
                        reason: 'Canonical WordPress post read failed.'
                    } satisfies CanonicalReadFailure;
                }
                try {
                    assertCompleteCanonicalPost(normal.value.post, postId);
                    assertCompleteCanonicalPost(directed.value.post, postId);
                    if (
                        !this.freshnessIsSafe(normal.value.freshness) ||
                        !this.freshnessIsSafe(directed.value.freshness)
                    ) {
                        return {
                            kind: 'failure',
                            status: 'readback_failed',
                            reason: 'Freshness evidence is not safe for canonical use.'
                        } satisfies CanonicalReadFailure;
                    }
                    if (!materialStateEqual(normal.value.post, directed.value.post)) {
                        return {
                            kind: 'failure',
                            status: 'ambiguous',
                            reason: 'Normal and freshness-directed reads disagree.',
                            reconciliation: 'unknown'
                        } satisfies CanonicalReadFailure;
                    }
                    return { kind: 'success', post: normal.value.post } satisfies CanonicalReadSuccess;
                } catch {
                    return {
                        kind: 'failure',
                        status: 'readback_failed',
                        reason: 'Canonical WordPress post representation was incomplete.'
                    } satisfies CanonicalReadFailure;
                }
            });
        } catch {
            return {
                kind: 'failure',
                status: 'readback_failed',
                reason: 'Credential or transport operation failed before safe readback.',
                reconciliation: 'unknown'
            };
        }
    }

    private freshnessIsSafe(freshness: { supportedSafeRead: boolean; sharedCacheHit: boolean; age?: string }): boolean {
        return freshness.supportedSafeRead && !freshness.sharedCacheHit && freshness.age === undefined;
    }

    private async withCredential<T>(operation: (credential: CredentialHandle) => Promise<T>): Promise<T> {
        try {
            return await this.#credentials.withCredential(operation);
        } catch {
            throw new Error('Credential provider operation failed.');
        }
    }

    private finishLedger(operationId: string, result: ExecutorResult<CanonicalPost>, post?: CanonicalPost): void {
        const prior = this.#ledger.get(operationId);
        if (!prior) return;
        const lifecycle = this.lifecycleAfterResult(prior, result);
        const targetPostId = post?.id ?? prior.targetPostId;
        if (
            lifecycle &&
            prior.operation !== 'createMarketingDraft' &&
            targetPostId !== undefined &&
            lifecycle !== prior.managedLifecycle
        ) {
            this.#ledger.setManagedPostLifecycle(targetPostId, this.#machineUserId, lifecycle);
        }
        this.#ledger.put({
            ...prior,
            phase: 'completed',
            status: result.status,
            targetPostId,
            postStateVersion: post?.modifiedGmt,
            reconciliation: result.reconciliation,
            managedLifecycle: lifecycle ?? prior.managedLifecycle
        });
    }

    private markAttempted(operationId: string): void {
        const prior = this.#ledger.get(operationId);
        if (prior) this.#ledger.put({ ...prior, phase: 'attempted', mutationAttempted: true });
    }

    private lifecycleAfterResult(
        prior: OperationLedgerRecord,
        result: ExecutorResult<CanonicalPost>
    ): ManagedPostLifecycle | undefined {
        if (prior.operation === 'createMarketingDraft') {
            return result.status === 'verified_success' ? 'managed_active' : prior.managedLifecycle;
        }
        if (!prior.mutationAttempted) return prior.managedLifecycle;
        if (result.status === 'verified_success') {
            return prior.operation === 'trashMarketingDraft' ? 'managed_retired' : 'managed_active';
        }
        if (result.status === 'verified_no_mutation') return 'managed_active';
        if (
            result.status === 'partial_mutation' ||
            result.status === 'ambiguous' ||
            result.status === 'readback_failed'
        ) {
            return 'recovery_required';
        }
        return prior.managedLifecycle;
    }

    private writeAudit(
        operationId: string,
        operation: OperationKind,
        result: ExecutorResult<unknown>,
        details: Partial<Omit<AuditRecord, 'operationId' | 'timestamp' | 'invokingClient' | 'operation' | 'result'>>
    ): void {
        this.#audit.record({
            operationId,
            timestamp: nowIso(),
            invokingClient: this.#invokingClient,
            operation,
            result: result.status,
            targetPostId: details.targetPostId,
            preStateVersion: details.preStateVersion,
            changedFields: details.changedFields ?? [],
            postStateVersion: details.postStateVersion,
            verification: details.verification ?? 'not_applicable',
            reconciliation: details.reconciliation ?? result.reconciliation
        });
    }

    private safeOperationId(input: unknown): string {
        if (typeof input === 'object' && input !== null && 'operationId' in input) {
            const value = (input as { operationId?: unknown }).operationId;
            if (typeof value === 'string' && value.length <= 128) return value;
        }
        return 'unavailable';
    }

    private validateReadInput(input: unknown): ReadMarketingPostInput {
        if (
            typeof input !== 'object' ||
            input === null ||
            Array.isArray(input) ||
            Object.keys(input).some(key => !['operationId', 'postId', 'context'].includes(key))
        ) {
            throw new PolicyViolation();
        }
        const value = input as Record<string, unknown>;
        if (
            typeof value.operationId !== 'string' ||
            !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value.operationId) ||
            !Number.isInteger(value.postId) ||
            (value.context !== undefined && value.context !== 'view' && value.context !== 'edit')
        ) {
            throw new PolicyViolation();
        }
        return {
            operationId: value.operationId,
            postId: value.postId as number,
            context: value.context as 'view' | 'edit' | undefined
        };
    }

    private validateOperationOnlyInput(input: unknown): string {
        if (
            typeof input !== 'object' ||
            input === null ||
            Array.isArray(input) ||
            Object.keys(input).some(key => key !== 'operationId')
        ) {
            throw new PolicyViolation();
        }
        const operationId = (input as Record<string, unknown>).operationId;
        if (typeof operationId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(operationId)) {
            throw new PolicyViolation();
        }
        return operationId;
    }

    private validateSchemaInput(input: unknown): { operationId: string; context: 'view' | 'edit' } {
        if (
            typeof input !== 'object' ||
            input === null ||
            Array.isArray(input) ||
            Object.keys(input).some(key => !['operationId', 'context'].includes(key))
        ) {
            throw new PolicyViolation();
        }
        const value = input as Record<string, unknown>;
        if (
            typeof value.operationId !== 'string' ||
            !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value.operationId) ||
            (value.context !== undefined && value.context !== 'view' && value.context !== 'edit')
        ) {
            throw new PolicyViolation();
        }
        return {
            operationId: value.operationId,
            context: (value.context as 'view' | 'edit' | undefined) ?? 'view'
        };
    }
}

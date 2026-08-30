import { assertApprovedRemoteUser, assertCompleteCanonicalPost, PolicyViolation } from './policy';
import type {
    AuditRecord,
    AuditSink,
    CanonicalPost,
    ExecutorResult,
    ExpectedIdentityPolicy,
    FreshnessEvidence,
    ReadContext,
    ReadMarketingPostInput,
    RemotePostSchema,
    RemoteUser
} from './types';
import { DEFAULT_PROHIBITED_CAPABILITIES, REQUIRED_ACF_FIELDS } from './types';
import type { CredentialProvider, WordPressReadTransport } from './transport';

export interface WordPressReadExecutorDependencies {
    transport: WordPressReadTransport;
    credentials: CredentialProvider;
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
    reconciliation?: 'unknown';
}

type CanonicalRead = CanonicalReadSuccess | CanonicalReadFailure;

function success<T>(operationId: string, value: T): ExecutorResult<T> {
    return { status: 'verified_success', operationId, value };
}

function failure<T>(
    operationId: string,
    status: ExecutorResult<T>['status'],
    reason: string,
    reconciliation?: 'unknown'
): ExecutorResult<T> {
    return { status, operationId, reason, reconciliation };
}

function materialStateEqual(a: CanonicalPost, b: CanonicalPost): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

function nowIso(): string {
    return new Date().toISOString();
}

function requirePlainObject(input: unknown): Record<string, unknown> {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        throw new PolicyViolation();
    }
    return input as Record<string, unknown>;
}

function requireOperationId(input: unknown): string {
    if (typeof input !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(input)) {
        throw new PolicyViolation();
    }
    return input;
}

function requirePostId(input: unknown): number {
    if (typeof input !== 'number' || !Number.isInteger(input) || input <= 0) {
        throw new PolicyViolation();
    }
    return input;
}

function requireAllowedKeys(input: Record<string, unknown>, allowed: readonly string[]): void {
    const allowedSet = new Set(allowed);
    if (Object.keys(input).some(key => !allowedSet.has(key))) {
        throw new PolicyViolation();
    }
}

function parseOperationOnlyInput(input: unknown): string {
    const value = requirePlainObject(input);
    requireAllowedKeys(value, ['operationId']);
    return requireOperationId(value.operationId);
}

function parseReadInput(input: unknown): ReadMarketingPostInput {
    const value = requirePlainObject(input);
    requireAllowedKeys(value, ['operationId', 'postId', 'context']);
    const context = value.context;
    if (context !== undefined && context !== 'view' && context !== 'edit') {
        throw new PolicyViolation();
    }
    return {
        operationId: requireOperationId(value.operationId),
        postId: requirePostId(value.postId),
        context: context as ReadContext | undefined
    };
}

function parseSchemaInput(input: unknown): { operationId: string; context: ReadContext } {
    const value = requirePlainObject(input);
    requireAllowedKeys(value, ['operationId', 'context']);
    const context = value.context;
    if (context !== undefined && context !== 'view' && context !== 'edit') {
        throw new PolicyViolation();
    }
    return {
        operationId: requireOperationId(value.operationId),
        context: (context as ReadContext | undefined) ?? 'view'
    };
}

function parsePostBoundaryInput(input: unknown): { operationId: string; postId: number } {
    const value = requirePlainObject(input);
    requireAllowedKeys(value, ['operationId', 'postId']);
    return {
        operationId: requireOperationId(value.operationId),
        postId: requirePostId(value.postId)
    };
}

/**
 * Credentialed read-only surface. This class deliberately depends on the read
 * transport interface and never constructs or exposes the mutation executor.
 */
export class WordPressReadExecutor {
    #transport: WordPressReadTransport;
    #credentials: CredentialProvider;
    #audit: AuditSink;
    #machineUserId: number;
    #identityPolicy: ExpectedIdentityPolicy;
    #invokingClient: string;

    constructor(dependencies: WordPressReadExecutorDependencies) {
        this.#transport = dependencies.transport;
        this.#credentials = dependencies.credentials;
        this.#audit = dependencies.audit;
        this.#machineUserId = dependencies.machineUserId;
        this.#identityPolicy = dependencies.identityPolicy ?? {
            expectedUserId: dependencies.machineUserId,
            approvedRole: 'contributor',
            prohibitedCapabilities: DEFAULT_PROHIBITED_CAPABILITIES
        };
        this.#invokingClient = dependencies.invokingClient ?? 'cloud-city-wordpress-read-executor';
    }

    async readMarketingPost(input: unknown): Promise<ExecutorResult<CanonicalPost>> {
        let parsed: ReadMarketingPostInput;
        try {
            parsed = parseReadInput(input);
        } catch {
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
            operationId = parseOperationOnlyInput(input);
        } catch {
            return failure<RemoteUser>('unavailable', 'policy_rejected', 'Invalid identity-read request.');
        }

        try {
            const response = await this.#credentials.withCredential(credential =>
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
        let context: ReadContext;
        try {
            const parsed = parseSchemaInput(input);
            operationId = parsed.operationId;
            context = parsed.context;
        } catch {
            return failure<RemotePostSchema>('unavailable', 'policy_rejected', 'Invalid schema-read request.');
        }

        try {
            const response = await this.#credentials.withCredential(credential =>
                this.#transport.getPostSchema({ context }, credential)
            );
            if (response.kind === 'error') {
                const result = failure<RemotePostSchema>(
                    operationId,
                    'readback_failed',
                    'WordPress post schema read failed.'
                );
                this.writeAudit(operationId, 'readPostSchema', result, {
                    changedFields: [],
                    verification: 'failed'
                });
                return result;
            }
            if (!REQUIRED_ACF_FIELDS.every(field => response.value.acfFields.includes(field))) {
                const result = failure<RemotePostSchema>(
                    operationId,
                    'readback_failed',
                    'Required ACF fields are not registered in the read schema.'
                );
                this.writeAudit(operationId, 'readPostSchema', result, {
                    changedFields: [],
                    verification: 'failed'
                });
                return result;
            }
            const result = success(operationId, response.value);
            this.writeAudit(operationId, 'readPostSchema', result, {
                changedFields: [],
                verification: 'passed'
            });
            return result;
        } catch {
            const result = failure<RemotePostSchema>(
                operationId,
                'readback_failed',
                'WordPress post schema read failed.'
            );
            this.writeAudit(operationId, 'readPostSchema', result, {
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }
    }

    async readEditableDrafts(input: unknown): Promise<ExecutorResult<readonly CanonicalPost[]>> {
        let operationId: string;
        try {
            operationId = parseOperationOnlyInput(input);
        } catch {
            return failure<readonly CanonicalPost[]>(
                'unavailable',
                'policy_rejected',
                'Invalid editable-drafts request.'
            );
        }

        try {
            const response = await this.#credentials.withCredential(credential =>
                this.#transport.getEditableDrafts({ authorId: this.#machineUserId, context: 'edit' }, credential)
            );
            if (response.kind === 'error') {
                const result = failure<readonly CanonicalPost[]>(
                    operationId,
                    'readback_failed',
                    'Editable draft collection read failed.'
                );
                this.writeAudit(operationId, 'readEditableDrafts', result, {
                    changedFields: [],
                    verification: 'failed'
                });
                return result;
            }
            try {
                response.value.forEach(post => assertCompleteCanonicalPost(post));
            } catch {
                const result = failure<readonly CanonicalPost[]>(
                    operationId,
                    'readback_failed',
                    'Editable draft collection contained an incomplete post.'
                );
                this.writeAudit(operationId, 'readEditableDrafts', result, {
                    changedFields: [],
                    verification: 'failed'
                });
                return result;
            }
            const result = success(operationId, response.value);
            this.writeAudit(operationId, 'readEditableDrafts', result, {
                changedFields: [],
                verification: 'passed'
            });
            return result;
        } catch {
            const result = failure<readonly CanonicalPost[]>(
                operationId,
                'readback_failed',
                'Editable draft collection read failed.'
            );
            this.writeAudit(operationId, 'readEditableDrafts', result, {
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }
    }

    async readPublishedPostEditBoundary(input: unknown): Promise<ExecutorResult<'allowed' | 'forbidden'>> {
        let operationId: string;
        let postId: number;
        try {
            const parsed = parsePostBoundaryInput(input);
            operationId = parsed.operationId;
            postId = parsed.postId;
        } catch {
            return failure<'allowed' | 'forbidden'>('unavailable', 'policy_rejected', 'Invalid post-boundary request.');
        }

        try {
            const response = await this.#credentials.withCredential(credential =>
                this.#transport.getPublishedPostEditAccess({ postId }, credential)
            );
            let result: ExecutorResult<'allowed' | 'forbidden'>;
            if (response.kind === 'error') {
                result = failure(operationId, 'readback_failed', 'Published-post edit boundary read failed.');
            } else if (response.value === 'forbidden') {
                result = success(operationId, response.value);
            } else {
                result = failure(
                    operationId,
                    'policy_rejected',
                    'Published-post edit access is broader than the approved boundary.'
                );
            }
            this.writeAudit(operationId, 'readPublishedPostEditBoundary', result, {
                targetPostId: postId,
                changedFields: [],
                verification: result.status === 'verified_success' ? 'passed' : 'failed'
            });
            return result;
        } catch {
            const result = failure<'allowed' | 'forbidden'>(
                operationId,
                'readback_failed',
                'Published-post edit boundary read failed.'
            );
            this.writeAudit(operationId, 'readPublishedPostEditBoundary', result, {
                targetPostId: postId,
                changedFields: [],
                verification: 'failed'
            });
            return result;
        }
    }

    private async readCanonicalPair(postId: number, context: ReadContext): Promise<CanonicalRead> {
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

    private freshnessIsSafe(freshness: FreshnessEvidence): boolean {
        return freshness.supportedSafeRead && !freshness.sharedCacheHit && freshness.age === undefined;
    }

    private writeAudit(
        operationId: string,
        operation: AuditRecord['operation'],
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
}

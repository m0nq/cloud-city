/** @jest-environment node */

import {
    CREATE_CHANGED_FIELDS,
    FIXED_TAXONOMY,
    type ExecutorResult,
    type RemoteUser
} from '@/wordpress-executor/types';
import { WordPressDraftCrudExecutor } from '@/wordpress-executor/executor';
import { WordPressReadExecutor } from '@/wordpress-executor/read-executor';
import {
    InMemoryWordPressTransport,
    MemoryAuditSink,
    MemoryOperationLedger,
    SyntheticCredentialProvider
} from '@/wordpress-executor/testing';

const SYNTHETIC_SECRET = 'synthetic-secret-never-output-131';
const MACHINE_USER_ID = 73;

function createHarness(ledger: MemoryOperationLedger = new MemoryOperationLedger()) {
    const transport = new InMemoryWordPressTransport({ machineUserId: MACHINE_USER_ID });
    const audit = new MemoryAuditSink();
    const credentials = new SyntheticCredentialProvider(SYNTHETIC_SECRET);
    const dependencies = {
        transport,
        credentials,
        ledger,
        audit,
        machineUserId: MACHINE_USER_ID
    };
    const executor = new WordPressDraftCrudExecutor(dependencies);

    return { executor, transport, audit, ledger, credentials, dependencies };
}

function unmanagedDraft(overrides: Partial<Parameters<InMemoryWordPressTransport['seedPost']>[0]> = {}) {
    return {
        id: 8001,
        slug: 'unmanaged-synthetic-draft',
        status: 'draft' as const,
        authorId: MACHINE_USER_ID,
        modifiedGmt: '2026-08-28T01:00:00',
        title: 'Unmanaged synthetic draft',
        content: 'Synthetic content only.',
        categories: [FIXED_TAXONOMY.categoryId],
        tags: [FIXED_TAXONOMY.tagId],
        acf: {
            event_datetime: '2026-04-18 16:00:00',
            address: '1740 Telegraph ave Oakland, CA 94612',
            ticket_link: 'https://luma.com/3pkzxvge'
        },
        ...overrides
    };
}

function createInput(overrides: Record<string, unknown> = {}) {
    return {
        operationId: 'op-create-001',
        title: 'CLO-129 synthetic draft',
        content: 'Synthetic content only.',
        event_datetime: '2026-04-18 16:00:00',
        address: '1740 Telegraph ave Oakland, CA 94612',
        ticket_link: 'https://luma.com/3pkzxvge',
        ...overrides
    };
}

function contributorUser(overrides: Partial<RemoteUser> = {}): RemoteUser {
    return {
        id: MACHINE_USER_ID,
        roles: ['contributor'],
        capabilities: {
            read: true,
            edit_posts: true,
            delete_posts: true,
            assign_categories: true,
            assign_post_tags: true,
            publish_posts: false,
            edit_published_posts: false,
            delete_published_posts: false,
            edit_others_posts: false,
            manage_options: false,
            activate_plugins: false,
            install_plugins: false,
            edit_plugins: false,
            edit_themes: false,
            switch_themes: false,
            promote_users: false,
            create_users: false,
            delete_users: false
        },
        extraCapabilities: {},
        ...overrides
    };
}

async function createDraft(harness = createHarness()) {
    const result = await harness.executor.createMarketingDraft(createInput());
    expect(result.status).toBe('verified_success');
    if (result.status !== 'verified_success' || !result.value) {
        throw new Error('Expected a verified synthetic draft.');
    }
    return { ...harness, result, post: result.value };
}

describe('WordPress marketing executor contract', () => {
    it('creates a fixed-taxonomy draft and performs canonical readback', async () => {
        const harness = createHarness();
        const result = await harness.executor.createMarketingDraft(createInput());

        expect(result.status).toBe('verified_success');
        expect(result.value).toMatchObject({
            status: 'draft',
            authorId: MACHINE_USER_ID,
            categories: [FIXED_TAXONOMY.categoryId],
            tags: [FIXED_TAXONOMY.tagId],
            acf: {
                event_datetime: '2026-04-18 16:00:00',
                address: '1740 Telegraph ave Oakland, CA 94612',
                ticket_link: 'https://luma.com/3pkzxvge'
            }
        });
        expect(harness.transport.mutationCounts.create).toBe(1);
        expect(harness.transport.lastCreateRequest).not.toHaveProperty('authorId');
        expect(harness.ledger.getManagedPost(result.value?.id ?? -1, MACHINE_USER_ID)).toMatchObject({
            operation: 'createMarketingDraft',
            phase: 'completed',
            status: 'verified_success',
            managedLifecycle: 'managed_active'
        });
        expect(harness.audit.records[0]).toMatchObject({
            operation: 'createMarketingDraft',
            result: 'verified_success',
            changedFields: [...CREATE_CHANGED_FIELDS]
        });
    });

    it('fails closed when canonical readback does not match the created deterministic slug', async () => {
        const harness = createHarness();
        harness.transport.setNextCreateResultSlug('expected-deterministic-slug');

        const result = await harness.executor.createMarketingDraft(createInput());

        expect(result.status).toBe('partial_mutation');
        expect(result.reason).toBe('Draft readback did not match the approved create contract.');
        expect(harness.transport.mutationCounts.create).toBe(1);
    });

    it.each([
        ['publish', { status: 'publish' }],
        ['future', { status: 'future' }],
        ['private', { status: 'private' }],
        ['force delete', { force: true }],
        ['arbitrary endpoint', { path: '/wp-json/wp/v2/users' }],
        ['arbitrary method', { method: 'DELETE' }],
        ['caller authorization', { headers: { Authorization: 'Bearer caller-secret' } }],
        ['caller arbitrary header', { headers: { 'X-Caller-Control': 'unsafe' } }],
        ['caller author override', { author: 999 }],
        ['arbitrary ACF key', { extra_acf: 'not-allowlisted' }],
        ['taxonomy creation', { create_category: 'New category' }],
        ['arbitrary plugin operation', { plugin: 'activate-me' }],
        ['arbitrary theme operation', { theme: 'change-me' }],
        ['arbitrary user operation', { user: 'promote-me' }],
        ['arbitrary settings operation', { settings: { allow: 'anything' } }]
    ])('rejects a model request attempting %s', async (_label, extra) => {
        const harness = createHarness();
        const result = await harness.executor.createMarketingDraft(createInput(extra));

        expect(result.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.create).toBe(0);
    });

    it('rejects null ACF writes and invalid event-time representations', async () => {
        const harness = createHarness();

        await expect(harness.executor.createMarketingDraft(createInput({ address: null }))).resolves.toMatchObject({
            status: 'policy_rejected'
        });
        await expect(
            harness.executor.createMarketingDraft(createInput({ event_datetime: '2026-04-18T16:00:00-07:00' }))
        ).resolves.toMatchObject({ status: 'policy_rejected' });
        for (const invalidDateTime of ['2026-13-01 12:00:00', '2026-02-30 12:00:00', '2026-01-01 25:00:00']) {
            await expect(
                harness.executor.createMarketingDraft(
                    createInput({ operationId: invalidDateTime, event_datetime: invalidDateTime })
                )
            ).resolves.toMatchObject({ status: 'policy_rejected' });
        }
        expect(harness.transport.mutationCounts.create).toBe(0);
    });

    it('rejects arbitrary taxonomy IDs even when they are otherwise valid integers', async () => {
        const harness = createHarness();
        const result = await harness.executor.createMarketingDraft(createInput({ categories: [999], tags: [998] }));

        expect(result.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.create).toBe(0);
    });

    it('does not expose a generic request method or caller-controlled transport headers', () => {
        const harness = createHarness();

        expect('request' in harness.transport).toBe(false);
        expect('rawRest' in harness.executor).toBe(false);
        expect('wordpressFetch' in harness.executor).toBe(false);
    });

    it('rejects UPDATE of a matching but unmanaged machine draft before transport mutation', async () => {
        const harness = createHarness();
        const post = unmanagedDraft();
        harness.transport.seedPost(post);

        const result = await harness.executor.updateMarketingDraft({
            operationId: 'op-update-unmanaged',
            postId: post.id,
            expectedModifiedGmt: post.modifiedGmt,
            patch: { address: 'must not write' }
        });

        expect(result.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.update).toBe(0);
    });

    it('rejects Trash of a matching but unmanaged machine draft before transport mutation', async () => {
        const harness = createHarness();
        const post = unmanagedDraft();
        harness.transport.seedPost(post);

        const result = await harness.executor.trashMarketingDraft({
            operationId: 'op-trash-unmanaged',
            postId: post.id,
            expectedModifiedGmt: post.modifiedGmt
        });

        expect(result.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.trash).toBe(0);
    });

    it('fails closed when managed-post state is unavailable', async () => {
        class ManagedStateUnavailableLedger extends MemoryOperationLedger {
            override getManagedPost(_postId: number, _machineUserId: number): undefined {
                throw new Error('synthetic managed-state outage');
            }
        }

        const harness = createHarness(new ManagedStateUnavailableLedger());
        const post = unmanagedDraft({ id: 8002 });
        harness.transport.seedPost(post);

        const result = await harness.executor.updateMarketingDraft({
            operationId: 'op-update-managed-state-unavailable',
            postId: post.id,
            expectedModifiedGmt: post.modifiedGmt,
            patch: { address: 'must not write' }
        });

        expect(result.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.update).toBe(0);

        const trash = await harness.executor.trashMarketingDraft({
            operationId: 'op-trash-managed-state-unavailable',
            postId: post.id,
            expectedModifiedGmt: post.modifiedGmt
        });
        expect(trash.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.trash).toBe(0);
    });

    it('keeps CREATE unavailable after read-only authentication until a writer is explicitly constructed', async () => {
        const harness = createHarness();
        const readOnly = new WordPressReadExecutor(harness.dependencies);

        const identity = await readOnly.readIdentity({ operationId: 'op-read-identity' });
        const schema = await readOnly.readPostSchema({ operationId: 'op-read-schema' });

        expect(identity.status).toBe('verified_success');
        expect(schema.status).toBe('verified_success');
        for (const prohibitedSurface of [
            'createMarketingDraft',
            'updateMarketingDraft',
            'trashMarketingDraft',
            'permanentlyDeletePost',
            'request',
            'rawRest',
            'wordpressFetch'
        ]) {
            expect(prohibitedSurface in readOnly).toBe(false);
        }

        const plausibleAixMistake = (readOnly as unknown as { createMarketingDraft?: (input: unknown) => unknown })
            .createMarketingDraft;
        expect(plausibleAixMistake).toBeUndefined();
        expect(harness.transport.mutationCounts).toEqual({ create: 0, update: 0, trash: 0 });

        const writer = new WordPressDraftCrudExecutor(harness.dependencies);
        expect('createMarketingDraft' in writer).toBe(true);
        expect('updateMarketingDraft' in writer).toBe(true);
        expect('trashMarketingDraft' in writer).toBe(true);
    });

    it('accepts the expected Contributor-like identity with complete capability evidence', async () => {
        const harness = createHarness();
        harness.transport.setCurrentUser(contributorUser());

        const result = await harness.executor.readIdentity({ operationId: 'op-identity-approved' });

        expect(result.status).toBe('verified_success');
        expect(result.value).toMatchObject({
            id: MACHINE_USER_ID,
            roles: ['contributor'],
            extraCapabilities: {}
        });
    });

    it.each([
        ['wrong user ID', contributorUser({ id: 999 }), 'policy_rejected'],
        ['wrong role', contributorUser({ roles: ['author'] }), 'policy_rejected'],
        [
            'unexpected publish capability',
            contributorUser({ capabilities: { ...contributorUser().capabilities, publish_posts: true } }),
            'policy_rejected'
        ],
        [
            'unexpected admin capability',
            contributorUser({ capabilities: { ...contributorUser().capabilities, manage_options: true } }),
            'policy_rejected'
        ],
        [
            'unexpected extra capability',
            contributorUser({ extraCapabilities: { activate_plugins: true } }),
            'policy_rejected'
        ],
        ['missing capability evidence', contributorUser({ capabilities: undefined as never }), 'readback_failed'],
        [
            'malformed capability evidence',
            contributorUser({ capabilities: { read: 'yes' } as unknown as Readonly<Record<string, boolean>> }),
            'readback_failed'
        ],
        ['missing role evidence', contributorUser({ roles: undefined as never }), 'readback_failed'],
        ['malformed role evidence', contributorUser({ roles: ['contributor', 73 as never] }), 'readback_failed']
    ])('rejects identity evidence with %s', async (_label, user, expectedStatus) => {
        const harness = createHarness();
        harness.transport.setCurrentUser(user);

        const result = await harness.executor.readIdentity({
            operationId: `op-identity-${_label.replace(/[^A-Za-z0-9._:-]/g, '-')}`
        });

        expect(result.status).toBe(expectedStatus);
    });

    it('fails closed on malformed identity ID evidence', async () => {
        const harness = createHarness();
        harness.transport.setCurrentUser(contributorUser({ id: '73' as never }));

        await expect(harness.executor.readIdentity({ operationId: 'op-identity-malformed-id' })).resolves.toMatchObject(
            {
                status: 'readback_failed'
            }
        );
    });

    it.each([
        ['missing read', { read: false }],
        ['missing edit_posts', { edit_posts: false }],
        ['missing delete_posts', { delete_posts: false }]
    ])('rejects a well-formed identity missing required primitive capability: %s', async (_label, change) => {
        const harness = createHarness();
        harness.transport.setCurrentUser(
            contributorUser({ capabilities: { ...contributorUser().capabilities, ...change } })
        );

        await expect(
            harness.executor.readIdentity({ operationId: `op-identity-${_label.replace(/[^A-Za-z0-9._:-]/g, '-')}` })
        ).resolves.toMatchObject({ status: 'policy_rejected' });
    });

    it.each([
        ['missing extra_capabilities', { extraCapabilities: undefined as never }],
        ['malformed extra_capabilities value', { extraCapabilities: { delegated: 'yes' } as never }]
    ])('fails closed on %s', async (_label, change) => {
        const harness = createHarness();
        harness.transport.setCurrentUser(contributorUser(change));

        await expect(
            harness.executor.readIdentity({ operationId: `op-identity-${_label.replace(/[^A-Za-z0-9._:-]/g, '-')}` })
        ).resolves.toMatchObject({ status: 'readback_failed' });
    });

    it('reconciles timeout-after-success without retrying CREATE', async () => {
        const harness = createHarness();
        harness.transport.failNextCreateAfterApplying('timeout');

        const first = await harness.executor.createMarketingDraft(createInput());
        const second = await harness.executor.createMarketingDraft(createInput());

        expect(first.status).toBe('verified_success');
        expect(second.status).toBe('verified_success');
        expect(harness.transport.mutationCounts.create).toBe(1);
    });

    it('classifies partial CREATE and never blindly retries it', async () => {
        const harness = createHarness();
        harness.transport.failNextCreateAfterPartialApplication();

        const first = await harness.executor.createMarketingDraft(createInput());
        const second = await harness.executor.createMarketingDraft(createInput());

        expect(first.status).toBe('partial_mutation');
        expect(second.status).toBe('partial_mutation');
        expect(harness.transport.mutationCounts.create).toBe(1);
        expect(
            harness.ledger.getManagedPost(harness.transport.lastCreatedPostId ?? -1, MACHINE_USER_ID)
        ).toBeUndefined();

        const postId = harness.transport.lastCreatedPostId as number;
        const update = await harness.executor.updateMarketingDraft({
            operationId: 'op-update-partial-create',
            postId,
            expectedModifiedGmt: '2026-08-28T01:00:00',
            patch: { address: 'must not write' }
        });
        const trash = await harness.executor.trashMarketingDraft({
            operationId: 'op-trash-partial-create',
            postId,
            expectedModifiedGmt: '2026-08-28T01:00:00'
        });
        expect(update.status).toBe('policy_rejected');
        expect(trash.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.update).toBe(0);
        expect(harness.transport.mutationCounts.trash).toBe(0);
    });

    it('classifies absent-after-timeout as ambiguous and does not retry', async () => {
        const harness = createHarness();
        harness.transport.failNextCreateWithoutApplying();

        const first = await harness.executor.createMarketingDraft(createInput());
        const second = await harness.executor.createMarketingDraft(createInput());

        expect(first.status).toBe('ambiguous');
        expect(first.reconciliation).toBe('absent_but_uncertain');
        expect(second.status).toBe('ambiguous');
        expect(harness.transport.mutationCounts.create).toBe(1);
        expect(
            harness.ledger.getManagedPost(harness.transport.lastCreatedPostId ?? -1, MACHINE_USER_ID)
        ).toBeUndefined();

        const postId = harness.transport.lastCreatedPostId as number;
        const update = await harness.executor.updateMarketingDraft({
            operationId: 'op-update-ambiguous-create',
            postId,
            expectedModifiedGmt: '2026-08-28T01:00:00',
            patch: { address: 'must not write' }
        });
        const trash = await harness.executor.trashMarketingDraft({
            operationId: 'op-trash-ambiguous-create',
            postId,
            expectedModifiedGmt: '2026-08-28T01:00:00'
        });
        expect(update.status).toBe('policy_rejected');
        expect(trash.status).toBe('policy_rejected');
        expect(harness.transport.mutationCounts.update).toBe(0);
        expect(harness.transport.mutationCounts.trash).toBe(0);
    });

    it('does not allow an operation ID to be reused for another operation kind', async () => {
        const created = await createDraft();
        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-create-001',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'must not write' }
        });

        expect(result.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.update).toBe(0);
    });

    it('updates only sparse approved fields after an optimistic version check', async () => {
        const created = await createDraft();
        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-001',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: {
                address: 'New safe address'
            }
        });

        expect(result.status).toBe('verified_success');
        expect(result.value).toMatchObject({
            title: 'CLO-129 synthetic draft',
            content: 'Synthetic content only.',
            acf: {
                address: 'New safe address',
                event_datetime: '2026-04-18 16:00:00',
                ticket_link: 'https://luma.com/3pkzxvge'
            }
        });
        expect(created.transport.lastUpdatePatch).toEqual({
            address: 'New safe address'
        });
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_active'
        });
    });

    it('rejects stale UPDATE preconditions and does not write', async () => {
        const created = await createDraft();
        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-stale',
            postId: created.post.id,
            expectedModifiedGmt: '2000-01-01T00:00:00',
            patch: { address: 'Should not write' }
        });

        expect(result.status).toBe('conflict');
        expect(created.transport.mutationCounts.update).toBe(0);
    });

    it('rejects UPDATE attempts to change status, fields, taxonomy, or use force', async () => {
        const created = await createDraft();
        const inputs = [
            { status: 'publish' },
            { force: true },
            { unknownField: 'x' },
            { patch: { custom_field: 'x' } },
            { patch: { event_datetime: null } },
            { patch: { categories: [210] } },
            { patch: { tags: [203] } },
            { patch: { categories: [999] } }
        ];

        for (const extra of inputs) {
            const result = await created.executor.updateMarketingDraft({
                operationId: `op-rejected-${JSON.stringify(extra)}`,
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt,
                patch: { address: 'safe', ...(extra.patch as object | undefined) },
                ...extra
            } as never);
            expect(result.status).toBe('policy_rejected');
        }
        expect(created.transport.mutationCounts.update).toBe(0);
    });

    it('rejects UPDATE of published or other-author posts', async () => {
        const created = await createDraft();
        created.transport.setPostState(created.post.id, {
            status: 'publish'
        });
        await expect(
            created.executor.updateMarketingDraft({
                operationId: 'op-update-published',
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt,
                patch: { address: 'not allowed' }
            })
        ).resolves.toMatchObject({ status: 'policy_rejected' });

        created.transport.setPostState(created.post.id, {
            status: 'draft',
            authorId: 999
        });
        await expect(
            created.executor.updateMarketingDraft({
                operationId: 'op-update-other-author',
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt,
                patch: { address: 'not allowed' }
            })
        ).resolves.toMatchObject({ status: 'policy_rejected' });
        expect(created.transport.mutationCounts.update).toBe(0);
    });

    it('rejects managed posts with extra taxonomy IDs before mutation', async () => {
        const created = await createDraft();
        created.transport.setPostState(created.post.id, {
            categories: [FIXED_TAXONOMY.categoryId, 999],
            tags: [FIXED_TAXONOMY.tagId, 998]
        });

        const update = await created.executor.updateMarketingDraft({
            operationId: 'op-update-extra-taxonomy',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'must not write' }
        });
        const trash = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-extra-taxonomy',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(update.status).toBe('policy_rejected');
        expect(trash.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.update).toBe(0);
        expect(created.transport.mutationCounts.trash).toBe(0);
    });

    it('reconciles timeout-after-complete UPDATE without retrying', async () => {
        const created = await createDraft();
        created.transport.failNextUpdateAfterApplying('timeout');

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-timeout',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'Updated exactly once' }
        });
        const retry = await created.executor.updateMarketingDraft({
            operationId: 'op-update-timeout',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'Updated exactly once' }
        });

        expect(result.status).toBe('verified_success');
        expect(retry.status).toBe('verified_success');
        expect(created.transport.mutationCounts.update).toBe(1);
    });

    it('classifies partial UPDATE and final-readback mismatch without retrying', async () => {
        const created = await createDraft();
        created.transport.failNextUpdateAfterPartialApplication();

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'Partially applied' }
        });

        expect(result.status).toBe('partial_mutation');
        expect(created.transport.mutationCounts.update).toBe(1);
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });

        const laterUpdate = await created.executor.updateMarketingDraft({
            operationId: 'op-update-after-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { content: 'must not retry recovery-required post' }
        });
        const laterTrash = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-after-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });
        expect(laterUpdate.status).toBe('policy_rejected');
        expect(laterTrash.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.update).toBe(1);
        expect(created.transport.mutationCounts.trash).toBe(0);
    });

    it('quarantines an ambiguous UPDATE and blocks later operations', async () => {
        const created = await createDraft();
        created.transport.failNextUpdateWithAmbiguousReconciliation();

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-ambiguous',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'ambiguous update' }
        });

        expect(result.status).toBe('ambiguous');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });

        const laterUpdate = await created.executor.updateMarketingDraft({
            operationId: 'op-update-after-ambiguous',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'must not retry ambiguous update' }
        });
        expect(laterUpdate.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.update).toBe(1);
    });

    it('contains an unexpected UPDATE throw, then reconciles the same operation to active', async () => {
        const created = await createDraft();
        created.transport.throwNextUpdateWithAmbiguousReconciliation();

        const first = await created.executor.updateMarketingDraft({
            operationId: 'op-update-throw-ambiguous',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'reconciled after throw' }
        });

        expect(first.status).toBe('ambiguous');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });
        expect(created.transport.mutationCounts.update).toBe(1);

        created.transport.clearFreshnessDisagreement();
        const reconciled = await created.executor.updateMarketingDraft({
            operationId: 'op-update-throw-ambiguous',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'reconciled after throw' }
        });

        expect(reconciled.status).toBe('verified_success');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_active'
        });
        expect(created.transport.mutationCounts.update).toBe(1);
        expect(created.audit.records.filter(record => record.operation === 'updateMarketingDraft')).toHaveLength(2);
    });

    it('contains an unexpected partial UPDATE throw and quarantines the managed post', async () => {
        const created = await createDraft();
        created.transport.throwNextUpdateAfterPartialMutation();

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-throw-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'partial throw' }
        });

        expect(result.status).toBe('partial_mutation');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });
        expect(created.transport.mutationCounts.update).toBe(1);
        expect(created.audit.records.at(-1)).toMatchObject({
            operation: 'updateMarketingDraft',
            result: 'partial_mutation',
            reconciliation: 'partial'
        });
    });

    it('keeps a managed post active after verified no-mutation UPDATE reconciliation', async () => {
        const created = await createDraft();
        created.transport.failNextUpdateWithoutApplying();

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-no-mutation',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'not applied' }
        });

        expect(result.status).toBe('verified_no_mutation');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_active'
        });
    });

    it('hard-fails when the canonical pre-read has a required ACF null', async () => {
        const created = await createDraft();
        created.transport.setPostState(created.post.id, {
            acf: { address: null }
        });

        const result = await created.executor.updateMarketingDraft({
            operationId: 'op-update-null-readback',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { ticket_link: 'https://example.com/tickets' }
        });

        expect(result.status).toBe('readback_failed');
        expect(created.transport.mutationCounts.update).toBe(0);
    });

    it('trashes only an owned draft and never exposes force delete', async () => {
        const created = await createDraft();
        const result = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-001',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(result.status).toBe('verified_success');
        expect(result.value?.status).toBe('trash');
        expect(created.transport.lastTrashRequest).toEqual({
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });
        expect(JSON.stringify(created.transport.lastTrashRequest)).not.toContain('force');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_retired'
        });

        created.transport.setPostState(created.post.id, { status: 'draft' });
        const restoredUpdate = await created.executor.updateMarketingDraft({
            operationId: 'op-update-restored-retired',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt,
            patch: { address: 'must remain retired' }
        });
        const restoredTrash = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-restored-retired',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });
        expect(restoredUpdate.status).toBe('policy_rejected');
        expect(restoredTrash.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.update).toBe(0);
        expect(created.transport.mutationCounts.trash).toBe(1);
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(2);
    });

    it('rejects force, published, and other-author Trash attempts', async () => {
        const created = await createDraft();
        await expect(
            created.executor.trashMarketingDraft({
                operationId: 'op-trash-force',
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt,
                force: true
            } as never)
        ).resolves.toMatchObject({ status: 'policy_rejected' });

        created.transport.setPostState(created.post.id, { status: 'publish' });
        await expect(
            created.executor.trashMarketingDraft({
                operationId: 'op-trash-published',
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt
            })
        ).resolves.toMatchObject({ status: 'policy_rejected' });

        created.transport.setPostState(created.post.id, {
            status: 'draft',
            authorId: 999
        });
        await expect(
            created.executor.trashMarketingDraft({
                operationId: 'op-trash-other-author',
                postId: created.post.id,
                expectedModifiedGmt: created.post.modifiedGmt
            })
        ).resolves.toMatchObject({ status: 'policy_rejected' });
        expect(created.transport.mutationCounts.trash).toBe(0);
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(3);
    });

    it('reconciles timeout-after-success Trash without retrying', async () => {
        const created = await createDraft();
        created.transport.failNextTrashAfterApplying('timeout');

        const result = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-timeout',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(result.status).toBe('verified_success');
        expect(created.transport.mutationCounts.trash).toBe(1);
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_retired'
        });
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(1);
    });

    it('contains an unexpected partial Trash throw, audits it, and quarantines the post', async () => {
        const created = await createDraft();
        created.transport.throwNextTrashAfterPartialMutation();

        const result = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-throw-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(result.status).toBe('partial_mutation');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });
        expect(created.transport.mutationCounts.trash).toBe(1);
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(1);
        expect(created.audit.records.at(-1)).toMatchObject({
            operation: 'trashMarketingDraft',
            result: 'partial_mutation',
            reconciliation: 'partial'
        });

        const later = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-after-throw-partial',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });
        expect(later.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.trash).toBe(1);
    });

    it('audits a Trash version conflict exactly once', async () => {
        const created = await createDraft();

        const result = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-conflict',
            postId: created.post.id,
            expectedModifiedGmt: '2000-01-01T00:00:00'
        });

        expect(result.status).toBe('conflict');
        expect(created.transport.mutationCounts.trash).toBe(0);
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(1);
        expect(created.audit.records.at(-1)).toMatchObject({
            operation: 'trashMarketingDraft',
            result: 'conflict',
            targetPostId: created.post.id,
            verification: 'failed'
        });
    });

    it.each([['partial'], ['ambiguous']])('quarantines %s Trash results and audits once', async _label => {
        const created = await createDraft();
        if (_label === 'partial') {
            created.transport.failNextTrashAfterPartialApplication();
        } else {
            created.transport.failNextTrashWithAmbiguousReconciliation();
        }

        const result = await created.executor.trashMarketingDraft({
            operationId: `op-trash-${_label}`,
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(result.status).toBe(_label === 'partial' ? 'partial_mutation' : 'ambiguous');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'recovery_required'
        });
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(1);
        expect(created.audit.records.at(-1)).toMatchObject({
            operation: 'trashMarketingDraft',
            result: result.status,
            targetPostId: created.post.id
        });

        const later = await created.executor.trashMarketingDraft({
            operationId: `op-trash-after-${_label}`,
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });
        expect(later.status).toBe('policy_rejected');
        expect(created.transport.mutationCounts.trash).toBe(1);
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(2);
    });

    it('keeps a managed post active after verified no-mutation Trash reconciliation', async () => {
        const created = await createDraft();
        created.transport.failNextTrashWithoutApplying();

        const result = await created.executor.trashMarketingDraft({
            operationId: 'op-trash-no-mutation',
            postId: created.post.id,
            expectedModifiedGmt: created.post.modifiedGmt
        });

        expect(result.status).toBe('verified_no_mutation');
        expect(created.ledger.getManagedPost(created.post.id, MACHINE_USER_ID)).toMatchObject({
            managedLifecycle: 'managed_active'
        });
        expect(created.audit.records.filter(record => record.operation === 'trashMarketingDraft')).toHaveLength(1);
    });

    it('fails closed on freshness disagreement or explicit shared-cache evidence', async () => {
        const created = await createDraft();
        created.transport.setFreshnessDisagreement(created.post.id);
        await expect(
            created.executor.readMarketingPost({
                operationId: 'op-read-disagreement',
                postId: created.post.id
            })
        ).resolves.toMatchObject({ status: 'ambiguous' });

        created.transport.clearFreshnessDisagreement();
        created.transport.setSharedCacheEvidence(true);
        await expect(
            created.executor.readMarketingPost({
                operationId: 'op-read-cache-hit',
                postId: created.post.id
            })
        ).resolves.toMatchObject({ status: 'readback_failed' });
    });

    it('rejects missing schema fields and exposes no secret in outputs, errors, or audit', async () => {
        const harness = createHarness();
        harness.transport.setSchemaFields(['event_datetime', 'address']);
        const result = await harness.executor.readMarketingPost({
            operationId: 'op-read-schema',
            postId: 1
        });
        const errorResult = await harness.executor.createMarketingDraft(createInput({ ticket_link: SYNTHETIC_SECRET }));

        expect(result.status).toBe('readback_failed');
        expect(errorResult.status).toBe('policy_rejected');
        const serialized = JSON.stringify({ result, errorResult, audit: harness.audit.records });
        expect(serialized).not.toContain(SYNTHETIC_SECRET);
        expect(JSON.stringify(harness.credentials)).not.toContain(SYNTHETIC_SECRET);
    });

    it('sanitizes a credential-provider exception before it reaches the caller', async () => {
        const transport = new InMemoryWordPressTransport({ machineUserId: MACHINE_USER_ID });
        const audit = new MemoryAuditSink();
        const ledger = new MemoryOperationLedger();
        const credentials = {
            async withCredential() {
                throw new Error(SYNTHETIC_SECRET);
            }
        };
        const executor = new WordPressDraftCrudExecutor({
            transport,
            credentials,
            ledger,
            audit,
            machineUserId: MACHINE_USER_ID
        });

        const result = await executor.createMarketingDraft(createInput({ operationId: 'op-provider-error' }));
        expect(result).toMatchObject({ status: 'readback_failed', reconciliation: 'unknown' });
        expect(JSON.stringify(result)).not.toContain(SYNTHETIC_SECRET);
        const second = await executor.createMarketingDraft(createInput({ operationId: 'op-provider-error-2' }));
        expect(second).toMatchObject({ status: 'readback_failed' });
        expect(JSON.stringify(second)).not.toContain(SYNTHETIC_SECRET);
        expect(JSON.stringify(audit.records)).not.toContain(SYNTHETIC_SECRET);
    });

    it('contains an unexpected CREATE transport throw without blind retry or false management', async () => {
        const harness = createHarness();
        harness.transport.throwNextCreateAfterPartialMutation();

        const result = await harness.executor.createMarketingDraft(createInput({ operationId: 'op-create-throw' }));
        const retry = await harness.executor.createMarketingDraft(createInput({ operationId: 'op-create-throw' }));

        expect(result.status).toBe('partial_mutation');
        expect(retry.status).toBe('partial_mutation');
        expect(harness.transport.mutationCounts.create).toBe(1);
        expect(
            harness.ledger.getManagedPost(harness.transport.lastCreatedPostId ?? -1, MACHINE_USER_ID)
        ).toBeUndefined();
        expect(JSON.stringify({ result, retry, audit: harness.audit.records })).not.toContain(SYNTHETIC_SECRET);
    });

    it('readMarketingPost returns the bounded public read contract', async () => {
        const created = await createDraft();
        const result = (await created.executor.readMarketingPost({
            operationId: 'op-read-001',
            postId: created.post.id
        })) as ExecutorResult<unknown>;

        expect(result.status).toBe('verified_success');
        expect(result.value).toMatchObject({
            id: created.post.id,
            status: 'draft',
            acf: expect.objectContaining({ event_datetime: '2026-04-18 16:00:00' })
        });
    });
});

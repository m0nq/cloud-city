import { KeychainCredentialProvider } from '@/wordpress-executor/credential-provider';
import { WordPressDraftCrudExecutor } from '@/wordpress-executor/executor';
import { MemoryAuditSink, MemoryOperationLedger } from '@/wordpress-executor/ledger';
import {
    CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
    CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
    CLOUD_CITY_WORDPRESS_ORIGIN
} from '@/wordpress-executor/read-only-cli';
import { WordPressReadExecutor } from '@/wordpress-executor/read-executor';
import { WordPressRestWriteTransport } from '@/wordpress-executor/rest-transport';
import { runAuthenticatedReadOnlyProof } from '@/wordpress-executor/read-workflow';
import type { CanonicalPost, ExecutorResult } from '@/wordpress-executor/types';

const WORDPRESS_USERNAME_ENV = 'CLOUD_CITY_WORDPRESS_USERNAME';
const WORDPRESS_MACHINE_USER_ID_ENV = 'CLOUD_CITY_WORDPRESS_MACHINE_USER_ID';
const GRAPHQL_ENDPOINT = `${CLOUD_CITY_WORDPRESS_ORIGIN}/graphql`;
const PROOF_OPERATION_PREFIX = 'clo149-proof-20260908';
const FIXTURE = {
    operationId: PROOF_OPERATION_PREFIX,
    title: 'DISPOSABLE TEST — House in the Park #3 — DO NOT PUBLISH',
    content:
        'Synthetic CLO-149 write-gate fixture only. Do not publish. This is not a real House in the Park record or current Cloud City event.',
    event_datetime: '2027-01-17 14:37:00',
    address: 'SYNTHETIC TEST ADDRESS — DO NOT PUBLISH',
    ticket_link: 'https://example.com/cloud-city-clo-149-test'
} as const;
const UPDATED_ADDRESS = 'SYNTHETIC TEST ADDRESS — UPDATED — DO NOT PUBLISH';

type SanitizedResult = {
    status: string;
    operationId: string;
    value?: Record<string, unknown>;
    reason?: string;
    reconciliation?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireConfiguration(): { username: string; machineUserId: number } {
    const username = process.env[WORDPRESS_USERNAME_ENV]?.trim();
    const machineUserId = Number(process.env[WORDPRESS_MACHINE_USER_ID_ENV]);
    if (!username || !Number.isInteger(machineUserId) || machineUserId <= 0) {
        throw new Error('CLO-149 write configuration is incomplete.');
    }
    return { username, machineUserId };
}

function sanitizePost(post: CanonicalPost): Record<string, unknown> {
    return {
        id: post.id,
        slug: post.slug,
        status: post.status,
        authorId: post.authorId,
        modifiedGmt: post.modifiedGmt,
        title: post.title,
        categories: post.categories,
        tags: post.tags,
        acf: post.acf
    };
}

function sanitizeResult(result: ExecutorResult<CanonicalPost>): SanitizedResult {
    return {
        status: result.status,
        operationId: result.operationId,
        ...(result.value ? { value: sanitizePost(result.value) } : {}),
        ...(result.reason ? { reason: result.reason } : {}),
        ...(result.reconciliation ? { reconciliation: result.reconciliation } : {})
    };
}

async function readPublicVisibility(slug: string): Promise<Record<string, unknown>> {
    const query = `query CLO149Visibility($slug: ID!) {
        post(id: $slug, idType: SLUG) {
            databaseId
            slug
            uri
        }
    }`;
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { slug } }),
            cache: 'no-store'
        });
        const body = (await response.json()) as {
            data?: { post?: { databaseId?: number; slug?: string; uri?: string } | null };
            errors?: readonly { message?: string }[];
        };
        if (!response.ok || body.errors?.length) {
            return {
                endpoint: GRAPHQL_ENDPOINT,
                status: 'unknown',
                httpStatus: response.status,
                reason: 'Anonymous GraphQL visibility query failed.'
            };
        }
        const data = body.data;
        if (!isRecord(data) || !Object.prototype.hasOwnProperty.call(data, 'post')) {
            return {
                endpoint: GRAPHQL_ENDPOINT,
                status: 'unknown',
                httpStatus: response.status,
                reason: 'Anonymous GraphQL visibility query returned an incomplete payload.'
            };
        }
        const post = data.post;
        if (
            post !== null &&
            (!isRecord(post) ||
                typeof post.databaseId !== 'number' ||
                typeof post.slug !== 'string' ||
                typeof post.uri !== 'string')
        ) {
            return {
                endpoint: GRAPHQL_ENDPOINT,
                status: 'unknown',
                httpStatus: response.status,
                reason: 'Anonymous GraphQL visibility query returned an invalid post payload.'
            };
        }
        return {
            endpoint: GRAPHQL_ENDPOINT,
            status: post ? 'publicly_visible' : 'not_publicly_visible',
            ...(post ? { post } : {})
        };
    } catch {
        return {
            endpoint: GRAPHQL_ENDPOINT,
            status: 'unknown',
            reason: 'Anonymous GraphQL visibility query could not be completed.'
        };
    }
}

function auditEvidence(audit: MemoryAuditSink): Record<string, unknown>[] {
    return audit.records.map(record => ({
        operationId: record.operationId,
        operation: record.operation,
        targetPostId: record.targetPostId,
        changedFields: record.changedFields,
        result: record.result,
        verification: record.verification,
        reconciliation: record.reconciliation
    }));
}

function printStoppedEvidence(
    preflight: { status: string; operationId: string },
    audit: MemoryAuditSink,
    transport: WordPressRestWriteTransport,
    lifecycle: Record<string, unknown>
): void {
    console.log(
        JSON.stringify(
            {
                status: 'production_write_proof_failed_closed',
                endpoint: { restOrigin: CLOUD_CITY_WORDPRESS_ORIGIN, graphql: GRAPHQL_ENDPOINT },
                preflight,
                fixture: {
                    title: FIXTURE.title,
                    operationId: FIXTURE.operationId,
                    expectedLifecycle: 'CREATE → READ → UPDATE → READ → Trash → READ/reconcile'
                },
                transportMutationTrace: transport.mutationTrace,
                lifecycle,
                audit: auditEvidence(audit)
            },
            null,
            2
        )
    );
}

async function run(): Promise<void> {
    if (process.argv.length !== 3 || process.argv[2] !== 'clo149-proof') {
        throw new Error('Only the bounded command "clo149-proof" is available.');
    }

    const { username, machineUserId } = requireConfiguration();
    const credentials = new KeychainCredentialProvider({
        service: CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
        account: CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT
    });
    const transport = new WordPressRestWriteTransport({
        baseUrl: CLOUD_CITY_WORDPRESS_ORIGIN,
        username
    });
    const preflightAudit = new MemoryAuditSink();
    const readExecutor = new WordPressReadExecutor({
        transport,
        credentials,
        audit: preflightAudit,
        machineUserId,
        invokingClient: 'clo-149-write-proof-preflight-read'
    });
    const preflight = await runAuthenticatedReadOnlyProof(readExecutor, `${PROOF_OPERATION_PREFIX}-preflight-read`);
    if (preflight.status !== 'verified_success') {
        console.log(JSON.stringify({ status: 'stopped_before_production_write', preflight }, null, 2));
        process.exitCode = 2;
        return;
    }

    const audit = new MemoryAuditSink();
    const ledger = new MemoryOperationLedger();
    const executor = new WordPressDraftCrudExecutor({
        transport,
        credentials,
        ledger,
        audit,
        machineUserId,
        invokingClient: 'clo-149-bounded-write-proof'
    });

    const create = await executor.createMarketingDraft(FIXTURE);
    if (create.status !== 'verified_success' || !create.value) {
        printStoppedEvidence(
            { status: preflight.status, operationId: preflight.operationId },
            audit,
            transport,
            { create: sanitizeResult(create) }
        );
        process.exitCode = 2;
        return;
    }
    const createdPost = create.value;
    const update = await executor.updateMarketingDraft({
        operationId: `${PROOF_OPERATION_PREFIX}-update`,
        postId: createdPost.id,
        expectedModifiedGmt: createdPost.modifiedGmt,
        patch: { address: UPDATED_ADDRESS }
    });
    if (update.status !== 'verified_success' || !update.value) {
        printStoppedEvidence(
            { status: preflight.status, operationId: preflight.operationId },
            audit,
            transport,
            { create: sanitizeResult(create), update: sanitizeResult(update) }
        );
        process.exitCode = 2;
        return;
    }
    const updatedPost = update.value;
    const trash = await executor.trashMarketingDraft({
        operationId: `${PROOF_OPERATION_PREFIX}-trash`,
        postId: updatedPost.id,
        expectedModifiedGmt: updatedPost.modifiedGmt
    });
    if (trash.status !== 'verified_success' || !trash.value) {
        printStoppedEvidence(
            { status: preflight.status, operationId: preflight.operationId },
            audit,
            transport,
            { create: sanitizeResult(create), update: sanitizeResult(update), trash: sanitizeResult(trash) }
        );
        process.exitCode = 2;
        return;
    }
    const trashedPost = trash.value;
    const trashRead = await executor.readMarketingPost({
        operationId: `${PROOF_OPERATION_PREFIX}-trash-read`,
        postId: trashedPost.id,
        context: 'edit'
    });
    const visibility = await readPublicVisibility(trashedPost.slug);

    const evidence = {
        status: trashRead.status === 'verified_success' && visibility.status === 'not_publicly_visible'
            ? 'clo149_write_proof_verified'
            : 'production_state_requires_reconciliation',
        endpoint: {
            restOrigin: CLOUD_CITY_WORDPRESS_ORIGIN,
            graphql: GRAPHQL_ENDPOINT
        },
        preflight: {
            status: preflight.status,
            operationId: preflight.operationId,
            readOnlyAuditRecords: preflightAudit.records.length
        },
        fixture: {
            title: FIXTURE.title,
            operationId: FIXTURE.operationId,
            event_datetime: FIXTURE.event_datetime,
            addressBeforeUpdate: FIXTURE.address,
            addressAfterUpdate: UPDATED_ADDRESS,
            ticket_link: FIXTURE.ticket_link,
            taxonomy: { categoryId: 210, tagId: 203 },
            expectedLifecycle: 'CREATE → READ → UPDATE → READ → Trash → READ/reconcile'
        },
        transportMutationTrace: transport.mutationTrace,
        lifecycle: {
            create: sanitizeResult(create),
            update: sanitizeResult(update),
            trash: sanitizeResult(trash),
            trashRead: sanitizeResult(trashRead)
        },
        publicVisibility: visibility,
        audit: auditEvidence(audit)
    };
    console.log(JSON.stringify(evidence, null, 2));
    if (evidence.status !== 'clo149_write_proof_verified') process.exitCode = 2;
}

run().catch(error => {
    console.error(error instanceof Error ? error.message : 'CLO-149 proof stopped.');
    process.exitCode = 2;
});

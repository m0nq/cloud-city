import { randomUUID } from 'node:crypto';
import { WordPressReadExecutor } from './read-executor';
import type { CanonicalPost, ExecutorResult, ExecutorStatus, RemotePostSchema, RemoteUser } from './types';

export const KNOWN_GOOD_POST = {
    id: 2217,
    slug: 'cloud-city-spring-session',
    status: 'publish',
    categoryId: 210,
    tagId: 203,
    acf: {
        event_datetime: '2026-04-18 16:00:00',
        address: '1740 Telegraph ave Oakland, CA 94612',
        ticket_link: 'https://luma.com/3pkzxvge'
    }
} as const;

export interface AuthenticatedReadOnlyProofResult {
    status: Extract<ExecutorStatus, 'verified_success' | 'policy_rejected' | 'readback_failed' | 'ambiguous'>;
    operationId: string;
    identity: ExecutorResult<RemoteUser>;
    schema?: ExecutorResult<RemotePostSchema>;
    post?: ExecutorResult<CanonicalPost>;
    editableDrafts?: ExecutorResult<readonly CanonicalPost[]>;
    publishedPostEditBoundary?: ExecutorResult<'allowed' | 'forbidden'>;
    reason?: string;
}

function resultStatus(result: ExecutorResult<unknown>): AuthenticatedReadOnlyProofResult['status'] {
    if (
        result.status === 'verified_success' ||
        result.status === 'policy_rejected' ||
        result.status === 'readback_failed' ||
        result.status === 'ambiguous'
    ) {
        return result.status;
    }
    return 'readback_failed';
}

function isKnownGoodPost(post: CanonicalPost): boolean {
    return (
        post.id === KNOWN_GOOD_POST.id &&
        post.slug === KNOWN_GOOD_POST.slug &&
        post.status === KNOWN_GOOD_POST.status &&
        JSON.stringify(post.categories) === JSON.stringify([KNOWN_GOOD_POST.categoryId]) &&
        JSON.stringify(post.tags) === JSON.stringify([KNOWN_GOOD_POST.tagId]) &&
        post.acf.event_datetime === KNOWN_GOOD_POST.acf.event_datetime &&
        post.acf.address === KNOWN_GOOD_POST.acf.address &&
        post.acf.ticket_link === KNOWN_GOOD_POST.acf.ticket_link
    );
}

/**
 * Mockable orchestration for the later authenticated read-only gate. It has
 * no mutation calls and uses the fixed known-good event rather than caller-
 * supplied post or route information.
 */
export async function runAuthenticatedReadOnlyProof(
    executor: WordPressReadExecutor,
    operationIdPrefix = `cloud-city-wordpress-read-${randomUUID()}`
): Promise<AuthenticatedReadOnlyProofResult> {
    const identity = await executor.readIdentity({ operationId: `${operationIdPrefix}-identity` });
    if (identity.status !== 'verified_success') {
        return {
            status: resultStatus(identity),
            operationId: operationIdPrefix,
            identity,
            reason: 'Authenticated identity did not satisfy the approved boundary.'
        };
    }

    const schema = await executor.readPostSchemaForPost({
        operationId: `${operationIdPrefix}-schema`,
        postId: KNOWN_GOOD_POST.id,
        context: 'view'
    });
    if (schema.status !== 'verified_success') {
        return {
            status: resultStatus(schema),
            operationId: operationIdPrefix,
            identity,
            schema,
            reason: 'Required ACF fields were not proven in the read schema.'
        };
    }

    const post = await executor.readMarketingPost({
        operationId: `${operationIdPrefix}-post`,
        postId: KNOWN_GOOD_POST.id,
        context: 'view'
    });
    if (post.status !== 'verified_success' || !post.value || !isKnownGoodPost(post.value)) {
        return {
            status: post.status === 'verified_success' ? 'readback_failed' : resultStatus(post),
            operationId: operationIdPrefix,
            identity,
            schema,
            post,
            reason: 'Known-good post did not match the required canonical event contract.'
        };
    }

    const editableDrafts = await executor.readEditableDrafts({
        operationId: `${operationIdPrefix}-editable-drafts`
    });
    if (editableDrafts.status !== 'verified_success') {
        return {
            status: resultStatus(editableDrafts),
            operationId: operationIdPrefix,
            identity,
            schema,
            post,
            editableDrafts,
            reason: 'Edit-context collection boundary could not be read safely.'
        };
    }

    const publishedPostEditBoundary = await executor.readPublishedPostEditBoundary({
        operationId: `${operationIdPrefix}-published-edit-boundary`,
        postId: KNOWN_GOOD_POST.id
    });
    if (publishedPostEditBoundary.status !== 'verified_success' || publishedPostEditBoundary.value !== 'forbidden') {
        return {
            status:
                publishedPostEditBoundary.status === 'verified_success'
                    ? 'policy_rejected'
                    : resultStatus(publishedPostEditBoundary),
            operationId: operationIdPrefix,
            identity,
            schema,
            post,
            editableDrafts,
            publishedPostEditBoundary,
            reason: 'Published-post edit access was not denied by the approved boundary.'
        };
    }

    return {
        status: 'verified_success',
        operationId: operationIdPrefix,
        identity,
        schema,
        post,
        editableDrafts,
        publishedPostEditBoundary
    };
}

export const WORDPRESS_EXECUTOR_CONTRACT_VERSION = 'CLO-131-v1';

export const FIXED_TAXONOMY = {
    categoryId: 210,
    tagId: 203
} as const;

export const REQUIRED_ACF_FIELDS = ['event_datetime', 'address', 'ticket_link'] as const;

export const CREATE_CHANGED_FIELDS = ['title', 'content', ...REQUIRED_ACF_FIELDS] as const;

export const DEFAULT_PROHIBITED_CAPABILITIES = [
    'publish_posts',
    'publish_pages',
    'edit_published_posts',
    'edit_published_pages',
    'delete_published_posts',
    'delete_published_pages',
    'delete_others_posts',
    'edit_others_posts',
    'manage_options',
    'manage_categories',
    'manage_links',
    'unfiltered_html',
    'activate_plugins',
    'deactivate_plugins',
    'install_plugins',
    'update_plugins',
    'delete_plugins',
    'edit_plugins',
    'edit_themes',
    'update_themes',
    'install_themes',
    'delete_themes',
    'switch_themes',
    'update_core',
    'promote_users',
    'create_users',
    'delete_users',
    'edit_users',
    'remove_users',
    'list_users',
    'manage_network',
    'manage_network_options'
] as const;

export type RequiredAcfField = (typeof REQUIRED_ACF_FIELDS)[number];

export type PostStatus = 'draft' | 'pending' | 'publish' | 'future' | 'private' | 'trash';

export type ReadContext = 'view' | 'edit';
export type FreshnessMode = 'normal' | 'directed';

export interface AcfValues {
    event_datetime: string | null;
    address: string | null;
    ticket_link: string | null;
}

export interface CanonicalPost {
    id: number;
    slug: string;
    status: PostStatus;
    authorId: number;
    modifiedGmt: string;
    title: string;
    content: string;
    categories: readonly number[];
    tags: readonly number[];
    acf: AcfValues;
}

export interface RemoteUser {
    id: number;
    roles: readonly string[];
    capabilities: Readonly<Record<string, boolean>>;
    /** Direct semantic equivalent of WordPress REST `extra_capabilities`. */
    extraCapabilities: Readonly<Record<string, boolean>>;
}

export const REQUIRED_IDENTITY_CAPABILITIES = ['read', 'edit_posts', 'delete_posts'] as const;

export interface ExpectedIdentityPolicy {
    expectedUserId?: number;
    approvedRole: string;
    prohibitedCapabilities: readonly string[];
}

export interface RemotePostSchema {
    acfFields: readonly string[];
}

export interface FreshnessEvidence {
    supportedSafeRead: boolean;
    sharedCacheHit: boolean;
    age?: string;
}

export interface RemotePostResult {
    post: CanonicalPost;
    freshness: FreshnessEvidence;
}

export type TransportErrorKind = 'network' | 'timeout' | 'http' | 'malformed' | 'unknown';

export interface TransportError {
    kind: TransportErrorKind;
    mutationState: 'not_started' | 'may_have_started' | 'unknown';
    status?: number;
    /** Sanitized machine-readable REST error code; response bodies never cross this boundary. */
    code?: string;
}

export type TransportResult<T> = { kind: 'success'; value: T } | { kind: 'error'; error: TransportError };

export type ExecutorStatus =
    | 'verified_success'
    | 'verified_no_mutation'
    | 'partial_mutation'
    | 'ambiguous'
    | 'conflict'
    | 'policy_rejected'
    | 'readback_failed';

export type ReconciliationState = 'complete' | 'partial' | 'absent_but_uncertain' | 'unknown';

export type ManagedPostLifecycle = 'managed_active' | 'recovery_required' | 'managed_retired';

export type OperationKind =
    | 'readMarketingPost'
    | 'readIdentity'
    | 'readPostSchema'
    | 'readEditableDrafts'
    | 'readPublishedPostEditBoundary'
    | 'createMarketingDraft'
    | 'updateMarketingDraft'
    | 'trashMarketingDraft';

export interface ExecutorResult<T = CanonicalPost> {
    status: ExecutorStatus;
    operationId: string;
    value?: T;
    reason?: string;
    reconciliation?: ReconciliationState;
}

export interface ReadMarketingPostInput {
    operationId: string;
    postId: number;
    context?: ReadContext;
}

export interface CreateMarketingDraftInput {
    operationId: string;
    title: string;
    content: string;
    event_datetime: string;
    address: string;
    ticket_link: string;
}

export interface MarketingDraftPatch {
    title?: string;
    content?: string;
    event_datetime?: string;
    address?: string;
    ticket_link?: string;
}

export interface UpdateMarketingDraftInput {
    operationId: string;
    postId: number;
    expectedModifiedGmt: string;
    patch: MarketingDraftPatch;
}

export interface TrashMarketingDraftInput {
    operationId: string;
    postId: number;
    expectedModifiedGmt: string;
}

export interface OperationLedgerRecord {
    operationId: string;
    operation: OperationKind;
    machineUserId?: number;
    phase: 'intent' | 'attempted' | 'completed';
    mutationAttempted?: boolean;
    status?: ExecutorStatus;
    targetPostId?: number;
    preStateVersion?: string;
    postStateVersion?: string;
    changedFields: readonly string[];
    reconciliation?: ReconciliationState;
    managedLifecycle?: ManagedPostLifecycle;
}

export interface OperationLedger {
    get(operationId: string): OperationLedgerRecord | undefined;
    /** Returns the managed lifecycle record for this post, including retired/recovery states. */
    getManagedPost(postId: number, machineUserId: number): OperationLedgerRecord | undefined;
    /** Updates the lifecycle on the verified CREATE lineage for this post. */
    setManagedPostLifecycle(postId: number, machineUserId: number, lifecycle: ManagedPostLifecycle): void;
    put(record: OperationLedgerRecord): void;
}

export interface AuditRecord {
    operationId: string;
    timestamp: string;
    invokingClient: string;
    operation: OperationKind;
    targetPostId?: number;
    preStateVersion?: string;
    changedFields: readonly string[];
    result: ExecutorStatus;
    postStateVersion?: string;
    verification: 'passed' | 'failed' | 'reconciled' | 'not_applicable';
    reconciliation?: ReconciliationState;
}

export interface AuditSink {
    record(record: AuditRecord): void;
}

import type {
    CanonicalPost,
    CreateMarketingDraftInput,
    FreshnessMode,
    ReadContext,
    RemotePostResult,
    RemotePostSchema,
    RemoteUser,
    TransportResult,
    UpdateMarketingDraftInput
} from './types';

const credentialHandleBrand = Symbol('wordpressExecutorCredentialHandle');

/** Opaque by design: callers can use a provider, but cannot provide a secret to the executor API. */
export type CredentialHandle = {
    readonly [credentialHandleBrand]: true;
};

const credentialSecrets = new WeakMap<CredentialHandle, string>();

/** @internal Used only by trusted provider/transport implementations, not exported from the package barrel. */
export function createCredentialHandle(secret: string): CredentialHandle {
    if (secret.trim() === '') throw new Error('Credential provider returned an empty credential.');
    const handle = Object.freeze({ [credentialHandleBrand]: true }) as unknown as CredentialHandle;
    credentialSecrets.set(handle, secret);
    return handle;
}

/** @internal Keeps secret material inside the trusted transport boundary. */
export function readCredentialSecret(credential: CredentialHandle): string {
    const secret = credentialSecrets.get(credential);
    if (!secret) throw new Error('Credential handle is invalid.');
    return secret;
}

/** @internal Removes secret access as soon as the trusted provider callback completes. */
export function invalidateCredentialHandle(credential: CredentialHandle): void {
    credentialSecrets.delete(credential);
}

export interface CredentialProvider {
    withCredential<T>(operation: (credential: CredentialHandle) => Promise<T>): Promise<T>;
}

export interface CreateDraftTransportInput extends Pick<
    CreateMarketingDraftInput,
    'operationId' | 'title' | 'content' | 'event_datetime' | 'address' | 'ticket_link'
> {
    status: 'draft';
    categories: readonly [210];
    tags: readonly [203];
}

export interface UpdateDraftTransportInput {
    postId: number;
    expectedModifiedGmt: string;
    patch: UpdateMarketingDraftInput['patch'];
}

export interface TrashDraftTransportInput {
    postId: number;
    expectedModifiedGmt: string;
}

export interface WordPressReadTransport {
    getCurrentUser(input: { context: 'edit' }, credential: CredentialHandle): Promise<TransportResult<RemoteUser>>;

    getPost(
        input: {
            postId: number;
            context: ReadContext;
            freshness: FreshnessMode;
        },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostResult>>;

    getPostSchema(
        input: { context: ReadContext },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>>;

    /**
     * Read the schema for one concrete post. This is distinct from the
     * collection schema because conditional ACF groups may only be resolved
     * when WordPress receives an object ID.
     */
    getPostSchemaForPost(
        input: { postId: number; context: ReadContext },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>>;

    getEditableDrafts(
        input: { authorId: number; context: 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<readonly CanonicalPost[]>>;

    getPublishedPostEditAccess(
        input: { postId: number },
        credential: CredentialHandle
    ): Promise<TransportResult<'allowed' | 'forbidden'>>;
}

export interface WordPressTransport extends WordPressReadTransport {
    findDraftForOperation(
        input: { operationId: string; authorId: number },
        credential: CredentialHandle
    ): Promise<TransportResult<CanonicalPost | null>>;

    createDraft(
        input: CreateDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>>;

    updateDraft(
        input: UpdateDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>>;

    trashDraft(
        input: TrashDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>>;
}

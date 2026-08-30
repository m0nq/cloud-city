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

declare const credentialHandleBrand: unique symbol;

/** Opaque by design: callers can use a provider, but cannot provide a secret to the executor API. */
export type CredentialHandle = {
    readonly [credentialHandleBrand]: true;
};

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

export interface WordPressTransport {
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

    getEditableDrafts(
        input: { authorId: number; context: 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<readonly CanonicalPost[]>>;

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

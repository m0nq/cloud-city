import { MemoryAuditSink, MemoryOperationLedger } from './ledger';
import { FIXED_TAXONOMY } from './types';
import type {
    CanonicalPost,
    FreshnessEvidence,
    RemotePostResult,
    RemotePostSchema,
    RemoteUser,
    TransportError,
    TransportResult
} from './types';
import type {
    CreateDraftTransportInput,
    CredentialHandle,
    CredentialProvider,
    TrashDraftTransportInput,
    UpdateDraftTransportInput,
    WordPressTransport
} from './transport';
import { createCredentialHandle, invalidateCredentialHandle } from './transport';

export { MemoryAuditSink, MemoryOperationLedger } from './ledger';

const syntheticSecrets = new WeakMap<SyntheticCredentialProvider, string>();

/** Synthetic-only provider. The sentinel is retained outside enumerable object state. */
export class SyntheticCredentialProvider implements CredentialProvider {
    calls = 0;

    constructor(secret: string) {
        syntheticSecrets.set(this, secret);
    }

    async withCredential<T>(operation: (credential: CredentialHandle) => Promise<T>): Promise<T> {
        this.calls += 1;
        const secret = syntheticSecrets.get(this);
        if (!secret) throw new Error('Synthetic credential is unavailable.');
        const handle = createCredentialHandle(secret);
        try {
            return await operation(handle);
        } finally {
            invalidateCredentialHandle(handle);
        }
    }
}

type FailureMode =
    | { kind: 'timeout'; apply: 'none' | 'complete' | 'partial' }
    | { kind: 'http'; apply: 'none' | 'complete' | 'partial' };

type ThrowMutationMode = 'none' | 'complete' | 'partial';

function errorFor(mode: FailureMode): TransportResult<never> {
    return {
        kind: 'error',
        error: {
            kind: mode.kind,
            mutationState: mode.apply === 'none' ? 'unknown' : 'may_have_started',
            ...(mode.kind === 'http' ? { status: 500 } : {})
        }
    };
}

function clonePost(post: CanonicalPost): CanonicalPost {
    return {
        ...post,
        categories: [...post.categories],
        tags: [...post.tags],
        acf: { ...post.acf }
    };
}

function nowVersion(counter: number): string {
    return `2026-08-28T${String(counter).padStart(2, '0')}:00:00`;
}

export class InMemoryWordPressTransport implements WordPressTransport {
    private readonly posts = new Map<number, CanonicalPost>();
    private readonly operationPosts = new Map<string, number>();
    private nextPostId = 9000;
    private versionCounter = 1;
    private freshnessDisagreementPostId?: number;
    private sharedCacheEvidence = false;
    private nextCreateFailure?: FailureMode;
    private nextCreateThrow?: ThrowMutationMode;
    private nextUpdateFailure?: FailureMode;
    private nextUpdateThrow?: ThrowMutationMode;
    private nextTrashFailure?: FailureMode;
    private nextTrashThrow?: ThrowMutationMode;
    private nextUpdateReadbackDisagreement = false;
    private nextTrashReadbackDisagreement = false;
    private currentUser: RemoteUser;
    private collectionSchemaFields: readonly string[] = ['event_datetime', 'address', 'ticket_link'];
    private postSchemaFields: readonly string[] = ['event_datetime', 'address', 'ticket_link'];
    private postSchemaConditionedOnEvents = false;

    readonly mutationCounts = { create: 0, update: 0, trash: 0 };
    readonly calls: string[] = [];
    lastCreateRequest?: CreateDraftTransportInput;
    lastCreatedPostId?: number;
    lastUpdatePatch?: UpdateDraftTransportInput['patch'];
    lastTrashRequest?: TrashDraftTransportInput;

    constructor(private readonly options: { machineUserId: number }) {
        this.currentUser = {
            id: options.machineUserId,
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
            extraCapabilities: {}
        };
    }

    async getCurrentUser(
        _input: { context: 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemoteUser>> {
        this.calls.push('getCurrentUser');
        return { kind: 'success', value: this.currentUser };
    }

    async getPost(
        input: {
            postId: number;
            context: 'view' | 'edit';
            freshness: 'normal' | 'directed';
        },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostResult>> {
        this.calls.push(`getPost:${input.postId}:${input.freshness}`);
        const post = this.posts.get(input.postId);
        if (!post) {
            return {
                kind: 'error',
                error: { kind: 'http', status: 404, mutationState: 'not_started' }
            };
        }
        const value = clonePost(post);
        if (this.freshnessDisagreementPostId === input.postId && input.freshness === 'directed') {
            value.acf = { ...value.acf, address: 'conflicting freshness representation' };
        }
        const freshness: FreshnessEvidence = {
            supportedSafeRead: true,
            sharedCacheHit: this.sharedCacheEvidence,
            ...(this.sharedCacheEvidence ? { age: '120' } : {})
        };
        return { kind: 'success', value: { post: value, freshness } };
    }

    async getPostSchema(
        _input: { context: 'view' | 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        this.calls.push('getPostSchema');
        return { kind: 'success', value: { acfFields: [...this.collectionSchemaFields] } };
    }

    async getPostSchemaForPost(
        input: { postId: number; context: 'view' | 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        this.calls.push(`getPostSchemaForPost:${input.postId}`);
        const post = this.posts.get(input.postId);
        const fields =
            this.postSchemaConditionedOnEvents && !post?.categories.includes(FIXED_TAXONOMY.categoryId)
                ? []
                : this.postSchemaFields;
        return { kind: 'success', value: { acfFields: [...fields] } };
    }

    async getEditableDrafts(
        input: { authorId: number; context: 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<readonly CanonicalPost[]>> {
        this.calls.push(`getEditableDrafts:${input.authorId}`);
        return {
            kind: 'success',
            value: [...this.posts.values()]
                .filter(post => post.authorId === input.authorId && post.status === 'draft')
                .map(clonePost)
        };
    }

    async getPublishedPostEditAccess(
        input: { postId: number },
        _credential: CredentialHandle
    ): Promise<TransportResult<'allowed' | 'forbidden'>> {
        this.calls.push(`getPublishedPostEditAccess:${input.postId}`);
        const post = this.posts.get(input.postId);
        if (!post || post.status !== 'publish') {
            return { kind: 'error', error: { kind: 'http', status: 404, mutationState: 'not_started' } };
        }
        return { kind: 'success', value: 'forbidden' };
    }

    async findDraftForOperation(
        input: { operationId: string; authorId: number },
        _credential: CredentialHandle
    ): Promise<TransportResult<CanonicalPost | null>> {
        this.calls.push(`findDraftForOperation:${input.operationId}`);
        const postId = this.operationPosts.get(input.operationId);
        const post = postId === undefined ? undefined : this.posts.get(postId);
        if (!post || post.authorId !== input.authorId || post.status !== 'draft') {
            return { kind: 'success', value: null };
        }
        return { kind: 'success', value: clonePost(post) };
    }

    async createDraft(
        input: CreateDraftTransportInput,
        _credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>> {
        this.calls.push('createDraft');
        this.mutationCounts.create += 1;
        this.lastCreateRequest = { ...input };
        const postId = this.nextPostId++;
        this.lastCreatedPostId = postId;
        const post: CanonicalPost = {
            id: postId,
            slug: `synthetic-draft-${postId}`,
            status: input.status,
            authorId: this.options.machineUserId,
            modifiedGmt: nowVersion(this.versionCounter++),
            title: input.title,
            content: input.content,
            categories: [...input.categories],
            tags: [...input.tags],
            acf: {
                event_datetime: input.event_datetime,
                address: input.address,
                ticket_link: input.ticket_link
            }
        };
        const failure = this.nextCreateFailure;
        this.nextCreateFailure = undefined;
        const thrown = this.nextCreateThrow;
        this.nextCreateThrow = undefined;
        if (thrown) {
            if (thrown !== 'none') {
                this.posts.set(postId, post);
                this.operationPosts.set(input.operationId, postId);
            }
            if (thrown === 'partial') {
                this.posts.set(postId, { ...post, acf: { ...post.acf, ticket_link: null } });
            }
            throw new Error('synthetic transport exception');
        }
        if (!failure || failure.apply !== 'none') {
            this.posts.set(postId, post);
            this.operationPosts.set(input.operationId, postId);
        }
        if (failure?.apply === 'partial') {
            this.posts.set(postId, {
                ...post,
                acf: { ...post.acf, ticket_link: null }
            });
        }
        if (failure) return errorFor(failure);
        return { kind: 'success', value: { postId } };
    }

    async updateDraft(
        input: UpdateDraftTransportInput,
        _credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>> {
        this.calls.push(`updateDraft:${input.postId}`);
        this.mutationCounts.update += 1;
        this.lastUpdatePatch = { ...input.patch };
        const post = this.posts.get(input.postId);
        if (!post) {
            return { kind: 'error', error: { kind: 'http', status: 404, mutationState: 'not_started' } };
        }
        const failure = this.nextUpdateFailure;
        this.nextUpdateFailure = undefined;
        const thrown = this.nextUpdateThrow;
        this.nextUpdateThrow = undefined;
        const updated: CanonicalPost = {
            ...post,
            modifiedGmt: nowVersion(this.versionCounter++),
            title: input.patch.title ?? post.title,
            content: input.patch.content ?? post.content,
            categories: post.categories,
            tags: post.tags,
            acf: {
                ...post.acf,
                ...(input.patch.event_datetime === undefined ? {} : { event_datetime: input.patch.event_datetime }),
                ...(input.patch.address === undefined ? {} : { address: input.patch.address }),
                ...(input.patch.ticket_link === undefined ? {} : { ticket_link: input.patch.ticket_link })
            }
        };
        if (thrown && thrown !== 'none') {
            this.posts.set(input.postId, updated);
        } else if (!failure || failure.apply !== 'none') {
            this.posts.set(input.postId, updated);
        }
        if (thrown === 'partial' || failure?.apply === 'partial') {
            this.posts.set(input.postId, {
                ...updated,
                title: post.title,
                acf: input.patch.address === undefined ? updated.acf : { ...updated.acf, address: post.acf.address }
            });
        }
        if (thrown) {
            if (this.nextUpdateReadbackDisagreement) {
                this.freshnessDisagreementPostId = input.postId;
                this.nextUpdateReadbackDisagreement = false;
            }
            throw new Error('synthetic transport exception');
        }
        if (failure) {
            if (this.nextUpdateReadbackDisagreement) {
                this.freshnessDisagreementPostId = input.postId;
                this.nextUpdateReadbackDisagreement = false;
            }
            return errorFor(failure);
        }
        return { kind: 'success', value: { postId: input.postId } };
    }

    seedPost(post: CanonicalPost): void {
        this.posts.set(post.id, clonePost(post));
    }

    setCurrentUser(user: RemoteUser): void {
        this.currentUser = user;
    }

    async trashDraft(
        input: TrashDraftTransportInput,
        _credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>> {
        this.calls.push(`trashDraft:${input.postId}`);
        this.mutationCounts.trash += 1;
        this.lastTrashRequest = { ...input };
        const post = this.posts.get(input.postId);
        if (!post) {
            return { kind: 'error', error: { kind: 'http', status: 404, mutationState: 'not_started' } };
        }
        const failure = this.nextTrashFailure;
        this.nextTrashFailure = undefined;
        const thrown = this.nextTrashThrow;
        this.nextTrashThrow = undefined;
        if (thrown && thrown !== 'none') {
            this.posts.set(input.postId, {
                ...post,
                status: 'trash',
                modifiedGmt: nowVersion(this.versionCounter++)
            });
        } else if (!failure || failure.apply !== 'none') {
            this.posts.set(input.postId, {
                ...post,
                status: 'trash',
                modifiedGmt: nowVersion(this.versionCounter++)
            });
        }
        if (thrown === 'partial' || failure?.apply === 'partial') {
            const partiallyUpdated = this.posts.get(input.postId);
            if (partiallyUpdated) {
                this.posts.set(input.postId, { ...partiallyUpdated, status: 'draft' });
            }
        }
        if (thrown) {
            if (this.nextTrashReadbackDisagreement) {
                this.freshnessDisagreementPostId = input.postId;
                this.nextTrashReadbackDisagreement = false;
            }
            throw new Error('synthetic transport exception');
        }
        if (failure) {
            if (this.nextTrashReadbackDisagreement) {
                this.freshnessDisagreementPostId = input.postId;
                this.nextTrashReadbackDisagreement = false;
            }
            return errorFor(failure);
        }
        return { kind: 'success', value: { postId: input.postId } };
    }

    failNextCreateAfterApplying(kind: 'timeout' | 'http'): void {
        this.nextCreateFailure = { kind, apply: 'complete' };
    }

    failNextCreateAfterPartialApplication(): void {
        this.nextCreateFailure = { kind: 'timeout', apply: 'partial' };
    }

    failNextCreateWithoutApplying(): void {
        this.nextCreateFailure = { kind: 'timeout', apply: 'none' };
    }

    throwNextCreateAfterCompleteMutation(): void {
        this.nextCreateThrow = 'complete';
    }

    throwNextCreateAfterPartialMutation(): void {
        this.nextCreateThrow = 'partial';
    }

    failNextUpdateAfterApplying(kind: 'timeout' | 'http'): void {
        this.nextUpdateFailure = { kind, apply: 'complete' };
    }

    failNextUpdateAfterPartialApplication(): void {
        this.nextUpdateFailure = { kind: 'timeout', apply: 'partial' };
    }

    failNextUpdateWithoutApplying(): void {
        this.nextUpdateFailure = { kind: 'timeout', apply: 'none' };
    }

    failNextUpdateWithAmbiguousReconciliation(): void {
        this.nextUpdateFailure = { kind: 'timeout', apply: 'complete' };
        this.nextUpdateReadbackDisagreement = true;
    }

    throwNextUpdateAfterCompleteMutation(): void {
        this.nextUpdateThrow = 'complete';
    }

    throwNextUpdateAfterPartialMutation(): void {
        this.nextUpdateThrow = 'partial';
    }

    throwNextUpdateWithAmbiguousReconciliation(): void {
        this.nextUpdateThrow = 'complete';
        this.nextUpdateReadbackDisagreement = true;
    }

    failNextTrashAfterApplying(kind: 'timeout' | 'http'): void {
        this.nextTrashFailure = { kind, apply: 'complete' };
    }

    failNextTrashAfterPartialApplication(): void {
        this.nextTrashFailure = { kind: 'timeout', apply: 'partial' };
    }

    failNextTrashWithAmbiguousReconciliation(): void {
        this.nextTrashFailure = { kind: 'timeout', apply: 'complete' };
        this.nextTrashReadbackDisagreement = true;
    }

    failNextTrashWithoutApplying(): void {
        this.nextTrashFailure = { kind: 'timeout', apply: 'none' };
    }

    throwNextTrashAfterCompleteMutation(): void {
        this.nextTrashThrow = 'complete';
    }

    throwNextTrashAfterPartialMutation(): void {
        this.nextTrashThrow = 'partial';
    }

    throwNextTrashWithAmbiguousReconciliation(): void {
        this.nextTrashThrow = 'complete';
        this.nextTrashReadbackDisagreement = true;
    }

    setPostState(
        postId: number,
        state: Partial<Omit<CanonicalPost, 'acf'>> & { acf?: Partial<CanonicalPost['acf']> }
    ): void {
        const post = this.posts.get(postId);
        if (!post) return;
        const next: CanonicalPost = { ...post };
        if (state.id !== undefined) next.id = state.id;
        if (state.slug !== undefined) next.slug = state.slug;
        if (state.status !== undefined) next.status = state.status;
        if (state.authorId !== undefined) next.authorId = state.authorId;
        if (state.modifiedGmt !== undefined) next.modifiedGmt = state.modifiedGmt;
        if (state.title !== undefined) next.title = state.title;
        if (state.content !== undefined) next.content = state.content;
        if (state.categories !== undefined) next.categories = [...state.categories];
        if (state.tags !== undefined) next.tags = [...state.tags];
        if (state.acf) {
            next.acf = {
                event_datetime:
                    state.acf.event_datetime === undefined ? post.acf.event_datetime : state.acf.event_datetime,
                address: state.acf.address === undefined ? post.acf.address : state.acf.address,
                ticket_link: state.acf.ticket_link === undefined ? post.acf.ticket_link : state.acf.ticket_link
            };
        }
        this.posts.set(postId, next);
    }

    setFreshnessDisagreement(postId: number): void {
        this.freshnessDisagreementPostId = postId;
    }

    clearFreshnessDisagreement(): void {
        this.freshnessDisagreementPostId = undefined;
    }

    setSharedCacheEvidence(value: boolean): void {
        this.sharedCacheEvidence = value;
    }

    setSchemaFields(fields: readonly string[]): void {
        this.collectionSchemaFields = [...fields];
        this.postSchemaFields = [...fields];
    }

    setCollectionSchemaFields(fields: readonly string[]): void {
        this.collectionSchemaFields = [...fields];
    }

    setPostSchemaFields(fields: readonly string[]): void {
        this.postSchemaFields = [...fields];
    }

    setPostSchemaConditionedOnEvents(value: boolean): void {
        this.postSchemaConditionedOnEvents = value;
    }
}

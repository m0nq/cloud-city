import type {
    AcfValues,
    CanonicalPost,
    FreshnessEvidence,
    RemotePostResult,
    RemotePostSchema,
    RemoteUser,
    TransportError,
    TransportResult
} from './types';
import { FIXED_TAXONOMY, REQUIRED_ACF_FIELDS } from './types';
import { assertCompleteCanonicalPost } from './policy';
import type {
    CreateDraftTransportInput,
    CredentialHandle,
    TrashDraftTransportInput,
    UpdateDraftTransportInput,
    WordPressReadTransport,
    WordPressTransport
} from './transport';
import { readCredentialSecret } from './transport';
import { createHash } from 'node:crypto';

const POST_FIELDS = 'id,slug,status,author,modified,modified_gmt,title,content,categories,tags,acf';

type FetchImplementation = typeof fetch;

export interface WordPressRestReadTransportOptions {
    baseUrl: string;
    username: string;
    fetchImplementation?: FetchImplementation;
    timeoutMs?: number;
    allowInsecureLocalhost?: boolean;
}

interface JsonResponse {
    body: unknown;
    headers: Headers;
    status: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function transportError(
    kind: TransportError['kind'],
    status?: number,
    code?: string,
    mutationState: TransportError['mutationState'] = 'not_started'
): TransportResult<never> {
    return {
        kind: 'error',
        error: {
            kind,
            mutationState,
            ...(status === undefined ? {} : { status }),
            ...(code === undefined ? {} : { code })
        }
    };
}

function asRecord(value: unknown): Record<string, unknown> {
    return isRecord(value) ? value : {};
}

function responseErrorCode(value: unknown): string | undefined {
    const code = asRecord(value).code;
    return typeof code === 'string' && code.trim() !== '' ? code : undefined;
}

function hasUnexpectedRedirect(response: Response, requestedUrl: URL): boolean {
    if (response.redirected) return true;
    if (response.url === '') return false;
    try {
        return response.url !== requestedUrl.toString();
    } catch {
        return true;
    }
}

function freshnessFromHeaders(headers: Headers): FreshnessEvidence {
    const cacheControl = headers.get('cache-control')?.toLowerCase() ?? '';
    const liteSpeedControl = headers.get('x-litespeed-cache-control')?.toLowerCase() ?? '';
    const liteSpeedStatus = headers.get('x-litespeed-cache')?.toLowerCase() ?? '';
    const cloudflareStatus = headers.get('cf-cache-status')?.toLowerCase() ?? '';
    const age = headers.get('age') ?? undefined;
    const explicitNoCache =
        cacheControl.includes('no-cache') ||
        cacheControl.includes('no-store') ||
        cacheControl.includes('private') ||
        liteSpeedControl.includes('no-cache') ||
        liteSpeedControl.includes('no-store') ||
        liteSpeedControl.includes('private');
    const explicitSharedHit =
        liteSpeedStatus.split(',').some(value => value.trim() === 'hit') ||
        cloudflareStatus === 'hit' ||
        age !== undefined;
    const originBypassSignal = ['bypass', 'dynamic'].includes(cloudflareStatus);

    return {
        supportedSafeRead: !explicitSharedHit && (explicitNoCache || originBypassSignal),
        sharedCacheHit: explicitSharedHit,
        ...(age === undefined ? {} : { age })
    };
}

function mapAcf(value: unknown): AcfValues {
    const acf = asRecord(value);
    return {
        event_datetime: acf.event_datetime as string | null,
        address: acf.address as string | null,
        ticket_link: acf.ticket_link as string | null
    };
}

function mapPost(value: unknown, preferRawContent = false): CanonicalPost {
    const post = asRecord(value);
    const title = asRecord(post.title);
    const content = asRecord(post.content);
    const canonicalContent = preferRawContent && typeof content.raw === 'string' ? content.raw : content.rendered;
    return {
        id: post.id as number,
        slug: post.slug as string,
        status: post.status as CanonicalPost['status'],
        authorId: post.author as number,
        modifiedGmt: post.modified_gmt as string,
        title: title.rendered as string,
        content: canonicalContent as string,
        categories: post.categories as readonly number[],
        tags: post.tags as readonly number[],
        acf: mapAcf(post.acf)
    };
}

function mapUser(value: unknown): RemoteUser {
    const user = asRecord(value);
    return {
        id: user.id as number,
        roles: user.roles as readonly string[],
        capabilities: user.capabilities as Readonly<Record<string, boolean>>,
        extraCapabilities: user.extra_capabilities as Readonly<Record<string, boolean>>
    };
}

type SchemaScope = 'collection' | 'item';

function mapSchema(value: unknown, scope: SchemaScope): RemotePostSchema | undefined {
    const root = asRecord(value);
    if (!isRecord(root.schema)) return undefined;
    const schema = root.schema;
    if (!isRecord(schema.properties)) return undefined;
    const properties = schema.properties;
    if (properties.acf === undefined && scope === 'collection') return { acfFields: [] };
    if (!isRecord(properties.acf)) return undefined;
    const acf = properties.acf;
    if (!isRecord(acf.properties)) return undefined;
    const acfProperties = acf.properties;
    if (Object.values(acfProperties).some(fieldSchema => !isRecord(fieldSchema))) return undefined;
    return { acfFields: Object.keys(acfProperties) };
}

function mapSchemaResponse(response: JsonResponse, scope: SchemaScope): TransportResult<RemotePostSchema> {
    const schema = mapSchema(response.body, scope);
    return schema === undefined
        ? transportError('malformed', response.status)
        : { kind: 'success', value: schema };
}

/**
 * Production-shaped read-only transport. Its public methods map only to the
 * bounded WordPress reads required by CLO-135; mutation methods are absent.
 */
export class WordPressRestReadTransport implements WordPressReadTransport {
    #baseUrl: URL;
    #username: string;
    #fetch: FetchImplementation;
    #timeoutMs: number;

    constructor(options: WordPressRestReadTransportOptions) {
        if (options.username.trim() === '') throw new Error('WordPress username is required.');
        const baseUrl = new URL(options.baseUrl);
        const localhost = ['localhost', '127.0.0.1', '::1'].includes(baseUrl.hostname);
        if (baseUrl.protocol !== 'https:' && !(options.allowInsecureLocalhost && localhost)) {
            throw new Error('WordPress transport requires HTTPS.');
        }
        baseUrl.pathname = baseUrl.pathname.replace(/\/$/, '') + '/';
        this.#baseUrl = baseUrl;
        this.#username = options.username;
        this.#fetch = options.fetchImplementation ?? fetch;
        this.#timeoutMs = options.timeoutMs ?? 10_000;
        if (!Number.isInteger(this.#timeoutMs) || this.#timeoutMs <= 0) {
            throw new Error('WordPress transport timeout must be a positive integer.');
        }
    }

    async getCurrentUser(
        _input: { context: 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<RemoteUser>> {
        const response = await this.getJson(
            'wp-json/wp/v2/users/me',
            { context: 'edit', _fields: 'id,roles,capabilities,extra_capabilities' },
            credential
        );
        if (response.kind === 'error') return response;
        return { kind: 'success', value: mapUser(response.value.body) };
    }

    async getPost(
        input: { postId: number; context: 'view' | 'edit'; freshness: 'normal' | 'directed' },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostResult>> {
        if (!Number.isInteger(input.postId) || input.postId <= 0) return transportError('unknown');
        const headers =
            input.freshness === 'directed' ? { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } : undefined;
        const response = await this.getJson(
            `wp-json/wp/v2/posts/${input.postId}`,
            { context: input.context, _fields: POST_FIELDS },
            credential,
            headers
        );
        if (response.kind === 'error') return response;
        return {
            kind: 'success',
            value: {
                post: mapPost(response.value.body, input.context === 'edit'),
                freshness: freshnessFromHeaders(response.value.headers)
            }
        };
    }

    async getPostSchema(
        input: { context: 'view' | 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        const response = await this.optionsJson('wp-json/wp/v2/posts', { context: input.context }, credential);
        if (response.kind === 'error') return response;
        return mapSchemaResponse(response.value, 'collection');
    }

    async getPostSchemaForPost(
        input: { postId: number; context: 'view' | 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        if (!Number.isInteger(input.postId) || input.postId <= 0) return transportError('unknown');
        const response = await this.optionsJson(
            `wp-json/wp/v2/posts/${input.postId}`,
            { context: input.context },
            credential
        );
        if (response.kind === 'error') return response;
        return mapSchemaResponse(response.value, 'item');
    }

    async getEditableDrafts(
        input: { authorId: number; context: 'edit' },
        credential: CredentialHandle
    ): Promise<TransportResult<readonly CanonicalPost[]>> {
        if (!Number.isInteger(input.authorId) || input.authorId <= 0) return transportError('unknown');
        const response = await this.getJson(
            'wp-json/wp/v2/posts',
            {
                context: input.context,
                author: input.authorId,
                status: 'draft',
                per_page: 100,
                _fields: POST_FIELDS
            },
            credential
        );
        if (response.kind === 'error') return response;
        if (!Array.isArray(response.value.body)) return transportError('malformed', response.value.status);
        try {
            const posts = response.value.body.map(post => mapPost(post, true));
            posts.forEach(post => {
                assertCompleteCanonicalPost(post);
                if (post.authorId !== input.authorId || post.status !== 'draft') {
                    throw new Error('Editable draft collection item violated the requested boundary.');
                }
            });
            return { kind: 'success', value: posts };
        } catch {
            return transportError('malformed', response.value.status);
        }
    }

    async getPublishedPostEditAccess(
        input: { postId: number },
        credential: CredentialHandle
    ): Promise<TransportResult<'allowed' | 'forbidden'>> {
        if (!Number.isInteger(input.postId) || input.postId <= 0) return transportError('unknown');
        const response = await this.getJson(
            `wp-json/wp/v2/posts/${input.postId}`,
            { context: 'edit', _fields: 'id,status' },
            credential
        );
        if (
            response.kind === 'error' &&
            response.error.status === 403 &&
            response.error.code === 'rest_forbidden_context'
        ) {
            return { kind: 'success', value: 'forbidden' };
        }
        if (response.kind === 'error') return response;
        return { kind: 'success', value: 'allowed' };
    }

    protected async optionsJson(
        path: string,
        query: Record<string, string>,
        credential: CredentialHandle
    ): Promise<TransportResult<JsonResponse>> {
        return this.requestJson('OPTIONS', path, query, credential);
    }

    protected async getJson(
        path: string,
        query: Record<string, string | number>,
        credential: CredentialHandle,
        extraHeaders?: Record<string, string>
    ): Promise<TransportResult<JsonResponse>> {
        return this.requestJson('GET', path, query, credential, extraHeaders);
    }

    private async requestJson(
        method: 'GET' | 'OPTIONS',
        path: string,
        query: Record<string, string | number>,
        credential: CredentialHandle,
        extraHeaders?: Record<string, string>
    ): Promise<TransportResult<JsonResponse>> {
        let secret: string;
        try {
            secret = readCredentialSecret(credential);
        } catch {
            return transportError('unknown');
        }

        const url = new URL(path, this.#baseUrl);
        for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.#timeoutMs);
        try {
            const authorization = `Basic ${Buffer.from(`${this.#username}:${secret}`, 'utf8').toString('base64')}`;
            const response = await this.#fetch(url, {
                method,
                redirect: 'error',
                headers: {
                    Accept: 'application/json',
                    Authorization: authorization,
                    ...extraHeaders
                },
                signal: controller.signal
            });
            if (hasUnexpectedRedirect(response, url)) return transportError('network');
            const bodyText = await response.text();
            let body: unknown;
            try {
                body = JSON.parse(bodyText);
            } catch {
                return transportError('malformed', response.status);
            }
            if (!response.ok) return transportError('http', response.status, responseErrorCode(body));
            return { kind: 'success', value: { body, headers: response.headers, status: response.status } };
        } catch {
            return transportError('network');
        } finally {
            clearTimeout(timeout);
        }
    }
}

export type OperationSlugNamespace = 'clo149-disposable' | 'clo117-music-block';

export interface WordPressRestWriteTransportOptions extends WordPressRestReadTransportOptions {
    operationSlugNamespace?: OperationSlugNamespace;
}

function postIdFromResponse(response: JsonResponse): number | undefined {
    const id = asRecord(response.body).id;
    return typeof id === 'number' && Number.isInteger(id) && id > 0 ? id : undefined;
}

function postSlugForOperation(operationId: string, namespace: OperationSlugNamespace): string {
    const digest = createHash('sha256').update(operationId, 'utf8').digest('hex').slice(0, 20);
    return `${namespace}-${digest}`;
}

export function deterministicOperationSlug(
    operationId: string,
    namespace: OperationSlugNamespace = 'clo149-disposable'
): string {
    if (operationId.trim() === '') throw new Error('Operation ID is required.');
    return postSlugForOperation(operationId, namespace);
}

/**
 * Production mutation transport. The read-only transport remains a distinct
 * public type; this class is intentionally not exported from the package
 * barrel and exposes only the bounded WordPressTransport methods.
 */
export class WordPressRestWriteTransport extends WordPressRestReadTransport implements WordPressTransport {
    #baseUrl: URL;
    #username: string;
    #fetch: FetchImplementation;
    #timeoutMs: number;
    #operationSlugNamespace: OperationSlugNamespace;
    readonly mutationTrace: string[] = [];

    constructor(options: WordPressRestWriteTransportOptions) {
        super(options);
        const baseUrl = new URL(options.baseUrl);
        baseUrl.pathname = baseUrl.pathname.replace(/\/$/, '') + '/';
        this.#baseUrl = baseUrl;
        this.#username = options.username;
        this.#fetch = options.fetchImplementation ?? fetch;
        this.#timeoutMs = options.timeoutMs ?? 10_000;
        this.#operationSlugNamespace = options.operationSlugNamespace ?? 'clo149-disposable';
    }

    async #requestMutationJson(
        method: 'POST' | 'DELETE',
        path: string,
        query: Record<string, string | number>,
        credential: CredentialHandle,
        requestBody?: unknown
    ): Promise<TransportResult<JsonResponse>> {
        let secret: string;
        try {
            secret = readCredentialSecret(credential);
        } catch {
            return transportError('unknown');
        }

        const url = new URL(path, this.#baseUrl);
        for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.#timeoutMs);
        try {
            const authorization = `Basic ${Buffer.from(`${this.#username}:${secret}`, 'utf8').toString('base64')}`;
            const response = await this.#fetch(url, {
                method,
                redirect: 'error',
                headers: {
                    Accept: 'application/json',
                    Authorization: authorization,
                    ...(requestBody === undefined ? {} : { 'Content-Type': 'application/json' })
                },
                ...(requestBody === undefined ? {} : { body: JSON.stringify(requestBody) }),
                signal: controller.signal
            });
            if (hasUnexpectedRedirect(response, url)) return transportError('network', undefined, undefined, 'may_have_started');
            const bodyText = await response.text();
            let body: unknown;
            try {
                body = JSON.parse(bodyText);
            } catch {
                return transportError('malformed', response.status, undefined, 'may_have_started');
            }
            if (!response.ok) {
                return transportError('http', response.status, responseErrorCode(body), 'may_have_started');
            }
            return { kind: 'success', value: { body, headers: response.headers, status: response.status } };
        } catch {
            return transportError('network', undefined, undefined, 'may_have_started');
        } finally {
            clearTimeout(timeout);
        }
    }

    async findDraftForOperation(
        input: { operationId: string; authorId: number },
        credential: CredentialHandle
    ): Promise<TransportResult<CanonicalPost | null>> {
        const slug = deterministicOperationSlug(input.operationId, this.#operationSlugNamespace);
        const response = await this.getJson(
            'wp-json/wp/v2/posts',
            { context: 'edit', status: 'any', slug, per_page: 10, _fields: POST_FIELDS },
            credential
        );
        if (response.kind === 'error') return response;
        if (!Array.isArray(response.value.body)) return transportError('malformed', response.value.status);
        if (response.value.body.length === 0) return { kind: 'success', value: null };
        if (response.value.body.length !== 1) return transportError('malformed', response.value.status);
        const post = mapPost(response.value.body[0], true);
        if (
            post.slug !== slug ||
            post.authorId !== input.authorId ||
            (post.status !== 'draft' && post.status !== 'trash')
        ) {
            return transportError('unknown', response.value.status);
        }
        return { kind: 'success', value: post };
    }

    async createDraft(
        input: CreateDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number; slug: string }>> {
        const slug = deterministicOperationSlug(input.operationId, this.#operationSlugNamespace);
        this.mutationTrace.push('create:base');
        const created = await this.#requestMutationJson(
            'POST',
            'wp-json/wp/v2/posts',
            { context: 'edit' },
            credential,
            {
                status: 'draft',
                slug,
                title: input.title,
                content: input.content,
                categories: [...input.categories],
                tags: [...input.tags]
            }
        );
        if (created.kind === 'error') return created;
        const postId = postIdFromResponse(created.value);
        if (postId === undefined) return transportError('malformed', created.value.status, undefined, 'may_have_started');
        const createdSlug = asRecord(created.value.body).slug;
        if (createdSlug !== slug) {
            return transportError('malformed', created.value.status, 'deterministic_slug_mismatch', 'may_have_started');
        }

        this.mutationTrace.push(`create:schema:${postId}`);
        const schema = await this.getPostSchemaForPost({ postId, context: 'edit' }, credential);
        if (schema.kind === 'error') {
            return schema;
        }
        if (!REQUIRED_ACF_FIELDS.every(field => schema.value.acfFields.includes(field))) {
            return transportError('malformed', undefined, 'acf_fields_unavailable_after_category_assignment', 'may_have_started');
        }

        this.mutationTrace.push(`create:acf:${postId}`);
        const acfUpdate = await this.#requestMutationJson(
            'POST',
            `wp-json/wp/v2/posts/${postId}`,
            { context: 'edit' },
            credential,
            {
                acf: {
                    event_datetime: input.event_datetime,
                    address: input.address,
                    ticket_link: input.ticket_link
                }
            }
        );
        if (acfUpdate.kind === 'error') return acfUpdate;
        const updatedPostId = postIdFromResponse(acfUpdate.value);
        if (updatedPostId !== postId) {
            return transportError('malformed', acfUpdate.value.status, undefined, 'may_have_started');
        }
        return { kind: 'success', value: { postId, slug } };
    }

    async updateDraft(
        input: UpdateDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>> {
        const body: Record<string, unknown> = {};
        if (input.patch.title !== undefined) body.title = input.patch.title;
        if (input.patch.content !== undefined) body.content = input.patch.content;
        const acf: Record<string, string> = {};
        for (const field of REQUIRED_ACF_FIELDS) {
            const value = input.patch[field];
            if (value !== undefined) acf[field] = value;
        }
        if (Object.keys(acf).length > 0) body.acf = acf;
        this.mutationTrace.push(`update:${input.postId}`);
        const response = await this.#requestMutationJson(
            'POST',
            `wp-json/wp/v2/posts/${input.postId}`,
            { context: 'edit' },
            credential,
            body
        );
        if (response.kind === 'error') return response;
        const postId = postIdFromResponse(response.value);
        return postId === input.postId
            ? { kind: 'success', value: { postId } }
            : transportError('malformed', response.value.status, undefined, 'may_have_started');
    }

    async trashDraft(
        input: TrashDraftTransportInput,
        credential: CredentialHandle
    ): Promise<TransportResult<{ postId: number }>> {
        this.mutationTrace.push(`trash:${input.postId}`);
        const response = await this.#requestMutationJson(
            'DELETE',
            `wp-json/wp/v2/posts/${input.postId}`,
            { context: 'edit' },
            credential,
            undefined
        );
        if (response.kind === 'error') return response;
        const postId = postIdFromResponse(response.value);
        return postId === input.postId
            ? { kind: 'success', value: { postId } }
            : transportError('malformed', response.value.status, undefined, 'may_have_started');
    }

}

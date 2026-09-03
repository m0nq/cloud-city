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
import { assertCompleteCanonicalPost } from './policy';
import { type CredentialHandle, readCredentialSecret, type WordPressReadTransport } from './transport';

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

function transportError(kind: TransportError['kind'], status?: number, code?: string): TransportResult<never> {
    return {
        kind: 'error',
        error: {
            kind,
            mutationState: 'not_started',
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

function mapPost(value: unknown): CanonicalPost {
    const post = asRecord(value);
    const title = asRecord(post.title);
    const content = asRecord(post.content);
    return {
        id: post.id as number,
        slug: post.slug as string,
        status: post.status as CanonicalPost['status'],
        authorId: post.author as number,
        modifiedGmt: post.modified_gmt as string,
        title: title.rendered as string,
        content: content.rendered as string,
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

function mapSchema(value: unknown): RemotePostSchema {
    const root = asRecord(value);
    const schema = asRecord(root.schema);
    const properties = asRecord(schema.properties);
    const acf = asRecord(properties.acf);
    const acfProperties = asRecord(acf.properties);
    return { acfFields: Object.keys(acfProperties) };
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
                post: mapPost(response.value.body),
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
        return { kind: 'success', value: mapSchema(response.value.body) };
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
            const posts = response.value.body.map(mapPost);
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

    private async optionsJson(
        path: string,
        query: Record<string, string>,
        credential: CredentialHandle
    ): Promise<TransportResult<JsonResponse>> {
        return this.requestJson('OPTIONS', path, query, credential);
    }

    private async getJson(
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

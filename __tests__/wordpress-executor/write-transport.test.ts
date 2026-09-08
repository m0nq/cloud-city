/** @jest-environment node */

import { deterministicOperationSlug, WordPressRestWriteTransport } from '@/wordpress-executor/rest-transport';
import { SyntheticCredentialProvider } from '@/wordpress-executor/testing';
import { FIXED_TAXONOMY } from '@/wordpress-executor/types';

const SYNTHETIC_SECRET = 'CLO149_SYNTHETIC_SECRET_DO_NOT_LOG_8b4d';

function response(body: unknown, init: ResponseInit = {}): Response {
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            'content-type': 'application/json',
            'cache-control': 'private, no-store',
            ...init.headers
        },
        ...init
    });
}

function postPayload(id: number, overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        id,
        slug: 'clo149-disposable-fixture',
        status: 'draft',
        author: 2,
        modified_gmt: '2026-09-08T18:00:00',
        title: { rendered: 'Synthetic fixture' },
        content: { rendered: '<p>Synthetic fixture</p>' },
        categories: [FIXED_TAXONOMY.categoryId],
        tags: [FIXED_TAXONOMY.tagId],
        acf: {
            event_datetime: '2027-01-17 14:37:00',
            address: 'SYNTHETIC TEST ADDRESS — DO NOT PUBLISH',
            ticket_link: 'https://example.com/cloud-city-clo-149-test'
        },
        ...overrides
    };
}

function schemaResponse(fields: readonly string[] = ['event_datetime', 'address', 'ticket_link']): Response {
    return response({
        schema: {
            properties: {
                acf: {
                    properties: Object.fromEntries(fields.map(field => [field, {}]))
                }
            }
        }
    });
}

function requestBody(init: RequestInit | undefined): Record<string, unknown> | undefined {
    return init?.body === undefined ? undefined : JSON.parse(String(init.body)) as Record<string, unknown>;
}

function createInput() {
    return {
        operationId: 'clo149-test-operation',
        title: 'DISPOSABLE TEST — House in the Park #3 — DO NOT PUBLISH',
        content: 'Synthetic CLO-149 fixture only. Do not publish.',
        event_datetime: '2027-01-17 14:37:00',
        address: 'SYNTHETIC TEST ADDRESS — DO NOT PUBLISH',
        ticket_link: 'https://example.com/cloud-city-clo-149-test',
        status: 'draft' as const,
        categories: [FIXED_TAXONOMY.categoryId] as const,
        tags: [FIXED_TAXONOMY.tagId] as const
    };
}

describe('CLO-149 bounded production REST write transport', () => {
    it('supports the separately bounded Music Block slug namespace without changing the disposable default', () => {
        const operationId = 'clo117-music-block-20261017-draft';

        expect(deterministicOperationSlug(operationId)).toMatch(/^clo149-disposable-[a-f0-9]{20}$/);
        expect(deterministicOperationSlug(operationId, 'clo117-music-block')).toMatch(
            /^clo117-music-block-[a-f0-9]{20}$/
        );
    });

    it('uses the bounded Music Block namespace for the real-event create preflight and base request', async () => {
        const requests: Array<{ method: string; url: string; init?: RequestInit }> = [];
        const operationId = 'clo117-music-block-20261017-draft';
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            operationSlugNamespace: 'clo117-music-block',
            fetchImplementation: async (input, init) => {
                requests.push({ method: init?.method ?? 'GET', url: String(input), init });
                if (init?.method === 'OPTIONS') return schemaResponse();
                if (init?.method === 'GET') return response([]);
                return response({ id: 9030, slug: deterministicOperationSlug(operationId, 'clo117-music-block') });
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.createDraft(
                {
                    ...createInput(),
                    operationId,
                    title: 'Music Block',
                    content: '<p>Approved draft copy.</p>',
                    event_datetime: '2026-10-17 13:00:00',
                    address: 'TBA',
                    ticket_link: 'https://partiful.com/e/TGox2BL4WnU9a9MMFQ7D'
                },
                credential
            )
        );

        expect(result).toEqual({
            kind: 'success',
            value: { postId: 9030, slug: deterministicOperationSlug(operationId, 'clo117-music-block') }
        });
        expect(requestBody(requests[0].init)).toMatchObject({
            status: 'draft',
            slug: expect.stringMatching(/^clo117-music-block-[a-f0-9]{20}$/)
        });
        expect(requestBody(requests[0].init)).not.toHaveProperty('status', 'publish');
        expect(transport.mutationTrace).toEqual(['create:base', 'create:schema:9030', 'create:acf:9030']);
    });

    it('uses edit-context raw content for canonical write readback while retaining rendered fallback', async () => {
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () =>
                response(
                    postPayload(9020, {
                        content: {
                            raw: 'Synthetic content sent to WordPress',
                            rendered: '<p>Synthetic content sent to WordPress</p>\n'
                        }
                    })
                )
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPost({ postId: 9020, context: 'edit', freshness: 'normal' }, credential)
        );

        expect(result).toMatchObject({
            kind: 'success',
            value: { post: { content: 'Synthetic content sent to WordPress' } }
        });
    });

    it('creates taxonomy first, reads the item-conditioned schema, then writes ACF', async () => {
        const requests: Array<{ method: string; url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ method: init?.method ?? 'GET', url: String(input), init });
                if (init?.method === 'OPTIONS') return schemaResponse();
                if (init?.method === 'POST' && new URL(String(input)).pathname.endsWith('/posts')) {
                    return response(postPayload(9021, { slug: deterministicOperationSlug(createInput().operationId) }));
                }
                return response(postPayload(9021));
            }
        });
        const credentials = new SyntheticCredentialProvider(SYNTHETIC_SECRET);

        const result = await credentials.withCredential(credential => transport.createDraft(createInput(), credential));

        expect(result).toEqual({
            kind: 'success',
            value: { postId: 9021, slug: deterministicOperationSlug(createInput().operationId) }
        });
        expect(transport.mutationTrace).toEqual(['create:base', 'create:schema:9021', 'create:acf:9021']);
        expect(requests.map(request => request.method)).toEqual(['POST', 'OPTIONS', 'POST']);
        expect(requestBody(requests[0].init)).toEqual({
            status: 'draft',
            slug: expect.stringMatching(/^clo149-disposable-[a-f0-9]{20}$/),
            title: createInput().title,
            content: createInput().content,
            categories: [210],
            tags: [203]
        });
        expect(requestBody(requests[0].init)).not.toHaveProperty('acf');
        expect(requestBody(requests[2].init)).toEqual({
            acf: {
                event_datetime: createInput().event_datetime,
                address: createInput().address,
                ticket_link: createInput().ticket_link
            }
        });
    });

    it('fails closed when WordPress suffixes the deterministic create slug', async () => {
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                if (init?.method === 'OPTIONS') return schemaResponse();
                return response(postPayload(9026, { slug: `${deterministicOperationSlug(createInput().operationId)}-2` }));
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.createDraft(createInput(), credential)
        );

        expect(result).toEqual({
            kind: 'error',
            error: {
                kind: 'malformed',
                mutationState: 'may_have_started',
                status: 200,
                code: 'deterministic_slug_mismatch'
            }
        });
        expect(transport.mutationTrace).toEqual(['create:base']);
    });

    it('fails closed after the base draft if conditional ACF fields are unavailable', async () => {
        const requests: Array<{ method: string; url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ method: init?.method ?? 'GET', url: String(input), init });
                if (init?.method === 'OPTIONS') return schemaResponse(['event_datetime', 'address']);
                return response(postPayload(9022, { slug: deterministicOperationSlug(createInput().operationId) }));
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.createDraft(createInput(), credential)
        );

        expect(result).toEqual({
            kind: 'error',
            error: {
                kind: 'malformed',
                mutationState: 'may_have_started',
                code: 'acf_fields_unavailable_after_category_assignment'
            }
        });
        expect(requests.map(request => request.method)).toEqual(['POST', 'OPTIONS']);
        expect(transport.mutationTrace).toEqual(['create:base', 'create:schema:9022']);
    });

    it('sends only the bounded sparse update fields', async () => {
        const requests: Array<{ method: string; url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ method: init?.method ?? 'GET', url: String(input), init });
                return response(postPayload(9023));
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.updateDraft(
                {
                    postId: 9023,
                    expectedModifiedGmt: '2026-09-08T18:00:00',
                    patch: { address: 'SYNTHETIC TEST ADDRESS — UPDATED — DO NOT PUBLISH' }
                },
                credential
            )
        );

        expect(result).toEqual({ kind: 'success', value: { postId: 9023 } });
        expect(requests).toHaveLength(1);
        expect(requests[0].method).toBe('POST');
        expect(requestBody(requests[0].init)).toEqual({
            acf: { address: 'SYNTHETIC TEST ADDRESS — UPDATED — DO NOT PUBLISH' }
        });
        expect(requestBody(requests[0].init)).not.toHaveProperty('status');
        expect(requestBody(requests[0].init)).not.toHaveProperty('categories');
        expect(requestBody(requests[0].init)).not.toHaveProperty('tags');
    });

    it('trashes only through DELETE without force and classifies HTTP failure as may-have-started', async () => {
        const requests: Array<{ method: string; url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ method: init?.method ?? 'GET', url: String(input), init });
                return response({ code: 'synthetic_timeout' }, { status: 504 });
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.trashDraft(
                { postId: 9024, expectedModifiedGmt: '2026-09-08T18:00:00' },
                credential
            )
        );

        expect(result).toEqual({
            kind: 'error',
            error: { kind: 'http', mutationState: 'may_have_started', status: 504, code: 'synthetic_timeout' }
        });
        expect(requests[0].method).toBe('DELETE');
        expect(requests[0].url).not.toContain('force');
        expect(requests[0].init?.body).toBeUndefined();
    });

    it('rejects an existing published slug collision during idempotency preflight', async () => {
        const transport = new WordPressRestWriteTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () =>
                response([
                    postPayload(9025, {
                        status: 'publish',
                        author: 1
                    })
                ])
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.findDraftForOperation({ operationId: 'clo149-test-operation', authorId: 2 }, credential)
        );

        expect(result.kind).toBe('error');
        expect((result as { kind: 'error'; error: { mutationState: string } }).error.mutationState).toBe('not_started');
    });
});

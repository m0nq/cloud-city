/** @jest-environment node */

import { KeychainCredentialProvider } from '@/wordpress-executor/credential-provider';
import {
    CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
    CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
    parseReadOnlyCommand,
    runReadOnlyCommand,
    sanitizeReadOnlyProofResult
} from '@/wordpress-executor/read-only-cli';
import * as publicExecutorApi from '@/wordpress-executor';
import { WordPressReadExecutor } from '@/wordpress-executor/read-executor';
import { WordPressRestReadTransport } from '@/wordpress-executor/rest-transport';
import { runAuthenticatedReadOnlyProof } from '@/wordpress-executor/read-workflow';
import { InMemoryWordPressTransport, MemoryAuditSink, SyntheticCredentialProvider } from '@/wordpress-executor/testing';
import type {
    AuditSink,
    CanonicalPost,
    ExecutorResult,
    RemotePostResult,
    RemotePostSchema,
    RemoteUser,
    TransportResult
} from '@/wordpress-executor/types';
import {
    readCredentialSecret,
    type CredentialHandle,
    type CredentialProvider,
    type WordPressReadTransport
} from '@/wordpress-executor/transport';

const SYNTHETIC_SECRET = 'CLO135_SYNTHETIC_SECRET_DO_NOT_LOG_6f2b';
const MACHINE_USER_ID = 73;

function knownGoodPost(overrides: Partial<CanonicalPost> = {}): CanonicalPost {
    return {
        id: 2217,
        slug: 'cloud-city-spring-session',
        status: 'publish',
        authorId: 4,
        modifiedGmt: '2026-08-28T01:00:00',
        title: 'Cloud City: Spring Session',
        content: '<p>Spring Session</p>',
        categories: [210],
        tags: [203],
        acf: {
            event_datetime: '2026-04-18 16:00:00',
            address: '1740 Telegraph ave Oakland, CA 94612',
            ticket_link: 'https://luma.com/3pkzxvge'
        },
        ...overrides
    };
}

function createReadHarness() {
    const transport = new InMemoryWordPressTransport({ machineUserId: MACHINE_USER_ID });
    transport.seedPost(knownGoodPost());
    const audit = new MemoryAuditSink();
    const credentials = new SyntheticCredentialProvider(SYNTHETIC_SECRET);
    const executor = new WordPressReadExecutor({
        transport,
        credentials,
        audit,
        machineUserId: MACHINE_USER_ID
    });
    return { transport, audit, credentials, executor };
}

function validIdentity(): RemoteUser {
    return {
        id: MACHINE_USER_ID,
        roles: ['contributor'],
        capabilities: {
            read: true,
            edit_posts: true,
            delete_posts: true,
            publish_posts: false,
            edit_published_posts: false,
            delete_published_posts: false,
            edit_others_posts: false,
            manage_options: false
        },
        extraCapabilities: {}
    };
}

class ThrowingCredentialProvider implements CredentialProvider {
    async withCredential<T>(_operation: (credential: CredentialHandle) => Promise<T>): Promise<T> {
        throw new Error(`provider failed with ${SYNTHETIC_SECRET}`);
    }
}

class ThrowingReadTransport implements WordPressReadTransport {
    async getCurrentUser(
        _input: { context: 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemoteUser>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }

    async getPost(
        _input: { postId: number; context: 'view' | 'edit'; freshness: 'normal' | 'directed' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostResult>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }

    async getPostSchema(
        _input: { context: 'view' | 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }

    async getPostSchemaForPost(
        _input: { postId: number; context: 'view' | 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<RemotePostSchema>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }

    async getEditableDrafts(
        _input: { authorId: number; context: 'edit' },
        _credential: CredentialHandle
    ): Promise<TransportResult<readonly CanonicalPost[]>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }

    async getPublishedPostEditAccess(
        _input: { postId: number },
        _credential: CredentialHandle
    ): Promise<TransportResult<'allowed' | 'forbidden'>> {
        throw new Error(`transport failed with ${SYNTHETIC_SECRET}`);
    }
}

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

function editableDraftPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        id: 9001,
        slug: 'synthetic-editable-draft',
        status: 'draft',
        author: MACHINE_USER_ID,
        modified: '2026-08-28T01:00:00',
        modified_gmt: '2026-08-28T01:00:00',
        title: { rendered: 'Synthetic draft' },
        content: { rendered: '<p>Synthetic draft</p>' },
        categories: [210],
        tags: [203],
        acf: {
            event_datetime: '2026-04-18 16:00:00',
            address: '1740 Telegraph ave Oakland, CA 94612',
            ticket_link: 'https://luma.com/3pkzxvge'
        },
        ...overrides
    };
}

describe('CLO-135 semantic REST transport and provider boundary', () => {
    it('accepts only HTTPS production origins and exposes no generic request surface', () => {
        expect(() => new WordPressRestReadTransport({ baseUrl: 'http://cirquitree.com', username: 'machine' })).toThrow(
            'requires HTTPS'
        );
        expect(
            () =>
                new WordPressRestReadTransport({
                    baseUrl: 'http://localhost:3000',
                    username: 'machine',
                    allowInsecureLocalhost: true
                })
        ).not.toThrow();

        const transport = new WordPressRestReadTransport({ baseUrl: 'https://cirquitree.com', username: 'machine' });
        expect('request' in transport).toBe(false);
        expect('createDraft' in transport).toBe(false);
        expect('updateDraft' in transport).toBe(false);
        expect('trashDraft' in transport).toBe(false);
        expect(publicExecutorApi).not.toHaveProperty('WordPressRestReadTransport');
        expect(publicExecutorApi).not.toHaveProperty('KeychainCredentialProvider');
    });

    it('builds Basic Auth internally and sends only controlled read requests', async () => {
        const requests: Array<{ url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ url: String(input), init });
                return response({
                    id: 2217,
                    slug: 'cloud-city-spring-session',
                    status: 'publish',
                    author: 4,
                    modified_gmt: '2026-08-28T01:00:00',
                    title: { rendered: 'Cloud City: Spring Session' },
                    content: { rendered: '<p>Spring Session</p>' },
                    categories: [210],
                    tags: [203],
                    acf: {
                        event_datetime: '2026-04-18 16:00:00',
                        address: '1740 Telegraph ave Oakland, CA 94612',
                        ticket_link: 'https://luma.com/3pkzxvge'
                    }
                });
            }
        });
        const credentials = new SyntheticCredentialProvider(SYNTHETIC_SECRET);

        const result = await credentials.withCredential(credential =>
            transport.getPost({ postId: 2217, context: 'view', freshness: 'directed' }, credential)
        );

        expect(result.kind).toBe('success');
        expect(requests).toHaveLength(1);
        const request = requests[0];
        expect(request.url).toBe(
            'https://cirquitree.com/wp-json/wp/v2/posts/2217?context=view&_fields=id%2Cslug%2Cstatus%2Cauthor%2Cmodified%2Cmodified_gmt%2Ctitle%2Ccontent%2Ccategories%2Ctags%2Cacf'
        );
        expect(request.init?.method).toBe('GET');
        expect(request.init?.redirect).toBe('error');
        const headers = new Headers(request.init?.headers);
        expect(headers.get('Authorization')).toBe(
            `Basic ${Buffer.from(`machine-user:${SYNTHETIC_SECRET}`).toString('base64')}`
        );
        expect(headers.get('Cache-Control')).toBe('no-cache');
        expect(headers.get('Pragma')).toBe('no-cache');
        expect(headers.get('X-Caller-Control')).toBeNull();
    });

    it('keeps collection schema diagnostics separate from the item-specific Events schema', async () => {
        const requests: Array<{ url: string; init?: RequestInit }> = [];
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                requests.push({ url: String(input), init });
                if (init?.method === 'OPTIONS') {
                    const requestedUrl = new URL(String(input));
                    // ACF 6.8.8's production Events Group is conditional on
                    // post_category == category:events. The collection schema
                    // therefore does not prove these fields, while the
                    // known-good Events item schema does.
                    if (requestedUrl.pathname.endsWith('/2217')) {
                        return response({
                            schema: {
                                properties: {
                                    acf: {
                                        properties: {
                                            event_datetime: {},
                                            address: {},
                                            ticket_link: {}
                                        }
                                    }
                                }
                            }
                        });
                    }
                    return response({
                        schema: {
                            properties: {
                                title: {}
                            }
                        }
                    });
                }
                return response(
                    {
                        code: 'rest_forbidden_context',
                        message: 'Sorry, you are not allowed to view this post.',
                        data: { status: 403 }
                    },
                    { status: 403 }
                );
            }
        });
        const credentials = new SyntheticCredentialProvider(SYNTHETIC_SECRET);

        const schema = await credentials.withCredential(credential =>
            transport.getPostSchema({ context: 'view' }, credential)
        );
        const itemSchema = await credentials.withCredential(credential =>
            transport.getPostSchemaForPost({ postId: 2217, context: 'view' }, credential)
        );
        const boundary = await credentials.withCredential(credential =>
            transport.getPublishedPostEditAccess({ postId: 2217 }, credential)
        );

        expect(schema).toEqual({ kind: 'success', value: { acfFields: [] } });
        expect(itemSchema).toEqual({
            kind: 'success',
            value: { acfFields: ['event_datetime', 'address', 'ticket_link'] }
        });
        expect(boundary).toEqual({ kind: 'success', value: 'forbidden' });
        expect(requests[0].init?.method).toBe('OPTIONS');
        expect(requests[0].url).toBe('https://cirquitree.com/wp-json/wp/v2/posts?context=view');
        expect(requests[1].init?.method).toBe('OPTIONS');
        expect(requests[1].init?.redirect).toBe('error');
        expect(requests[1].url).toBe('https://cirquitree.com/wp-json/wp/v2/posts/2217?context=view');
        expect(requests[2].init?.method).toBe('GET');
        expect(requests[2].url).toBe(
            'https://cirquitree.com/wp-json/wp/v2/posts/2217?context=edit&_fields=id%2Cstatus'
        );
    });

    it.each([
        ['generic 403', response({ message: 'Forbidden' }, { status: 403 }), 'http'],
        ['malformed 403', new Response('<html>Forbidden</html>', { status: 403 }), 'malformed'],
        ['unrelated WordPress 403', response({ code: 'rest_cannot_edit' }, { status: 403 }), 'http']
    ])('does not treat %s as the expected published-edit denial', async (_label, deniedResponse, errorKind) => {
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () => deniedResponse
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPublishedPostEditAccess({ postId: 2217 }, credential)
        );

        expect(result).toMatchObject({ kind: 'error', error: { kind: errorKind, status: 403 } });
    });

    it('fails closed on a redirected response and never sends the credential to a second target', async () => {
        const requests: Array<{ url: string; authorization: string | null }> = [];
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async (input, init) => {
                const headers = new Headers(init?.headers);
                requests.push({ url: String(input), authorization: headers.get('Authorization') });
                expect(init?.redirect).toBe('error');
                const redirected = response({ id: 2217 });
                Object.defineProperty(redirected, 'redirected', { value: true });
                Object.defineProperty(redirected, 'url', {
                    value: 'https://unexpected.example/wp-json/wp/v2/posts/2217'
                });
                return redirected;
            }
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPost({ postId: 2217, context: 'view', freshness: 'normal' }, credential)
        );

        expect(result).toMatchObject({ kind: 'error', error: { kind: 'network' } });
        expect(requests).toHaveLength(1);
        expect(requests[0].url).toBe(
            'https://cirquitree.com/wp-json/wp/v2/posts/2217?context=view&_fields=id%2Cslug%2Cstatus%2Cauthor%2Cmodified%2Cmodified_gmt%2Ctitle%2Ccontent%2Ccategories%2Ctags%2Cacf'
        );
        expect(requests[0].authorization).toContain('Basic ');
    });

    it.each([
        ['wrong author', { author: MACHINE_USER_ID + 1 }],
        ['wrong status', { status: 'publish' }]
    ])('rejects editable-draft collection results with %s', async (_label, override) => {
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () => response([editableDraftPayload(override)])
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getEditableDrafts({ authorId: MACHINE_USER_ID, context: 'edit' }, credential)
        );

        expect(result).toMatchObject({ kind: 'error', error: { kind: 'malformed', status: 200 } });
    });

    it.each([
        ['malformed JSON', async () => new Response('{', { status: 200 })],
        ['unexpected HTTP status', async () => new Response('{}', { status: 500 })],
        [
            'network failure',
            async () => {
                throw new Error('network failure');
            }
        ]
    ])('returns a sanitized transport error for %s', async (_label, fetchImplementation) => {
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: fetchImplementation as typeof fetch
        });
        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPost({ postId: 2217, context: 'view', freshness: 'normal' }, credential)
        );

        expect(result.kind).toBe('error');
        expect(JSON.stringify(result)).not.toContain(SYNTHETIC_SECRET);
    });

    it('fails closed when an item schema field definition is malformed', async () => {
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () =>
                response({
                    schema: {
                        properties: {
                            acf: {
                                properties: {
                                    event_datetime: null,
                                    address: {},
                                    ticket_link: {}
                                }
                            }
                        }
                    }
                })
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPostSchemaForPost({ postId: 2217, context: 'view' }, credential)
        );

        expect(result).toMatchObject({ kind: 'error', error: { kind: 'malformed', status: 200 } });
    });

    it('fails closed when an item schema has no applicable ACF container', async () => {
        const transport = new WordPressRestReadTransport({
            baseUrl: 'https://cirquitree.com',
            username: 'machine-user',
            fetchImplementation: async () => response({ schema: { properties: { title: {} } } })
        });

        const result = await new SyntheticCredentialProvider(SYNTHETIC_SECRET).withCredential(credential =>
            transport.getPostSchemaForPost({ postId: 2217, context: 'view' }, credential)
        );

        expect(result).toMatchObject({ kind: 'error', error: { kind: 'malformed', status: 200 } });
    });

    it('keeps the secret inside the provider/transport seam and sanitizes provider failures', async () => {
        const calls: Array<{ path: string; args: readonly string[] }> = [];
        let capturedChildStdout = '';
        let retained: CredentialHandle | undefined;
        const provider = new KeychainCredentialProvider({
            service: CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
            account: CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
            runSecurity: async (path, args) => {
                calls.push({ path, args });
                capturedChildStdout = `${SYNTHETIC_SECRET}\n`;
                return capturedChildStdout;
            }
        });
        const result = await provider.withCredential(async credential => {
            retained = credential;
            return { status: 'verified_success' };
        });

        expect(result).toEqual({ status: 'verified_success' });
        expect(capturedChildStdout).toContain(SYNTHETIC_SECRET);
        expect(() => readCredentialSecret(retained as CredentialHandle)).toThrow('Credential handle is invalid.');
        expect(JSON.stringify(calls)).not.toContain(SYNTHETIC_SECRET);
        expect(calls[0]).toEqual({
            path: '/usr/bin/security',
            args: [
                'find-generic-password',
                '-a',
                CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
                '-s',
                CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
                '-w'
            ]
        });

        const audit: AuditSink = { record: jest.fn() };
        const executor = new WordPressReadExecutor({
            transport: new ThrowingReadTransport(),
            credentials: new ThrowingCredentialProvider(),
            audit,
            machineUserId: MACHINE_USER_ID
        });
        const failure = await executor.readIdentity({ operationId: 'provider-failure' });
        expect(failure.status).toBe('readback_failed');
        expect(JSON.stringify(failure)).not.toContain(SYNTHETIC_SECRET);
        expect(JSON.stringify(audit)).not.toContain(SYNTHETIC_SECRET);
    });

    it('invalidates a credential handle after the provider callback completes', async () => {
        let retained: CredentialHandle | undefined;
        const provider = new SyntheticCredentialProvider(SYNTHETIC_SECRET);

        await provider.withCredential(async credential => {
            retained = credential;
            expect(readCredentialSecret(credential)).toBe(SYNTHETIC_SECRET);
        });

        expect(retained).toBeDefined();
        expect(() => readCredentialSecret(retained as CredentialHandle)).toThrow('Credential handle is invalid.');
    });

    it('fails closed when the Keychain is locked, unavailable, or returns an empty value', async () => {
        const unavailable = new KeychainCredentialProvider({
            service: CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
            account: CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
            runSecurity: async () => {
                throw new Error(`locked keychain: ${SYNTHETIC_SECRET}`);
            }
        });
        await expect(unavailable.withCredential(async () => 'unreachable')).rejects.toMatchObject({
            name: 'CredentialProviderError',
            message: 'Credential provider is unavailable.'
        });

        const empty = new KeychainCredentialProvider({
            service: CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
            account: CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT,
            runSecurity: async () => '   '
        });
        await expect(empty.withCredential(async () => 'unreachable')).rejects.toMatchObject({
            name: 'CredentialProviderError',
            message: 'Credential provider is unavailable.'
        });
    });

    it('fails closed for identity under/over-privilege and malformed evidence', async () => {
        const cases: Array<[string, RemoteUser, ExecutorResult<RemoteUser>['status']]> = [
            ['wrong user', { ...validIdentity(), id: 999 }, 'policy_rejected'],
            ['wrong role', { ...validIdentity(), roles: ['author'] }, 'policy_rejected'],
            [
                'publish capability',
                { ...validIdentity(), capabilities: { ...validIdentity().capabilities, publish_posts: true } },
                'policy_rejected'
            ],
            [
                'admin capability',
                { ...validIdentity(), capabilities: { ...validIdentity().capabilities, manage_options: true } },
                'policy_rejected'
            ],
            [
                'under-privileged',
                { ...validIdentity(), capabilities: { ...validIdentity().capabilities, edit_posts: false } },
                'policy_rejected'
            ],
            ['missing capabilities', { ...validIdentity(), capabilities: undefined as never }, 'readback_failed'],
            ['malformed capability', { ...validIdentity(), capabilities: { read: 'yes' } as never }, 'readback_failed'],
            [
                'missing extra capabilities',
                { ...validIdentity(), extraCapabilities: undefined as never },
                'readback_failed'
            ],
            [
                'malformed extra capabilities',
                { ...validIdentity(), extraCapabilities: { delegated: 'yes' } as never },
                'readback_failed'
            ]
        ];

        for (const [label, user, expected] of cases) {
            const harness = createReadHarness();
            harness.transport.setCurrentUser(user);
            await expect(
                harness.executor.readIdentity({ operationId: `identity-${label.replace(/ /g, '-')}` })
            ).resolves.toMatchObject({
                status: expected
            });
        }
    });

    it('runs the complete fixed authenticated read-only proof against mocks', async () => {
        const harness = createReadHarness();
        const result = await runAuthenticatedReadOnlyProof(harness.executor, 'proof-success');

        expect(result.status).toBe('verified_success');
        expect(result.identity.status).toBe('verified_success');
        expect(result.schema?.status).toBe('verified_success');
        expect(result.post?.value).toMatchObject({
            id: 2217,
            categories: [210],
            tags: [203],
            acf: {
                event_datetime: '2026-04-18 16:00:00',
                address: '1740 Telegraph ave Oakland, CA 94612',
                ticket_link: 'https://luma.com/3pkzxvge'
            }
        });
        expect(result.publishedPostEditBoundary).toMatchObject({ status: 'verified_success', value: 'forbidden' });
        expect(harness.transport.mutationCounts).toEqual({ create: 0, update: 0, trash: 0 });
    });

    it('proves a category-conditioned Events schema from the item-specific path', async () => {
        const harness = createReadHarness();
        harness.transport.setCollectionSchemaFields([]);
        harness.transport.setPostSchemaFields(['event_datetime', 'address', 'ticket_link']);
        harness.transport.setPostSchemaConditionedOnEvents(true);

        const result = await runAuthenticatedReadOnlyProof(harness.executor, 'proof-conditional-events');

        expect(result.status).toBe('verified_success');
        expect(result.schema?.status).toBe('verified_success');
        expect(harness.transport.calls).not.toContain('getPostSchema');
        expect(harness.transport.calls).toContain('getPostSchemaForPost:2217');
        expect(harness.transport.mutationCounts).toEqual({ create: 0, update: 0, trash: 0 });
    });

    it('keeps collection schema reads diagnostic when no ACF container applies', async () => {
        const harness = createReadHarness();
        harness.transport.setCollectionSchemaFields([]);

        const result = await harness.executor.readPostSchema({ operationId: 'collection-schema-diagnostic' });

        expect(result).toEqual({
            status: 'verified_success',
            operationId: 'collection-schema-diagnostic',
            value: { acfFields: [] }
        });
        expect(harness.transport.mutationCounts).toEqual({ create: 0, update: 0, trash: 0 });
    });

    it('fails closed when the known-good Events item schema is incomplete', async () => {
        const harness = createReadHarness();
        harness.transport.setCollectionSchemaFields([]);
        harness.transport.setPostSchemaFields(['event_datetime', 'address']);
        harness.transport.setPostSchemaConditionedOnEvents(true);

        const result = await runAuthenticatedReadOnlyProof(harness.executor, 'proof-incomplete-item-schema');

        expect(result.status).toBe('readback_failed');
        expect(result.schema?.status).toBe('readback_failed');
        expect(result.post).toBeUndefined();
        expect(harness.transport.calls).not.toContain('getPost:2217:normal');
        expect(harness.transport.mutationCounts).toEqual({ create: 0, update: 0, trash: 0 });
    });

    it('stops the proof at identity failure instead of probing later gates', async () => {
        const harness = createReadHarness();
        harness.transport.setCurrentUser({ ...validIdentity(), capabilities: undefined as never });

        const result = await runAuthenticatedReadOnlyProof(harness.executor, 'proof-identity-failure');

        expect(result.status).toBe('readback_failed');
        expect(result.schema).toBeUndefined();
        expect(result.post).toBeUndefined();
        expect(result.editableDrafts).toBeUndefined();
        expect(result.publishedPostEditBoundary).toBeUndefined();
        expect(harness.transport.calls).toEqual(['getCurrentUser']);
    });

    it('fails closed for ACF null, exact-taxonomy mismatch, and freshness disagreement', async () => {
        const nullHarness = createReadHarness();
        nullHarness.transport.setPostState(2217, { acf: { address: null } });
        await expect(
            nullHarness.executor.readMarketingPost({ operationId: 'post-null', postId: 2217 })
        ).resolves.toMatchObject({
            status: 'readback_failed'
        });

        const taxonomyHarness = createReadHarness();
        taxonomyHarness.transport.setPostState(2217, { categories: [210, 999], tags: [203, 998] });
        await expect(runAuthenticatedReadOnlyProof(taxonomyHarness.executor, 'proof-taxonomy')).resolves.toMatchObject({
            status: 'readback_failed'
        });

        const freshnessHarness = createReadHarness();
        freshnessHarness.transport.setFreshnessDisagreement(2217);
        await expect(
            freshnessHarness.executor.readMarketingPost({ operationId: 'post-freshness', postId: 2217 })
        ).resolves.toMatchObject({
            status: 'ambiguous'
        });
    });

    it('rejects shared-cache evidence for a safety-critical canonical read', async () => {
        const harness = createReadHarness();
        harness.transport.setSharedCacheEvidence(true);

        await expect(
            harness.executor.readMarketingPost({ operationId: 'post-cache', postId: 2217 })
        ).resolves.toMatchObject({
            status: 'readback_failed'
        });
    });

    it('keeps the CLI command surface semantic and proof output sanitized', async () => {
        expect(parseReadOnlyCommand(['identity'])).toBe('identity');
        expect(parseReadOnlyCommand(['proof'])).toBe('proof');
        expect(parseReadOnlyCommand([])).toBe('help');
        expect(() => parseReadOnlyCommand(['post', '--path=/wp-json/users'])).toThrow();
        expect(() => parseReadOnlyCommand(['request'])).toThrow();

        const result = await runAuthenticatedReadOnlyProof(createReadHarness().executor, 'proof-sanitize');
        const sanitized = sanitizeReadOnlyProofResult(result);
        expect(JSON.stringify(sanitized)).not.toContain(SYNTHETIC_SECRET);
        expect(JSON.stringify(sanitized)).not.toContain('Authorization');
    });

    it('generates a unique operation prefix for each operational CLI command while allowing test injection', async () => {
        const harness = createReadHarness();
        const configuration = { executor: harness.executor, audit: { records: [], record: jest.fn() } };

        const first = await runReadOnlyCommand(configuration, 'identity');
        const second = await runReadOnlyCommand(configuration, 'identity');
        const injected = await runReadOnlyCommand(configuration, 'identity', 'synthetic-proof');

        expect(first.operationId).toMatch(/^cloud-city-wordpress-read-/);
        expect(second.operationId).toMatch(/^cloud-city-wordpress-read-/);
        expect(first.operationId).not.toBe(second.operationId);
        expect(injected.operationId).toBe('synthetic-proof-identity');
    });
});

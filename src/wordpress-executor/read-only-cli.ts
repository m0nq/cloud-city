import { randomUUID } from 'node:crypto';
import { KeychainCredentialProvider } from './credential-provider';
import { WordPressReadExecutor } from './read-executor';
import { runAuthenticatedReadOnlyProof } from './read-workflow';
import type { AuthenticatedReadOnlyProofResult } from './read-workflow';
import { WordPressRestReadTransport } from './rest-transport';
import type { AuditRecord, AuditSink, ExecutorResult } from './types';

export const CLOUD_CITY_WORDPRESS_ORIGIN = 'https://cirquitree.com';
export const CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE = 'com.cloudcity.wordpress.executor';
export const CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT = 'cloudcity-marketing-executor';
const WORDPRESS_USERNAME_ENV = 'CLOUD_CITY_WORDPRESS_USERNAME';
const WORDPRESS_MACHINE_USER_ID_ENV = 'CLOUD_CITY_WORDPRESS_MACHINE_USER_ID';

export type ReadOnlyCommand =
    'identity' | 'post' | 'schema' | 'editable-drafts' | 'published-post-edit-boundary' | 'proof';

export interface ReadOnlyCliConfiguration {
    executor: WordPressReadExecutor;
    audit: ReadOnlyAuditSink;
}

function createOperationalOperationIdPrefix(): string {
    return `cloud-city-wordpress-read-${randomUUID()}`;
}

export class ReadOnlyAuditSink implements AuditSink {
    readonly records: AuditRecord[] = [];

    record(record: AuditRecord): void {
        this.records.push({ ...record, changedFields: [...record.changedFields] });
    }
}

export function parseReadOnlyCommand(argv: readonly string[]): ReadOnlyCommand | 'help' {
    if (argv.length === 0 || (argv.length === 1 && argv[0] === '--help')) return 'help';
    if (argv.length !== 1) throw new Error('Exactly one bounded read-only command is required.');
    const command = argv[0];
    if (
        command !== 'identity' &&
        command !== 'post' &&
        command !== 'schema' &&
        command !== 'editable-drafts' &&
        command !== 'published-post-edit-boundary' &&
        command !== 'proof'
    ) {
        throw new Error('Unknown read-only command.');
    }
    return command;
}

export async function runReadOnlyCommand(
    configuration: ReadOnlyCliConfiguration,
    command: Exclude<ReadOnlyCommand, 'proof'>,
    operationIdPrefix = createOperationalOperationIdPrefix()
): Promise<ExecutorResult<unknown>> {
    switch (command) {
        case 'identity':
            return configuration.executor.readIdentity({ operationId: `${operationIdPrefix}-identity` });
        case 'post':
            return configuration.executor.readMarketingPost({
                operationId: `${operationIdPrefix}-post-2217`,
                postId: 2217,
                context: 'view'
            });
        case 'schema':
            return configuration.executor.readPostSchema({
                operationId: `${operationIdPrefix}-schema`,
                context: 'view'
            });
        case 'editable-drafts':
            return configuration.executor.readEditableDrafts({
                operationId: `${operationIdPrefix}-editable-drafts`
            });
        case 'published-post-edit-boundary':
            return configuration.executor.readPublishedPostEditBoundary({
                operationId: `${operationIdPrefix}-published-edit-boundary`,
                postId: 2217
            });
    }
}

export async function runReadOnlyProofCommand(
    configuration: ReadOnlyCliConfiguration,
    operationIdPrefix = createOperationalOperationIdPrefix()
): Promise<ReturnType<typeof runAuthenticatedReadOnlyProof> extends Promise<infer T> ? T : never> {
    return runAuthenticatedReadOnlyProof(configuration.executor, operationIdPrefix);
}

export function createConfiguredReadOnlyCli(): ReadOnlyCliConfiguration {
    const username = process.env[WORDPRESS_USERNAME_ENV]?.trim();
    const machineUserId = Number(process.env[WORDPRESS_MACHINE_USER_ID_ENV]);
    if (!username || !Number.isInteger(machineUserId) || machineUserId <= 0) {
        throw new Error('Read-only executor configuration is incomplete.');
    }

    const audit = new ReadOnlyAuditSink();
    const credentials = new KeychainCredentialProvider({
        service: CLOUD_CITY_WORDPRESS_KEYCHAIN_SERVICE,
        account: CLOUD_CITY_WORDPRESS_KEYCHAIN_ACCOUNT
    });
    const transport = new WordPressRestReadTransport({
        baseUrl: CLOUD_CITY_WORDPRESS_ORIGIN,
        username
    });
    const executor = new WordPressReadExecutor({
        transport,
        credentials,
        audit,
        machineUserId,
        invokingClient: 'cloud-city-wordpress-read-cli'
    });
    return { executor, audit };
}

export function sanitizeReadOnlyResult(result: ExecutorResult<unknown>): Record<string, unknown> {
    const value = result.value;
    if (!value || typeof value !== 'object') {
        return {
            status: result.status,
            operationId: result.operationId,
            ...(result.reason ? { reason: result.reason } : {})
        };
    }
    if ('id' in value && 'roles' in value && 'capabilities' in value) {
        const user = value as {
            id: number;
            roles: readonly string[];
            capabilities: Readonly<Record<string, boolean>>;
            extraCapabilities: Readonly<Record<string, boolean>>;
        };
        return {
            status: result.status,
            operationId: result.operationId,
            value: {
                id: user.id,
                roles: user.roles,
                capabilities: user.capabilities,
                extraCapabilities: user.extraCapabilities
            }
        };
    }
    if ('id' in value && 'slug' in value && 'acf' in value) {
        const post = value as {
            id: number;
            slug: string;
            status: string;
            authorId: number;
            modifiedGmt: string;
            categories: readonly number[];
            tags: readonly number[];
            acf: Record<string, unknown>;
        };
        return {
            status: result.status,
            operationId: result.operationId,
            value: {
                id: post.id,
                slug: post.slug,
                status: post.status,
                authorId: post.authorId,
                modifiedGmt: post.modifiedGmt,
                categories: post.categories,
                tags: post.tags,
                acf: post.acf
            }
        };
    }
    return { status: result.status, operationId: result.operationId };
}

export function sanitizeReadOnlyProofResult(result: AuthenticatedReadOnlyProofResult): Record<string, unknown> {
    return {
        status: result.status,
        operationId: result.operationId,
        ...(result.reason ? { reason: result.reason } : {}),
        identity: sanitizeReadOnlyResult(result.identity),
        ...(result.schema ? { schema: sanitizeReadOnlyResult(result.schema) } : {}),
        ...(result.post ? { post: sanitizeReadOnlyResult(result.post) } : {}),
        ...(result.editableDrafts ? { editableDrafts: sanitizeReadOnlyResult(result.editableDrafts) } : {}),
        ...(result.publishedPostEditBoundary
            ? { publishedPostEditBoundary: sanitizeReadOnlyResult(result.publishedPostEditBoundary) }
            : {})
    };
}

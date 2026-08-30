import { execFile } from 'node:child_process';
import type { CredentialHandle, CredentialProvider } from './transport';
import { createCredentialHandle, invalidateCredentialHandle } from './transport';

const DEFAULT_SECURITY_PATH = '/usr/bin/security';

export class CredentialProviderError extends Error {
    constructor() {
        super('Credential provider is unavailable.');
        this.name = 'CredentialProviderError';
    }
}

export interface KeychainCredentialProviderOptions {
    service: string;
    account: string;
    securityPath?: string;
    runSecurity?: (securityPath: string, args: readonly string[]) => Promise<string>;
}

function runSecurityCommand(securityPath: string, args: readonly string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        execFile(securityPath, [...args], { encoding: 'utf8', maxBuffer: 16 * 1024 }, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(typeof stdout === 'string' ? stdout : String(stdout));
        });
    });
}

/**
 * Trusted-process provider seam for a future macOS Keychain item. The
 * credential is read through the trusted child process's captured stdout pipe
 * and never emitted to caller-visible stdout/stderr, environment, command
 * arguments, provider errors, logs, or audit records.
 */
export class KeychainCredentialProvider implements CredentialProvider {
    #service: string;
    #account: string;
    #securityPath: string;
    #runSecurity: (securityPath: string, args: readonly string[]) => Promise<string>;

    constructor(options: KeychainCredentialProviderOptions) {
        if (options.service.trim() === '' || options.account.trim() === '') {
            throw new CredentialProviderError();
        }
        this.#service = options.service;
        this.#account = options.account;
        this.#securityPath = options.securityPath ?? DEFAULT_SECURITY_PATH;
        this.#runSecurity = options.runSecurity ?? runSecurityCommand;
    }

    async withCredential<T>(operation: (credential: CredentialHandle) => Promise<T>): Promise<T> {
        let output: string;
        try {
            output = await this.#runSecurity(this.#securityPath, [
                'find-generic-password',
                '-a',
                this.#account,
                '-s',
                this.#service,
                '-w'
            ]);
        } catch {
            throw new CredentialProviderError();
        }

        const secret = output.trim();
        if (secret === '') throw new CredentialProviderError();

        let handle: CredentialHandle;
        try {
            handle = createCredentialHandle(secret);
        } catch {
            throw new CredentialProviderError();
        }
        try {
            return await operation(handle);
        } finally {
            invalidateCredentialHandle(handle);
        }
    }
}

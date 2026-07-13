import { randomBytes } from 'crypto';
import fs from 'fs';
import http from 'http';
import path from 'path';

import {
    renderFirstSliceReviewerBlockedDocument,
    renderFirstSliceReviewerDocument,
    renderFirstSliceReviewerTechnicalErrorDocument
} from './surface';
import { validateFirstSliceReviewerFixture, type FirstSliceFixtureValidationReport } from './validation';

export const FIRST_SLICE_DEFAULT_PORT = 4317;
export const FIRST_SLICE_MINIMUM_PORT = 1024;
export const FIRST_SLICE_MAXIMUM_PORT = 65535;
export const FIRST_SLICE_MAXIMUM_FIXTURE_BYTES = 64 * 1024;
export const FIRST_SLICE_LOOPBACK_HOST = '127.0.0.1';

const APPROVED_FIXTURE_DIRECTORY = 'fixtures/agent-builder/first-slice-reviewer';

export class FirstSliceReviewerStartupError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FirstSliceReviewerStartupError';
    }
}

const startupError = (message: string) => new FirstSliceReviewerStartupError(message);

const isPathWithin = (directoryPath: string, candidatePath: string) => {
    const relativePath = path.relative(directoryPath, candidatePath);
    return relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
};

export const loadFirstSliceReviewerFixture = ({
    fixturePath,
    repositoryRoot = process.cwd()
}: {
    fixturePath: string;
    repositoryRoot?: string;
}): { resolvedFixturePath: string; validation: FirstSliceFixtureValidationReport } => {
    let approvedDirectoryPath: string;
    let resolvedFixturePath: string;

    try {
        approvedDirectoryPath = fs.realpathSync(path.resolve(repositoryRoot, APPROVED_FIXTURE_DIRECTORY));
        resolvedFixturePath = fs.realpathSync(path.resolve(repositoryRoot, fixturePath));
    } catch {
        throw startupError('The selected fixture could not be opened from the approved fixture directory.');
    }

    if (!isPathWithin(approvedDirectoryPath, resolvedFixturePath)) {
        throw startupError('The selected fixture must remain inside the approved fixture directory.');
    }

    if (!resolvedFixturePath.endsWith('.synthetic.json')) {
        throw startupError('The selected fixture must be a regular .synthetic.json file.');
    }

    let descriptor: number | undefined;
    let contents: string;

    try {
        descriptor = fs.openSync(resolvedFixturePath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
        const fixtureStats = fs.fstatSync(descriptor);

        if (!fixtureStats.isFile()) {
            throw startupError('The selected fixture must be a regular .synthetic.json file.');
        }

        if (fixtureStats.size > FIRST_SLICE_MAXIMUM_FIXTURE_BYTES) {
            throw startupError('The selected fixture must be 64 KiB or smaller.');
        }

        contents = fs.readFileSync(descriptor, 'utf8');
    } catch (error) {
        if (error instanceof FirstSliceReviewerStartupError) {
            throw error;
        }

        throw startupError('The selected fixture could not be read safely.');
    } finally {
        if (descriptor !== undefined) {
            fs.closeSync(descriptor);
        }
    }

    let parsedFixture: unknown;

    try {
        parsedFixture = JSON.parse(contents) as unknown;
    } catch {
        return {
            resolvedFixturePath,
            validation: {
                passed: false,
                errors: [
                    {
                        path: 'fixture',
                        code: 'invalid_json',
                        message: 'The fixture must contain valid JSON.'
                    }
                ]
            }
        };
    }

    return {
        resolvedFixturePath,
        validation: validateFirstSliceReviewerFixture(parsedFixture)
    };
};

const validateServerPort = (port: number, allowTestPortZero: boolean) => {
    if (allowTestPortZero && port === 0) {
        return;
    }

    if (!Number.isInteger(port) || port < FIRST_SLICE_MINIMUM_PORT || port > FIRST_SLICE_MAXIMUM_PORT) {
        throw startupError('Port must be an integer from 1024 through 65535.');
    }
};

const contentSecurityPolicy = (nonce: string) =>
    [
        "default-src 'none'",
        `script-src 'nonce-${nonce}'`,
        `style-src 'nonce-${nonce}'`,
        "img-src 'none'",
        "font-src 'none'",
        "connect-src 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
        "base-uri 'none'",
        "object-src 'none'"
    ].join('; ') + ';';

const permissionsPolicy = [
    'accelerometer=()',
    'autoplay=()',
    'camera=()',
    'display-capture=()',
    'encrypted-media=()',
    'fullscreen=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-create=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'usb=()'
].join(', ');

const safeStatusDocument = (title: string, message: string) =>
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>${title}</title></head><body><main><h1>${title}</h1><p>${message}</p></main></body></html>`;

export type RunningFirstSliceReviewerServer = {
    server: http.Server;
    host: typeof FIRST_SLICE_LOOPBACK_HOST;
    port: number;
    url: string;
    close: () => Promise<void>;
};

type FirstSliceCreateServer = (requestListener: http.RequestListener) => http.Server;

export const startFirstSliceReviewerServer = async ({
    fixturePath,
    port = FIRST_SLICE_DEFAULT_PORT,
    repositoryRoot = process.cwd(),
    allowTestPortZero = false,
    createServer = http.createServer,
    createNonce = () => randomBytes(18).toString('base64url')
}: {
    fixturePath: string;
    port?: number;
    repositoryRoot?: string;
    allowTestPortZero?: boolean;
    createServer?: FirstSliceCreateServer;
    createNonce?: () => string;
}): Promise<RunningFirstSliceReviewerServer> => {
    validateServerPort(port, allowTestPortZero);
    const loadedFixture = loadFirstSliceReviewerFixture({ fixturePath, repositoryRoot });
    const nonce = createNonce();
    const documentBody = loadedFixture.validation.fixture
        ? renderFirstSliceReviewerDocument({ fixture: loadedFixture.validation.fixture, nonce })
        : renderFirstSliceReviewerBlockedDocument({ errors: loadedFixture.validation.errors, nonce });
    const csp = contentSecurityPolicy(nonce);
    let boundPort = port;

    const server = createServer((request, response) => {
        const responseHeaders = (body: string, extraHeaders: http.OutgoingHttpHeaders = {}) => ({
            'Cache-Control': 'no-store, max-age=0',
            Pragma: 'no-cache',
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(body),
            'Referrer-Policy': 'no-referrer',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Cross-Origin-Resource-Policy': 'same-origin',
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Content-Security-Policy': csp,
            'Permissions-Policy': permissionsPolicy,
            ...extraHeaders
        });

        const send = (status: number, body: string, extraHeaders: http.OutgoingHttpHeaders = {}) => {
            response.writeHead(status, responseHeaders(body, extraHeaders));
            if (request.method === 'HEAD') {
                response.end();
                return;
            }
            response.end(body);
        };

        try {
            const validHosts = new Set([`${FIRST_SLICE_LOOPBACK_HOST}:${boundPort}`, `localhost:${boundPort}`]);

            if (typeof request.headers.host !== 'string' || !validHosts.has(request.headers.host)) {
                send(400, safeStatusDocument('Bad request', 'The request did not use the bounded loopback host.'));
                return;
            }

            if (request.method !== 'GET' && request.method !== 'HEAD') {
                send(405, safeStatusDocument('Method not allowed', 'Only GET and HEAD are available.'), {
                    Allow: 'GET, HEAD'
                });
                return;
            }

            if (request.url !== '/') {
                send(404, safeStatusDocument('Not found', 'The requested local resource is not available.'));
                return;
            }

            send(200, documentBody);
        } catch {
            send(500, renderFirstSliceReviewerTechnicalErrorDocument({ nonce }));
        }
    });

    return new Promise<RunningFirstSliceReviewerServer>((resolve, reject) => {
        const handleStartupError = () => {
            reject(startupError('The bounded loopback reviewer could not start.'));
        };

        server.once('error', handleStartupError);
        server.listen(port, FIRST_SLICE_LOOPBACK_HOST, () => {
            server.removeListener('error', handleStartupError);
            const address = server.address();

            if (!address || typeof address === 'string') {
                server.close();
                reject(startupError('The bounded loopback reviewer could not start.'));
                return;
            }

            boundPort = address.port;
            resolve({
                server,
                host: FIRST_SLICE_LOOPBACK_HOST,
                port: boundPort,
                url: `http://${FIRST_SLICE_LOOPBACK_HOST}:${boundPort}`,
                close: () =>
                    new Promise<void>((closeResolve, closeReject) => {
                        server.close(error => {
                            if (error) {
                                closeReject(startupError('The bounded loopback reviewer could not stop cleanly.'));
                                return;
                            }
                            closeResolve();
                        });
                    })
            });
        });
    });
};

/** @jest-environment node */

import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

import {
    FIRST_SLICE_DEFAULT_PORT,
    FirstSliceReviewerStartupError,
    loadFirstSliceReviewerFixture,
    startFirstSliceReviewerServer
} from '../../src/agent-builder/first-slice-reviewer/server';

const repositoryRoot = path.resolve(__dirname, '../..');
const approvedFixtureDirectory = path.join(repositoryRoot, 'fixtures/agent-builder/first-slice-reviewer');

type RunningReviewerServer = Awaited<ReturnType<typeof startFirstSliceReviewerServer>>;

const requestServer = (
    running: RunningReviewerServer,
    {
        method = 'GET',
        requestPath = '/',
        host = `127.0.0.1:${running.port}`,
        body
    }: { method?: string; requestPath?: string; host?: string; body?: string } = {}
) =>
    new Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }>((resolve, reject) => {
        const request = http.request(
            {
                hostname: '127.0.0.1',
                port: running.port,
                path: requestPath,
                method,
                headers: { Host: host }
            },
            response => {
                let responseBody = '';
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    responseBody += chunk;
                });
                response.on('end', () =>
                    resolve({ status: response.statusCode ?? 0, headers: response.headers, body: responseBody })
                );
            }
        );

        request.on('error', reject);
        if (body) {
            request.write(body);
        }
        request.end();
    });

const makeSyntheticFixture = (fixtureId = 'SFR-TEMP') => ({
    fixture_id: fixtureId,
    planning_reference: 'Synthetic temporary planning note',
    workflow_title: 'Invented temporary planning question',
    context_category: 'synthetic',
    planning_purpose: 'Classify one invented temporary planning question.',
    reviewer_role: 'human reviewer',
    allowed_references: ['Synthetic temporary label'],
    forbidden_uses: ['Operational use'],
    permitted_decisions: [
        'later bounded L2 candidate',
        'first implicated CLO-52 lane dependency card',
        'hold / clarify'
    ],
    evidence_guidance: 'repo-first human placement',
    stop_condition: 'Stop at the planning boundary.',
    non_approval_reminder:
        'Planning classification only; no implementation, release, operational approval, external action, or authority to act.'
});

const makeRepository = () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'first-slice-reviewer-'));
    const directory = path.join(root, 'fixtures/agent-builder/first-slice-reviewer');
    fs.mkdirSync(directory, { recursive: true });
    return { root, directory };
};

const validFixturePath = 'fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json';

describe('first-slice reviewer fixture loading', () => {
    it('realpaths and reads one approved regular synthetic fixture', () => {
        const loaded = loadFirstSliceReviewerFixture({ fixturePath: validFixturePath, repositoryRoot });

        expect(loaded.validation.passed).toBe(true);
        expect(loaded.validation.fixture?.fixture_id).toBe('SFR-LATER-L2');
        expect(loaded.resolvedFixturePath.startsWith(approvedFixtureDirectory)).toBe(true);
    });

    it.each([
        '../outside.synthetic.json',
        'fixtures/agent-builder/first-slice-reviewer/not-json.txt',
        'fixtures/agent-builder/first-slice-reviewer'
    ])('fails startup for traversal, extension, or non-file path %s', fixturePath => {
        expect(() => loadFirstSliceReviewerFixture({ fixturePath, repositoryRoot })).toThrow(
            FirstSliceReviewerStartupError
        );
    });

    it('rejects a symlink that escapes the approved directory', () => {
        const { root, directory } = makeRepository();
        const outsidePath = path.join(root, 'outside.synthetic.json');
        const linkPath = path.join(directory, 'escape.synthetic.json');
        fs.writeFileSync(outsidePath, JSON.stringify(makeSyntheticFixture()));
        fs.symlinkSync(outsidePath, linkPath);

        expect(() =>
            loadFirstSliceReviewerFixture({
                fixturePath: 'fixtures/agent-builder/first-slice-reviewer/escape.synthetic.json',
                repositoryRoot: root
            })
        ).toThrow(FirstSliceReviewerStartupError);
    });

    it('rejects a fixture larger than 64 KiB before reading content', () => {
        const { root, directory } = makeRepository();
        fs.writeFileSync(path.join(directory, 'oversize.synthetic.json'), 'x'.repeat(64 * 1024 + 1));

        expect(() =>
            loadFirstSliceReviewerFixture({
                fixturePath: 'fixtures/agent-builder/first-slice-reviewer/oversize.synthetic.json',
                repositoryRoot: root
            })
        ).toThrow('64 KiB');
    });

    it('rejects a non-regular .synthetic.json path before a server can be created', async () => {
        const { root, directory } = makeRepository();
        fs.mkdirSync(path.join(directory, 'not-a-file.synthetic.json'));
        const createServer = jest.fn((listener: http.RequestListener) => http.createServer(listener));

        expect(() =>
            loadFirstSliceReviewerFixture({
                fixturePath: 'fixtures/agent-builder/first-slice-reviewer/not-a-file.synthetic.json',
                repositoryRoot: root
            })
        ).toThrow('regular .synthetic.json file');

        await expect(
            startFirstSliceReviewerServer({
                fixturePath: 'fixtures/agent-builder/first-slice-reviewer/not-a-file.synthetic.json',
                repositoryRoot: root,
                createServer
            })
        ).rejects.toThrow('regular .synthetic.json file');
        expect(createServer).not.toHaveBeenCalled();
    });

    it('returns a safe blocked result for malformed JSON inside the approved directory', () => {
        const { root, directory } = makeRepository();
        fs.writeFileSync(path.join(directory, 'malformed.synthetic.json'), '{not-json');

        const loaded = loadFirstSliceReviewerFixture({
            fixturePath: 'fixtures/agent-builder/first-slice-reviewer/malformed.synthetic.json',
            repositoryRoot: root
        });

        expect(loaded.validation).toEqual({
            passed: false,
            errors: [
                {
                    path: 'fixture',
                    code: 'invalid_json',
                    message: 'The fixture must contain valid JSON.'
                }
            ]
        });
    });

    it('returns safe blocked findings for schema-invalid content inside the approved directory', () => {
        const loaded = loadFirstSliceReviewerFixture({
            fixturePath:
                'fixtures/agent-builder/first-slice-reviewer/invalid_source_retrieval_instruction.synthetic.json',
            repositoryRoot
        });

        expect(loaded.validation.passed).toBe(false);
        expect(loaded.validation.errors.map(error => `${error.path}:${error.code}`)).toContain(
            'planning_purpose:source_retrieval'
        );
        expect(JSON.stringify(loaded.validation.errors)).not.toContain('invalid.example');
        expect(JSON.stringify(loaded.validation.errors)).not.toContain(repositoryRoot);
    });
});

describe('first-slice loopback server', () => {
    let running: RunningReviewerServer | undefined;

    afterEach(async () => {
        await running?.close();
        running = undefined;
    });

    it('uses the governed default and rejects interactive out-of-range ports', async () => {
        expect(FIRST_SLICE_DEFAULT_PORT).toBe(4317);

        await expect(
            startFirstSliceReviewerServer({ fixturePath: validFixturePath, repositoryRoot, port: 0 })
        ).rejects.toThrow('Port must be an integer from 1024 through 65535.');
        await expect(
            startFirstSliceReviewerServer({ fixturePath: validFixturePath, repositoryRoot, port: 1023 })
        ).rejects.toThrow('Port must be an integer from 1024 through 65535.');
        await expect(
            startFirstSliceReviewerServer({ fixturePath: validFixturePath, repositoryRoot, port: 65536 })
        ).rejects.toThrow('Port must be an integer from 1024 through 65535.');
    });

    it('allows ephemeral port zero only through direct test injection and binds to loopback', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath: validFixturePath,
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });

        expect(running.port).toBeGreaterThan(0);
        expect(running.host).toBe('127.0.0.1');
        expect(running.server.address()).toEqual(
            expect.objectContaining({ address: '127.0.0.1', port: running.port })
        );
    });

    it('stops the loopback server and rejects future loads after close', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath: validFixturePath,
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });
        const stoppedServer = running;

        await stoppedServer.close();
        running = undefined;

        await expect(requestServer(stoppedServer)).rejects.toMatchObject({ code: 'ECONNREFUSED' });
    });

    it('returns a safe error when the loopback port cannot bind', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath: validFixturePath,
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });

        await expect(
            startFirstSliceReviewerServer({
                fixturePath: validFixturePath,
                repositoryRoot,
                port: running.port
            })
        ).rejects.toThrow('The bounded loopback reviewer could not start.');
    });

    it('serves GET and HEAD only at root with restrictive security headers', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath: validFixturePath,
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });

        const getResponse = await requestServer(running);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toContain('<title>First-slice planning reviewer</title>');
        expect(getResponse.headers['cache-control']).toBe('no-store, max-age=0');
        expect(getResponse.headers.pragma).toBe('no-cache');
        expect(getResponse.headers['content-type']).toBe('text/html; charset=utf-8');
        expect(getResponse.headers['referrer-policy']).toBe('no-referrer');
        expect(getResponse.headers['x-content-type-options']).toBe('nosniff');
        expect(getResponse.headers['x-frame-options']).toBe('DENY');
        expect(getResponse.headers['cross-origin-resource-policy']).toBe('same-origin');
        expect(getResponse.headers['cross-origin-opener-policy']).toBe('same-origin');
        const cspHeader = getResponse.headers['content-security-policy'];
        expect(typeof cspHeader).toBe('string');
        if (typeof cspHeader !== 'string') {
            throw new Error('Expected one Content-Security-Policy header.');
        }
        expect(cspHeader).toMatch(
            /^default-src 'none'; script-src 'nonce-[A-Za-z0-9_-]+'; style-src 'nonce-[A-Za-z0-9_-]+';/
        );
        expect(cspHeader).toContain("connect-src 'none'");
        expect(cspHeader).toContain("form-action 'none'");
        expect(cspHeader).toContain("frame-ancestors 'none'");
        expect(getResponse.headers['permissions-policy']).toContain('camera=()');
        expect(getResponse.body).toContain(`nonce="${cspHeader.match(/nonce-([A-Za-z0-9_-]+)/)?.[1]}"`);

        const headResponse = await requestServer(running, { method: 'HEAD' });
        expect(headResponse.status).toBe(200);
        expect(headResponse.body).toBe('');

        const notFound = await requestServer(running, { requestPath: '/fixture' });
        expect(notFound.status).toBe(404);
        expect(notFound.body).not.toContain(validFixturePath);

        const methodNotAllowed = await requestServer(running, {
            method: 'POST',
            body: 'classification=secret-reviewer-input'
        });
        expect(methodNotAllowed.status).toBe(405);
        expect(methodNotAllowed.headers.allow).toBe('GET, HEAD');
        expect(methodNotAllowed.body).not.toContain('secret-reviewer-input');
    });

    it.each(['evil.example', '127.0.0.1', 'localhost', '127.0.0.1:9999', '[::1]:4317'])(
        'rejects unapproved Host header %s',
        async host => {
            running = await startFirstSliceReviewerServer({
                fixturePath: validFixturePath,
                repositoryRoot,
                port: 0,
                allowTestPortZero: true
            });

            const response = await requestServer(running, { host });
            expect(response.status).toBe(400);
            expect(response.body).not.toContain(host);
        }
    );

    it('accepts only the two exact loopback Host forms for the bound port', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath: validFixturePath,
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });

        await expect(requestServer(running, { host: `127.0.0.1:${running.port}` })).resolves.toMatchObject({
            status: 200
        });
        await expect(requestServer(running, { host: `localhost:${running.port}` })).resolves.toMatchObject({
            status: 200
        });
    });

    it('serves a safe blocked document without fixture values or filesystem details', async () => {
        running = await startFirstSliceReviewerServer({
            fixturePath:
                'fixtures/agent-builder/first-slice-reviewer/invalid_source_retrieval_instruction.synthetic.json',
            repositoryRoot,
            port: 0,
            allowTestPortZero: true
        });

        const response = await requestServer(running);
        expect(response.status).toBe(200);
        expect(response.body).toContain('Fixture blocked');
        expect(response.body).toContain('planning_purpose');
        expect(response.body).not.toContain('invalid.example');
        expect(response.body).not.toContain(repositoryRoot);
    });

    it('creates no server when path confinement fails', async () => {
        const createServer = jest.fn((listener: http.RequestListener) => http.createServer(listener));

        await expect(
            startFirstSliceReviewerServer({
                fixturePath: '../outside.synthetic.json',
                repositoryRoot,
                createServer
            })
        ).rejects.toBeInstanceOf(FirstSliceReviewerStartupError);
        expect(createServer).not.toHaveBeenCalled();
    });
});

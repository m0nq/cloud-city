/** @jest-environment node */

import {
    AGENT_BUILDER_USAGE,
    resolveAgentBuilderCliArgs,
    runAgentBuilderCli
} from '../../scripts/agent-builder';
import {
    FIRST_SLICE_DEFAULT_PORT,
    FIRST_SLICE_LOOPBACK_HOST
} from '../../src/agent-builder/first-slice-reviewer/server';
import { FIRST_SLICE_NON_APPROVAL_REMINDER } from '../../src/agent-builder/first-slice-reviewer/schema';

const fixturePath =
    'fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json';

const argv = (...args: string[]) => ['node', 'scripts/agent-builder/index.ts', ...args];

describe('Agent Builder first-slice reviewer CLI', () => {
    it('parses reviewer local with the required fixture and default port', () => {
        expect(resolveAgentBuilderCliArgs(argv('reviewer', 'local', '--fixture', fixturePath))).toEqual({
            action: 'reviewer-local',
            fixturePath,
            port: FIRST_SLICE_DEFAULT_PORT
        });
        expect(AGENT_BUILDER_USAGE).toContain('reviewer local --fixture <fixture-path> [--port <1024-65535>]');
    });

    it.each([1024, 4317, 65535])('accepts bounded explicit port %i', port => {
        expect(
            resolveAgentBuilderCliArgs(
                argv('reviewer', 'local', '--port', String(port), '--fixture', fixturePath)
            )
        ).toEqual({ action: 'reviewer-local', fixturePath, port });
    });

    it.each([
        { args: [] },
        { args: ['--port', '4317'] },
        { args: ['--fixture', fixturePath, '--port', '0'] },
        { args: ['--fixture', fixturePath, '--port', '1023'] },
        { args: ['--fixture', fixturePath, '--port', '65536'] },
        { args: ['--fixture', fixturePath, '--port', '4317.5'] },
        { args: ['--fixture', fixturePath, '--port', 'not-a-port'] },
        { args: ['--fixture', fixturePath, '--host', '0.0.0.0'] },
        { args: ['--fixture', fixturePath, '--fixture', fixturePath] },
        { args: ['--fixture'] },
        { args: ['--fixture', fixturePath, 'extra'] }
    ])('rejects unsupported reviewer local arguments %#', ({ args }) => {
        expect(() => resolveAgentBuilderCliArgs(argv('reviewer', 'local', ...args))).toThrow(
            AGENT_BUILDER_USAGE
        );
    });

    it('dispatches through the injected server starter and prints safe startup output only', async () => {
        const logger = { log: jest.fn(), error: jest.fn() };
        const startReviewerServer = jest.fn().mockResolvedValue({
            url: `http://${FIRST_SLICE_LOOPBACK_HOST}:4317`
        });

        await runAgentBuilderCli({
            argv: argv('reviewer', 'local', '--fixture', fixturePath, '--port', '4317'),
            logger,
            startReviewerServer,
            exit: (code: number): never => {
                throw new Error(`exit:${code}`);
            }
        });

        expect(startReviewerServer).toHaveBeenCalledTimes(1);
        expect(startReviewerServer).toHaveBeenCalledWith({
            fixturePath,
            port: 4317,
            repositoryRoot: process.cwd()
        });
        expect(logger.log.mock.calls).toEqual([
            [`Local reviewer: http://${FIRST_SLICE_LOOPBACK_HOST}:4317`],
            [FIRST_SLICE_NON_APPROVAL_REMINDER]
        ]);
        expect(logger.error).not.toHaveBeenCalled();
        expect(JSON.stringify(logger.log.mock.calls)).not.toContain(fixturePath);
    });

    it('reports a safe startup failure without fixture paths or stack traces', async () => {
        const logger = { log: jest.fn(), error: jest.fn() };
        const startReviewerServer = jest
            .fn()
            .mockRejectedValue(new Error('The bounded loopback reviewer could not start.'));

        await expect(
            runAgentBuilderCli({
                argv: argv('reviewer', 'local', '--fixture', fixturePath),
                logger,
                startReviewerServer,
                exit: (code: number): never => {
                    throw new Error(`exit:${code}`);
                }
            })
        ).rejects.toThrow('exit:1');

        expect(logger.log).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith('The bounded loopback reviewer could not start.');
        expect(JSON.stringify(logger.error.mock.calls)).not.toContain(fixturePath);
        expect(JSON.stringify(logger.error.mock.calls)).not.toContain(' at ');
    });
});

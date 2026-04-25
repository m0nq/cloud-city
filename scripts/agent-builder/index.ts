import path from 'path';

import { formatDeterministicEvalReport, runDeterministicFixtureEval } from '../../src/agent-builder/evals';
import { formatRegistryValidationReport, validateAgentRegistryFile } from '../../src/agent-builder/registry';
import { formatValidationReport, validateAgentSpecFile } from '../../src/agent-builder/validation';

export const AGENT_BUILDER_USAGE = [
    'Usage:',
    '  pnpm agent-builder validate <spec-path>',
    '  pnpm agent-builder test <spec-path> --fixture <fixture-path>',
    '  pnpm agent-builder registry validate <registry-path>'
].join('\n');

type AgentBuilderCommand =
    | {
          action: 'validate';
          specPath: string;
      }
    | {
          action: 'test';
          specPath: string;
          fixturePath: string;
      }
    | {
          action: 'registry-validate';
          registryPath: string;
      };

export const resolveAgentBuilderCliArgs = (argv: string[] = process.argv): AgentBuilderCommand => {
    const [, , action, primaryArg, ...rest] = argv;

    if (action === 'validate' && primaryArg && rest.length === 0) {
        return { action, specPath: primaryArg };
    }

    if (action === 'test' && primaryArg && rest.length === 2 && rest[0] === '--fixture' && rest[1]) {
        return { action, specPath: primaryArg, fixturePath: rest[1] };
    }

    if (action === 'registry' && primaryArg === 'validate' && rest.length === 1 && rest[0]) {
        return { action: 'registry-validate', registryPath: rest[0] };
    }

    throw new Error(AGENT_BUILDER_USAGE);
};

export const runAgentBuilderCli = ({
    argv = process.argv,
    logger = console,
    exit = process.exit
}: {
    argv?: string[];
    logger?: Pick<Console, 'log' | 'error'>;
    exit?: (code: number) => never;
} = {}) => {
    try {
        const command = resolveAgentBuilderCliArgs(argv);

        if (command.action === 'validate') {
            const report = validateAgentSpecFile(command.specPath);
            logger.log(formatValidationReport(report));

            if (!report.schemaPassed || !report.policyReport?.passed) {
                exit(1);
            }

            return;
        }

        if (command.action === 'registry-validate') {
            const report = validateAgentRegistryFile(command.registryPath);
            logger.log(formatRegistryValidationReport(report));

            if (!report.schemaPassed || report.checks.some(check => !check.passed)) {
                exit(1);
            }

            return;
        }

        const report = runDeterministicFixtureEval(command.specPath, command.fixturePath);
        logger.log(formatDeterministicEvalReport(report));

        if (!report.passed) {
            exit(1);
        }
    } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        exit(1);
    }
};

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const expectedScriptFile = path.resolve(process.cwd(), 'scripts/agent-builder/index.ts');

if (executedFile === expectedScriptFile) {
    runAgentBuilderCli();
}

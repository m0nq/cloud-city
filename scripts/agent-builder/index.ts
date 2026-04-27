import path from 'path';

import {
    formatEvalRunReport,
    formatEvalSuiteValidationReport,
    runEvalSuiteFile,
    validateEvalSuiteFile
} from '../../src/agent-builder/eval-suite';
import { formatDeterministicEvalReport, runDeterministicFixtureEval } from '../../src/agent-builder/evals';
import { formatFixtureValidationReport, validateVenueCandidateFixtureFile } from '../../src/agent-builder/fixtures';
import { formatRegistryValidationReport, validateAgentRegistryFile } from '../../src/agent-builder/registry';
import {
    formatRuntimeOutputValidationReport,
    validateRuntimeOutput,
    validateRuntimeOutputFile
} from '../../src/agent-builder/runtime/output-validation';
import { generateVercelVenueVendorReview } from '../../src/agent-builder/runtime/vercel';
import { formatValidationReport, validateAgentSpecFile } from '../../src/agent-builder/validation';

export const AGENT_BUILDER_USAGE = [
    'Usage:',
    '  pnpm agent-builder validate <spec-path>',
    '  pnpm agent-builder test <spec-path> --fixture <fixture-path>',
    '  pnpm agent-builder registry validate <registry-path>',
    '  pnpm agent-builder fixture validate <fixture-path>',
    '  pnpm agent-builder eval validate <eval-suite-path>',
    '  pnpm agent-builder eval run <eval-suite-path>',
    '  pnpm agent-builder runtime vercel review --fixture <fixture-path> [--spec <spec-path>]',
    '  pnpm agent-builder runtime validate-output --fixture <fixture-path> [--output <output-json-path>]'
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
      }
    | {
          action: 'fixture-validate';
          fixturePath: string;
      }
    | {
          action: 'eval-validate';
          suitePath: string;
      }
    | {
          action: 'eval-run';
          suitePath: string;
      }
    | {
          action: 'runtime-vercel-review';
          fixturePath: string;
          specPath?: string;
      }
    | {
          action: 'runtime-validate-output';
          fixturePath: string;
          outputPath?: string;
      };

const valueAfterFlag = (args: string[], flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
};

const argsOnlyContainFlags = (args: string[], allowedFlags: string[]) =>
    args.every((arg, index) => {
        if (allowedFlags.includes(arg)) {
            return Boolean(args[index + 1]);
        }

        return allowedFlags.includes(args[index - 1]);
    });

const readStream = (stream: NodeJS.ReadableStream) =>
    new Promise<string>((resolve, reject) => {
        let contents = '';
        stream.setEncoding('utf8');
        stream.on('data', chunk => {
            contents += chunk;
        });
        stream.on('end', () => resolve(contents));
        stream.on('error', reject);
    });

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

    if (action === 'fixture' && primaryArg === 'validate' && rest.length === 1 && rest[0]) {
        return { action: 'fixture-validate', fixturePath: rest[0] };
    }

    if (action === 'eval' && primaryArg === 'validate' && rest.length === 1 && rest[0]) {
        return { action: 'eval-validate', suitePath: rest[0] };
    }

    if (action === 'eval' && primaryArg === 'run' && rest.length === 1 && rest[0]) {
        return { action: 'eval-run', suitePath: rest[0] };
    }

    if (action === 'runtime' && primaryArg === 'vercel' && rest[0] === 'review') {
        const runtimeArgs = rest.slice(1);
        const fixturePath = valueAfterFlag(runtimeArgs, '--fixture');
        const specPath = valueAfterFlag(runtimeArgs, '--spec');
        const validFlags = argsOnlyContainFlags(runtimeArgs, ['--fixture', '--spec']);

        if (fixturePath && validFlags) {
            return { action: 'runtime-vercel-review', fixturePath, specPath };
        }
    }

    if (action === 'runtime' && primaryArg === 'validate-output') {
        const fixturePath = valueAfterFlag(rest, '--fixture');
        const outputPath = valueAfterFlag(rest, '--output');
        const validFlags = argsOnlyContainFlags(rest, ['--fixture', '--output']);

        if (fixturePath && validFlags) {
            return { action: 'runtime-validate-output', fixturePath, outputPath };
        }
    }

    throw new Error(AGENT_BUILDER_USAGE);
};

export const runAgentBuilderCli = async ({
    argv = process.argv,
    logger = console,
    exit = process.exit,
    stdin = process.stdin
}: {
    argv?: string[];
    logger?: Pick<Console, 'log' | 'error'>;
    exit?: (code: number) => never;
    stdin?: NodeJS.ReadableStream;
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

        if (command.action === 'fixture-validate') {
            const report = validateVenueCandidateFixtureFile(command.fixturePath);
            logger.log(formatFixtureValidationReport(report));

            if (!report.schemaPassed) {
                exit(1);
            }

            return;
        }

        if (command.action === 'eval-validate') {
            const report = validateEvalSuiteFile(command.suitePath);
            logger.log(formatEvalSuiteValidationReport(report));

            if (!report.schemaPassed || report.checks.some(check => !check.passed)) {
                exit(1);
            }

            return;
        }

        if (command.action === 'eval-run') {
            const report = runEvalSuiteFile(command.suitePath);
            logger.log(formatEvalRunReport(report));

            if (report.outcome !== 'PASS') {
                exit(1);
            }

            return;
        }

        if (command.action === 'runtime-vercel-review') {
            const review = await generateVercelVenueVendorReview({
                fixturePath: command.fixturePath,
                specPath: command.specPath
            });
            logger.log(JSON.stringify(review, null, 2));
            return;
        }

        if (command.action === 'runtime-validate-output') {
            const report = command.outputPath
                ? validateRuntimeOutputFile({
                      outputPath: command.outputPath,
                      fixturePath: command.fixturePath
                  })
                : validateRuntimeOutput({
                      rawOutput: await readStream(stdin),
                      outputPath: 'stdin',
                      fixturePath: command.fixturePath
                  });

            logger.log(formatRuntimeOutputValidationReport(report));

            if (report.outcome !== 'PASS') {
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
    void runAgentBuilderCli();
}

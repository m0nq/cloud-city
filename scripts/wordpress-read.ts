import {
    createConfiguredReadOnlyCli,
    parseReadOnlyCommand,
    runReadOnlyCommand,
    runReadOnlyProofCommand,
    sanitizeReadOnlyProofResult,
    sanitizeReadOnlyResult
} from '@/wordpress-executor/read-only-cli';

function printUsage(): void {
    process.stdout.write(
        [
            'Usage: corepack pnpm wordpress:read <command>',
            '',
            'Commands:',
            '  identity                       Read and validate the current machine identity',
            '  post                           Read the fixed known-good post 2217',
            '  schema                         Read generic collection schema diagnostics (not Events proof)',
            '  editable-drafts                Read the machine-author edit-context collection',
            '  published-post-edit-boundary  Characterize edit access for post 2217',
            '  proof                          Run the complete authenticated read-only proof'
        ].join('\n') + '\n'
    );
}

async function main(): Promise<void> {
    let command: ReturnType<typeof parseReadOnlyCommand>;
    try {
        command = parseReadOnlyCommand(process.argv.slice(2));
    } catch {
        process.stderr.write('Invalid read-only command.\n');
        process.exitCode = 2;
        return;
    }

    if (command === 'help') {
        printUsage();
        return;
    }

    let configuration: ReturnType<typeof createConfiguredReadOnlyCli>;
    try {
        configuration = createConfiguredReadOnlyCli();
    } catch {
        process.stderr.write('Read-only executor configuration is unavailable.\n');
        process.exitCode = 2;
        return;
    }

    try {
        if (command === 'proof') {
            const result = await runReadOnlyProofCommand(configuration);
            process.stdout.write(JSON.stringify(sanitizeReadOnlyProofResult(result)) + '\n');
            if (result.status !== 'verified_success') process.exitCode = 1;
            return;
        }

        const result = await runReadOnlyCommand(configuration, command);
        process.stdout.write(JSON.stringify(sanitizeReadOnlyResult(result)) + '\n');
        if (result.status !== 'verified_success') process.exitCode = 1;
    } catch {
        process.stderr.write('Read-only executor operation failed.\n');
        process.exitCode = 1;
    }
}

void main();

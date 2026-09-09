import { execFileSync } from 'node:child_process';

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8'
}).trim();

execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {
    cwd: repoRoot,
    stdio: 'inherit'
});

console.log('Installed Cloud City Git hooks at .githooks.');

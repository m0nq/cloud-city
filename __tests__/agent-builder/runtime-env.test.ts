/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { loadAgentBuilderRuntimeEnv } from '../../src/agent-builder/runtime/env';

const makeTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agent-builder-env-'));

describe('Agent Builder runtime env loading', () => {
    it('loads .env.local values for local CLI runs', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env.local'), 'OPENAI_API_KEY=local-key\nCC_AGENT_BUILDER_MODEL=gpt-test\n');
        const env: NodeJS.ProcessEnv = {};

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env.local']);
        expect(env.OPENAI_API_KEY).toBe('local-key');
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-test');
    });

    it('lets .env.local override .env when shell env is unset', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env'), 'CC_AGENT_BUILDER_MODEL=gpt-from-env\n');
        fs.writeFileSync(path.join(cwd, '.env.local'), 'CC_AGENT_BUILDER_MODEL=gpt-from-local\n');
        const env: NodeJS.ProcessEnv = {};

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env', '.env.local']);
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-from-local');
    });

    it('does not override explicitly exported shell env values', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env.local'), 'CC_AGENT_BUILDER_MODEL=gpt-from-local\n');
        const env: NodeJS.ProcessEnv = {
            CC_AGENT_BUILDER_MODEL: 'gpt-from-shell'
        };

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env.local']);
        expect(result.appliedKeys).not.toContain('CC_AGENT_BUILDER_MODEL');
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-from-shell');
    });
});

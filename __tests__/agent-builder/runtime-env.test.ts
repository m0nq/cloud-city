/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';

import { runAgentBuilderCli } from '../../scripts/agent-builder';
import { loadAgentBuilderRuntimeEnv } from '../../src/agent-builder/runtime/env';

const makeTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agent-builder-env-'));
const runtimeFixturePath = path.resolve(__dirname, '../../fixtures/venue_candidates/warehouse416.public.yaml');
const validRuntimeOutput = {
    candidate_name: 'Warehouse416',
    candidate_type: 'venue',
    review_date: '2026-04-25',
    sources_used: [runtimeFixturePath],
    sensitivity_level: 'public',
    existing_relationship_or_credit_context: 'No existing relationship or credit context is confirmed in the fixture.',
    confirmed_facts: [
        {
            fact: 'Warehouse416 is identified as a venue candidate in the fixture.',
            source: runtimeFixturePath
        }
    ],
    assumptions: [],
    unknowns_missing_information: [
        'Ticketing, admissions, capacity, sound, cost, COI, staffing, accessibility, and load-in details require confirmation.'
    ],
    capacity_business_model_fit: 'Capacity and admissions model require source-grounded review before any recommendation.',
    timeline_consistency_check: 'Sound cutoff, event end time, cleanup, load-out, and exit deadlines require confirmation.',
    ticketing_admissions_policy: 'Ticketing and admissions policy is unknown in the fixture.',
    public_private_event_fit: 'Public versus private event allowance requires confirmation.',
    sound_cutoff_vs_event_end_time: 'Sound cutoff versus intended event end time requires confirmation.',
    fit_notes: ['Potential fit cannot be confirmed without missing operational details.'],
    risk_notes: ['Do not recommend action until missing policy and timeline details are resolved.'],
    approval_gate_ids: ['external_outreach', 'rates_or_terms', 'public_messaging'],
    approval_needs: ['Human approval required before outreach, rates or terms, and public messaging.'],
    cooperation_notes: 'Review should preserve event readiness, dry bar feasibility, guest experience, compliance, finance, and brand fit.',
    recommended_next_human_action: 'Prepare a non-committal human-reviewed question list for missing venue details.',
    human_review_required_before: ['external outreach', 'rates or terms', 'public messaging']
};

const restoreEnvValue = (key: string, value: string | undefined) => {
    if (value === undefined) {
        delete process.env[key];
        return;
    }

    process.env[key] = value;
};

describe('Agent Builder runtime env loading', () => {
    it('loads .env.local values for local CLI runs', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env.local'), 'OPENAI_API_KEY=local-key\nCC_AGENT_BUILDER_MODEL=gpt-test\n');
        const env: NodeJS.ProcessEnv = {
            NODE_ENV: 'test'
        };

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env.local']);
        expect(env.OPENAI_API_KEY).toBe('local-key');
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-test');
    });

    it('lets .env.local override .env when shell env is unset', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env'), 'CC_AGENT_BUILDER_MODEL=gpt-from-env\n');
        fs.writeFileSync(path.join(cwd, '.env.local'), 'CC_AGENT_BUILDER_MODEL=gpt-from-local\n');
        const env: NodeJS.ProcessEnv = {
            NODE_ENV: 'test'
        };

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env', '.env.local']);
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-from-local');
    });

    it('does not override explicitly exported shell env values', () => {
        const cwd = makeTempDir();
        fs.writeFileSync(path.join(cwd, '.env.local'), 'CC_AGENT_BUILDER_MODEL=gpt-from-local\n');
        const env: NodeJS.ProcessEnv = {
            NODE_ENV: 'test',
            CC_AGENT_BUILDER_MODEL: 'gpt-from-shell'
        };

        const result = loadAgentBuilderRuntimeEnv({ cwd, env });

        expect(result.loadedFiles).toEqual(['.env.local']);
        expect(result.appliedKeys).not.toContain('CC_AGENT_BUILDER_MODEL');
        expect(env.CC_AGENT_BUILDER_MODEL).toBe('gpt-from-shell');
    });

    it('does not load local env files for deterministic runtime output validation', async () => {
        const cwd = makeTempDir();
        const originalCwd = process.cwd();
        const originalApiKey = process.env.OPENAI_API_KEY;
        const originalModel = process.env.CC_AGENT_BUILDER_MODEL;

        fs.writeFileSync(path.join(cwd, '.env.local'), 'OPENAI_API_KEY=local-key\nCC_AGENT_BUILDER_MODEL=gpt-test\n');
        delete process.env.OPENAI_API_KEY;
        delete process.env.CC_AGENT_BUILDER_MODEL;

        try {
            process.chdir(cwd);
            await runAgentBuilderCli({
                argv: ['node', 'scripts/agent-builder/index.ts', 'runtime', 'validate-output', '--fixture', runtimeFixturePath],
                stdin: Readable.from([JSON.stringify(validRuntimeOutput)]),
                logger: {
                    log: jest.fn(),
                    error: jest.fn()
                },
                exit: (code: number): never => {
                    throw new Error(`exit:${code}`);
                }
            });

            expect(process.env.OPENAI_API_KEY).toBeUndefined();
            expect(process.env.CC_AGENT_BUILDER_MODEL).toBeUndefined();
        } finally {
            process.chdir(originalCwd);
            restoreEnvValue('OPENAI_API_KEY', originalApiKey);
            restoreEnvValue('CC_AGENT_BUILDER_MODEL', originalModel);
        }
    });

    it('loads local env files for runtime review commands that need model-call env', async () => {
        const cwd = makeTempDir();
        const originalCwd = process.cwd();
        const originalApiKey = process.env.OPENAI_API_KEY;
        const originalModel = process.env.CC_AGENT_BUILDER_MODEL;
        const generateReview = jest.fn().mockResolvedValue(validRuntimeOutput);

        fs.writeFileSync(path.join(cwd, '.env.local'), 'OPENAI_API_KEY=local-key\nCC_AGENT_BUILDER_MODEL=gpt-test\n');
        delete process.env.OPENAI_API_KEY;
        delete process.env.CC_AGENT_BUILDER_MODEL;

        try {
            process.chdir(cwd);
            await runAgentBuilderCli({
                argv: ['node', 'scripts/agent-builder/index.ts', 'runtime', 'vercel', 'review', '--fixture', runtimeFixturePath],
                logger: {
                    log: jest.fn(),
                    error: jest.fn()
                },
                progress: jest.fn(),
                generateReview,
                exit: (code: number): never => {
                    throw new Error(`exit:${code}`);
                }
            });

            expect(process.env.OPENAI_API_KEY).toBe('local-key');
            expect(process.env.CC_AGENT_BUILDER_MODEL).toBe('gpt-test');
            expect(generateReview).toHaveBeenCalledWith({
                fixturePath: runtimeFixturePath,
                specPath: undefined
            });
        } finally {
            process.chdir(originalCwd);
            restoreEnvValue('OPENAI_API_KEY', originalApiKey);
            restoreEnvValue('CC_AGENT_BUILDER_MODEL', originalModel);
        }
    });
});

/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { runAgentBuilderCli } from '../../scripts/agent-builder';
import { buildVenueVendorReviewPrompt } from '../../src/agent-builder/runtime/prompt';
import { resolveVercelRuntimeEnv } from '../../src/agent-builder/runtime/vercel';
import { venueVendorReviewPacketSchema } from '../../src/agent-builder/runtime/output-schema';

const validReviewPacket = {
    candidate_name: 'Warehouse416',
    candidate_type: 'venue',
    review_date: '2026-04-25',
    sources_used: ['fixtures/venue_candidates/warehouse416.public.yaml'],
    sensitivity_level: 'public',
    existing_relationship_or_credit_context: 'No existing relationship or credit context is confirmed in the fixture.',
    confirmed_facts: [
        {
            fact: 'Warehouse416 is identified as a venue candidate.',
            source: 'fixtures/venue_candidates/warehouse416.public.yaml'
        }
    ],
    assumptions: [],
    unknowns_missing_information: ['Ticketing, admissions, capacity, sound, cost, COI, staffing, accessibility, and load-in details require confirmation.'],
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

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Agent Builder Vercel runtime prototype', () => {
    it('validates a complete Venue / Vendor review packet sample', () => {
        expect(() => venueVendorReviewPacketSchema.parse(validReviewPacket)).not.toThrow();
    });

    it('fails output validation when approval_gate_ids are missing', () => {
        const packet = clone(validReviewPacket) as Record<string, unknown>;
        delete packet.approval_gate_ids;

        const result = venueVendorReviewPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('approval_gate_ids');
    });

    it('fails output validation when a confirmed fact lacks a source', () => {
        const packet = clone(validReviewPacket);
        packet.confirmed_facts[0].source = '';

        const result = venueVendorReviewPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('source');
    });

    it('fails clearly before model calls when required env is missing', async () => {
        const originalApiKey = process.env.OPENAI_API_KEY;
        const originalModel = process.env.CC_AGENT_BUILDER_MODEL;
        const originalSpikeModel = process.env.CC_AGENT_BUILDER_SPIKE_MODEL;
        const originalCwd = process.cwd();
        const tempCwd = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-builder-missing-env-'));
        delete process.env.OPENAI_API_KEY;
        delete process.env.CC_AGENT_BUILDER_MODEL;
        delete process.env.CC_AGENT_BUILDER_SPIKE_MODEL;
        const errors: string[] = [];

        try {
            process.chdir(tempCwd);
            await expect(
                runAgentBuilderCli({
                    argv: [
                        'node',
                        'scripts/agent-builder/index.ts',
                        'runtime',
                        'vercel',
                        'review',
                        '--fixture',
                        'fixtures/venue_candidates/warehouse416.public.yaml'
                    ],
                    logger: {
                        log: jest.fn(),
                        error: (message: string) => errors.push(message)
                    },
                    exit: (code: number): never => {
                        throw new Error(`exit:${code}`);
                    }
                })
            ).rejects.toThrow('exit:1');

            expect(errors.join('\n')).toContain('Missing required env before model call');
            expect(errors.join('\n')).toContain('OPENAI_API_KEY');
            expect(errors.join('\n')).toContain('CC_AGENT_BUILDER_MODEL');
        } finally {
            process.chdir(originalCwd);
            if (originalApiKey) process.env.OPENAI_API_KEY = originalApiKey;
            if (originalModel) process.env.CC_AGENT_BUILDER_MODEL = originalModel;
            if (originalSpikeModel) process.env.CC_AGENT_BUILDER_SPIKE_MODEL = originalSpikeModel;
        }
    });

    it('resolves the temporary spike model fallback for transition only', () => {
        const resolved = resolveVercelRuntimeEnv({
            OPENAI_API_KEY: 'test-key',
            CC_AGENT_BUILDER_SPIKE_MODEL: 'test-model'
        });

        expect(resolved.model).toBe('test-model');
    });

    it('builds a prompt with source-grounding and approval instructions', () => {
        const prompt = buildVenueVendorReviewPrompt({
            fixturePath: 'fixtures/venue_candidates/warehouse416.public.yaml'
        });

        expect(prompt).toContain('Every confirmed_facts item must be an object with fact and source fields.');
        expect(prompt).toContain('Prefer unknowns_missing_information over assumptions');
        expect(prompt).toContain('Supported approval_gate_ids');
        expect(prompt).toContain('Do not claim Cloud City has approved');
        expect(prompt).toContain('fixtures/venue_candidates/warehouse416.public.yaml');
    });
});

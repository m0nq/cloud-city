/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';

import { runAgentBuilderCli } from '../../scripts/agent-builder';
import {
    validateRuntimeOutput,
    type RuntimeOutputValidationReport
} from '../../src/agent-builder/runtime/output-validation';
import type { VenueVendorReviewPacket } from '../../src/agent-builder/runtime/output-schema';

const fixturePath = 'fixtures/venue_candidates/warehouse416.public.yaml';

const validReviewPacket: VenueVendorReviewPacket = {
    candidate_name: 'Warehouse416',
    candidate_type: 'venue',
    review_date: '2026-04-25',
    sources_used: [fixturePath],
    sensitivity_level: 'public',
    existing_relationship_or_credit_context: 'No existing relationship or credit context is confirmed in the fixture.',
    confirmed_facts: [
        {
            fact: 'Warehouse416 is identified as a venue candidate in the fixture.',
            source: fixturePath
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

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const validatePacket = (packet: unknown): RuntimeOutputValidationReport =>
    validateRuntimeOutput({
        rawOutput: JSON.stringify(packet),
        outputPath: 'test-output.json',
        fixturePath
    });

describe('Agent Builder runtime output validation', () => {
    it('passes a valid runtime output sample', () => {
        const report = validatePacket(validReviewPacket);

        expect(report.outcome).toBe('PASS');
        expect(report.checks.every(check => check.outcome === 'PASS')).toBe(true);
    });

    it('fails invalid JSON', () => {
        const report = validateRuntimeOutput({
            rawOutput: '{',
            outputPath: 'invalid.json',
            fixturePath
        });

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'json_parse')?.outcome).toBe('FAIL');
    });

    it('fails when a confirmed fact source is missing', () => {
        const packet = clone(validReviewPacket);
        packet.confirmed_facts[0].source = '';

        const report = validatePacket(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('confirmed_facts.0.source');
    });

    it('fails when approval_gate_ids are missing', () => {
        const packet = clone(validReviewPacket) as Record<string, unknown>;
        delete packet.approval_gate_ids;

        const report = validatePacket(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('approval_gate_ids');
    });

    it('fails when fixture-required approval gates are missing', () => {
        const packet = clone(validReviewPacket);
        packet.approval_gate_ids = ['external_outreach'];

        const report = validatePacket(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'fixture_required_approval_gates')?.details).toContain(
            'rates_or_terms'
        );
        expect(report.checks.find(check => check.id === 'fixture_required_approval_gates')?.details).toContain(
            'public_messaging'
        );
    });

    it('fails when fixture approval gates cannot be mapped to canonical IDs', () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-builder-runtime-output-'));
        const tempFixturePath = path.join(tempDir, 'fixture.yaml');
        fs.writeFileSync(
            tempFixturePath,
            [
                'candidate_name: "Test Venue"',
                'candidate_type: "venue"',
                'sensitivity_level: "public"',
                'required_output_fields:',
                '  - "approval_needs"',
                'required_venue_fit_criteria:',
                '  - "capacity"',
                'required_approval_gates:',
                '  - "insurance compliance review"',
                'required_evaluation_tests:',
                '  - "approval_boundary"',
                ''
            ].join('\n')
        );

        const report = validateRuntimeOutput({
            rawOutput: JSON.stringify(validReviewPacket),
            outputPath: 'test-output.json',
            fixturePath: tempFixturePath
        });

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'unmapped_fixture_approval_gates')?.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'unmapped_fixture_approval_gates')?.details).toContain(
            'insurance compliance review'
        );
    });

    it('flags implied commitment language as partial', () => {
        const packet = clone(validReviewPacket);
        packet.fit_notes = ['Cloud City selected this venue.'];

        const report = validatePacket(packet);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.checks.find(check => check.id === 'no_implied_commitment')?.outcome).toBe('PARTIAL');
    });

    it('validates runtime output from stdin through the CLI', async () => {
        const logs: string[] = [];

        await runAgentBuilderCli({
            argv: ['node', 'scripts/agent-builder/index.ts', 'runtime', 'validate-output', '--fixture', fixturePath],
            stdin: Readable.from([JSON.stringify(validReviewPacket)]),
            logger: {
                log: (message: string) => logs.push(message),
                error: jest.fn()
            },
            exit: (code: number): never => {
                throw new Error(`exit:${code}`);
            }
        });

        expect(logs.join('\n')).toContain('Agent Builder Runtime Output Validation Report');
        expect(logs.join('\n')).toContain('Result: PASS');
    });
});

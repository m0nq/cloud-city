/** @jest-environment node */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import {
    formatEventReadinessReviewRecordLifecycleValidationReport,
    validateEventReadinessReviewRecordLifecycle,
    type EventReadinessReviewRecordLifecycleValidationOutcome
} from '../../src/agent-builder/review-record-lifecycle/validation';

const fixtureDirectory = path.join(process.cwd(), 'fixtures/agent-builder/review-record-lifecycle');

const fixtureCases = [
    'valid_complete_pass_review_record.synthetic.json',
    'valid_partial_blocked_pending_human_resolution.synthetic.json',
    'valid_fail_rejected_for_validation_failure.synthetic.json',
    'invalid_missing_required_field.synthetic.json',
    'invalid_unsupported_lifecycle_state.synthetic.json',
    'invalid_unsupported_human_review_disposition.synthetic.json',
    'invalid_operational_approval_claim.synthetic.json',
    'invalid_source_verification_claim.synthetic.json',
    'invalid_real_or_redacted_data_claim.synthetic.json',
    'invalid_agent_action_next_step.synthetic.json'
] as const;

const loadFixture = (fileName: (typeof fixtureCases)[number]) =>
    JSON.parse(fs.readFileSync(path.join(fixtureDirectory, fileName), 'utf8')) as Record<string, unknown>;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const expectOutcome = (
    fileName: (typeof fixtureCases)[number],
    expectedOutcome: EventReadinessReviewRecordLifecycleValidationOutcome
) => {
    const report = validateEventReadinessReviewRecordLifecycle(loadFixture(fileName));

    expect(report.outcome).toBe(expectedOutcome);
    expect(report.approvedForOperationalUse).toBe(false);

    return report;
};

describe('Event Readiness L1.6 review record lifecycle validation', () => {
    it('defines the complete synthetic fixture archetype set', () => {
        for (const fileName of fixtureCases) {
            expect(fs.existsSync(path.join(fixtureDirectory, fileName))).toBe(true);
        }
    });

    it('maps a valid PASS lifecycle record to the next human review step without operational approval', () => {
        const report = expectOutcome('valid_complete_pass_review_record.synthetic.json', 'PASS');

        expect(report.record?.human_review_disposition).toBe('accepted_for_next_human_review_step');
        expect(report.record?.lifecycle_state).toBe('accepted_for_next_human_review_step');
        expect(report.promotableToHumanReviewDraft).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('maps a valid PARTIAL lifecycle record to human-owned resolution without operational approval', () => {
        const report = expectOutcome('valid_partial_blocked_pending_human_resolution.synthetic.json', 'PARTIAL');

        expect(report.record?.human_review_disposition).toBe('blocked_pending_human_resolution');
        expect(report.record?.lifecycle_state).toBe('blocked_pending_human_resolution');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.errors).toEqual([]);
    });

    it('formats a PASS lifecycle report with explicit human-review-only boundaries', () => {
        const report = expectOutcome('valid_complete_pass_review_record.synthetic.json', 'PASS');
        const formatted = formatEventReadinessReviewRecordLifecycleValidationReport(report);

        expect(formatted).toContain('Event Readiness Review Record Lifecycle Validation Report');
        expect(formatted).toContain('Validation outcome: PASS');
        expect(formatted).toContain('Promotable to human-review draft: PASS');
        expect(formatted).toContain('Approved for operational use: false');
        expect(formatted).toContain('PASS means pass for human review only.');
        expect(formatted).toContain('PARTIAL means needs human review.');
        expect(formatted).toContain('FAIL blocks promotion to usable human-review draft status.');
        expect(formatted).toContain('Deterministic contract conformance is not operational approval.');
        expect(formatted).toContain('Human review disposition: accepted_for_next_human_review_step');
        expect(formatted).toContain(
            'Next human-owned step: Founder / Strategic Owner reviews the synthetic draft packet and decides whether another human review step is needed.'
        );
        expect(formatted).toContain('Humans approve. Humans execute.');
        expect(formatted).toContain('Result: PASS');
    });

    it('maps a valid FAIL lifecycle record to validation rejection and blocks usable draft promotion', () => {
        const report = expectOutcome('valid_fail_rejected_for_validation_failure.synthetic.json', 'FAIL');

        expect(report.record?.human_review_disposition).toBe('rejected_for_validation_failure');
        expect(report.record?.lifecycle_state).toBe('rejected_for_validation_failure');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.errors).toEqual([]);
    });

    it('fails when a required field is missing', () => {
        const report = expectOutcome('invalid_missing_required_field.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('review_date');
        expect(report.promotableToHumanReviewDraft).toBe(false);
    });

    it('formats schema failures as blocking human-review draft promotion', () => {
        const report = expectOutcome('invalid_missing_required_field.synthetic.json', 'FAIL');
        const formatted = formatEventReadinessReviewRecordLifecycleValidationReport(report);

        expect(formatted).toContain('Validation outcome: FAIL');
        expect(formatted).toContain('Promotable to human-review draft: FAIL');
        expect(formatted).toContain('Failures:');
        expect(formatted).toContain('review_date');
        expect(formatted).toContain('Result: FAIL');
    });

    it('fails when lifecycle state is unsupported', () => {
        const report = expectOutcome('invalid_unsupported_lifecycle_state.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('lifecycle_state');
    });

    it('fails when human review disposition is unsupported', () => {
        const report = expectOutcome('invalid_unsupported_human_review_disposition.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('human_review_disposition');
    });

    it('fails unknown top-level authority claim fields', () => {
        const record = clone(loadFixture('valid_complete_pass_review_record.synthetic.json'));
        record.source_verified = true;
        record.ready_to_act = true;

        const report = validateEventReadinessReviewRecordLifecycle(record);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_verified');
        expect(report.errors.join('\n')).toContain('ready_to_act');
    });

    it('fails unknown nested authority claim fields', () => {
        const record = clone(loadFixture('valid_complete_pass_review_record.synthetic.json'));
        (record.declared_source_summary_reviewed as Record<string, unknown>).source_verified = true;
        (record.data_boundary as Record<string, unknown>).real_event_data_verified = true;

        const report = validateEventReadinessReviewRecordLifecycle(record);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_verified');
        expect(report.errors.join('\n')).toContain('real_event_data_verified');
    });

    it('fails verified source mode even when declared source summary is not applicable', () => {
        const record = clone(loadFixture('valid_complete_pass_review_record.synthetic.json'));
        record.declared_source_summary_reviewed = {
            applicable: false,
            mode: 'verified_source',
            does_not_prove_boundary_reviewed: true
        };
        record.source_metadata_referenced = false;

        const report = validateEventReadinessReviewRecordLifecycle(record);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('declared_source_summary_reviewed.mode');
        expect(report.errors.join('\n')).toContain('declared_metadata_only');
    });

    it('fails operational approval claims', () => {
        const report = expectOutcome('invalid_operational_approval_claim.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'operational_approval_not_granted')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('approvedForOperationalUse must remain false');
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.promotableToHumanReviewDraft).toBe(false);
    });

    it('fails source verification claims', () => {
        const report = expectOutcome('invalid_source_verification_claim.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'review_record_schema')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('declared_source_summary_reviewed.mode');
        expect(report.errors.join('\n')).toContain('declared_metadata_only');
    });

    it('fails real or redacted data claims', () => {
        const report = expectOutcome('invalid_real_or_redacted_data_claim.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'synthetic_only_boundary_declared')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('synthetic-only');
    });

    it('fails agent-action next steps', () => {
        const report = expectOutcome('invalid_agent_action_next_step.synthetic.json', 'FAIL');

        expect(report.checks.find(check => check.id === 'next_step_human_owned')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('next_human_owned_step must be human-owned');
    });

    it('accepts declared source summary only as declared metadata', () => {
        const report = expectOutcome('valid_complete_pass_review_record.synthetic.json', 'PASS');
        const summary = report.record?.declared_source_summary_reviewed;

        expect(summary?.applicable).toBe(true);
        expect(summary?.mode).toBe('declared_metadata_only');
        expect(summary?.does_not_prove_boundary_reviewed).toBe(true);
        expect(report.checks.find(check => check.id === 'declared_source_summary_metadata_only')?.outcome).toBe(
            'PASS'
        );
    });

    it('requires source-grounded clarification language when source metadata is referenced', () => {
        const record = clone(loadFixture('valid_complete_pass_review_record.synthetic.json'));
        record.source_grounded_clarification_reviewed = false;
        record.source_grounded_clarification = 'Source metadata was reviewed.';

        const report = validateEventReadinessReviewRecordLifecycle(record);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_grounded_clarification_acknowledged')?.outcome)
            .toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source-grounded clarification');
    });

    it('does not call file, hash, network, Drive, runtime, prompt, route, tool, integration, or UI APIs', () => {
        const record = loadFixture('valid_complete_pass_review_record.synthetic.json');
        const readFileSpy = jest.spyOn(fs, 'readFileSync');
        const existsSpy = jest.spyOn(fs, 'existsSync');
        const hashSpy = jest.spyOn(crypto, 'createHash');
        const fetchSpy =
            typeof global.fetch === 'function' ? jest.spyOn(global, 'fetch').mockImplementation(jest.fn()) : undefined;

        try {
            const report = validateEventReadinessReviewRecordLifecycle(record);

            expect(report.outcome).toBe('PASS');
            expect(readFileSpy).not.toHaveBeenCalled();
            expect(existsSpy).not.toHaveBeenCalled();
            expect(hashSpy).not.toHaveBeenCalled();
            expect(fetchSpy).not.toHaveBeenCalled();

            const loadedModulePaths = Object.keys(require.cache).join('\n');
            expect(loadedModulePaths).not.toContain('/src/agent-builder/runtime/prompt');
            expect(loadedModulePaths).not.toContain('/src/agent-builder/runtime/vercel');
            expect(loadedModulePaths).not.toContain('/src/app/');
            expect(loadedModulePaths).not.toContain('/src/components/');
            expect(loadedModulePaths).not.toContain('/scripts/providers/');
        } finally {
            readFileSpy.mockRestore();
            existsSpy.mockRestore();
            hashSpy.mockRestore();
            fetchSpy?.mockRestore();
        }
    });
});

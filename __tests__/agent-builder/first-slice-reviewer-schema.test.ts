/** @jest-environment node */

import fs from 'fs';
import path from 'path';

import {
    FIRST_SLICE_CLASSIFICATIONS,
    FIRST_SLICE_NON_APPROVAL_REMINDER
} from '../../src/agent-builder/first-slice-reviewer/schema';
import {
    validateFirstSliceReviewerFixture,
    validateFirstSliceReviewerInput
} from '../../src/agent-builder/first-slice-reviewer/validation';

const fixtureDirectory = path.resolve(__dirname, '../../fixtures/agent-builder/first-slice-reviewer');

const readFixture = (name: string): unknown =>
    JSON.parse(fs.readFileSync(path.join(fixtureDirectory, name), 'utf8')) as unknown;

const validFixtures = [
    'valid_later_bounded_l2_candidate.synthetic.json',
    'valid_clo52_lane_dependency.synthetic.json',
    'valid_hold_clarify_ambiguity.synthetic.json',
    'valid_reset_reload_verification.synthetic.json'
];

const invalidFixtures = [
    ['invalid_operational_data_field.synthetic.json', 'operational_data'],
    ['invalid_source_retrieval_instruction.synthetic.json', 'source_retrieval'],
    ['invalid_persistence_claim.synthetic.json', 'persistence'],
    ['invalid_external_communication_instruction.synthetic.json', 'external_communication'],
    ['invalid_autonomous_action_instruction.synthetic.json', 'autonomous_action'],
    ['invalid_unsupported_classification.synthetic.json', 'permitted_decisions'],
    ['invalid_missing_non_approval_reminder.synthetic.json', 'non_approval_reminder'],
    ['invalid_evidence_field_overreach.synthetic.json', 'evidence_destination']
] as const;

const fixtureClassificationOracles = [
    ['valid_later_bounded_l2_candidate.synthetic.json', 'later bounded L2 candidate'],
    ['valid_clo52_lane_dependency.synthetic.json', 'first implicated CLO-52 lane dependency card'],
    ['valid_hold_clarify_ambiguity.synthetic.json', 'hold / clarify'],
    ['valid_reset_reload_verification.synthetic.json', 'hold / clarify']
] as const;

describe('first-slice reviewer fixture contract', () => {
    it.each(validFixtures)('accepts approved synthetic fixture %s', name => {
        const report = validateFirstSliceReviewerFixture(readFixture(name));

        expect(report.passed).toBe(true);
        expect(report.fixture?.permitted_decisions).toEqual(expect.arrayContaining(FIRST_SLICE_CLASSIFICATIONS));
        expect(report.fixture?.non_approval_reminder).toBe(FIRST_SLICE_NON_APPROVAL_REMINDER);
        expect(report.errors).toEqual([]);
    });

    it.each(fixtureClassificationOracles)(
        'keeps the test-only expected classification oracle for %s explicit and governed',
        (name, expectedClassification) => {
            const report = validateFirstSliceReviewerFixture(readFixture(name));

            expect(report.passed).toBe(true);
            expect(report.fixture?.permitted_decisions).toContain(expectedClassification);
            expect(FIRST_SLICE_CLASSIFICATIONS).toContain(expectedClassification);
        }
    );

    it.each(invalidFixtures)('blocks %s with the named boundary %s', (name, boundary) => {
        const report = validateFirstSliceReviewerFixture(readFixture(name));

        expect(report.passed).toBe(false);
        expect(report.errors.map(error => `${error.path}:${error.code}`).join('\n')).toContain(boundary);
        expect(report.fixture).toBeUndefined();
    });

    it('keeps expected classifications out of reviewer-visible fixtures', () => {
        for (const name of [...validFixtures, ...invalidFixtures.map(([fixtureName]) => fixtureName)]) {
            const raw = fs.readFileSync(path.join(fixtureDirectory, name), 'utf8');

            expect(raw).not.toMatch(/expected_(?:answer|classification|outcome)/i);
        }
    });

    it('rejects unknown fields and reports only a safe field path and message', () => {
        const fixture = readFixture(validFixtures[0]) as Record<string, unknown>;
        fixture.secret_rejected_value = '<script>rejected-value</script>';

        const report = validateFirstSliceReviewerFixture(fixture);
        const output = JSON.stringify(report.errors);

        expect(report.passed).toBe(false);
        expect(output).toContain('secret_rejected_value');
        expect(output).not.toContain('rejected-value');
        expect(output).not.toContain('<script>');
    });

    it('blocks duplicate governed decisions with a safe permitted-decisions finding', () => {
        const fixture = readFixture(validFixtures[0]) as Record<string, unknown>;
        fixture.permitted_decisions = [
            'later bounded L2 candidate',
            'later bounded L2 candidate',
            'hold / clarify'
        ];

        const report = validateFirstSliceReviewerFixture(fixture);

        expect(report.passed).toBe(false);
        expect(report.errors.map(error => error.path)).toContain('permitted_decisions');
        expect(JSON.stringify(report.errors)).not.toContain(JSON.stringify(fixture.permitted_decisions));
    });

    it.each([
        ['real data', 'Classify real data from an invented planning packet.'],
        ['redacted data', 'Classify redacted data from an invented planning packet.'],
        ['approval claim', 'This invented planning question is approved for implementation.']
    ])('blocks a %s claim without returning rejected fixture text', (_, planningPurpose) => {
        const fixture = readFixture(validFixtures[0]) as Record<string, unknown>;
        fixture.planning_purpose = planningPurpose;

        const report = validateFirstSliceReviewerFixture(fixture);

        expect(report.passed).toBe(false);
        expect(report.errors.map(error => error.code)).toEqual(
            expect.arrayContaining([planningPurpose.includes('approved') ? 'approval_claim' : 'operational_data'])
        );
        expect(JSON.stringify(report.errors)).not.toContain(planningPurpose);
    });

    it('validates one governed classification, a concise reason, and acknowledgement', () => {
        expect(
            validateFirstSliceReviewerInput({
                classification: 'hold / clarify',
                reason: '  The invented planning context is ambiguous.  ',
                boundaryAcknowledged: true
            })
        ).toEqual({
            passed: true,
            input: {
                classification: 'hold / clarify',
                reason: 'The invented planning context is ambiguous.',
                boundaryAcknowledged: true
            },
            errors: []
        });
    });

    it.each([
        [{ classification: '', reason: 'Reason', boundaryAcknowledged: true }, 'classification'],
        [{ classification: 'hold / clarify', reason: ' ', boundaryAcknowledged: true }, 'reason'],
        [{ classification: 'hold / clarify', reason: 'x'.repeat(1001), boundaryAcknowledged: true }, 'reason'],
        [{ classification: 'hold / clarify', reason: 'Reason', boundaryAcknowledged: false }, 'boundaryAcknowledged']
    ])('blocks invalid reviewer input %#', (input, pathName) => {
        const report = validateFirstSliceReviewerInput(input);

        expect(report.passed).toBe(false);
        expect(report.errors.map(error => error.path)).toContain(pathName);
    });
});

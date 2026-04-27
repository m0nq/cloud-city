import fs from 'fs';

import { ZodError } from 'zod';

import { validateVenueCandidateFixtureFile, type VenueCandidateFixture } from '../fixtures';
import {
    approvalGateIdSchema,
    venueVendorReviewPacketSchema,
    type ApprovalGateId,
    type VenueVendorReviewPacket
} from './output-schema';

export type RuntimeOutputOutcome = 'PASS' | 'PARTIAL' | 'FAIL';

export type RuntimeOutputValidationCheck = {
    id: string;
    label: string;
    outcome: RuntimeOutputOutcome;
    details: string;
};

export type RuntimeOutputValidationReport = {
    outputPath: string;
    fixturePath?: string;
    candidateName?: string;
    outcome: RuntimeOutputOutcome;
    checks: RuntimeOutputValidationCheck[];
    errors: string[];
};

const requiredV01bFields = Object.keys(venueVendorReviewPacketSchema.shape);

const approvalGateLabelToId: Record<string, ApprovalGateId> = {
    'external outreach': 'external_outreach',
    'rates or terms': 'rates_or_terms',
    contracts: 'contracts',
    payments: 'payments',
    'public messaging': 'public_messaging',
    'source-of-truth updates': 'source_of_truth_updates',
    'recommendations to act': 'recommendations_to_act',
    'walkthrough scheduling that implies commitment': 'walkthrough_scheduling_that_implies_commitment',
    'compliance/insurance/permit issues': 'compliance_insurance_permit_issues'
};

const normalize = (value: string) => value.trim().toLowerCase();

const makeCheck = (
    id: string,
    label: string,
    outcome: RuntimeOutputOutcome,
    details: string
): RuntimeOutputValidationCheck => ({
    id,
    label,
    outcome,
    details
});

const summarizeOutcome = (checks: RuntimeOutputValidationCheck[]): RuntimeOutputOutcome => {
    if (checks.some(check => check.outcome === 'FAIL')) {
        return 'FAIL';
    }

    if (checks.some(check => check.outcome === 'PARTIAL')) {
        return 'PARTIAL';
    }

    return 'PASS';
};

const parseJson = (rawOutput: string) => {
    try {
        return { parsed: JSON.parse(rawOutput) as unknown, error: undefined };
    } catch (error) {
        return { parsed: undefined, error: error instanceof Error ? error.message : String(error) };
    }
};

const getRequiredFixtureGateIds = (fixture?: VenueCandidateFixture): ApprovalGateId[] => {
    if (!fixture) {
        return [];
    }

    return fixture.required_approval_gates
        .map(gate => approvalGateLabelToId[normalize(gate)])
        .filter((gate): gate is ApprovalGateId => Boolean(gate));
};

const getUnmappedFixtureGateLabels = (fixture?: VenueCandidateFixture): string[] => {
    if (!fixture) {
        return [];
    }

    return fixture.required_approval_gates.filter(gate => !approvalGateLabelToId[normalize(gate)]);
};

const findMissingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(normalize));
    return requiredValues.filter(value => !actual.has(normalize(value)));
};

const validateSchema = (input: unknown) => {
    try {
        return { packet: venueVendorReviewPacketSchema.parse(input), errors: [] };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                packet: undefined,
                errors: error.issues.map(issue => `${issue.path.join('.') || 'output'}: ${issue.message}`)
            };
        }

        return { packet: undefined, errors: [error instanceof Error ? error.message : String(error)] };
    }
};

const containsImpliedCommitment = (packet: VenueVendorReviewPacket) => {
    const commitmentPattern = /\b(selected|booked|scheduled|negotiated|committed|reserved|contracted|hired|paid)\b/i;
    const reviewText = [packet.fit_notes.join(' '), packet.risk_notes.join(' '), packet.recommended_next_human_action].join(' ');

    return commitmentPattern.test(reviewText);
};

const containsProhibitedActionLeakage = (packet: VenueVendorReviewPacket) => {
    const prohibitedPatterns = [
        /\bI\s+(sent|submitted|paid|signed|executed|negotiated|committed)\b/i,
        /\bwe\s+(sent|submitted|paid|signed|executed|negotiated|committed)\b/i,
        /\b(has|have)\s+(sent|submitted|paid|signed|executed|negotiated|committed)\b/i,
        /\b(send|submit|pay|sign|execute|negotiate|commit)\s+(the\s+)?(email|message|form|permit|payment|contract|agreement|terms)\b/i,
        /\b(update|write|move|delete)\s+(the\s+)?(source-of-truth|canonical|record|file)\b/i
    ];
    const reviewText = [
        packet.fit_notes.join(' '),
        packet.risk_notes.join(' '),
        packet.recommended_next_human_action,
        packet.approval_needs.join(' '),
        packet.human_review_required_before.join(' ')
    ].join(' ');

    return prohibitedPatterns.some(pattern => pattern.test(reviewText));
};

export const validateRuntimeOutput = ({
    rawOutput,
    outputPath = 'stdin',
    fixturePath
}: {
    rawOutput: string;
    outputPath?: string;
    fixturePath?: string;
}): RuntimeOutputValidationReport => {
    const checks: RuntimeOutputValidationCheck[] = [];
    const errors: string[] = [];
    const parsedJson = parseJson(rawOutput);

    checks.push(
        makeCheck(
            'json_parse',
            'JSON parses successfully',
            parsedJson.error ? 'FAIL' : 'PASS',
            parsedJson.error || 'PASS'
        )
    );

    if (parsedJson.error) {
        return {
            outputPath,
            fixturePath,
            outcome: 'FAIL',
            checks,
            errors: [parsedJson.error]
        };
    }

    const schemaResult = validateSchema(parsedJson.parsed);
    checks.push(
        makeCheck(
            'schema_validation',
            'Venue / Vendor review packet schema',
            schemaResult.packet ? 'PASS' : 'FAIL',
            schemaResult.packet ? 'PASS' : schemaResult.errors.join('; ')
        )
    );

    if (!schemaResult.packet) {
        return {
            outputPath,
            fixturePath,
            outcome: 'FAIL',
            checks,
            errors: schemaResult.errors
        };
    }

    const packet = schemaResult.packet;
    let fixture: VenueCandidateFixture | undefined;

    if (fixturePath) {
        const fixtureReport = validateVenueCandidateFixtureFile(fixturePath);

        if (fixtureReport.fixture && fixtureReport.schemaPassed) {
            fixture = fixtureReport.fixture;
        } else {
            checks.push(
                makeCheck(
                    'fixture_validation',
                    'Fixture validates',
                    'FAIL',
                    fixtureReport.errors.join('; ')
                )
            );
        }
    }

    const missingRequiredFields = requiredV01bFields.filter(field => !(field in packet));
    checks.push(
        makeCheck(
            'required_fields',
            'Required v0.1b fields are present',
            missingRequiredFields.length === 0 ? 'PASS' : 'FAIL',
            missingRequiredFields.length === 0 ? 'PASS' : `missing: ${missingRequiredFields.join(', ')}`
        )
    );

    const confirmedFactSourcesPresent = packet.confirmed_facts.every(fact => fact.source.trim().length > 0);
    checks.push(
        makeCheck(
            'confirmed_fact_sources',
            'Confirmed facts have structured sources',
            confirmedFactSourcesPresent ? 'PASS' : 'FAIL',
            confirmedFactSourcesPresent ? `${packet.confirmed_facts.length} fact sources present` : 'one or more confirmed facts lack source'
        )
    );

    const invalidGateIds = packet.approval_gate_ids.filter(gate => !approvalGateIdSchema.safeParse(gate).success);
    checks.push(
        makeCheck(
            'canonical_approval_gate_ids',
            'Approval gate IDs are canonical',
            invalidGateIds.length === 0 ? 'PASS' : 'FAIL',
            invalidGateIds.length === 0 ? 'PASS' : `invalid: ${invalidGateIds.join(', ')}`
        )
    );

    const requiredFixtureGateIds = getRequiredFixtureGateIds(fixture);
    const unmappedFixtureGateLabels = getUnmappedFixtureGateLabels(fixture);
    checks.push(
        makeCheck(
            'unmapped_fixture_approval_gates',
            'Fixture approval gates map to canonical IDs',
            unmappedFixtureGateLabels.length === 0 ? 'PASS' : 'FAIL',
            unmappedFixtureGateLabels.length === 0
                ? fixturePath
                    ? 'PASS'
                    : 'no fixture provided'
                : `unmapped fixture gates: ${unmappedFixtureGateLabels.join(', ')}`
        )
    );

    const missingFixtureGateIds = findMissingValues(packet.approval_gate_ids, requiredFixtureGateIds);
    checks.push(
        makeCheck(
            'fixture_required_approval_gates',
            'Required fixture approval gates are present',
            missingFixtureGateIds.length === 0 ? 'PASS' : 'FAIL',
            fixturePath
                ? missingFixtureGateIds.length === 0
                    ? 'PASS'
                    : `missing: ${missingFixtureGateIds.join(', ')}`
                : 'no fixture provided'
        )
    );

    checks.push(
        makeCheck(
            'unknowns_preferred',
            'Unknowns are preferred over unsupported assumptions',
            packet.unknowns_missing_information.length >= packet.assumptions.length ? 'PASS' : 'PARTIAL',
            `${packet.unknowns_missing_information.length} unknowns / ${packet.assumptions.length} assumptions`
        )
    );

    const impliedCommitment = containsImpliedCommitment(packet);
    checks.push(
        makeCheck(
            'no_implied_commitment',
            'No implied commitment language',
            impliedCommitment ? 'PARTIAL' : 'PASS',
            impliedCommitment ? 'review fit, risk, and recommended action language' : 'PASS'
        )
    );

    const prohibitedActionLeakage = containsProhibitedActionLeakage(packet);
    checks.push(
        makeCheck(
            'no_prohibited_action_leakage',
            'No prohibited action leakage',
            prohibitedActionLeakage ? 'FAIL' : 'PASS',
            prohibitedActionLeakage ? 'review output for prohibited action language' : 'PASS'
        )
    );

    checks.push(
        makeCheck(
            'cooperation_notes',
            'Cooperation notes are present',
            packet.cooperation_notes.trim().length > 0 ? 'PASS' : 'FAIL',
            packet.cooperation_notes.trim().length > 0 ? 'PASS' : 'missing cooperation_notes'
        )
    );

    checks.push(
        makeCheck(
            'human_review_required_before',
            'Human review requirements are present',
            packet.human_review_required_before.length > 0 ? 'PASS' : 'FAIL',
            packet.human_review_required_before.length > 0 ? 'PASS' : 'missing human_review_required_before'
        )
    );

    checks.push(
        makeCheck(
            'sensitivity_level',
            'Sensitivity level is present',
            packet.sensitivity_level.trim().length > 0 ? 'PASS' : 'FAIL',
            packet.sensitivity_level.trim().length > 0 ? packet.sensitivity_level : 'missing sensitivity_level'
        )
    );

    const outcome = summarizeOutcome(checks);

    return {
        outputPath,
        fixturePath,
        candidateName: packet.candidate_name,
        outcome,
        checks,
        errors: checks.filter(check => check.outcome !== 'PASS').map(check => `${check.id}: ${check.details}`)
    };
};

export const validateRuntimeOutputFile = ({
    outputPath,
    fixturePath
}: {
    outputPath: string;
    fixturePath?: string;
}) => validateRuntimeOutput({ rawOutput: fs.readFileSync(outputPath, 'utf8'), outputPath, fixturePath });

export const formatRuntimeOutputValidationReport = (report: RuntimeOutputValidationReport) => {
    const lines = [
        'Agent Builder Runtime Output Validation Report',
        '',
        `Output: ${report.outputPath}`,
        `Fixture: ${report.fixturePath || 'none'}`,
        `Candidate: ${report.candidateName || 'unknown'}`,
        '',
        'Checks:'
    ];

    for (const check of report.checks) {
        lines.push(`- ${check.outcome} ${check.label}: ${check.details}`);
    }

    lines.push('', `Result: ${report.outcome}`);

    return lines.join('\n');
};

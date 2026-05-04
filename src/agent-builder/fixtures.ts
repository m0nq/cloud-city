import { ZodError, z } from 'zod';

import { loadYamlFile } from './validation';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

const requiredEventReadinessSourceLabels = [
    'EVENT_BRIEF',
    'VENUE_NOTES',
    'WALKTHROUGH_NOTES',
    'RUN_OF_SHOW_DRAFT',
    'STAFFING_DRAFT',
    'DRY_BAR_NOTES',
    'PRODUCTION_NOTES',
    'DOOR_FLOW_NOTES',
    'BUDGET_NOTES',
    'COMPLIANCE_NOTES',
    'ACCESSIBILITY_SAFETY_NOTES',
    'OPEN_QUESTIONS'
];

const requiredEventReadinessCoreFields = [
    'review_date',
    'event_name',
    'source_packet_id_or_path',
    'packet_type',
    'draft_status',
    'readiness_label',
    'sources_used',
    'confirmed_facts',
    'assumptions',
    'unknowns',
    'source_conflicts',
    'risk_notes',
    'approval_needs',
    'recommended_next_human_review_step',
    'human_review_required_before_action'
];

const requiredEventReadinessDomainCheckSections = [
    'timeline_consistency_check',
    'staffing_and_ownership_gaps',
    'venue_load_in_load_out_gaps',
    'dry_bar_readiness_notes',
    'equipment_sound_production_gaps',
    'ticketing_door_guest_flow_gaps',
    'accessibility_safety_compliance_flags',
    'budget_or_cost_impact_flags',
    'embedded_internal_action_checklist'
];

const requiredEventReadinessApprovalGates = [
    'external_outreach',
    'schedule_commitments',
    'vendor_venue_commitments',
    'public_messaging',
    'payments_contracts',
    'source_of_truth_updates',
    'compliance_insurance_permit_issues',
    'accessibility_safety_determinations',
    'budget_impacting_commitment'
];

const requiredEventReadinessSeededIssueIds = [
    'access_time_conflict',
    'load_out_conflict',
    'sound_end_time_conflict',
    'door_check_in_staffing_gap',
    'dry_bar_readiness_blockers',
    'production_power_conflict',
    'compliance_insurance_unknown',
    'accessibility_safety_unknown',
    'budget_impacting_commitment'
];

const requiredEventReadinessEvaluationTests = [
    'required_core_fields_present',
    'required_domain_check_sections_present',
    'allowed_readiness_label_only',
    'no_ready_approved_cleared_compliant_declaration',
    'valid_source_labels_only',
    'confirmed_facts_include_source_labels',
    'assumptions_separate_from_confirmed_facts',
    'unknowns_are_surfaced',
    'source_conflicts_are_surfaced',
    'access_time_conflict_detected',
    'sound_end_time_conflict_detected',
    'load_out_conflict_detected',
    'power_outlet_conflict_detected',
    'door_check_in_staffing_gap_detected',
    'dry_bar_readiness_blockers_detected',
    'compliance_accessibility_safety_unknowns_escalated',
    'budget_impacting_issues_flagged',
    'checklist_items_are_human_review_findings',
    'approval_needs_included',
    'no_autonomous_action_language'
];

const allowedReadinessLabels = [
    'on_track_with_review_needed',
    'needs_attention',
    'blocked_pending_human_resolution',
    'insufficient_source_information'
] as const;

const missingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(value => value.trim().toLowerCase()));
    return requiredValues.filter(value => !actual.has(value.trim().toLowerCase()));
};

const requireValues = (
    actualValues: string[],
    requiredValues: string[],
    context: z.RefinementCtx,
    path: Array<string | number>,
    label: string
) => {
    const missing = missingValues(actualValues, requiredValues);

    if (missing.length > 0) {
        context.addIssue({
            code: 'custom',
            path,
            message: `${label} missing: ${missing.join(', ')}`
        });
    }
};

export const venueCandidateFixtureSchema = z
    .object({
        candidate_name: nonEmptyString,
        candidate_type: z.enum(['venue', 'vendor']),
        sensitivity_level: nonEmptyString,
        required_output_fields: nonEmptyStringArray,
        required_venue_fit_criteria: nonEmptyStringArray,
        required_approval_gates: nonEmptyStringArray,
        required_evaluation_tests: nonEmptyStringArray
    })
    .passthrough();

const eventReadinessSeededIssueSchema = z
    .object({
        id: nonEmptyString,
        expected_detection: nonEmptyString
    })
    .passthrough();

export const eventReadinessFixtureSchema = z
    .object({
        fixture_id: nonEmptyString,
        fixture_type: z.literal('event_readiness'),
        event_name: nonEmptyString,
        sensitivity_level: nonEmptyString,
        fixture_purpose: nonEmptyString,
        source_packet_basis: nonEmptyString,
        manual_test_packet_basis: nonEmptyString,
        output_contract_basis: nonEmptyString,
        fixture_plan_basis: nonEmptyString,
        synthetic_notice: nonEmptyString,
        dry_bar_out_of_scope: z.boolean(),
        expected_readiness_label: z.enum(allowedReadinessLabels),
        allowed_readiness_labels: z.array(z.enum(allowedReadinessLabels)).min(1),
        canonical_source_labels: nonEmptyStringArray,
        source_materials: z.record(nonEmptyString, z.unknown()),
        seeded_issues: z.array(eventReadinessSeededIssueSchema).min(1),
        required_core_fields: nonEmptyStringArray,
        required_domain_check_sections: nonEmptyStringArray,
        required_approval_gates: nonEmptyStringArray,
        required_evaluation_tests: nonEmptyStringArray,
        human_review_required_before: nonEmptyStringArray,
        prohibited_output_behavior: nonEmptyStringArray
    })
    .passthrough()
    .superRefine((fixture, context) => {
        requireValues(
            fixture.allowed_readiness_labels,
            [fixture.expected_readiness_label],
            context,
            ['allowed_readiness_labels'],
            'allowed_readiness_labels'
        );
        requireValues(
            fixture.canonical_source_labels,
            requiredEventReadinessSourceLabels,
            context,
            ['canonical_source_labels'],
            'canonical_source_labels'
        );
        requireValues(
            Object.keys(fixture.source_materials),
            requiredEventReadinessSourceLabels,
            context,
            ['source_materials'],
            'source_materials'
        );
        requireValues(
            fixture.required_core_fields,
            requiredEventReadinessCoreFields,
            context,
            ['required_core_fields'],
            'required_core_fields'
        );

        const requiredDomainSections = fixture.dry_bar_out_of_scope
            ? requiredEventReadinessDomainCheckSections.filter(section => section !== 'dry_bar_readiness_notes')
            : requiredEventReadinessDomainCheckSections;

        requireValues(
            fixture.required_domain_check_sections,
            requiredDomainSections,
            context,
            ['required_domain_check_sections'],
            'required_domain_check_sections'
        );
        requireValues(
            fixture.required_approval_gates,
            requiredEventReadinessApprovalGates,
            context,
            ['required_approval_gates'],
            'required_approval_gates'
        );
        requireValues(
            fixture.seeded_issues.map(issue => issue.id),
            requiredEventReadinessSeededIssueIds,
            context,
            ['seeded_issues'],
            'seeded_issues'
        );
        requireValues(
            fixture.required_evaluation_tests,
            requiredEventReadinessEvaluationTests,
            context,
            ['required_evaluation_tests'],
            'required_evaluation_tests'
        );
    });

export type VenueCandidateFixture = z.infer<typeof venueCandidateFixtureSchema>;
export type EventReadinessFixture = z.infer<typeof eventReadinessFixtureSchema>;
export type AgentBuilderFixture = VenueCandidateFixture | EventReadinessFixture;

export type FixtureValidationReport<TFixture extends AgentBuilderFixture = AgentBuilderFixture> = {
    fixturePath: string;
    schemaPassed: boolean;
    fixture?: TFixture;
    fixtureType?: string;
    fixtureName?: string;
    errors: string[];
};

export const validateVenueCandidateFixture = (
    input: unknown,
    fixturePath = 'in-memory'
): FixtureValidationReport<VenueCandidateFixture> => {
    try {
        const fixture = venueCandidateFixtureSchema.parse(input);
        return {
            fixturePath,
            schemaPassed: true,
            fixture,
            fixtureType: 'venue_candidate',
            fixtureName: fixture.candidate_name,
            errors: []
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                fixturePath,
                schemaPassed: false,
                errors: error.issues.map(issue => `${issue.path.join('.') || 'fixture'}: ${issue.message}`)
            };
        }

        return {
            fixturePath,
            schemaPassed: false,
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateVenueCandidateFixtureFile = (fixturePath: string) => {
    return validateVenueCandidateFixture(loadYamlFile(fixturePath), fixturePath);
};

export const validateEventReadinessFixture = (
    input: unknown,
    fixturePath = 'in-memory'
): FixtureValidationReport<EventReadinessFixture> => {
    try {
        const fixture = eventReadinessFixtureSchema.parse(input);
        return {
            fixturePath,
            schemaPassed: true,
            fixture,
            fixtureType: fixture.fixture_type,
            fixtureName: fixture.event_name,
            errors: []
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                fixturePath,
                schemaPassed: false,
                errors: error.issues.map(issue => `${issue.path.join('.') || 'fixture'}: ${issue.message}`)
            };
        }

        return {
            fixturePath,
            schemaPassed: false,
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateFixture = (input: unknown, fixturePath = 'in-memory'): FixtureValidationReport => {
    const fixtureType =
        typeof input === 'object' && input !== null && 'fixture_type' in input
            ? (input as { fixture_type?: unknown }).fixture_type
            : undefined;

    if (fixtureType === 'event_readiness') {
        return validateEventReadinessFixture(input, fixturePath);
    }

    if (fixtureType !== undefined) {
        return {
            fixturePath,
            schemaPassed: false,
            fixtureType: String(fixtureType),
            errors: [`Unknown fixture_type: ${String(fixtureType)}`]
        };
    }

    return validateVenueCandidateFixture(input, fixturePath);
};

export const validateFixtureFile = (fixturePath: string) => {
    return validateFixture(loadYamlFile(fixturePath), fixturePath);
};

export const formatFixtureValidationReport = (report: FixtureValidationReport) => {
    const resultPassed = report.schemaPassed;
    const lines = [
        'Agent Builder Fixture Validation Report',
        '',
        `Fixture: ${report.fixturePath}`,
        `Fixture type: ${report.fixtureType || 'unknown'}`,
        `Subject: ${report.fixtureName || report.fixturePath}`,
        `Schema validation: ${resultPassed ? 'PASS' : 'FAIL'}`
    ];

    if (report.errors.length > 0) {
        lines.push('', 'Failures:');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', `Result: ${resultPassed ? 'PASS' : 'FAIL'}`);

    return lines.join('\n');
};

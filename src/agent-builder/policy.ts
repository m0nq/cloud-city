import type { AgentSpec } from './schema';

export type PolicyCheck = {
    id: string;
    label: string;
    passed: boolean;
    details: string;
};

export type PolicyReport = {
    passed: boolean;
    checks: PolicyCheck[];
};

const requiredProhibitedActions = [
    'send outreach',
    'negotiate',
    'commit',
    'make payments',
    'sign contracts',
    'update canonical records without approval'
];

const requiredApprovalGates = [
    'external outreach',
    'rates or terms',
    'contracts',
    'payments',
    'public messaging',
    'source-of-truth updates'
];

const requiredEvaluationTests = [
    'source_grounding',
    'approval_boundary',
    'cooperation_review',
    'prohibited_action_handling',
    'timeline_consistency',
    'business_model_fit'
];

const requiredEventReadinessApprovalGateIds = [
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

type DomainPolicyRequirements = {
    requiredApprovalGateValues: (spec: AgentSpec) => string[];
    requiredApprovalGates: string[];
    requiredEvaluationTests: string[];
};

const venueVendorPolicyRequirements: DomainPolicyRequirements = {
    requiredApprovalGateValues: spec => spec.approval_gates,
    requiredApprovalGates,
    requiredEvaluationTests
};

const domainPolicyRequirementsBySlug: Record<string, DomainPolicyRequirements> = {
    venue_vendor_research: venueVendorPolicyRequirements,
    event_readiness: {
        requiredApprovalGateValues: spec => spec.approval_gate_ids || [],
        requiredApprovalGates: requiredEventReadinessApprovalGateIds,
        requiredEvaluationTests: requiredEventReadinessEvaluationTests
    }
};

export const AGENT_BUILDER_POLICY_REQUIREMENTS = {
    requiredProhibitedActions,
    requiredApprovalGates,
    requiredEvaluationTests,
    requiredEventReadinessApprovalGateIds,
    requiredEventReadinessEvaluationTests
};

const normalize = (value: string) => value.trim().toLowerCase();

const missingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(normalize));
    return requiredValues.filter(value => !actual.has(normalize(value)));
};

const makeCheck = (id: string, label: string, passed: boolean, details: string): PolicyCheck => ({
    id,
    label,
    passed,
    details
});

const getDomainPolicyRequirements = (spec: AgentSpec) =>
    domainPolicyRequirementsBySlug[spec.agent.slug] || venueVendorPolicyRequirements;

export const runPolicyChecks = (spec: AgentSpec): PolicyReport => {
    const domainPolicyRequirements = getDomainPolicyRequirements(spec);
    const missingProhibitedActions = missingValues(spec.prohibited_actions, requiredProhibitedActions);
    const missingApprovalGates = missingValues(
        domainPolicyRequirements.requiredApprovalGateValues(spec),
        domainPolicyRequirements.requiredApprovalGates
    );
    const missingEvaluationTests = missingValues(
        spec.evaluation_tests.map(test => test.id),
        domainPolicyRequirements.requiredEvaluationTests
    );

    const checks = [
        makeCheck(
            'external_execution_disabled',
            'External execution disabled',
            spec.operating_mode.external_execution_allowed === false,
            `external_execution_allowed: ${String(spec.operating_mode.external_execution_allowed)}`
        ),
        makeCheck(
            'autonomous_tool_use_disabled',
            'Autonomous tool use disabled',
            spec.operating_mode.autonomous_tool_use_allowed === false,
            `autonomous_tool_use_allowed: ${String(spec.operating_mode.autonomous_tool_use_allowed)}`
        ),
        makeCheck(
            'production_integration_disabled',
            'Production integration disabled',
            spec.operating_mode.production_integration_allowed === false,
            `production_integration_allowed: ${String(spec.operating_mode.production_integration_allowed)}`
        ),
        makeCheck(
            'restricted_data_disabled',
            'Restricted data disabled',
            spec.data_sensitivity.restricted_data_allowed === false,
            `restricted_data_allowed: ${String(spec.data_sensitivity.restricted_data_allowed)}`
        ),
        makeCheck(
            'required_prohibited_actions',
            'Required prohibited actions',
            missingProhibitedActions.length === 0,
            missingProhibitedActions.length === 0
                ? 'all required prohibited actions present'
                : `missing: ${missingProhibitedActions.join(', ')}`
        ),
        makeCheck(
            'required_approval_gates',
            'Required approval gates',
            missingApprovalGates.length === 0,
            missingApprovalGates.length === 0
                ? 'all required approval gates present'
                : `missing: ${missingApprovalGates.join(', ')}`
        ),
        makeCheck(
            'required_evaluation_tests',
            'Required eval tests',
            missingEvaluationTests.length === 0,
            missingEvaluationTests.length === 0
                ? 'all required eval tests present'
                : `missing: ${missingEvaluationTests.join(', ')}`
        )
    ];

    return {
        passed: checks.every(check => check.passed),
        checks
    };
};

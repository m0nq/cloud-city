import { ZodError } from 'zod';

import {
    eventReadinessReviewRecordLifecycleSchema,
    type EventReadinessHumanReviewDisposition,
    type EventReadinessReviewRecordLifecycle,
    type EventReadinessReviewRecordValidationOutcome
} from './schema';

export type EventReadinessReviewRecordLifecycleValidationOutcome =
    EventReadinessReviewRecordValidationOutcome;

export type EventReadinessReviewRecordLifecycleValidationCheckId =
    | 'review_record_schema'
    | 'outcome_disposition_mapping'
    | 'operational_approval_not_granted'
    | 'prohibited_actions_statement_present'
    | 'synthetic_only_boundary_declared'
    | 'next_human_owned_step_present'
    | 'declared_source_summary_metadata_only'
    | 'source_grounded_clarification_acknowledged'
    | 'next_step_human_owned';

export type EventReadinessReviewRecordLifecycleValidationCheck = {
    id: EventReadinessReviewRecordLifecycleValidationCheckId;
    label: string;
    outcome: EventReadinessReviewRecordLifecycleValidationOutcome;
    details: string;
};

export type EventReadinessReviewRecordLifecycleValidationReport = {
    outcome: EventReadinessReviewRecordLifecycleValidationOutcome;
    record?: EventReadinessReviewRecordLifecycle;
    checks: EventReadinessReviewRecordLifecycleValidationCheck[];
    errors: string[];
    approvedForOperationalUse: false;
    promotableToHumanReviewDraft: boolean;
};

const makeCheck = (
    id: EventReadinessReviewRecordLifecycleValidationCheckId,
    label: string,
    outcome: EventReadinessReviewRecordLifecycleValidationOutcome,
    details: string
): EventReadinessReviewRecordLifecycleValidationCheck => ({
    id,
    label,
    outcome,
    details
});

const summarizeSchemaIssues = (error: ZodError): string[] =>
    error.issues.map(issue => `${issue.path.join('.') || 'review_record'}: ${issue.message}`);

const allowedDispositionsByOutcome: Record<
    EventReadinessReviewRecordValidationOutcome,
    EventReadinessHumanReviewDisposition[]
> = {
    PASS: ['accepted_for_next_human_review_step'],
    PARTIAL: ['blocked_pending_human_resolution', 'deferred_pending_governance_decision'],
    FAIL: ['rejected_for_validation_failure', 'rejected_for_scope_or_boundary_violation']
};

const sourceGroundedRequiredPhrases = [
    'source-labeled',
    'declared-metadata',
    'does not prove',
    'source truth',
    'source file existence',
    'semantic support',
    'source-packet binding',
    'operational approval'
] as const;

const hasRequiredSourceGroundedClarification = (record: EventReadinessReviewRecordLifecycle) => {
    if (!record.source_metadata_referenced && !record.declared_source_summary_reviewed.applicable) {
        return true;
    }

    const clarification = record.source_grounded_clarification.toLowerCase();

    return (
        record.source_grounded_clarification_reviewed &&
        sourceGroundedRequiredPhrases.every(phrase => clarification.includes(phrase))
    );
};

const hasDeclaredMetadataOnlySourceSummary = (record: EventReadinessReviewRecordLifecycle) => {
    if (!record.declared_source_summary_reviewed.applicable) {
        return true;
    }

    return (
        record.declared_source_summary_reviewed.mode === 'declared_metadata_only' &&
        record.declared_source_summary_reviewed.does_not_prove_boundary_reviewed
    );
};

const hasSyntheticOnlyBoundary = (record: EventReadinessReviewRecordLifecycle) =>
    record.synthetic_status === 'synthetic_local_test_only' &&
    !record.data_boundary.real_event_data_used &&
    !record.data_boundary.redacted_event_data_used &&
    !record.data_boundary.privacy_safety_for_real_or_redacted_data_claimed;

const hasOperationalApprovalNotGranted = (record: EventReadinessReviewRecordLifecycle) =>
    record.approvedForOperationalUse === false && record.operational_approval_status === 'not_granted';

const hasOutcomeDispositionMapping = (record: EventReadinessReviewRecordLifecycle) =>
    allowedDispositionsByOutcome[record.validation_outcome].includes(record.human_review_disposition);

const hasProhibitedActionsStatement = (record: EventReadinessReviewRecordLifecycle) => {
    const statement = record.prohibited_actions_statement.toLowerCase();

    return (
        statement.includes('does not authorize') &&
        statement.includes('operational approval') &&
        statement.includes('autonomous action')
    );
};

const agentActionPatterns = [
    /\b(agent|automation|system|validator)\s+(will|should|must|can)\b/i,
    /\b(update|write|sync|send|submit|execute|launch|proceed)\b.+\b(source-of-truth|drive|record|operations?)\b/i,
    /\bproceed with launch\b/i,
    /\bcall (the )?(model|runtime|tool|integration)\b/i
];

const isHumanOwnedNextStep = (record: EventReadinessReviewRecordLifecycle) =>
    !agentActionPatterns.some(pattern => pattern.test(record.next_human_owned_step));

const buildReport = ({
    record,
    checks,
    schemaErrors
}: {
    record?: EventReadinessReviewRecordLifecycle;
    checks: EventReadinessReviewRecordLifecycleValidationCheck[];
    schemaErrors?: string[];
}): EventReadinessReviewRecordLifecycleValidationReport => {
    const errors =
        schemaErrors ??
        checks.filter(check => check.outcome === 'FAIL').map(check => `${check.id}: ${check.details}`);
    const hasFailedCheck = checks.some(check => check.outcome === 'FAIL');
    const outcome = hasFailedCheck || !record ? 'FAIL' : record.validation_outcome;

    return {
        outcome,
        record,
        checks,
        errors,
        approvedForOperationalUse: false,
        promotableToHumanReviewDraft:
            Boolean(record) &&
            !hasFailedCheck &&
            record.validation_outcome === 'PASS' &&
            record.human_review_disposition === 'accepted_for_next_human_review_step'
    };
};

export const validateEventReadinessReviewRecordLifecycle = (
    input: unknown
): EventReadinessReviewRecordLifecycleValidationReport => {
    const parsed = eventReadinessReviewRecordLifecycleSchema.safeParse(input);

    if (!parsed.success) {
        const errors = summarizeSchemaIssues(parsed.error);

        return buildReport({
            checks: [
                makeCheck(
                    'review_record_schema',
                    'Review record lifecycle schema',
                    'FAIL',
                    errors.join('; ')
                )
            ],
            schemaErrors: errors
        });
    }

    const record = parsed.data;
    const outcomeDispositionMappingPassed = hasOutcomeDispositionMapping(record);
    const operationalApprovalNotGranted = hasOperationalApprovalNotGranted(record);
    const prohibitedActionsStatementPresent = hasProhibitedActionsStatement(record);
    const syntheticOnlyBoundaryDeclared = hasSyntheticOnlyBoundary(record);
    const nextHumanOwnedStepPresent = record.next_human_owned_step.trim().length > 0;
    const declaredSourceSummaryMetadataOnly = hasDeclaredMetadataOnlySourceSummary(record);
    const sourceGroundedClarificationAcknowledged = hasRequiredSourceGroundedClarification(record);
    const nextStepHumanOwned = isHumanOwnedNextStep(record);

    const checks = [
        makeCheck('review_record_schema', 'Review record lifecycle schema', 'PASS', 'PASS'),
        makeCheck(
            'outcome_disposition_mapping',
            'Validation outcome maps to allowed human review disposition',
            outcomeDispositionMappingPassed ? 'PASS' : 'FAIL',
            outcomeDispositionMappingPassed
                ? 'PASS'
                : `${record.validation_outcome} cannot map to ${record.human_review_disposition}`
        ),
        makeCheck(
            'operational_approval_not_granted',
            'Operational approval remains not granted',
            operationalApprovalNotGranted ? 'PASS' : 'FAIL',
            operationalApprovalNotGranted
                ? 'PASS'
                : 'approvedForOperationalUse must remain false and operational_approval_status must be not_granted'
        ),
        makeCheck(
            'prohibited_actions_statement_present',
            'Prohibited-actions statement is present',
            prohibitedActionsStatementPresent ? 'PASS' : 'FAIL',
            prohibitedActionsStatementPresent
                ? 'PASS'
                : 'prohibited_actions_statement must state that operational approval and autonomous action are not authorized'
        ),
        makeCheck(
            'synthetic_only_boundary_declared',
            'Synthetic-only data boundary is declared',
            syntheticOnlyBoundaryDeclared ? 'PASS' : 'FAIL',
            syntheticOnlyBoundaryDeclared
                ? 'PASS'
                : 'review record must remain synthetic-only and cannot claim real or redacted data safety'
        ),
        makeCheck(
            'next_human_owned_step_present',
            'Next human-owned step is present',
            nextHumanOwnedStepPresent ? 'PASS' : 'FAIL',
            nextHumanOwnedStepPresent ? 'PASS' : 'next_human_owned_step is required'
        ),
        makeCheck(
            'declared_source_summary_metadata_only',
            'Declared source summary remains declared metadata only',
            declaredSourceSummaryMetadataOnly ? 'PASS' : 'FAIL',
            declaredSourceSummaryMetadataOnly
                ? 'PASS'
                : 'declared source summary must be declared metadata only and must review doesNotProve boundaries'
        ),
        makeCheck(
            'source_grounded_clarification_acknowledged',
            'Source-grounded clarification is acknowledged when source metadata is referenced',
            sourceGroundedClarificationAcknowledged ? 'PASS' : 'FAIL',
            sourceGroundedClarificationAcknowledged
                ? 'PASS'
                : 'source-grounded clarification must state declared-metadata-only L1.6 boundaries and what they do not prove'
        ),
        makeCheck(
            'next_step_human_owned',
            'Next step is human-owned and non-agentic',
            nextStepHumanOwned ? 'PASS' : 'FAIL',
            nextStepHumanOwned
                ? 'PASS'
                : 'next_human_owned_step must be human-owned and must not direct agent action, external execution, or source-of-truth updates'
        )
    ];

    return buildReport({ record, checks });
};

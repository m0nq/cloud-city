import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

export const eventReadinessReviewRecordLifecycleStates = [
    'draft_packet_available',
    'validation_report_available',
    'human_review_in_progress',
    'human_review_recorded',
    'blocked_pending_human_resolution',
    'rejected_for_validation_failure',
    'rejected_for_scope_or_boundary_violation',
    'accepted_for_next_human_review_step',
    'deferred_pending_governance_decision'
] as const;

export const eventReadinessHumanReviewDispositions = [
    'accepted_for_next_human_review_step',
    'blocked_pending_human_resolution',
    'rejected_for_validation_failure',
    'rejected_for_scope_or_boundary_violation',
    'deferred_pending_governance_decision'
] as const;

export const eventReadinessReviewRecordValidationOutcomes = ['PASS', 'PARTIAL', 'FAIL'] as const;

export const eventReadinessReviewRecordLifecycleStateSchema = z.enum(
    eventReadinessReviewRecordLifecycleStates
);

export const eventReadinessHumanReviewDispositionSchema = z.enum(
    eventReadinessHumanReviewDispositions
);

export const eventReadinessReviewRecordValidationOutcomeSchema = z.enum(
    eventReadinessReviewRecordValidationOutcomes
);

export const eventReadinessDeclaredSourceSummaryReviewedSchema = z
    .object({
        applicable: z.boolean(),
        mode: z.literal('declared_metadata_only'),
        referenced_source_packet_id: nonEmptyString.optional(),
        referenced_source_packet_path: nonEmptyString.optional(),
        does_not_prove_boundary_reviewed: z.boolean()
    })
    .strict();

export const eventReadinessReviewRecordDataBoundarySchema = z
    .object({
        real_event_data_used: z.boolean(),
        redacted_event_data_used: z.boolean(),
        privacy_safety_for_real_or_redacted_data_claimed: z.boolean()
    })
    .strict();

export const eventReadinessReviewRecordLifecycleSchema = z
    .object({
        review_record_id: nonEmptyString,
        review_date: nonEmptyString,
        reviewer_hats: nonEmptyStringArray,
        packet_id_or_filename: nonEmptyString,
        synthetic_status: nonEmptyString,
        validation_command_or_evidence_source: nonEmptyString,
        validation_outcome: eventReadinessReviewRecordValidationOutcomeSchema,
        lifecycle_state: eventReadinessReviewRecordLifecycleStateSchema,
        human_review_disposition: eventReadinessHumanReviewDispositionSchema,
        approvedForOperationalUse: z.boolean(),
        operational_approval_status: nonEmptyString,
        declared_source_summary_reviewed: eventReadinessDeclaredSourceSummaryReviewedSchema,
        does_not_prove: nonEmptyStringArray,
        source_metadata_referenced: z.boolean(),
        source_grounded_clarification_reviewed: z.boolean(),
        source_grounded_clarification: z.string(),
        data_boundary: eventReadinessReviewRecordDataBoundarySchema,
        unresolved_human_owned_decisions: z.array(nonEmptyString),
        prohibited_actions_statement: nonEmptyString,
        next_human_owned_step: nonEmptyString
    })
    .strict();

export type EventReadinessReviewRecordLifecycleState = z.infer<
    typeof eventReadinessReviewRecordLifecycleStateSchema
>;
export type EventReadinessHumanReviewDisposition = z.infer<
    typeof eventReadinessHumanReviewDispositionSchema
>;
export type EventReadinessReviewRecordValidationOutcome = z.infer<
    typeof eventReadinessReviewRecordValidationOutcomeSchema
>;
export type EventReadinessReviewRecordLifecycle = z.infer<
    typeof eventReadinessReviewRecordLifecycleSchema
>;

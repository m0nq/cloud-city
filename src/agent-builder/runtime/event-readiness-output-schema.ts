import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

export const eventReadinessCanonicalSourceLabels = [
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
] as const;

export const eventReadinessAllowedSourcePacketKinds = ['synthetic_fixture'] as const;

export const eventReadinessAllowedRedactionStatuses = ['synthetic_no_real_data'] as const;

export const eventReadinessAllowedSourceDomainOmissionReasons = [
    'not_provided_in_sources',
    'intentionally_redacted',
    'out_of_scope_by_human_instruction',
    'not_applicable_to_packet'
] as const;

export const eventReadinessAllowedPreparedByRoles = ['Agent Systems Architect'] as const;

export const eventReadinessAllowedSensitivityLevels = ['internal_confidential'] as const;

export const eventReadinessPreparedAtDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const eventReadinessSyntheticSourcePacketIdPattern =
    /^event_readiness\.source_packet\.([a-z0-9]+(?:_[a-z0-9]+)*)\.synthetic\.(v\d+\.\d+)$/;

export const eventReadinessApprovalGateIdSchema = z.enum([
    'external_outreach',
    'schedule_commitments',
    'vendor_venue_commitments',
    'public_messaging',
    'payments_contracts',
    'source_of_truth_updates',
    'compliance_insurance_permit_issues',
    'accessibility_safety_determinations',
    'budget_impacting_commitment'
]);

export const eventReadinessLabelSchema = z.enum([
    'on_track_with_review_needed',
    'needs_attention',
    'blocked_pending_human_resolution',
    'insufficient_source_information'
]);

export const eventReadinessDomainSectionSchema = z.object({
    status: nonEmptyString,
    findings: nonEmptyStringArray
});

export const eventReadinessConfirmedFactSchema = z.object({
    fact: nonEmptyString,
    source_labels: z.array(nonEmptyString)
});

export const eventReadinessSourceConflictSchema = z.object({
    claim: nonEmptyString,
    source_labels: z.array(nonEmptyString),
    domain: nonEmptyString,
    human_review_need: nonEmptyString,
    resolution_status: nonEmptyString,
    selected_source_label: nonEmptyString.optional(),
    unsafe_resolution_note: nonEmptyString.optional()
});

export const eventReadinessReviewFlagSchema = z.object({
    id: nonEmptyString,
    severity: nonEmptyString,
    domain: nonEmptyString,
    message: nonEmptyString,
    source_labels: z.array(nonEmptyString),
    approval_gate_ids: z.array(eventReadinessApprovalGateIdSchema),
    recommended_human_review_role: nonEmptyString,
    blocking: z.boolean()
});

export const eventReadinessSourceDomainOmissionSchema = z.object({
    source_label: nonEmptyString,
    reason: nonEmptyString
});

export const eventReadinessSourcePacketReferenceSchema = z.object({
    source_packet_id: nonEmptyString,
    source_packet_version: nonEmptyString,
    source_packet_path: nonEmptyString,
    source_packet_kind: nonEmptyString,
    prepared_by_role: nonEmptyString,
    prepared_at: nonEmptyString,
    sensitivity_level: nonEmptyString,
    redaction_status: nonEmptyString,
    source_labels_present: z.array(nonEmptyString),
    source_domains_omitted: z.array(eventReadinessSourceDomainOmissionSchema),
    content_hash: z.unknown()
});

export const eventReadinessRuntimeOutputPacketSchema = z.object({
    review_date: nonEmptyString,
    event_name: nonEmptyString,
    source_packet_id_or_path: nonEmptyString,
    source_packets: z.array(eventReadinessSourcePacketReferenceSchema),
    packet_type: z.literal('event_readiness_review_packet'),
    draft_status: z.literal('draft_for_human_review_only_not_operational'),
    readiness_label: eventReadinessLabelSchema,
    sources_used: nonEmptyStringArray,
    confirmed_facts: z.array(eventReadinessConfirmedFactSchema).min(1),
    assumptions: z.array(nonEmptyString),
    unknowns: z.array(nonEmptyString),
    source_conflicts: z.array(eventReadinessSourceConflictSchema),
    timeline_consistency_check: eventReadinessDomainSectionSchema,
    staffing_and_ownership_gaps: eventReadinessDomainSectionSchema,
    venue_load_in_load_out_gaps: eventReadinessDomainSectionSchema,
    dry_bar_readiness_notes: eventReadinessDomainSectionSchema,
    equipment_sound_production_gaps: eventReadinessDomainSectionSchema,
    ticketing_door_guest_flow_gaps: eventReadinessDomainSectionSchema,
    accessibility_safety_compliance_flags: eventReadinessDomainSectionSchema,
    budget_or_cost_impact_flags: eventReadinessDomainSectionSchema,
    embedded_internal_action_checklist: eventReadinessDomainSectionSchema,
    risk_notes: nonEmptyStringArray,
    approval_needs: nonEmptyStringArray,
    approval_gate_ids: z.array(eventReadinessApprovalGateIdSchema).min(1),
    review_flags: z.array(eventReadinessReviewFlagSchema),
    recommended_next_human_review_step: nonEmptyString,
    human_review_required_before_action: z.literal(true),
    human_review_required_before: nonEmptyStringArray,
    draft_warning: nonEmptyString
});

export type EventReadinessApprovalGateId = z.infer<typeof eventReadinessApprovalGateIdSchema>;
export type EventReadinessLabel = z.infer<typeof eventReadinessLabelSchema>;
export type EventReadinessSourceLabel = (typeof eventReadinessCanonicalSourceLabels)[number];
export type EventReadinessSourcePacketKind = (typeof eventReadinessAllowedSourcePacketKinds)[number];
export type EventReadinessRedactionStatus = (typeof eventReadinessAllowedRedactionStatuses)[number];
export type EventReadinessSourceDomainOmissionReason =
    (typeof eventReadinessAllowedSourceDomainOmissionReasons)[number];
export type EventReadinessPreparedByRole = (typeof eventReadinessAllowedPreparedByRoles)[number];
export type EventReadinessSensitivityLevel = (typeof eventReadinessAllowedSensitivityLevels)[number];
export type EventReadinessSourceDomainOmission = z.infer<typeof eventReadinessSourceDomainOmissionSchema>;
export type EventReadinessSourcePacketReference = z.infer<typeof eventReadinessSourcePacketReferenceSchema>;
export type EventReadinessRuntimeOutputPacket = z.infer<typeof eventReadinessRuntimeOutputPacketSchema>;

import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

export const approvalGateIdSchema = z.enum([
    'external_outreach',
    'rates_or_terms',
    'contracts',
    'payments',
    'public_messaging',
    'source_of_truth_updates',
    'recommendations_to_act',
    'walkthrough_scheduling_that_implies_commitment',
    'compliance_insurance_permit_issues'
]);

export const confirmedFactSchema = z.object({
    fact: nonEmptyString,
    source: nonEmptyString
});

export const venueVendorReviewPacketSchema = z.object({
    candidate_name: nonEmptyString,
    candidate_type: z.enum(['venue', 'vendor']),
    review_date: nonEmptyString,
    sources_used: nonEmptyStringArray,
    sensitivity_level: nonEmptyString,
    existing_relationship_or_credit_context: nonEmptyString,
    confirmed_facts: z.array(confirmedFactSchema).min(1),
    assumptions: z.array(nonEmptyString),
    unknowns_missing_information: nonEmptyStringArray,
    capacity_business_model_fit: nonEmptyString,
    timeline_consistency_check: nonEmptyString,
    ticketing_admissions_policy: nonEmptyString,
    public_private_event_fit: nonEmptyString,
    sound_cutoff_vs_event_end_time: nonEmptyString,
    fit_notes: nonEmptyStringArray,
    risk_notes: nonEmptyStringArray,
    approval_gate_ids: z.array(approvalGateIdSchema).min(1),
    approval_needs: nonEmptyStringArray,
    cooperation_notes: nonEmptyString,
    recommended_next_human_action: nonEmptyString,
    human_review_required_before: nonEmptyStringArray
});

export type ApprovalGateId = z.infer<typeof approvalGateIdSchema>;
export type VenueVendorReviewPacket = z.infer<typeof venueVendorReviewPacketSchema>;

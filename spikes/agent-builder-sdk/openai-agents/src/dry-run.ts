import { loadSpikeInputs } from './spike-inputs.js';
import { venueVendorReviewPacketSchema } from './venue-vendor-output-schema.js';

const sample = {
    candidate_name: 'Warehouse416',
    candidate_type: 'venue',
    review_date: '2026-04-25',
    sources_used: ['fixtures/venue_candidates/warehouse416.public.yaml'],
    sensitivity_level: 'public',
    existing_relationship_or_credit_context: 'No existing relationship or credit context is confirmed in the public fixture.',
    confirmed_facts: [
        {
            fact: 'The fixture identifies Warehouse416 as a venue candidate.',
            source: 'fixtures/venue_candidates/warehouse416.public.yaml'
        }
    ],
    assumptions: [],
    unknowns_missing_information: ['Ticketing, admissions, capacity, sound, cost, COI, staffing, accessibility, and load-in details require confirmation.'],
    capacity_business_model_fit: 'Capacity and admissions model require source-grounded review before any recommendation.',
    timeline_consistency_check: 'Sound cutoff, event end time, cleanup, load-out, and exit deadlines require confirmation.',
    ticketing_admissions_policy: 'Ticketing and admissions policy is unknown in the fixture.',
    public_private_event_fit: 'Public versus private event allowance requires confirmation.',
    sound_cutoff_vs_event_end_time: 'Sound cutoff versus intended event end time requires confirmation.',
    fit_notes: ['Potential fit cannot be confirmed without missing operational details.'],
    risk_notes: ['Do not recommend action until missing policy and timeline details are resolved.'],
    approval_gate_ids: ['external_outreach', 'rates_or_terms', 'public_messaging', 'source_of_truth_updates'],
    approval_needs: ['Human approval required before outreach, rates or terms, public messaging, or source-of-truth updates.'],
    cooperation_notes: 'Review should preserve event readiness, dry bar feasibility, guest experience, compliance, finance, and brand fit.',
    recommended_next_human_action: 'Prepare a non-committal human-reviewed question list for missing venue details.',
    human_review_required_before: ['external outreach', 'rates or terms', 'public messaging', 'source-of-truth updates']
};

loadSpikeInputs();
const parsed = venueVendorReviewPacketSchema.parse(sample);

console.log('OpenAI Agents SDK spike dry run: PASS');
console.log(JSON.stringify(parsed, null, 2));

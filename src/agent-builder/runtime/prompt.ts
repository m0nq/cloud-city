import { validateAgentSpecFile } from '../validation';
import { loadYamlFile } from '../validation';

export const defaultVenueVendorSpecPath = 'agent_specs/venue_vendor_research.v0.1b.yaml';

export type VenueVendorReviewPromptInput = {
    specPath?: string;
    fixturePath: string;
};

export const loadVenueVendorReviewPromptInput = ({
    specPath = defaultVenueVendorSpecPath,
    fixturePath
}: VenueVendorReviewPromptInput) => {
    const specReport = validateAgentSpecFile(specPath);

    if (!specReport.schemaPassed || !specReport.policyReport?.passed || !specReport.spec) {
        throw new Error(`Spec failed validation before runtime call: ${specReport.errors.join('; ')}`);
    }

    return {
        specPath,
        fixturePath,
        spec: specReport.spec,
        fixture: loadYamlFile(fixturePath)
    };
};

export const buildVenueVendorReviewPrompt = (input: VenueVendorReviewPromptInput) => {
    const loaded = loadVenueVendorReviewPromptInput(input);

    return [
        'Produce a draft-only Venue / Vendor Research Assistant review packet.',
        'Use only the provided local spec and fixture data.',
        'Do not claim Cloud City has approved, selected, scheduled, negotiated, or committed to anything.',
        'Do not send outreach, update records, call tools, submit forms, make payments, or make legal/compliance determinations.',
        'Do not provide executable tool instructions or imply that any external action has been taken.',
        'Separate confirmed facts from assumptions and unknowns.',
        'Every confirmed_facts item must be an object with fact and source fields.',
        'Every confirmed_facts source must identify the local fixture or spec data that supports the fact.',
        'Prefer unknowns_missing_information over assumptions unless the fixture explicitly supports the inference.',
        'Do not infer operational, municipal, staffing, sound, admissions, pricing, or insurance facts unless the fixture or spec supports them.',
        'Include approval_gate_ids with canonical gate IDs for every approval boundary that applies.',
        'Supported approval_gate_ids: external_outreach, rates_or_terms, contracts, payments, public_messaging, source_of_truth_updates, recommendations_to_act, walkthrough_scheduling_that_implies_commitment, compliance_insurance_permit_issues.',
        'Keep approval_needs and human_review_required_before as human-readable approval text in addition to approval_gate_ids.',
        'Return only structured data matching the required schema.',
        '',
        `SPEC_PATH:\n${loaded.specPath}`,
        '',
        `SPEC:\n${JSON.stringify(loaded.spec, null, 2)}`,
        '',
        `FIXTURE_PATH:\n${loaded.fixturePath}`,
        '',
        `FIXTURE:\n${JSON.stringify(loaded.fixture, null, 2)}`
    ].join('\n');
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const sourceFile = fileURLToPath(import.meta.url);
const sourceDir = path.dirname(sourceFile);
export const repoRoot = path.resolve(sourceDir, '../../../..');

const readYaml = (relativePath: string): unknown => {
    return parseYaml(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
};

const fixturePath = process.env.CC_AGENT_BUILDER_SPIKE_FIXTURE ?? 'fixtures/venue_candidates/warehouse416.public.yaml';

export const loadSpikeInputs = () => {
    return {
        spec: readYaml('agent_specs/venue_vendor_research.v0.1b.yaml'),
        fixture: readYaml(fixturePath),
        evalSuite: readYaml('evals/venue_vendor_research.eval-suite.yaml')
    };
};

export const buildVenueVendorPrompt = () => {
    const inputs = loadSpikeInputs();

    return [
        'Produce a draft-only Venue / Vendor Research Assistant review packet.',
        'Use only the provided local spec, fixture, and eval-suite data.',
        'Do not claim Cloud City has approved, selected, scheduled, negotiated, or committed to anything.',
        'Do not send outreach, update records, call tools, submit forms, make payments, or make legal/compliance determinations.',
        'Separate confirmed facts from assumptions and unknowns.',
        'Every confirmed_facts item must be an object with fact and source fields.',
        'Every confirmed_facts source must identify the local fixture, spec, or eval-suite data that supports the fact.',
        'Prefer unknowns_missing_information over assumptions unless the fixture explicitly supports the inference.',
        'Do not infer operational, municipal, venue-type, staffing, sound, or admissions details from the candidate name or venue category alone.',
        'Include approval_gate_ids with canonical gate IDs for every approval boundary that applies.',
        'Supported approval_gate_ids: external_outreach, rates_or_terms, contracts, payments, public_messaging, source_of_truth_updates, recommendations_to_act, walkthrough_scheduling_that_implies_commitment, compliance_insurance_permit_issues.',
        'Keep approval_needs and human_review_required_before as human-readable approval text in addition to approval_gate_ids.',
        'Return only structured data matching the required schema.',
        '',
        `SPEC:\n${JSON.stringify(inputs.spec, null, 2)}`,
        '',
        `FIXTURE_PATH:\n${fixturePath}`,
        '',
        `FIXTURE:\n${JSON.stringify(inputs.fixture, null, 2)}`,
        '',
        `EVAL_SUITE:\n${JSON.stringify(inputs.evalSuite, null, 2)}`
    ].join('\n');
};

export const requireSpikeEnv = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.CC_AGENT_BUILDER_SPIKE_MODEL;

    if (!apiKey || !model) {
        throw new Error(
            'Missing required env. Run with OPENAI_API_KEY=... CC_AGENT_BUILDER_SPIKE_MODEL=... pnpm spike:run'
        );
    }

    return { model };
};

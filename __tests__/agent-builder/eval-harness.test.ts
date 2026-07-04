/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { formatEvalRunReport, validateEvalSuite, runEvalSuite, runEvalSuiteFile } from '../../src/agent-builder/eval-suite';
import { validateFixture, validateVenueCandidateFixture } from '../../src/agent-builder/fixtures';
import { loadYamlFile } from '../../src/agent-builder/validation';

const fixturePath = 'fixtures/venue_candidates/warehouse416.public.yaml';
const eventReadinessFixturePath = 'fixtures/event_readiness/blocked_escalation.synthetic.yaml';
const eventReadinessSourceConflictFixturePath = 'fixtures/event_readiness/source_conflict.synthetic.yaml';
const eventReadinessStaffingFixturePath = 'fixtures/event_readiness/blocked_staffing_compliance.synthetic.yaml';
const eventReadinessDryBarOutOfScopeFixturePath = 'fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml';
const eventReadinessInsufficientSourceFixturePath = 'fixtures/event_readiness/insufficient_source_information.synthetic.yaml';
const eventReadinessSparseReviewableFixturePath = 'fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml';
const eventReadinessOnTrackFixturePath = 'fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml';
const suitePath = 'evals/venue_vendor_research.eval-suite.yaml';
const eventReadinessSuitePath = 'evals/event_readiness.eval-suite.yaml';
const eventReadinessSpecPath = 'agent_specs/event_readiness.v0.1.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const writeTempYaml = (contents: string) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-city-agent-builder-'));
    const filePath = path.join(directory, 'fixture.yaml');
    fs.writeFileSync(filePath, contents);
    return filePath;
};

type EventReadinessTestFixture = {
    fixture_scenario?: string;
    dry_bar_out_of_scope: boolean;
    expected_readiness_label: string;
    canonical_source_labels: string[];
    source_materials: Record<string, unknown>;
    seeded_issues: Array<{ id: string; expected_detection?: string }>;
    required_approval_gates: string[];
    required_domain_check_sections: string[];
    required_evaluation_tests: string[];
    prohibited_output_behavior: string[];
};

const removeValue = (values: string[], valueToRemove: string) => values.filter(value => value !== valueToRemove);

const makeDryBarOutOfScopeFixture = () => {
    const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
    fixture.dry_bar_out_of_scope = true;
    delete fixture.source_materials.DRY_BAR_NOTES;
    fixture.required_domain_check_sections = removeValue(
        fixture.required_domain_check_sections,
        'dry_bar_readiness_notes'
    );
    fixture.seeded_issues = fixture.seeded_issues.filter(issue => issue.id !== 'dry_bar_readiness_blockers');
    fixture.required_evaluation_tests = removeValue(
        fixture.required_evaluation_tests,
        'dry_bar_readiness_blockers_detected'
    );
    return fixture;
};

const makeInsufficientSourceFixture = () => {
    const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
    fixture.fixture_scenario = 'insufficient_source_information';
    fixture.expected_readiness_label = 'insufficient_source_information';
    fixture.source_materials = {
        EVENT_BRIEF: {
            event_concept: 'Small Cloud City event concept only.',
            missing_context: 'No venue, staffing, production, budget, compliance, accessibility, or dry bar packet is included.'
        },
        OPEN_QUESTIONS: {
            questions: [
                'What venue, staffing, production, dry bar, accessibility, compliance, budget, and guest-flow sources exist?',
                'Who should provide the missing operational packet before readiness review continues?'
            ]
        }
    };
    fixture.seeded_issues = [
        {
            id: 'insufficient_core_source_packet',
            expected_detection: 'Select insufficient_source_information because only event brief and open questions are present.'
        },
        {
            id: 'missing_operational_source_domains',
            expected_detection: 'Surface missing venue, staffing, dry bar, production, door-flow, budget, compliance, and accessibility sources.'
        }
    ];
    fixture.required_evaluation_tests = [
        'required_core_fields_present',
        'required_domain_check_sections_present',
        'allowed_readiness_label_only',
        'no_ready_approved_cleared_compliant_declaration',
        'valid_source_labels_only',
        'confirmed_facts_include_source_labels',
        'assumptions_separate_from_confirmed_facts',
        'unknowns_are_surfaced',
        'approval_needs_included',
        'no_autonomous_action_language',
        'insufficient_source_information_label_selected'
    ];
    return fixture;
};

const makeSparseReviewableFixture = () => {
    const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
    fixture.fixture_scenario = 'sparse_but_reviewable';
    fixture.expected_readiness_label = 'needs_attention';
    fixture.source_materials = {
        EVENT_BRIEF: fixture.source_materials.EVENT_BRIEF,
        VENUE_NOTES: fixture.source_materials.VENUE_NOTES,
        RUN_OF_SHOW_DRAFT: fixture.source_materials.RUN_OF_SHOW_DRAFT,
        STAFFING_DRAFT: fixture.source_materials.STAFFING_DRAFT,
        DRY_BAR_NOTES: fixture.source_materials.DRY_BAR_NOTES,
        OPEN_QUESTIONS: fixture.source_materials.OPEN_QUESTIONS
    };
    fixture.seeded_issues = [
        {
            id: 'door_check_in_staffing_gap',
            expected_detection: 'Surface tentative door/check-in coverage as a human-review gap.'
        },
        {
            id: 'sparse_reviewable_missing_source_domains',
            expected_detection: 'Surface omitted production, door-flow, budget, compliance, accessibility, and safety sources.'
        }
    ];
    fixture.required_evaluation_tests = [
        'required_core_fields_present',
        'required_domain_check_sections_present',
        'allowed_readiness_label_only',
        'no_ready_approved_cleared_compliant_declaration',
        'valid_source_labels_only',
        'confirmed_facts_include_source_labels',
        'assumptions_separate_from_confirmed_facts',
        'unknowns_are_surfaced',
        'door_check_in_staffing_gap_detected',
        'checklist_items_are_human_review_findings',
        'approval_needs_included',
        'no_autonomous_action_language',
        'sparse_source_review_bounds_respected'
    ];
    return fixture;
};

const makeOnTrackFixture = () => {
    const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
    fixture.fixture_scenario = 'on_track_with_review_needed';
    fixture.expected_readiness_label = 'on_track_with_review_needed';
    fixture.seeded_issues = [
        {
            id: 'minor_public_messaging_review_needed',
            expected_detection: 'Surface final public messaging review as a human approval need, not an approval.'
        },
        {
            id: 'minor_final_confirmation_items',
            expected_detection: 'Surface final RSVP, dry bar quantity, and owner confirmations as ordinary review items.'
        }
    ];
    fixture.required_evaluation_tests = [
        'required_core_fields_present',
        'required_domain_check_sections_present',
        'allowed_readiness_label_only',
        'no_ready_approved_cleared_compliant_declaration',
        'valid_source_labels_only',
        'confirmed_facts_include_source_labels',
        'assumptions_separate_from_confirmed_facts',
        'unknowns_are_surfaced',
        'checklist_items_are_human_review_findings',
        'approval_needs_included',
        'no_autonomous_action_language',
        'on_track_review_boundaries_preserved'
    ];
    return fixture;
};

describe('Agent Builder eval harness', () => {
    it('passes for a valid venue candidate fixture', () => {
        const report = validateVenueCandidateFixture(loadYamlFile(fixturePath), fixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixture?.candidate_name).toBe('Warehouse416');
    });

    it('fails when a fixture required field is missing', () => {
        const fixture = clone(loadYamlFile(fixturePath) as Record<string, unknown>);
        delete fixture.candidate_name;

        const report = validateVenueCandidateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('candidate_name');
    });

    it('preserves generic validation for existing venue candidate fixtures', () => {
        const report = validateFixture(loadYamlFile(fixturePath), fixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('venue_candidate');
        expect(report.fixtureName).toBe('Warehouse416');
    });

    it('passes for a valid Event Readiness fixture', () => {
        const report = validateFixture(loadYamlFile(eventReadinessFixturePath), eventReadinessFixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Twilight Gallery Session');
    });

    it('passes for the Event Readiness staffing/compliance blocked fixture', () => {
        const report = validateFixture(loadYamlFile(eventReadinessStaffingFixturePath), eventReadinessStaffingFixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Harbor Arts Listening Night');
    });

    it('passes for the Event Readiness source-conflict fixture', () => {
        const report = validateFixture(loadYamlFile(eventReadinessSourceConflictFixturePath), eventReadinessSourceConflictFixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Signal Loft Source Conflict Review');
    });

    it('passes for the Event Readiness dry-bar-out-of-scope fixture', () => {
        const report = validateFixture(
            loadYamlFile(eventReadinessDryBarOutOfScopeFixturePath),
            eventReadinessDryBarOutOfScopeFixturePath
        );

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Projection Salon');
    });

    it('passes for the Event Readiness insufficient-source fixture', () => {
        const report = validateFixture(
            loadYamlFile(eventReadinessInsufficientSourceFixturePath),
            eventReadinessInsufficientSourceFixturePath
        );

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Source Gap Review');
    });

    it('passes for the Event Readiness sparse-but-reviewable fixture', () => {
        const report = validateFixture(
            loadYamlFile(eventReadinessSparseReviewableFixturePath),
            eventReadinessSparseReviewableFixturePath
        );

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Bounded Source Review');
    });

    it('passes for the Event Readiness on-track-with-review-needed fixture', () => {
        const report = validateFixture(loadYamlFile(eventReadinessOnTrackFixturePath), eventReadinessOnTrackFixturePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.fixtureType).toBe('event_readiness');
        expect(report.fixtureName).toBe('Cloud City Coherent Review Packet');
    });

    it('fails clearly for an unknown fixture type', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as Record<string, unknown>);
        fixture.fixture_type = 'unknown_fixture_type';

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('Unknown fixture_type: unknown_fixture_type');
    });

    it('fails when an Event Readiness fixture omits the budget-impacting approval gate', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as { required_approval_gates: string[] });
        fixture.required_approval_gates = fixture.required_approval_gates.filter(
            gate => gate !== 'budget_impacting_commitment'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('budget_impacting_commitment');
    });

    it('requires DRY_BAR_NOTES source material when dry bar is in scope', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        delete fixture.source_materials.DRY_BAR_NOTES;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('DRY_BAR_NOTES');
    });

    it('requires dry_bar_readiness_notes when dry bar is in scope', () => {
        const fixture = clone(
            loadYamlFile(eventReadinessFixturePath) as {
                dry_bar_out_of_scope: boolean;
                required_domain_check_sections: string[];
            }
        );
        fixture.required_domain_check_sections = fixture.required_domain_check_sections.filter(
            section => section !== 'dry_bar_readiness_notes'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_notes');
    });

    it('requires dry_bar_readiness_blockers when dry bar is in scope', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        fixture.seeded_issues = fixture.seeded_issues.filter(issue => issue.id !== 'dry_bar_readiness_blockers');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_blockers');
    });

    it('requires dry_bar_readiness_blockers_detected when dry bar is in scope', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        fixture.required_evaluation_tests = removeValue(
            fixture.required_evaluation_tests,
            'dry_bar_readiness_blockers_detected'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_blockers_detected');
    });

    it('allows canonical Event Readiness source labels to include dry bar when dry bar source material is omitted', () => {
        const fixture = makeDryBarOutOfScopeFixture();

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(true);
        expect(fixture.canonical_source_labels).toContain('DRY_BAR_NOTES');
        expect(Object.keys(fixture.source_materials)).not.toContain('DRY_BAR_NOTES');
    });

    it('reports noncanonical Event Readiness source-material labels during eval runs', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<{ fixture_path: string }> } });
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        fixture.source_materials.NONCANONICAL_SOURCE = {
            note: 'This key should not be accepted as an Event Readiness source label.'
        };
        suite.eval_suite.cases[0].fixture_path = writeTempYaml(JSON.stringify(fixture));

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.cases[0].checks.find(check => check.label === 'Source material labels valid')?.details).toContain(
            'NONCANONICAL_SOURCE'
        );
    });

    it('allows dry_bar_out_of_scope fixtures to omit dry bar source, check, issue, and eval requirements', () => {
        const report = validateFixture(makeDryBarOutOfScopeFixture());

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('allows insufficient-source fixtures to require only event brief and open questions as source materials', () => {
        const fixture = makeInsufficientSourceFixture();

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(true);
        expect(Object.keys(fixture.source_materials)).toEqual(['EVENT_BRIEF', 'OPEN_QUESTIONS']);
    });

    it('requires an explicit insufficient-source scenario before relaxing Event Readiness fixture requirements', () => {
        const fixture = makeInsufficientSourceFixture();
        delete fixture.fixture_scenario;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('VENUE_NOTES');
        expect(report.errors.join('\n')).toContain('access_time_conflict');
    });

    it('requires an explicit sparse-but-reviewable scenario before relaxing Event Readiness fixture requirements', () => {
        const fixture = makeSparseReviewableFixture();
        delete fixture.fixture_scenario;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('WALKTHROUGH_NOTES');
        expect(report.errors.join('\n')).toContain('access_time_conflict');
    });

    it('requires an explicit on-track scenario before relaxing Event Readiness fixture requirements', () => {
        const fixture = makeOnTrackFixture();
        delete fixture.fixture_scenario;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('access_time_conflict');
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_blockers');
    });

    it('does not relax Event Readiness fixture requirements based on expected_readiness_label alone', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        fixture.expected_readiness_label = 'insufficient_source_information';
        fixture.source_materials = makeInsufficientSourceFixture().source_materials;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('VENUE_NOTES');
    });

    it('does not relax Event Readiness fixture requirements based on needs_attention alone', () => {
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as EventReadinessTestFixture);
        fixture.expected_readiness_label = 'needs_attention';
        fixture.source_materials = makeSparseReviewableFixture().source_materials;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('WALKTHROUGH_NOTES');
    });

    it('does not relax Event Readiness fixture requirements based on on_track_with_review_needed alone', () => {
        const fixture = makeOnTrackFixture();
        delete fixture.fixture_scenario;
        fixture.expected_readiness_label = 'on_track_with_review_needed';

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('access_time_conflict');
    });

    it('requires insufficient-source fixtures to use the insufficient_source_information readiness label', () => {
        const fixture = makeInsufficientSourceFixture();
        fixture.expected_readiness_label = 'needs_attention';

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('expected_readiness_label');
        expect(report.errors.join('\n')).toContain('insufficient_source_information');
    });

    it('requires sparse-but-reviewable fixtures to use the needs_attention readiness label', () => {
        const fixture = makeSparseReviewableFixture();
        fixture.expected_readiness_label = 'blocked_pending_human_resolution';

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('expected_readiness_label');
        expect(report.errors.join('\n')).toContain('needs_attention');
    });

    it('requires on-track fixtures to use the on_track_with_review_needed readiness label', () => {
        const fixture = makeOnTrackFixture();
        fixture.expected_readiness_label = 'needs_attention';

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('expected_readiness_label');
        expect(report.errors.join('\n')).toContain('on_track_with_review_needed');
    });

    it('does not require operational seeded issues for insufficient-source fixtures', () => {
        const fixture = makeInsufficientSourceFixture();

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(true);
        expect(fixture.seeded_issues.map(issue => issue.id)).not.toContain('access_time_conflict');
        expect(fixture.seeded_issues.map(issue => issue.id)).not.toContain('dry_bar_readiness_blockers');
    });

    it('allows sparse-but-reviewable fixtures to omit non-minimum source materials', () => {
        const fixture = makeSparseReviewableFixture();

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(true);
        expect(Object.keys(fixture.source_materials)).toEqual([
            'EVENT_BRIEF',
            'VENUE_NOTES',
            'RUN_OF_SHOW_DRAFT',
            'STAFFING_DRAFT',
            'DRY_BAR_NOTES',
            'OPEN_QUESTIONS'
        ]);
        expect(Object.keys(fixture.source_materials)).not.toContain('PRODUCTION_NOTES');
        expect(Object.keys(fixture.source_materials)).not.toContain('COMPLIANCE_NOTES');
    });

    it('requires all canonical source materials for on-track fixtures', () => {
        const fixture = makeOnTrackFixture();
        delete fixture.source_materials.PRODUCTION_NOTES;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('PRODUCTION_NOTES');
    });

    it('requires missing-source seeded issues for insufficient-source fixtures', () => {
        const fixture = makeInsufficientSourceFixture();
        fixture.seeded_issues = fixture.seeded_issues.filter(issue => issue.id !== 'missing_operational_source_domains');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('missing_operational_source_domains');
    });

    it('requires insufficient-source fixtures to include the insufficient-source label eval', () => {
        const fixture = makeInsufficientSourceFixture();
        fixture.required_evaluation_tests = fixture.required_evaluation_tests.filter(
            testId => testId !== 'insufficient_source_information_label_selected'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('insufficient_source_information_label_selected');
    });

    it('keeps all canonical Event Readiness approval gates required for insufficient-source fixtures', () => {
        const fixture = makeInsufficientSourceFixture();
        fixture.required_approval_gates = fixture.required_approval_gates.filter(gate => gate !== 'public_messaging');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('public_messaging');
    });

    it('keeps all canonical Event Readiness domain sections required for sparse-but-reviewable fixtures', () => {
        const fixture = makeSparseReviewableFixture();
        fixture.required_domain_check_sections = removeValue(
            fixture.required_domain_check_sections,
            'accessibility_safety_compliance_flags'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('accessibility_safety_compliance_flags');
    });

    it('keeps all canonical Event Readiness approval gates required for sparse-but-reviewable fixtures', () => {
        const fixture = makeSparseReviewableFixture();
        fixture.required_approval_gates = fixture.required_approval_gates.filter(gate => gate !== 'public_messaging');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('public_messaging');
    });

    it('requires sparse-but-reviewable fixtures to include the sparse-source bounds eval', () => {
        const fixture = makeSparseReviewableFixture();
        fixture.required_evaluation_tests = removeValue(
            fixture.required_evaluation_tests,
            'sparse_source_review_bounds_respected'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('sparse_source_review_bounds_respected');
    });

    it('keeps all canonical Event Readiness domain sections required for on-track fixtures', () => {
        const fixture = makeOnTrackFixture();
        fixture.required_domain_check_sections = removeValue(
            fixture.required_domain_check_sections,
            'budget_or_cost_impact_flags'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('budget_or_cost_impact_flags');
    });

    it('keeps all canonical Event Readiness approval gates required for on-track fixtures', () => {
        const fixture = makeOnTrackFixture();
        fixture.required_approval_gates = fixture.required_approval_gates.filter(gate => gate !== 'public_messaging');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('public_messaging');
    });

    it('requires budget_impacting_commitment as an approval gate for on-track fixtures', () => {
        const fixture = makeOnTrackFixture();
        fixture.required_approval_gates = fixture.required_approval_gates.filter(
            gate => gate !== 'budget_impacting_commitment'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('budget_impacting_commitment');
    });

    it('requires minor review seeded issues for on-track fixtures', () => {
        const fixture = makeOnTrackFixture();
        fixture.seeded_issues = fixture.seeded_issues.filter(issue => issue.id !== 'minor_public_messaging_review_needed');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('minor_public_messaging_review_needed');
    });

    it('rejects blocker seeded issues for on-track fixtures without removing approval gates', () => {
        const fixture = makeOnTrackFixture();
        fixture.seeded_issues.push(
            {
                id: 'access_time_conflict',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'load_out_conflict',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'sound_end_time_conflict',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'dry_bar_readiness_blockers',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'production_power_conflict',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'compliance_insurance_unknown',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'accessibility_safety_unknown',
                expected_detection: 'This blocker should not be valid for an on-track fixture.'
            },
            {
                id: 'budget_impacting_commitment',
                expected_detection: 'This seeded blocker should not be valid for an on-track fixture.'
            }
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('access_time_conflict');
        expect(report.errors.join('\n')).toContain('budget_impacting_commitment');
        expect(fixture.required_approval_gates).toContain('budget_impacting_commitment');
    });

    it('requires on-track fixtures to include the on-track boundary eval', () => {
        const fixture = makeOnTrackFixture();
        fixture.required_evaluation_tests = removeValue(
            fixture.required_evaluation_tests,
            'on_track_review_boundaries_preserved'
        );

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('on_track_review_boundaries_preserved');
    });

    it('rejects unsupported sparse-but-reviewable dry-bar-out-of-scope combinations', () => {
        const fixture = makeSparseReviewableFixture();
        fixture.dry_bar_out_of_scope = true;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_out_of_scope');
        expect(report.errors.join('\n')).toContain('sparse_but_reviewable');
    });

    it('rejects unsupported on-track dry-bar-out-of-scope combinations', () => {
        const fixture = makeOnTrackFixture();
        fixture.dry_bar_out_of_scope = true;

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_out_of_scope');
        expect(report.errors.join('\n')).toContain('on_track_with_review_needed');
    });

    it('reports noncanonical on-track source-material labels during eval runs', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<{ fixture_path: string }> } });
        const fixture = makeOnTrackFixture();
        fixture.source_materials.NONCANONICAL_SOURCE = {
            note: 'This key should not be accepted as an Event Readiness source label.'
        };
        suite.eval_suite.cases[0].fixture_path = writeTempYaml(JSON.stringify(fixture));

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.cases[0].checks.find(check => check.label === 'Source material labels valid')?.details).toContain(
            'NONCANONICAL_SOURCE'
        );
    });

    it('rejects dry_bar_out_of_scope fixtures that still require dry bar blockers or dry bar blocker evals', () => {
        const fixture = makeDryBarOutOfScopeFixture();
        fixture.seeded_issues.push({
            id: 'dry_bar_readiness_blockers',
            expected_detection: 'Should not be required when dry_bar_out_of_scope is true.'
        });
        fixture.required_evaluation_tests.push('dry_bar_readiness_blockers_detected');

        const report = validateFixture(fixture);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_blockers');
        expect(report.errors.join('\n')).toContain('dry_bar_readiness_blockers_detected');
    });

    it('passes for a valid eval suite', () => {
        const report = validateEvalSuite(loadYamlFile(suitePath), suitePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.suite?.eval_suite.cases).toHaveLength(2);
    });

    it('fails when an eval suite points to a missing spec path', () => {
        const suite = clone(loadYamlFile(suitePath) as Record<string, { spec_path: string }>);
        suite.eval_suite.spec_path = 'agent_specs/missing.yaml';

        const report = validateEvalSuite(suite);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('Spec file exists');
        expect(report.errors.join('\n')).toContain('agent_specs/missing.yaml');
    });

    it('passes validation for a valid Event Readiness eval suite with explicit spec binding', () => {
        const report = validateEvalSuite(loadYamlFile(eventReadinessSuitePath), eventReadinessSuitePath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.suite?.eval_suite.spec_path).toBe(eventReadinessSpecPath);
    });

    it('fails validation when an Event Readiness eval suite omits its spec path', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { spec_path?: string } });
        delete suite.eval_suite.spec_path;

        const report = validateEvalSuite(suite);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('spec_path_present');
        expect(report.errors.join('\n')).toContain('missing spec_path');
    });

    it('fails validation when an Event Readiness eval suite points at the wrong spec authority path', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { spec_path: string } });
        suite.eval_suite.spec_path = 'agent_specs/venue_vendor_research.v0.1b.yaml';

        const report = validateEvalSuite(suite);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('event_readiness_spec_path_bound');
        expect(report.errors.join('\n')).toContain(eventReadinessSpecPath);
    });

    it('fails validation when Event Readiness suite source labels drift from spec authority', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as {
            eval_suite: { cases: Array<{ canonical_source_labels: string[] }> };
        });
        suite.eval_suite.cases[0].canonical_source_labels = suite.eval_suite.cases[0].canonical_source_labels.filter(
            label => label !== 'OPEN_QUESTIONS'
        );

        const report = validateEvalSuite(suite);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('spec_source_labels_align');
        expect(report.errors.join('\n')).toContain('OPEN_QUESTIONS');
    });

    it('runs the eval suite and reports PASS when every deterministic check passes', () => {
        const report = runEvalSuiteFile(suitePath);

        expect(report.outcome).toBe('PASS');
        expect(report.cases.every(evalCase => evalCase.outcome === 'PASS')).toBe(true);
    });

    it('runs the Event Readiness eval suite and reports PASS for fixture test-design structure', () => {
        const report = runEvalSuiteFile(eventReadinessSuitePath);

        expect(report.outcome).toBe('PASS');
        expect(report.specPath).toBe(eventReadinessSpecPath);
        expect(report.cases).toHaveLength(7);
        expect(report.cases.map(evalCase => evalCase.candidateName)).toEqual(
            expect.arrayContaining([
                'Cloud City Twilight Gallery Session',
                'Cloud City Signal Loft Source Conflict Review',
                'Cloud City Harbor Arts Listening Night',
                'Cloud City Projection Salon',
                'Cloud City Source Gap Review',
                'Cloud City Bounded Source Review',
                'Cloud City Coherent Review Packet'
            ])
        );
    });

    it('preserves Event Readiness bounded review classification separately from contract conformance', () => {
        const report = runEvalSuiteFile(eventReadinessSuitePath);
        const formatted = formatEvalRunReport(report);
        const blockedCase = report.cases.find(evalCase => evalCase.caseId === 'blocked_escalation_synthetic');
        const insufficientCase = report.cases.find(evalCase => evalCase.caseId === 'insufficient_source_information_synthetic');
        const onTrackCase = report.cases.find(evalCase => evalCase.caseId === 'on_track_with_review_needed_synthetic');

        expect(blockedCase?.outcome).toBe('PASS');
        expect(blockedCase?.boundedReviewClassification).toBe('blocked_pending_human_resolution');
        expect(insufficientCase?.outcome).toBe('PASS');
        expect(insufficientCase?.boundedReviewClassification).toBe('insufficient_source_information');
        expect(onTrackCase?.outcome).toBe('PASS');
        expect(onTrackCase?.boundedReviewClassification).toBe('on_track_with_review_needed');

        expect(formatted).toContain(
            'Contract conformance: PASS blocked_escalation_synthetic: Cloud City Twilight Gallery Session'
        );
        expect(formatted).toContain(
            'Contract conformance: PASS insufficient_source_information_synthetic: Cloud City Source Gap Review'
        );
        expect(formatted).toContain(
            'Contract conformance: PASS on_track_with_review_needed_synthetic: Cloud City Coherent Review Packet'
        );
        expect(formatted).toContain('Bounded review classification: blocked_pending_human_resolution');
        expect(formatted).toContain('Bounded review classification: insufficient_source_information');
        expect(formatted).toContain('Bounded review classification: on_track_with_review_needed');
        expect(formatted).toContain('Suite contract conformance: PASS');
    });

    it('keeps Event Readiness classification mismatch visible without changing failure semantics', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as {
            eval_suite: {
                cases: Array<{ id: string; expected_readiness_label: string }>;
            };
        });
        suite.eval_suite.cases[0].expected_readiness_label = 'on_track_with_review_needed';

        const report = runEvalSuite(suite);
        const formatted = formatEvalRunReport(report);
        const blockedCase = report.cases.find(evalCase => evalCase.caseId === 'blocked_escalation_synthetic');

        expect(report.outcome).toBe('PARTIAL');
        expect(blockedCase?.outcome).toBe('FAIL');
        expect(blockedCase?.boundedReviewClassification).toBe('blocked_pending_human_resolution');
        expect(blockedCase?.checks.find(check => check.label === 'Expected readiness label')?.details).toContain(
            'expected: on_track_with_review_needed; actual: blocked_pending_human_resolution'
        );
        expect(formatted).toContain(
            'Contract conformance: FAIL blocked_escalation_synthetic: Cloud City Twilight Gallery Session'
        );
        expect(formatted).toContain('Bounded review classification: blocked_pending_human_resolution');
        expect(formatted).toContain(
            'FAIL Expected readiness label: expected: on_track_with_review_needed; actual: blocked_pending_human_resolution'
        );
        expect(formatted).toContain('Suite contract conformance: PARTIAL');
    });

    it('keeps non-Event-Readiness eval run formatting unchanged', () => {
        const report = runEvalSuiteFile(suitePath);
        const formatted = formatEvalRunReport(report);

        expect(report.outcome).toBe('PASS');
        expect(formatted).toContain('Contract conformance: PASS warehouse416_public: Warehouse416');
        expect(formatted).toContain('Contract conformance: PASS oakstop_redacted: Oakstop');
        expect(formatted).toContain('Suite contract conformance: PASS');
        expect(formatted).not.toContain('Bounded review classification:');
    });

    it('uses explicit source-material labels for Event Readiness eval cases', () => {
        const suite = loadYamlFile(eventReadinessSuitePath) as {
            eval_suite: {
                cases: Array<{
                    id: string;
                    canonical_source_labels?: string[];
                    required_source_labels?: string[];
                    required_source_material_labels?: string[];
                }>;
            };
        };

        for (const evalCase of suite.eval_suite.cases) {
            expect(evalCase.canonical_source_labels).toContain('DRY_BAR_NOTES');
            expect(evalCase.required_source_material_labels).toBeDefined();
            expect(evalCase.required_source_labels).toBeUndefined();
        }

        const dryBarOutOfScopeCase = suite.eval_suite.cases.find(
            evalCase => evalCase.id === 'dry_bar_out_of_scope_synthetic'
        );
        expect(dryBarOutOfScopeCase?.canonical_source_labels).toContain('DRY_BAR_NOTES');
        expect(dryBarOutOfScopeCase?.required_source_material_labels).not.toContain('DRY_BAR_NOTES');
    });

    it('reports PARTIAL when one Event Readiness case is missing a required seeded issue', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<Record<string, string[]>> } });
        suite.eval_suite.cases[0].required_seeded_issues = [
            ...suite.eval_suite.cases[0].required_seeded_issues,
            'unseeded_issue'
        ];

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.cases.map(evalCase => evalCase.outcome)).toEqual([
            'FAIL',
            'PASS',
            'PASS',
            'PASS',
            'PASS',
            'PASS',
            'PASS'
        ]);
        expect(report.cases[0].checks.find(check => check.label === 'Seeded issues')?.details).toContain(
            'unseeded_issue'
        );
    });

    it('fails validation when an Event Readiness fixture omits budget_impacting_commitment', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<{ fixture_path: string }> } });
        const fixture = clone(loadYamlFile(eventReadinessFixturePath) as { required_approval_gates: string[] });
        fixture.required_approval_gates = fixture.required_approval_gates.filter(
            gate => gate !== 'budget_impacting_commitment'
        );
        suite.eval_suite.cases[0].fixture_path = writeTempYaml(JSON.stringify(fixture));

        const report = validateEvalSuite(suite);

        expect(report.errors.join('\n')).toContain('budget_impacting_commitment');
    });

    it('respects dry_bar_out_of_scope for Event Readiness eval source, domain, seeded issue, and eval requirements', () => {
        const suite = clone(
            loadYamlFile(eventReadinessSuitePath) as {
                eval_suite: {
                    cases: Array<{
                        fixture_path: string;
                        required_source_material_labels: string[];
                        required_domain_check_sections: string[];
                        required_seeded_issues: string[];
                        required_evaluation_tests: string[];
                    }>;
                };
            }
        );
        const fixture = makeDryBarOutOfScopeFixture();
        suite.eval_suite.cases[0].fixture_path = writeTempYaml(JSON.stringify(fixture));
        suite.eval_suite.cases[0].required_source_material_labels = removeValue(
            suite.eval_suite.cases[0].required_source_material_labels,
            'DRY_BAR_NOTES'
        );
        suite.eval_suite.cases[0].required_domain_check_sections = removeValue(
            suite.eval_suite.cases[0].required_domain_check_sections,
            'dry_bar_readiness_notes'
        );
        suite.eval_suite.cases[0].required_seeded_issues = removeValue(
            suite.eval_suite.cases[0].required_seeded_issues,
            'dry_bar_readiness_blockers'
        );
        suite.eval_suite.cases[0].required_evaluation_tests = removeValue(
            suite.eval_suite.cases[0].required_evaluation_tests,
            'dry_bar_readiness_blockers_detected'
        );

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PASS');
    });

    it('reports PARTIAL when only some eval cases pass', () => {
        const suite = clone(loadYamlFile(suitePath) as Record<string, { cases: Array<Record<string, string[]>> }>);
        suite.eval_suite.cases[0].required_venue_fit_criteria = ['impossible criterion'];

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.cases.map(evalCase => evalCase.outcome)).toEqual(['FAIL', 'PASS']);
    });
});

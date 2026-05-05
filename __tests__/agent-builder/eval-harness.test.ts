/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { validateEvalSuite, runEvalSuite, runEvalSuiteFile } from '../../src/agent-builder/eval-suite';
import { validateFixture, validateVenueCandidateFixture } from '../../src/agent-builder/fixtures';
import { loadYamlFile } from '../../src/agent-builder/validation';

const fixturePath = 'fixtures/venue_candidates/warehouse416.public.yaml';
const eventReadinessFixturePath = 'fixtures/event_readiness/blocked_escalation.synthetic.yaml';
const eventReadinessStaffingFixturePath = 'fixtures/event_readiness/blocked_staffing_compliance.synthetic.yaml';
const eventReadinessDryBarOutOfScopeFixturePath = 'fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml';
const suitePath = 'evals/venue_vendor_research.eval-suite.yaml';
const eventReadinessSuitePath = 'evals/event_readiness.eval-suite.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const writeTempYaml = (contents: string) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-city-agent-builder-'));
    const filePath = path.join(directory, 'fixture.yaml');
    fs.writeFileSync(filePath, contents);
    return filePath;
};

type EventReadinessTestFixture = {
    dry_bar_out_of_scope: boolean;
    canonical_source_labels: string[];
    source_materials: Record<string, unknown>;
    seeded_issues: Array<{ id: string; expected_detection?: string }>;
    required_domain_check_sections: string[];
    required_evaluation_tests: string[];
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

    it('runs the eval suite and reports PASS when every deterministic check passes', () => {
        const report = runEvalSuiteFile(suitePath);

        expect(report.outcome).toBe('PASS');
        expect(report.cases.every(evalCase => evalCase.outcome === 'PASS')).toBe(true);
    });

    it('runs the Event Readiness eval suite and reports PASS for fixture test-design structure', () => {
        const report = runEvalSuiteFile(eventReadinessSuitePath);

        expect(report.outcome).toBe('PASS');
        expect(report.specPath).toBe('<none>');
        expect(report.cases).toHaveLength(3);
        expect(report.cases.map(evalCase => evalCase.candidateName)).toEqual(
            expect.arrayContaining([
                'Cloud City Twilight Gallery Session',
                'Cloud City Harbor Arts Listening Night',
                'Cloud City Projection Salon'
            ])
        );
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
        expect(report.cases.map(evalCase => evalCase.outcome)).toEqual(['FAIL', 'PASS', 'PASS']);
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

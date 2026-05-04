/** @jest-environment node */

import fs from 'fs';
import os from 'os';
import path from 'path';

import { validateEvalSuite, runEvalSuite, runEvalSuiteFile } from '../../src/agent-builder/eval-suite';
import { validateFixture, validateVenueCandidateFixture } from '../../src/agent-builder/fixtures';
import { loadYamlFile } from '../../src/agent-builder/validation';

const fixturePath = 'fixtures/venue_candidates/warehouse416.public.yaml';
const eventReadinessFixturePath = 'fixtures/event_readiness/blocked_escalation.synthetic.yaml';
const suitePath = 'evals/venue_vendor_research.eval-suite.yaml';
const eventReadinessSuitePath = 'evals/event_readiness.eval-suite.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const writeTempYaml = (contents: string) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-city-agent-builder-'));
    const filePath = path.join(directory, 'fixture.yaml');
    fs.writeFileSync(filePath, contents);
    return filePath;
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

    it('requires dry bar checks unless dry_bar_out_of_scope is true', () => {
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

        fixture.dry_bar_out_of_scope = true;
        const outOfScopeReport = validateFixture(fixture);

        expect(outOfScopeReport.schemaPassed).toBe(true);
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
        expect(report.cases).toHaveLength(1);
        expect(report.cases[0].candidateName).toBe('Cloud City Twilight Gallery Session');
    });

    it('reports FAIL when an Event Readiness required seeded issue is missing', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<Record<string, string[]>> } });
        suite.eval_suite.cases[0].required_seeded_issues = [
            ...suite.eval_suite.cases[0].required_seeded_issues,
            'unseeded_issue'
        ];

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('FAIL');
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

    it('respects dry_bar_out_of_scope for Event Readiness domain-check sections', () => {
        const suite = clone(loadYamlFile(eventReadinessSuitePath) as { eval_suite: { cases: Array<{ fixture_path: string }> } });
        const fixture = clone(
            loadYamlFile(eventReadinessFixturePath) as {
                dry_bar_out_of_scope: boolean;
                required_domain_check_sections: string[];
            }
        );
        fixture.dry_bar_out_of_scope = true;
        fixture.required_domain_check_sections = fixture.required_domain_check_sections.filter(
            section => section !== 'dry_bar_readiness_notes'
        );
        suite.eval_suite.cases[0].fixture_path = writeTempYaml(JSON.stringify(fixture));

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

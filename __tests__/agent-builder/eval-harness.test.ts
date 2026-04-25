/** @jest-environment node */

import { validateEvalSuite, runEvalSuite, runEvalSuiteFile } from '../../src/agent-builder/eval-suite';
import { validateVenueCandidateFixture } from '../../src/agent-builder/fixtures';
import { loadYamlFile } from '../../src/agent-builder/validation';

const fixturePath = 'fixtures/venue_candidates/warehouse416.public.yaml';
const suitePath = 'evals/venue_vendor_research.eval-suite.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

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

    it('reports PARTIAL when only some eval cases pass', () => {
        const suite = clone(loadYamlFile(suitePath) as Record<string, { cases: Array<Record<string, string[]>> }>);
        suite.eval_suite.cases[0].required_venue_fit_criteria = ['impossible criterion'];

        const report = runEvalSuite(suite);

        expect(report.outcome).toBe('PARTIAL');
        expect(report.cases.map(evalCase => evalCase.outcome)).toEqual(['FAIL', 'PASS']);
    });
});

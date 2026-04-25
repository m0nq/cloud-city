/** @jest-environment node */

import { loadYamlFile, validateAgentSpec } from '../../src/agent-builder/validation';

const specPath = 'agent_specs/venue_vendor_research.v0.1b.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Agent Builder validation', () => {
    it('passes for the Venue / Vendor Research Assistant seed spec', () => {
        const report = validateAgentSpec(loadYamlFile(specPath), specPath);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('fails when a required field is missing', () => {
        const spec = clone(loadYamlFile(specPath) as Record<string, unknown>);
        delete (spec.agent as Record<string, unknown>).name;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('agent.name');
    });

    it('fails when external execution is enabled', () => {
        const spec = clone(loadYamlFile(specPath) as Record<string, unknown>);
        (spec.operating_mode as Record<string, unknown>).external_execution_allowed = true;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('External execution disabled');
    });

    it('fails when restricted data is enabled', () => {
        const spec = clone(loadYamlFile(specPath) as Record<string, unknown>);
        (spec.data_sensitivity as Record<string, unknown>).restricted_data_allowed = true;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Restricted data disabled');
    });

    it('fails when a required approval gate is missing', () => {
        const spec = clone(loadYamlFile(specPath) as Record<string, unknown>);
        spec.approval_gates = (spec.approval_gates as string[]).filter(gate => gate !== 'payments');

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required approval gates');
        expect(report.errors.join('\n')).toContain('payments');
    });

    it('fails when a required eval test is missing', () => {
        const spec = clone(loadYamlFile(specPath) as Record<string, unknown>);
        spec.evaluation_tests = (spec.evaluation_tests as Array<{ id: string }>).filter(
            test => test.id !== 'business_model_fit'
        );

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required eval tests');
        expect(report.errors.join('\n')).toContain('business_model_fit');
    });
});

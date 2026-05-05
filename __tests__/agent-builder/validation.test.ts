/** @jest-environment node */

import { loadYamlFile, validateAgentSpec } from '../../src/agent-builder/validation';

const venueVendorSpecPath = 'agent_specs/venue_vendor_research.v0.1b.yaml';
const eventReadinessSpecPath = 'agent_specs/event_readiness.v0.1.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Agent Builder validation', () => {
    it('passes for the Venue / Vendor Research Assistant seed spec', () => {
        const report = validateAgentSpec(loadYamlFile(venueVendorSpecPath), venueVendorSpecPath);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('passes for the Event Readiness Assistant seed spec', () => {
        const report = validateAgentSpec(loadYamlFile(eventReadinessSpecPath), eventReadinessSpecPath);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('fails when a required field is missing', () => {
        const spec = clone(loadYamlFile(venueVendorSpecPath) as Record<string, unknown>);
        delete (spec.agent as Record<string, unknown>).name;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(false);
        expect(report.errors.join('\n')).toContain('agent.name');
    });

    it('fails when external execution is enabled', () => {
        const spec = clone(loadYamlFile(venueVendorSpecPath) as Record<string, unknown>);
        (spec.operating_mode as Record<string, unknown>).external_execution_allowed = true;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('External execution disabled');
    });

    it('fails when restricted data is enabled', () => {
        const spec = clone(loadYamlFile(venueVendorSpecPath) as Record<string, unknown>);
        (spec.data_sensitivity as Record<string, unknown>).restricted_data_allowed = true;

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Restricted data disabled');
    });

    it('fails when a required Venue / Vendor approval gate is missing', () => {
        const spec = clone(loadYamlFile(venueVendorSpecPath) as Record<string, unknown>);
        spec.approval_gates = (spec.approval_gates as string[]).filter(gate => gate !== 'payments');

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required approval gates');
        expect(report.errors.join('\n')).toContain('payments');
    });

    it('fails when a required Venue / Vendor eval test is missing', () => {
        const spec = clone(loadYamlFile(venueVendorSpecPath) as Record<string, unknown>);
        spec.evaluation_tests = (spec.evaluation_tests as Array<{ id: string }>).filter(
            test => test.id !== 'business_model_fit'
        );

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required eval tests');
        expect(report.errors.join('\n')).toContain('business_model_fit');
    });

    it('does not require Venue / Vendor compatibility gates or evals for Event Readiness', () => {
        const spec = clone(loadYamlFile(eventReadinessSpecPath) as Record<string, unknown>);
        spec.approval_gates = (spec.approval_gates as string[]).filter(
            gate => !['rates or terms', 'contracts', 'payments'].includes(gate)
        );
        spec.evaluation_tests = (spec.evaluation_tests as Array<{ id: string }>).filter(
            test => test.id !== 'business_model_fit'
        );

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(true);
        expect(report.errors).toEqual([]);
    });

    it('fails when a required Event Readiness approval gate id is missing', () => {
        const spec = clone(loadYamlFile(eventReadinessSpecPath) as Record<string, unknown>);
        spec.approval_gate_ids = (spec.approval_gate_ids as string[]).filter(
            gate => gate !== 'budget_impacting_commitment'
        );

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required approval gates');
        expect(report.errors.join('\n')).toContain('budget_impacting_commitment');
    });

    it('fails when a required Event Readiness eval test is missing', () => {
        const spec = clone(loadYamlFile(eventReadinessSpecPath) as Record<string, unknown>);
        spec.evaluation_tests = (spec.evaluation_tests as Array<{ id: string }>).filter(
            test => test.id !== 'budget_impacting_issues_flagged'
        );

        const report = validateAgentSpec(spec);

        expect(report.schemaPassed).toBe(true);
        expect(report.policyReport?.passed).toBe(false);
        expect(report.errors.join('\n')).toContain('Required eval tests');
        expect(report.errors.join('\n')).toContain('budget_impacting_issues_flagged');
    });
});

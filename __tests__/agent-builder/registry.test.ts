/** @jest-environment node */

import { loadYamlFile } from '../../src/agent-builder/validation';
import { validateAgentRegistry } from '../../src/agent-builder/registry';

const registryPath = 'registry/agent-registry.yaml';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Agent Builder registry validation', () => {
    it('passes for the local registry', () => {
        const report = validateAgentRegistry(loadYamlFile(registryPath), registryPath);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors).toEqual([]);
        expect(report.checks.every(check => check.passed)).toBe(true);
    });

    it('fails when the registry entry points to a missing spec file', () => {
        const registry = clone(
            loadYamlFile(registryPath) as Record<string, { entries: Array<Record<string, string>> }>
        );
        registry.registry.entries[0].spec_path = 'agent_specs/missing.yaml';

        const report = validateAgentRegistry(registry);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('Spec file exists');
        expect(report.errors.join('\n')).toContain('agent_specs/missing.yaml');
    });

    it('fails when registry metadata does not match the spec', () => {
        const registry = clone(
            loadYamlFile(registryPath) as Record<string, { entries: Array<Record<string, string>> }>
        );
        registry.registry.entries[0].version = '0.2';

        const report = validateAgentRegistry(registry);

        expect(report.schemaPassed).toBe(true);
        expect(report.errors.join('\n')).toContain('version matches spec');
        expect(report.errors.join('\n')).toContain('registry=0.2 spec=0.1b');
    });
});

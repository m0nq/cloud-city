import fs from 'fs';
import path from 'path';
import { ZodError, z } from 'zod';

import { loadYamlFile, validateAgentSpecFile } from './validation';

const nonEmptyString = z.string().trim().min(1);

export const registryEntrySchema = z
    .object({
        id: nonEmptyString,
        spec_path: nonEmptyString,
        agent_name: nonEmptyString,
        slug: nonEmptyString,
        version: nonEmptyString,
        business_domain: nonEmptyString,
        owner_hat: nonEmptyString,
        status: nonEmptyString,
        evaluation_status: nonEmptyString
    })
    .passthrough();

export const agentRegistrySchema = z
    .object({
        registry: z
            .object({
                schema_version: nonEmptyString,
                updated_at: nonEmptyString.optional(),
                entries: z.array(registryEntrySchema).min(1)
            })
            .passthrough()
    })
    .passthrough();

export type AgentRegistry = z.infer<typeof agentRegistrySchema>;
export type RegistryEntry = z.infer<typeof registryEntrySchema>;

export type RegistryCheck = {
    entryId: string;
    label: string;
    passed: boolean;
    details: string;
};

export type RegistryValidationReport = {
    registryPath: string;
    schemaPassed: boolean;
    registry?: AgentRegistry;
    checks: RegistryCheck[];
    errors: string[];
};

const formatValue = (value: string | undefined) => value || '<missing>';

const makeCheck = (entryId: string, label: string, passed: boolean, details: string): RegistryCheck => ({
    entryId,
    label,
    passed,
    details
});

const compareField = ({
    entry,
    field,
    specValue
}: {
    entry: RegistryEntry;
    field: keyof Pick<
        RegistryEntry,
        'agent_name' | 'slug' | 'version' | 'business_domain' | 'owner_hat' | 'status' | 'evaluation_status'
    >;
    specValue: string | undefined;
}) => {
    const entryValue = entry[field];
    return makeCheck(
        entry.id,
        `${field} matches spec`,
        entryValue === specValue,
        entryValue === specValue
            ? `${field}: ${entryValue}`
            : `registry=${formatValue(entryValue)} spec=${formatValue(specValue)}`
    );
};

export const validateAgentRegistry = (input: unknown, registryPath = 'in-memory'): RegistryValidationReport => {
    try {
        const registry = agentRegistrySchema.parse(input);
        const checks: RegistryCheck[] = [];

        for (const entry of registry.registry.entries) {
            const resolvedSpecPath = path.resolve(process.cwd(), entry.spec_path);
            const specExists = fs.existsSync(resolvedSpecPath);

            checks.push(
                makeCheck(
                    entry.id,
                    'Spec file exists',
                    specExists,
                    specExists ? entry.spec_path : `missing file: ${entry.spec_path}`
                )
            );

            if (!specExists) {
                continue;
            }

            const specReport = validateAgentSpecFile(entry.spec_path);
            const specValid =
                specReport.schemaPassed && Boolean(specReport.policyReport?.passed) && Boolean(specReport.spec);

            checks.push(
                makeCheck(
                    entry.id,
                    'Spec validates',
                    specValid,
                    specValid ? 'schema and policy pass' : specReport.errors.join('; ')
                )
            );

            if (!specReport.spec) {
                continue;
            }

            checks.push(
                compareField({ entry, field: 'agent_name', specValue: specReport.spec.agent.name }),
                compareField({ entry, field: 'slug', specValue: specReport.spec.agent.slug }),
                compareField({ entry, field: 'version', specValue: specReport.spec.agent.version }),
                compareField({ entry, field: 'business_domain', specValue: specReport.spec.agent.business_domain }),
                compareField({ entry, field: 'owner_hat', specValue: specReport.spec.agent.owner_hat }),
                compareField({ entry, field: 'status', specValue: specReport.spec.agent.status }),
                compareField({ entry, field: 'evaluation_status', specValue: specReport.spec.agent.evaluation_status })
            );
        }

        return {
            registryPath,
            schemaPassed: true,
            registry,
            checks,
            errors: checks
                .filter(check => !check.passed)
                .map(check => `${check.entryId}: ${check.label}: ${check.details}`)
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                registryPath,
                schemaPassed: false,
                checks: [],
                errors: error.issues.map(issue => `${issue.path.join('.') || 'registry'}: ${issue.message}`)
            };
        }

        return {
            registryPath,
            schemaPassed: false,
            checks: [],
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateAgentRegistryFile = (registryPath: string) => {
    const input = loadYamlFile(registryPath);
    return validateAgentRegistry(input, registryPath);
};

const formatPassFail = (passed: boolean) => (passed ? 'PASS' : 'FAIL');

export const formatRegistryValidationReport = (report: RegistryValidationReport) => {
    const crossCheckPassed = report.checks.every(check => check.passed);
    const resultPassed = report.schemaPassed && crossCheckPassed;
    const entryCount = report.registry?.registry.entries.length ?? 0;

    const lines = [
        'Agent Builder Registry Validation Report',
        '',
        `Registry: ${report.registryPath}`,
        `Entries: ${entryCount}`,
        `Schema validation: ${formatPassFail(report.schemaPassed)}`,
        `Registry cross-checks: ${formatPassFail(crossCheckPassed)}`
    ];

    if (report.checks.length > 0) {
        lines.push('', 'Checks:');
        for (const check of report.checks) {
            lines.push(`- ${formatPassFail(check.passed)} ${check.entryId}: ${check.label} (${check.details})`);
        }
    }

    if (report.errors.length > 0) {
        lines.push('', 'Failures:');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', `Result: ${formatPassFail(resultPassed)}`);

    return lines.join('\n');
};

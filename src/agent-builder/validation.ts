import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { ZodError } from 'zod';

import { runPolicyChecks, type PolicyReport } from './policy';
import { agentSpecSchema, type AgentSpec } from './schema';

export type ValidationReport = {
    specPath: string;
    spec?: AgentSpec;
    schemaPassed: boolean;
    policyReport?: PolicyReport;
    errors: string[];
};

export const loadYamlFile = (filePath: string): unknown => {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const contents = fs.readFileSync(resolvedPath, 'utf8');
    return parseYaml(contents);
};

export const validateAgentSpec = (input: unknown, specPath = 'in-memory'): ValidationReport => {
    try {
        const spec = agentSpecSchema.parse(input);
        const policyReport = runPolicyChecks(spec);

        return {
            specPath,
            spec,
            schemaPassed: true,
            policyReport,
            errors: policyReport.checks.filter(check => !check.passed).map(check => `${check.label}: ${check.details}`)
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                specPath,
                schemaPassed: false,
                errors: error.issues.map(issue => `${issue.path.join('.') || 'spec'}: ${issue.message}`)
            };
        }

        return {
            specPath,
            schemaPassed: false,
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

const formatPassFail = (passed: boolean) => (passed ? 'PASS' : 'FAIL');

export const formatValidationReport = (report: ValidationReport) => {
    const spec = report.spec;
    const policyReport = report.policyReport;
    const requiredApprovalGates = policyReport?.checks.find(check => check.id === 'required_approval_gates');
    const requiredEvalTests = policyReport?.checks.find(check => check.id === 'required_evaluation_tests');
    const resultPassed = report.schemaPassed && Boolean(policyReport?.passed);

    const lines = [
        'Agent Builder Validation Report',
        '',
        `Spec: ${spec ? `${spec.agent.name} v${spec.agent.version}` : report.specPath}`,
        `Schema validation: ${formatPassFail(report.schemaPassed)}`,
        `Policy checks: ${formatPassFail(Boolean(policyReport?.passed))}`
    ];

    if (spec) {
        lines.push(
            `Restricted data allowed: ${String(spec.data_sensitivity.restricted_data_allowed)}`,
            `External execution allowed: ${String(spec.operating_mode.external_execution_allowed)}`,
            `Autonomous tool use allowed: ${String(spec.operating_mode.autonomous_tool_use_allowed)}`,
            `Production integration allowed: ${String(spec.operating_mode.production_integration_allowed)}`,
            `Required approval gates: ${formatPassFail(Boolean(requiredApprovalGates?.passed))}`,
            `Required eval tests: ${formatPassFail(Boolean(requiredEvalTests?.passed))}`
        );
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

export const validateAgentSpecFile = (specPath: string) => {
    const input = loadYamlFile(specPath);
    return validateAgentSpec(input, specPath);
};

import fs from 'fs';
import path from 'path';
import { ZodError, z } from 'zod';

import type { AgentSpec } from './schema';
import {
    validateVenueCandidateFixtureFile,
    type VenueCandidateFixture
} from './fixtures';
import { loadYamlFile, validateAgentSpecFile } from './validation';

const nonEmptyString = z.string().trim().min(1);
const stringArray = z.array(nonEmptyString).default([]);

export type EvalOutcome = 'PASS' | 'PARTIAL' | 'FAIL';

export const evalSuiteCaseSchema = z
    .object({
        id: nonEmptyString,
        fixture_path: nonEmptyString,
        required_output_fields: stringArray,
        required_venue_fit_criteria: stringArray,
        required_approval_gates: stringArray,
        required_evaluation_tests: stringArray
    })
    .passthrough();

export const evalSuiteSchema = z
    .object({
        eval_suite: z
            .object({
                id: nonEmptyString,
                name: nonEmptyString,
                version: nonEmptyString,
                spec_path: nonEmptyString,
                cases: z.array(evalSuiteCaseSchema).min(1)
            })
            .passthrough()
    })
    .passthrough();

export type EvalSuite = z.infer<typeof evalSuiteSchema>;
export type EvalSuiteCase = z.infer<typeof evalSuiteCaseSchema>;

export type EvalSuiteValidationCheck = {
    id: string;
    label: string;
    passed: boolean;
    details: string;
};

export type EvalSuiteValidationReport = {
    suitePath: string;
    schemaPassed: boolean;
    suite?: EvalSuite;
    checks: EvalSuiteValidationCheck[];
    errors: string[];
};

export type EvalChecklistItem = {
    label: string;
    passed: boolean;
    details: string;
};

export type EvalCaseResult = {
    caseId: string;
    fixturePath: string;
    candidateName?: string;
    outcome: EvalOutcome;
    checks: EvalChecklistItem[];
};

export type EvalRunReport = {
    suitePath: string;
    suiteId: string;
    suiteName: string;
    specPath: string;
    outcome: EvalOutcome;
    cases: EvalCaseResult[];
};

const normalize = (value: string) => value.trim().toLowerCase();

const unique = (values: string[]) => Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));

const missingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(normalize));
    return requiredValues.filter(value => !actual.has(normalize(value)));
};

const makeValidationCheck = (
    id: string,
    label: string,
    passed: boolean,
    details: string
): EvalSuiteValidationCheck => ({
    id,
    label,
    passed,
    details
});

const makeChecklistItem = (label: string, actualValues: string[], requiredValues: string[]): EvalChecklistItem => {
    const missing = missingValues(actualValues, requiredValues);

    return {
        label,
        passed: missing.length === 0,
        details: missing.length === 0 ? 'PASS' : `missing: ${missing.join(', ')}`
    };
};

const caseOutcome = (checks: EvalChecklistItem[]): EvalOutcome => (checks.every(check => check.passed) ? 'PASS' : 'FAIL');

const suiteOutcome = (cases: EvalCaseResult[]): EvalOutcome => {
    const passedCount = cases.filter(evalCase => evalCase.outcome === 'PASS').length;

    if (passedCount === cases.length) {
        return 'PASS';
    }

    if (passedCount === 0) {
        return 'FAIL';
    }

    return 'PARTIAL';
};

const combineRequirements = (fixtureValues: string[], caseValues: string[]) => unique([...fixtureValues, ...caseValues]);

const loadValidSpec = (specPath: string): AgentSpec => {
    const specReport = validateAgentSpecFile(specPath);

    if (!specReport.spec || !specReport.schemaPassed || !specReport.policyReport?.passed) {
        throw new Error(`Spec must pass validation before eval: ${specReport.errors.join('; ')}`);
    }

    return specReport.spec;
};

const loadValidFixture = (fixturePath: string): VenueCandidateFixture => {
    const fixtureReport = validateVenueCandidateFixtureFile(fixturePath);

    if (!fixtureReport.fixture || !fixtureReport.schemaPassed) {
        throw new Error(`Fixture must pass validation before eval: ${fixtureReport.errors.join('; ')}`);
    }

    return fixtureReport.fixture;
};

export const validateEvalSuite = (input: unknown, suitePath = 'in-memory'): EvalSuiteValidationReport => {
    try {
        const suite = evalSuiteSchema.parse(input);
        const checks: EvalSuiteValidationCheck[] = [];
        const specPath = suite.eval_suite.spec_path;
        const specExists = fs.existsSync(path.resolve(process.cwd(), specPath));

        checks.push(
            makeValidationCheck('spec_exists', 'Spec file exists', specExists, specExists ? specPath : `missing file: ${specPath}`)
        );

        if (specExists) {
            const specReport = validateAgentSpecFile(specPath);
            const specValid = specReport.schemaPassed && Boolean(specReport.policyReport?.passed);

            checks.push(
                makeValidationCheck(
                    'spec_validates',
                    'Spec validates',
                    specValid,
                    specValid ? 'schema and policy pass' : specReport.errors.join('; ')
                )
            );
        }

        for (const evalCase of suite.eval_suite.cases) {
            const fixtureExists = fs.existsSync(path.resolve(process.cwd(), evalCase.fixture_path));

            checks.push(
                makeValidationCheck(
                    `${evalCase.id}.fixture_exists`,
                    'Fixture file exists',
                    fixtureExists,
                    fixtureExists ? evalCase.fixture_path : `missing file: ${evalCase.fixture_path}`
                )
            );

            if (!fixtureExists) {
                continue;
            }

            const fixtureReport = validateVenueCandidateFixtureFile(evalCase.fixture_path);
            checks.push(
                makeValidationCheck(
                    `${evalCase.id}.fixture_validates`,
                    'Fixture validates',
                    fixtureReport.schemaPassed,
                    fixtureReport.schemaPassed ? 'schema passes' : fixtureReport.errors.join('; ')
                )
            );
        }

        return {
            suitePath,
            schemaPassed: true,
            suite,
            checks,
            errors: checks.filter(check => !check.passed).map(check => `${check.id}: ${check.label}: ${check.details}`)
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                suitePath,
                schemaPassed: false,
                checks: [],
                errors: error.issues.map(issue => `${issue.path.join('.') || 'eval_suite'}: ${issue.message}`)
            };
        }

        return {
            suitePath,
            schemaPassed: false,
            checks: [],
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateEvalSuiteFile = (suitePath: string) => {
    return validateEvalSuite(loadYamlFile(suitePath), suitePath);
};

export const runEvalSuite = (input: unknown, suitePath = 'in-memory'): EvalRunReport => {
    const validation = validateEvalSuite(input, suitePath);

    if (!validation.suite || !validation.schemaPassed || validation.checks.some(check => !check.passed)) {
        throw new Error(`Eval suite must pass validation before run: ${validation.errors.join('; ')}`);
    }

    const suite = validation.suite.eval_suite;
    const spec = loadValidSpec(suite.spec_path);
    const specEvalTests = spec.evaluation_tests.map(test => test.id);

    const cases = suite.cases.map(evalCase => {
        const fixture = loadValidFixture(evalCase.fixture_path);
        const checks = [
            makeChecklistItem(
                'Required output fields',
                spec.required_output_fields,
                combineRequirements(fixture.required_output_fields, evalCase.required_output_fields)
            ),
            makeChecklistItem(
                'Venue fit criteria',
                spec.venue_fit_criteria || [],
                combineRequirements(fixture.required_venue_fit_criteria, evalCase.required_venue_fit_criteria)
            ),
            makeChecklistItem(
                'Approval gates',
                spec.approval_gates,
                combineRequirements(fixture.required_approval_gates, evalCase.required_approval_gates)
            ),
            makeChecklistItem(
                'Evaluation tests',
                specEvalTests,
                combineRequirements(fixture.required_evaluation_tests, evalCase.required_evaluation_tests)
            )
        ];

        return {
            caseId: evalCase.id,
            fixturePath: evalCase.fixture_path,
            candidateName: fixture.candidate_name,
            outcome: caseOutcome(checks),
            checks
        };
    });

    return {
        suitePath,
        suiteId: suite.id,
        suiteName: suite.name,
        specPath: suite.spec_path,
        outcome: suiteOutcome(cases),
        cases
    };
};

export const runEvalSuiteFile = (suitePath: string) => {
    return runEvalSuite(loadYamlFile(suitePath), suitePath);
};

export const formatEvalSuiteValidationReport = (report: EvalSuiteValidationReport) => {
    const checksPassed = report.checks.every(check => check.passed);
    const resultPassed = report.schemaPassed && checksPassed;
    const suite = report.suite?.eval_suite;
    const lines = [
        'Agent Builder Eval Suite Validation Report',
        '',
        `Suite: ${suite ? `${suite.name} v${suite.version}` : report.suitePath}`,
        `Spec: ${suite?.spec_path || '<unknown>'}`,
        `Cases: ${suite?.cases.length ?? 0}`,
        `Schema validation: ${report.schemaPassed ? 'PASS' : 'FAIL'}`,
        `Suite checks: ${checksPassed ? 'PASS' : 'FAIL'}`
    ];

    if (report.checks.length > 0) {
        lines.push('', 'Checks:');
        for (const check of report.checks) {
            lines.push(`- ${check.passed ? 'PASS' : 'FAIL'} ${check.id}: ${check.label} (${check.details})`);
        }
    }

    if (report.errors.length > 0) {
        lines.push('', 'Failures:');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', `Result: ${resultPassed ? 'PASS' : 'FAIL'}`);

    return lines.join('\n');
};

export const formatEvalRunReport = (report: EvalRunReport) => {
    const lines = [
        'Agent Builder Eval Run Report',
        '',
        `Suite: ${report.suiteName}`,
        `Spec: ${report.specPath}`,
        '',
        'Cases:'
    ];

    for (const evalCase of report.cases) {
        lines.push(`- ${evalCase.outcome} ${evalCase.caseId}: ${evalCase.candidateName || evalCase.fixturePath}`);
        for (const check of evalCase.checks) {
            lines.push(`  - ${check.passed ? 'PASS' : 'FAIL'} ${check.label}: ${check.details}`);
        }
    }

    lines.push('', `Result: ${report.outcome}`);

    return lines.join('\n');
};

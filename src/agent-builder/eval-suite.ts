import fs from 'fs';
import path from 'path';
import { ZodError, z } from 'zod';

import type { AgentSpec } from './schema';
import {
    validateFixtureFile,
    validateVenueCandidateFixtureFile,
    type EventReadinessFixture,
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
        expected_readiness_label: nonEmptyString.optional(),
        required_core_fields: stringArray,
        required_domain_check_sections: stringArray,
        required_source_labels: stringArray,
        required_seeded_issues: stringArray,
        required_output_fields: stringArray,
        required_venue_fit_criteria: stringArray,
        required_approval_gates: stringArray,
        required_evaluation_tests: stringArray,
        required_prohibited_output_behavior: stringArray
    })
    .passthrough();

export const evalSuiteSchema = z
    .object({
        eval_suite: z
            .object({
                id: nonEmptyString,
                name: nonEmptyString,
                version: nonEmptyString,
                fixture_type: nonEmptyString.optional(),
                spec_path: nonEmptyString.optional(),
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

const unexpectedValues = (actualValues: string[], allowedValues: string[]) => {
    const allowed = new Set(allowedValues.map(normalize));
    return actualValues.filter(value => !allowed.has(normalize(value)));
};

const makeAllowedValuesCheck = (label: string, actualValues: string[], allowedValues: string[]): EvalChecklistItem => {
    const unexpected = unexpectedValues(actualValues, allowedValues);

    return {
        label,
        passed: unexpected.length === 0,
        details: unexpected.length === 0 ? 'PASS' : `unexpected: ${unexpected.join(', ')}`
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

const getSuiteFixtureType = (suite: EvalSuite['eval_suite']) => suite.fixture_type || 'venue_candidate';

const isEventReadinessSuite = (suite: EvalSuite['eval_suite']) => getSuiteFixtureType(suite) === 'event_readiness';

const seededIssueIds = (fixture: EventReadinessFixture) => fixture.seeded_issues.map(issue => issue.id);

const sourceMaterialLabels = (fixture: EventReadinessFixture) => Object.keys(fixture.source_materials);

const makeExactValueCheck = (label: string, actualValue: string, expectedValue?: string): EvalChecklistItem => {
    const passed = !expectedValue || normalize(actualValue) === normalize(expectedValue);

    return {
        label,
        passed,
        details: passed ? 'PASS' : `expected: ${expectedValue}; actual: ${actualValue}`
    };
};

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

const loadValidEventReadinessFixture = (fixturePath: string): EventReadinessFixture => {
    const fixtureReport = validateFixtureFile(fixturePath);

    if (!fixtureReport.fixture || !fixtureReport.schemaPassed) {
        throw new Error(`Fixture must pass validation before eval: ${fixtureReport.errors.join('; ')}`);
    }

    if (fixtureReport.fixtureType !== 'event_readiness') {
        throw new Error(`Fixture must be event_readiness for this eval suite: ${fixturePath}`);
    }

    return fixtureReport.fixture as EventReadinessFixture;
};

export const validateEvalSuite = (input: unknown, suitePath = 'in-memory'): EvalSuiteValidationReport => {
    try {
        const suite = evalSuiteSchema.parse(input);
        const checks: EvalSuiteValidationCheck[] = [];
        const fixtureType = getSuiteFixtureType(suite.eval_suite);
        const isEventReadiness = isEventReadinessSuite(suite.eval_suite);
        const specPath = suite.eval_suite.spec_path;

        if (isEventReadiness && specPath) {
            checks.push(
                makeValidationCheck(
                    'spec_absent_for_event_readiness',
                    'Event Readiness suite does not require a spec',
                    false,
                    `unexpected spec_path: ${specPath}`
                )
            );
        }

        if (!isEventReadiness) {
            const hasSpecPath = Boolean(specPath);
            checks.push(
                makeValidationCheck(
                    'spec_path_present',
                    'Spec path present',
                    hasSpecPath,
                    hasSpecPath ? specPath || '<unknown>' : 'missing spec_path'
                )
            );

            if (specPath) {
                const specExists = fs.existsSync(path.resolve(process.cwd(), specPath));

                checks.push(
                    makeValidationCheck(
                        'spec_exists',
                        'Spec file exists',
                        specExists,
                        specExists ? specPath : `missing file: ${specPath}`
                    )
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
            }
        }

        if (fixtureType !== 'venue_candidate' && fixtureType !== 'event_readiness') {
            checks.push(
                makeValidationCheck(
                    'fixture_type_supported',
                    'Fixture type supported',
                    false,
                    `unknown fixture_type: ${fixtureType}`
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

            const fixtureReport = isEventReadiness
                ? validateFixtureFile(evalCase.fixture_path)
                : validateVenueCandidateFixtureFile(evalCase.fixture_path);
            const fixtureTypeMatches = isEventReadiness ? fixtureReport.fixtureType === 'event_readiness' : true;

            checks.push(
                makeValidationCheck(
                    `${evalCase.id}.fixture_validates`,
                    'Fixture validates',
                    fixtureReport.schemaPassed && fixtureTypeMatches,
                    fixtureReport.schemaPassed ? 'schema passes' : fixtureReport.errors.join('; ')
                )
            );

            if (isEventReadiness && fixtureReport.schemaPassed) {
                checks.push(
                    makeValidationCheck(
                        `${evalCase.id}.fixture_type_matches`,
                        'Fixture type matches suite',
                        fixtureTypeMatches,
                        fixtureTypeMatches ? 'event_readiness' : `actual: ${fixtureReport.fixtureType || 'unknown'}`
                    )
                );
            }
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
    const isEventReadiness = isEventReadinessSuite(suite);

    if (isEventReadiness) {
        const cases = suite.cases.map(evalCase => {
            const fixture = loadValidEventReadinessFixture(evalCase.fixture_path);
            const requiredDomainSections = fixture.dry_bar_out_of_scope
                ? evalCase.required_domain_check_sections.filter(section => section !== 'dry_bar_readiness_notes')
                : evalCase.required_domain_check_sections;
            const checks = [
                makeExactValueCheck(
                    'Expected readiness label',
                    fixture.expected_readiness_label,
                    evalCase.expected_readiness_label
                ),
                makeChecklistItem(
                    'Required core fields',
                    fixture.required_core_fields,
                    evalCase.required_core_fields
                ),
                makeChecklistItem(
                    'Required domain-check sections',
                    fixture.required_domain_check_sections,
                    requiredDomainSections
                ),
                makeChecklistItem(
                    'Canonical source labels',
                    fixture.canonical_source_labels,
                    evalCase.required_source_labels
                ),
                makeAllowedValuesCheck(
                    'Canonical source labels valid',
                    fixture.canonical_source_labels,
                    evalCase.required_source_labels
                ),
                makeChecklistItem(
                    'Source materials',
                    sourceMaterialLabels(fixture),
                    evalCase.required_source_labels
                ),
                makeAllowedValuesCheck(
                    'Source material labels valid',
                    sourceMaterialLabels(fixture),
                    evalCase.required_source_labels
                ),
                makeChecklistItem('Seeded issues', seededIssueIds(fixture), evalCase.required_seeded_issues),
                makeChecklistItem(
                    'Approval gates',
                    fixture.required_approval_gates,
                    evalCase.required_approval_gates
                ),
                makeChecklistItem(
                    'Evaluation tests',
                    fixture.required_evaluation_tests,
                    evalCase.required_evaluation_tests
                ),
                makeChecklistItem(
                    'Prohibited output behavior',
                    fixture.prohibited_output_behavior,
                    evalCase.required_prohibited_output_behavior
                )
            ];

            return {
                caseId: evalCase.id,
                fixturePath: evalCase.fixture_path,
                candidateName: fixture.event_name,
                outcome: caseOutcome(checks),
                checks
            };
        });

        return {
            suitePath,
            suiteId: suite.id,
            suiteName: suite.name,
            specPath: suite.spec_path || '<none>',
            outcome: suiteOutcome(cases),
            cases
        };
    }

    if (!suite.spec_path) {
        throw new Error('Spec path is required for venue/vendor eval suites.');
    }

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

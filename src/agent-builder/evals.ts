import { z } from 'zod';

import { loadYamlFile, validateAgentSpecFile } from './validation';

const fixtureSchema = z
    .object({
        candidate_name: z.string().trim().min(1),
        candidate_type: z.enum(['venue', 'vendor']),
        required_output_fields: z.array(z.string().trim().min(1)).default([]),
        required_venue_fit_criteria: z.array(z.string().trim().min(1)).default([]),
        required_evaluation_tests: z.array(z.string().trim().min(1)).default([])
    })
    .passthrough();

export type DeterministicEvalReport = {
    specPath: string;
    fixturePath: string;
    candidateName: string;
    passed: boolean;
    checks: Array<{
        label: string;
        passed: boolean;
        details: string;
    }>;
};

const normalize = (value: string) => value.trim().toLowerCase();

const missingValues = (actualValues: string[], requiredValues: string[]) => {
    const actual = new Set(actualValues.map(normalize));
    return requiredValues.filter(value => !actual.has(normalize(value)));
};

const makeChecklistCheck = (label: string, missing: string[]) => ({
    label,
    passed: missing.length === 0,
    details: missing.length === 0 ? 'PASS' : `missing: ${missing.join(', ')}`
});

export const runDeterministicFixtureEval = (specPath: string, fixturePath: string): DeterministicEvalReport => {
    const validation = validateAgentSpecFile(specPath);

    if (!validation.spec || !validation.schemaPassed || !validation.policyReport?.passed) {
        throw new Error(`Spec must pass validation before eval: ${validation.errors.join('; ')}`);
    }

    const fixture = fixtureSchema.parse(loadYamlFile(fixturePath));
    const spec = validation.spec;

    const checks = [
        makeChecklistCheck(
            'Required output fields',
            missingValues(spec.required_output_fields, fixture.required_output_fields)
        ),
        makeChecklistCheck(
            'Venue fit criteria',
            missingValues(spec.venue_fit_criteria || [], fixture.required_venue_fit_criteria)
        ),
        makeChecklistCheck(
            'Evaluation tests',
            missingValues(
                spec.evaluation_tests.map(test => test.id),
                fixture.required_evaluation_tests
            )
        )
    ];

    return {
        specPath,
        fixturePath,
        candidateName: fixture.candidate_name,
        passed: checks.every(check => check.passed),
        checks
    };
};

export const formatDeterministicEvalReport = (report: DeterministicEvalReport) => {
    const lines = [
        'Agent Builder Deterministic Eval Report',
        '',
        `Spec: ${report.specPath}`,
        `Fixture: ${report.fixturePath}`,
        `Candidate: ${report.candidateName}`,
        '',
        'Checklist:'
    ];

    for (const check of report.checks) {
        lines.push(`- ${check.passed ? 'PASS' : 'FAIL'} ${check.label}: ${check.details}`);
    }

    lines.push('', `Result: ${report.passed ? 'PASS' : 'FAIL'}`);

    return lines.join('\n');
};

import { validateVenueCandidateFixtureFile } from './fixtures';
import { validateAgentSpecFile } from './validation';

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

    const fixtureReport = validateVenueCandidateFixtureFile(fixturePath);
    if (!fixtureReport.fixture || !fixtureReport.schemaPassed) {
        throw new Error(`Fixture must pass validation before eval: ${fixtureReport.errors.join('; ')}`);
    }

    const fixture = fixtureReport.fixture;
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
        ),
        makeChecklistCheck(
            'Approval gates',
            missingValues(spec.approval_gates, fixture.required_approval_gates)
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

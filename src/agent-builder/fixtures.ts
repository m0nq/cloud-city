import { ZodError, z } from 'zod';

import { loadYamlFile } from './validation';

const nonEmptyString = z.string().trim().min(1);
const nonEmptyStringArray = z.array(nonEmptyString).min(1);

export const venueCandidateFixtureSchema = z
    .object({
        candidate_name: nonEmptyString,
        candidate_type: z.enum(['venue', 'vendor']),
        sensitivity_level: nonEmptyString,
        required_output_fields: nonEmptyStringArray,
        required_venue_fit_criteria: nonEmptyStringArray,
        required_approval_gates: nonEmptyStringArray,
        required_evaluation_tests: nonEmptyStringArray
    })
    .passthrough();

export type VenueCandidateFixture = z.infer<typeof venueCandidateFixtureSchema>;

export type FixtureValidationReport = {
    fixturePath: string;
    schemaPassed: boolean;
    fixture?: VenueCandidateFixture;
    errors: string[];
};

export const validateVenueCandidateFixture = (
    input: unknown,
    fixturePath = 'in-memory'
): FixtureValidationReport => {
    try {
        return {
            fixturePath,
            schemaPassed: true,
            fixture: venueCandidateFixtureSchema.parse(input),
            errors: []
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                fixturePath,
                schemaPassed: false,
                errors: error.issues.map(issue => `${issue.path.join('.') || 'fixture'}: ${issue.message}`)
            };
        }

        return {
            fixturePath,
            schemaPassed: false,
            errors: [error instanceof Error ? error.message : String(error)]
        };
    }
};

export const validateVenueCandidateFixtureFile = (fixturePath: string) => {
    return validateVenueCandidateFixture(loadYamlFile(fixturePath), fixturePath);
};

export const formatFixtureValidationReport = (report: FixtureValidationReport) => {
    const resultPassed = report.schemaPassed;
    const lines = [
        'Agent Builder Fixture Validation Report',
        '',
        `Fixture: ${report.fixturePath}`,
        `Candidate: ${report.fixture?.candidate_name || report.fixturePath}`,
        `Schema validation: ${resultPassed ? 'PASS' : 'FAIL'}`
    ];

    if (report.errors.length > 0) {
        lines.push('', 'Failures:');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
    }

    lines.push('', `Result: ${resultPassed ? 'PASS' : 'FAIL'}`);

    return lines.join('\n');
};

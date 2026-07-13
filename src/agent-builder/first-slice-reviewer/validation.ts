import type { z } from 'zod';

import {
    firstSliceReviewerFixtureSchema,
    firstSliceReviewerInputSchema,
    type FirstSliceReviewerFixture,
    type FirstSliceReviewerInput
} from './schema';

export type FirstSliceValidationError = {
    path: string;
    code: string;
    message: string;
};

export type FirstSliceFixtureValidationReport = {
    passed: boolean;
    fixture?: FirstSliceReviewerFixture;
    errors: FirstSliceValidationError[];
};

export type FirstSliceInputValidationReport = {
    passed: boolean;
    input?: FirstSliceReviewerInput;
    errors: FirstSliceValidationError[];
};

const formatPath = (path: PropertyKey[]) => (path.length > 0 ? path.map(String).join('.') : 'fixture');

const safeSchemaErrors = (issues: z.core.$ZodIssue[]): FirstSliceValidationError[] =>
    issues.flatMap(issue => {
        if (issue.code === 'unrecognized_keys') {
            return issue.keys.map(key => ({
                path: key,
                code: 'unrecognized_field',
                message: 'This field is not permitted by the first-slice fixture contract.'
            }));
        }

        return [
            {
                path: formatPath(issue.path),
                code: issue.code,
                message: issue.message
            }
        ];
    });

const positiveFixtureText = (fixture: FirstSliceReviewerFixture) =>
    [
        fixture.planning_reference,
        fixture.workflow_title,
        fixture.planning_purpose,
        ...fixture.allowed_references
    ].join('\n');

const governanceErrors = (fixture: FirstSliceReviewerFixture): FirstSliceValidationError[] => {
    const text = positiveFixtureText(fixture);
    const errors: FirstSliceValidationError[] = [];

    if (/(?:https?:\/\/|www\.|file:\/\/|\/Users\/|[A-Za-z]:\\)/i.test(text) || /\b(?:retrieve|fetch|download|browse)\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'source_retrieval',
            message: 'Source locations and retrieval instructions are not permitted.'
        });
    }

    if (/\b(?:persist|store|save|retain|record|log)(?:s|ed|ing)?\b.{0,32}\b(?:review|reviewer|classification|history|input|reason)\b|\breviewer history\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'persistence',
            message: 'Persistence, logging, and reviewer-history claims are not permitted.'
        });
    }

    if (/\b(?:email|message|notify|publish|post|send)\b.{0,48}\b(?:external|participant|recipient|classification|result|evidence)\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'external_communication',
            message: 'External communication instructions are not permitted.'
        });
    }

    if (/\b(?:agent|system)\b.{0,32}\b(?:automatically|autonomously|acts?|executes?)\b|\bwithout human (?:review|transfer)\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'autonomous_action',
            message: 'Autonomous action instructions are not permitted.'
        });
    }

    if (/\b(?:real|redacted|production)\s+(?:data|records?|sources?|identifiers?)\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'operational_data',
            message: 'Real, redacted, production, or operational data claims are not permitted.'
        });
    }

    if (/\b(?:approved|authorized|ready for implementation|ready for release)\b/i.test(text)) {
        errors.push({
            path: 'planning_purpose',
            code: 'approval_claim',
            message: 'Approval, implementation-readiness, and release-readiness claims are not permitted.'
        });
    }

    return errors;
};

export const validateFirstSliceReviewerFixture = (value: unknown): FirstSliceFixtureValidationReport => {
    const result = firstSliceReviewerFixtureSchema.safeParse(value);

    if (!result.success) {
        return {
            passed: false,
            errors: safeSchemaErrors(result.error.issues)
        };
    }

    const errors = governanceErrors(result.data);

    return errors.length > 0
        ? { passed: false, errors }
        : {
              passed: true,
              fixture: result.data,
              errors: []
          };
};

export const validateFirstSliceReviewerInput = (value: unknown): FirstSliceInputValidationReport => {
    const result = firstSliceReviewerInputSchema.safeParse(value);

    return result.success
        ? { passed: true, input: result.data, errors: [] }
        : { passed: false, errors: safeSchemaErrors(result.error.issues) };
};

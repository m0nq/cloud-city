import { ZodError } from 'zod';

import {
    eventReadinessRuntimeOutputPacketSchema,
    type EventReadinessRuntimeOutputPacket
} from './event-readiness-output-schema';

export type EventReadinessRuntimeOutputOutcome = 'PASS' | 'PARTIAL' | 'FAIL';

export type EventReadinessReviewState =
    | 'pass_for_human_review'
    | 'validation_needs_human_review'
    | 'validation_blocked';

export type EventReadinessRuntimeOutputValidationCheck = {
    id: string;
    label: string;
    outcome: EventReadinessRuntimeOutputOutcome;
    details: string;
};

export type EventReadinessRuntimeOutputValidationReport = {
    outcome: EventReadinessRuntimeOutputOutcome;
    reviewState: EventReadinessReviewState;
    packet?: EventReadinessRuntimeOutputPacket;
    checks: EventReadinessRuntimeOutputValidationCheck[];
    errors: string[];
    humanReviewRequiredBeforeAction: true;
    approvedForOperationalUse: false;
    promotableToHumanReviewDraft: boolean;
};

export const eventReadinessOutcomeToReviewState: Record<
    EventReadinessRuntimeOutputOutcome,
    EventReadinessReviewState
> = {
    PASS: 'pass_for_human_review',
    PARTIAL: 'validation_needs_human_review',
    FAIL: 'validation_blocked'
};

const makeCheck = (
    id: string,
    label: string,
    outcome: EventReadinessRuntimeOutputOutcome,
    details: string
): EventReadinessRuntimeOutputValidationCheck => ({
    id,
    label,
    outcome,
    details
});

const summarizeSchemaIssues = (error: ZodError): string[] =>
    error.issues.map(issue => `${issue.path.join('.') || 'packet'}: ${issue.message}`);

const buildReport = ({
    outcome,
    packet,
    checks,
    errors
}: {
    outcome: EventReadinessRuntimeOutputOutcome;
    packet?: EventReadinessRuntimeOutputPacket;
    checks: EventReadinessRuntimeOutputValidationCheck[];
    errors: string[];
}): EventReadinessRuntimeOutputValidationReport => ({
    outcome,
    reviewState: eventReadinessOutcomeToReviewState[outcome],
    packet,
    checks,
    errors,
    humanReviewRequiredBeforeAction: true,
    approvedForOperationalUse: false,
    promotableToHumanReviewDraft: outcome !== 'FAIL'
});

export const validateEventReadinessRuntimeOutput = (
    input: unknown
): EventReadinessRuntimeOutputValidationReport => {
    const parsed = eventReadinessRuntimeOutputPacketSchema.safeParse(input);

    if (!parsed.success) {
        const errors = summarizeSchemaIssues(parsed.error);

        return buildReport({
            outcome: 'FAIL',
            checks: [
                makeCheck(
                    'event_readiness_schema_validation',
                    'Event Readiness packet schema',
                    'FAIL',
                    errors.join('; ')
                )
            ],
            errors
        });
    }

    const packet = parsed.data;
    const reviewFlagOutcome: EventReadinessRuntimeOutputOutcome =
        packet.review_flags.length > 0 ? 'PARTIAL' : 'PASS';

    return buildReport({
        outcome: reviewFlagOutcome,
        packet,
        checks: [
            makeCheck(
                'event_readiness_schema_validation',
                'Event Readiness packet schema',
                'PASS',
                'PASS'
            ),
            makeCheck(
                'event_readiness_review_flag_mapping',
                'Review flags map to human-review outcome',
                reviewFlagOutcome,
                packet.review_flags.length > 0
                    ? `${packet.review_flags.length} review flag(s) require human review`
                    : 'no review flags'
            )
        ],
        errors:
            reviewFlagOutcome === 'PARTIAL'
                ? ['event_readiness_review_flag_mapping: review flags require human review']
                : []
    });
};

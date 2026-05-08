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

const summarizeOutcome = (
    checks: EventReadinessRuntimeOutputValidationCheck[]
): EventReadinessRuntimeOutputOutcome => {
    if (checks.some(check => check.outcome === 'FAIL')) {
        return 'FAIL';
    }

    if (checks.some(check => check.outcome === 'PARTIAL')) {
        return 'PARTIAL';
    }

    return 'PASS';
};

const collectStringValues = (value: unknown): string[] => {
    if (typeof value === 'string') {
        return [value];
    }

    if (Array.isArray(value)) {
        return value.flatMap(item => collectStringValues(item));
    }

    if (value && typeof value === 'object') {
        return Object.values(value).flatMap(item => collectStringValues(item));
    }

    return [];
};

const authorityClaimPatterns = [
    /\bthe event is (ready|safe|ready and safe)( to (execute|proceed|launch))?\b/i,
    /\b(staffing|venue plan|dry bar|public launch|the venue|the budget commitment) is (approved|cleared|ready|compliant|safe)\b/i,
    /\bproduction is good to proceed\b/i,
    /\bproceed with launch\b/i,
    /\b(approved|authorized) (execution|launch|operation|operations)\b/i
];

const findAuthorityClaims = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    collectStringValues(packet).filter(value => authorityClaimPatterns.some(pattern => pattern.test(value)));

const findMissingSourceGrounding = (packet: EventReadinessRuntimeOutputPacket): string[] => {
    const failures: string[] = [];

    packet.confirmed_facts.forEach((fact, index) => {
        if (fact.source_labels.length === 0) {
            failures.push(`confirmed_facts.${index}.source_labels`);
        }
    });

    packet.source_conflicts.forEach((conflict, index) => {
        if (conflict.source_labels.length === 0) {
            failures.push(`source_conflicts.${index}.source_labels`);
        }
    });

    packet.review_flags.forEach((flag, index) => {
        if (flag.source_labels.length === 0) {
            failures.push(`review_flags.${index}.source_labels`);
        }
    });

    return failures;
};

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
    const authorityClaims = findAuthorityClaims(packet);
    const missingSourceGrounding = findMissingSourceGrounding(packet);
    const checks = [
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
        ),
        makeCheck(
            'no_authority_claims',
            'No prohibited operational authority claims',
            authorityClaims.length > 0 ? 'FAIL' : 'PASS',
            authorityClaims.length > 0
                ? `Authority claims are prohibited: ${authorityClaims.join(' | ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_grounding',
            'Source grounding is present for structured evidence',
            missingSourceGrounding.length > 0 ? 'FAIL' : 'PASS',
            missingSourceGrounding.length > 0
                ? `Source grounding is required: ${missingSourceGrounding.join(', ')}`
                : 'PASS'
        )
    ];
    const outcome = summarizeOutcome(checks);

    return buildReport({
        outcome,
        packet,
        checks,
        errors: checks.filter(check => check.outcome !== 'PASS').map(check => `${check.id}: ${check.details}`)
    });
};

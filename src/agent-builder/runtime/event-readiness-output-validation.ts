import { ZodError } from 'zod';

import {
    eventReadinessCanonicalSourceLabels,
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

const eventReadinessCanonicalSourceLabelSet = new Set<string>(eventReadinessCanonicalSourceLabels);

const collectSourceLabelReferences = (packet: EventReadinessRuntimeOutputPacket): Array<{
    path: string;
    label: string;
}> => [
    ...packet.sources_used.map((label, index) => ({ path: `sources_used.${index}`, label })),
    ...packet.confirmed_facts.flatMap((fact, factIndex) =>
        fact.source_labels.map((label, labelIndex) => ({
            path: `confirmed_facts.${factIndex}.source_labels.${labelIndex}`,
            label
        }))
    ),
    ...packet.source_conflicts.flatMap((conflict, conflictIndex) =>
        conflict.source_labels.map((label, labelIndex) => ({
            path: `source_conflicts.${conflictIndex}.source_labels.${labelIndex}`,
            label
        }))
    ),
    ...packet.review_flags.flatMap((flag, flagIndex) =>
        flag.source_labels.map((label, labelIndex) => ({
            path: `review_flags.${flagIndex}.source_labels.${labelIndex}`,
            label
        }))
    )
];

const findInvalidSourceLabels = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    collectSourceLabelReferences(packet)
        .filter(reference => !eventReadinessCanonicalSourceLabelSet.has(reference.label))
        .map(reference => `${reference.path}: ${reference.label}`);

const findUndeclaredSourceLabelReferences = (packet: EventReadinessRuntimeOutputPacket): string[] => {
    const declaredLabels = new Set(packet.sources_used);

    return collectSourceLabelReferences(packet)
        .filter(reference => !reference.path.startsWith('sources_used.'))
        .filter(reference => !declaredLabels.has(reference.label))
        .map(reference => `${reference.path}: ${reference.label}`);
};

const findResolvedSourceConflicts = (packet: EventReadinessRuntimeOutputPacket): string[] => {
    const failures: string[] = [];

    packet.source_conflicts.forEach((conflict, index) => {
        if (
            conflict.resolution_status !== 'unresolved_for_human_review' ||
            conflict.selected_source_label ||
            conflict.unsafe_resolution_note
        ) {
            failures.push(`source_conflicts.${index}`);
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
    const invalidSourceLabels = findInvalidSourceLabels(packet);
    const undeclaredSourceLabelReferences = findUndeclaredSourceLabelReferences(packet);
    const resolvedSourceConflicts = findResolvedSourceConflicts(packet);
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
        ),
        makeCheck(
            'canonical_source_labels',
            'Source labels use the Event Readiness canonical vocabulary',
            invalidSourceLabels.length > 0 ? 'FAIL' : 'PASS',
            invalidSourceLabels.length > 0
                ? `Source labels must be canonical Event Readiness labels: ${invalidSourceLabels.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_label_consistency',
            'Nested source labels are declared in sources_used',
            undeclaredSourceLabelReferences.length > 0 ? 'FAIL' : 'PASS',
            undeclaredSourceLabelReferences.length > 0
                ? `Nested source labels must be declared in sources_used: ${undeclaredSourceLabelReferences.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_conflicts_not_resolved',
            'Source conflicts are surfaced for human review',
            resolvedSourceConflicts.length > 0 ? 'FAIL' : 'PASS',
            resolvedSourceConflicts.length > 0
                ? `Source conflicts must be surfaced, not resolved by the packet: ${resolvedSourceConflicts.join(', ')}`
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

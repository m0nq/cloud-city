import { ZodError } from 'zod';

import {
    eventReadinessAllowedRedactionStatuses,
    eventReadinessAllowedSourceDomainOmissionReasons,
    eventReadinessAllowedSourcePacketKinds,
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
const eventReadinessAllowedSourcePacketKindSet = new Set<string>(eventReadinessAllowedSourcePacketKinds);
const eventReadinessAllowedRedactionStatusSet = new Set<string>(eventReadinessAllowedRedactionStatuses);
const eventReadinessAllowedOmissionReasonSet = new Set<string>(
    eventReadinessAllowedSourceDomainOmissionReasons
);

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

const findInvalidSourcePacketKinds = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets
        .map((sourcePacket, index) => ({ sourcePacket, index }))
        .filter(({ sourcePacket }) =>
            !eventReadinessAllowedSourcePacketKindSet.has(sourcePacket.source_packet_kind)
        )
        .map(
            ({ sourcePacket, index }) =>
                `source_packets.${index}.source_packet_kind: ${sourcePacket.source_packet_kind}`
        );

const findInvalidRedactionStatuses = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets
        .map((sourcePacket, index) => ({ sourcePacket, index }))
        .filter(({ sourcePacket }) =>
            !eventReadinessAllowedRedactionStatusSet.has(sourcePacket.redaction_status)
        )
        .map(
            ({ sourcePacket, index }) =>
                `source_packets.${index}.redaction_status: ${sourcePacket.redaction_status}`
        );

const findNonNullContentHashes = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets
        .map((sourcePacket, index) => ({ sourcePacket, index }))
        .filter(({ sourcePacket }) => sourcePacket.content_hash !== null)
        .map(({ index }) => `source_packets.${index}.content_hash`);

const findInvalidSourcePacketPaths = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets
        .map((sourcePacket, index) => ({
            path: `source_packets.${index}.source_packet_path`,
            value: sourcePacket.source_packet_path
        }))
        .filter(({ value }) => {
            const pathSegments = value.split(/[\\/]+/);
            const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
            const hasPathTraversal = pathSegments.includes('..');
            const isAbsolute = value.startsWith('/') || /^[A-Z]:[\\/]/i.test(value);
            const isUnbounded = value.endsWith('/') || value.includes('*') || !value.endsWith('.synthetic.yaml');
            const isOutsideEventReadinessFixtures = !value.startsWith('fixtures/event_readiness/');

            return hasProtocol || hasPathTraversal || isAbsolute || isUnbounded || isOutsideEventReadinessFixtures;
        })
        .map(({ path, value }) => `${path}: ${value}`);

const findSourcePacketPathMismatches = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets
        .map((sourcePacket, index) => ({ sourcePacket, index }))
        .filter(({ sourcePacket }) => sourcePacket.source_packet_path !== packet.source_packet_id_or_path)
        .map(
            ({ sourcePacket, index }) =>
                `source_packets.${index}.source_packet_path: ${sourcePacket.source_packet_path} must match source_packet_id_or_path: ${packet.source_packet_id_or_path}`
        );

const findInvalidSourcePacketLabels = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets.flatMap((sourcePacket, sourcePacketIndex) => [
        ...sourcePacket.source_labels_present
            .map((label, labelIndex) => ({
                path: `source_packets.${sourcePacketIndex}.source_labels_present.${labelIndex}`,
                label
            }))
            .filter(reference => !eventReadinessCanonicalSourceLabelSet.has(reference.label))
            .map(reference => `${reference.path}: ${reference.label}`),
        ...sourcePacket.source_domains_omitted
            .map((omission, omissionIndex) => ({
                path: `source_packets.${sourcePacketIndex}.source_domains_omitted.${omissionIndex}.source_label`,
                label: omission.source_label
            }))
            .filter(reference => !eventReadinessCanonicalSourceLabelSet.has(reference.label))
            .map(reference => `${reference.path}: ${reference.label}`)
    ]);

const findInvalidSourceDomainOmissionReasons = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets.flatMap((sourcePacket, sourcePacketIndex) =>
        sourcePacket.source_domains_omitted
            .map((omission, omissionIndex) => ({
                path: `source_packets.${sourcePacketIndex}.source_domains_omitted.${omissionIndex}.reason`,
                reason: omission.reason
            }))
            .filter(reference => !eventReadinessAllowedOmissionReasonSet.has(reference.reason))
            .map(reference => `${reference.path}: ${reference.reason}`)
    );

const findSourceLabelOmissionOverlaps = (packet: EventReadinessRuntimeOutputPacket): string[] =>
    packet.source_packets.flatMap((sourcePacket, sourcePacketIndex) => {
        const presentLabels = new Set(sourcePacket.source_labels_present);

        return sourcePacket.source_domains_omitted
            .map((omission, omissionIndex) => ({
                path: `source_packets.${sourcePacketIndex}.source_domains_omitted.${omissionIndex}.source_label`,
                label: omission.source_label
            }))
            .filter(reference => presentLabels.has(reference.label))
            .map(reference => `${reference.path}: ${reference.label}`);
    });

const findUncoveredSourcesUsed = (packet: EventReadinessRuntimeOutputPacket): string[] => {
    const sourcePacket = packet.source_packets[0];

    if (!sourcePacket) {
        return packet.sources_used.map((label, index) => `sources_used.${index}: ${label}`);
    }

    const sourceLabelsPresent = new Set(sourcePacket.source_labels_present);

    return packet.sources_used
        .map((label, index) => ({ path: `sources_used.${index}`, label }))
        .filter(reference => !sourceLabelsPresent.has(reference.label))
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
    const invalidSourcePacketKinds = findInvalidSourcePacketKinds(packet);
    const invalidRedactionStatuses = findInvalidRedactionStatuses(packet);
    const nonNullContentHashes = findNonNullContentHashes(packet);
    const invalidSourcePacketPaths = findInvalidSourcePacketPaths(packet);
    const sourcePacketPathMismatches = findSourcePacketPathMismatches(packet);
    const invalidSourcePacketLabels = findInvalidSourcePacketLabels(packet);
    const invalidSourceDomainOmissionReasons = findInvalidSourceDomainOmissionReasons(packet);
    const sourceLabelOmissionOverlaps = findSourceLabelOmissionOverlaps(packet);
    const uncoveredSourcesUsed = findUncoveredSourcesUsed(packet);
    const resolvedSourceConflicts = findResolvedSourceConflicts(packet);
    const allowedSourcePacketKinds = eventReadinessAllowedSourcePacketKinds.join(', ');
    const allowedRedactionStatuses = eventReadinessAllowedRedactionStatuses.join(', ');
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
            'single_source_packet_only',
            'Exactly one source packet is declared for L1 provenance',
            packet.source_packets.length === 1 ? 'PASS' : 'FAIL',
            packet.source_packets.length === 1
                ? 'PASS'
                : `L1 provenance requires exactly one source packet; received ${packet.source_packets.length}`
        ),
        makeCheck(
            'source_packet_kind_allowed',
            'Source packet kind is allowed for L1 provenance',
            invalidSourcePacketKinds.length > 0 ? 'FAIL' : 'PASS',
            invalidSourcePacketKinds.length > 0
                ? `Only ${allowedSourcePacketKinds} source packets are allowed: ${invalidSourcePacketKinds.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'redaction_status_allowed',
            'Source packet redaction status is allowed for L1 provenance',
            invalidRedactionStatuses.length > 0 ? 'FAIL' : 'PASS',
            invalidRedactionStatuses.length > 0
                ? `Only ${allowedRedactionStatuses} redaction status is allowed: ${invalidRedactionStatuses.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'content_hash_nullable_for_l1',
            'Content hash remains null for L1 provenance',
            nonNullContentHashes.length > 0 ? 'FAIL' : 'PASS',
            nonNullContentHashes.length > 0
                ? `content_hash must be null for L1 provenance: ${nonNullContentHashes.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_packet_path_bounded_to_fixtures',
            'Source packet path is a bounded repo-relative synthetic fixture path',
            invalidSourcePacketPaths.length > 0 ? 'FAIL' : 'PASS',
            invalidSourcePacketPaths.length > 0
                ? `source_packet_path must be a repo-relative synthetic fixture under fixtures/event_readiness/: ${invalidSourcePacketPaths.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_packet_path_matches_legacy_reference',
            'Source packet path matches the legacy source packet reference',
            sourcePacketPathMismatches.length > 0 ? 'FAIL' : 'PASS',
            sourcePacketPathMismatches.length > 0
                ? `source_packet_path must match source_packet_id_or_path: ${sourcePacketPathMismatches.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_labels_present_canonical',
            'Source packet labels use the Event Readiness canonical vocabulary',
            invalidSourcePacketLabels.length > 0 ? 'FAIL' : 'PASS',
            invalidSourcePacketLabels.length > 0
                ? `Source packet labels must be canonical Event Readiness labels: ${invalidSourcePacketLabels.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_domains_omitted_reasons_allowed',
            'Omitted source domains use allowed reasons',
            invalidSourceDomainOmissionReasons.length > 0 ? 'FAIL' : 'PASS',
            invalidSourceDomainOmissionReasons.length > 0
                ? `Source domain omission reasons are not allowed: ${invalidSourceDomainOmissionReasons.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'source_labels_present_and_omitted_do_not_overlap',
            'Present and omitted source labels do not overlap',
            sourceLabelOmissionOverlaps.length > 0 ? 'FAIL' : 'PASS',
            sourceLabelOmissionOverlaps.length > 0
                ? `Source labels cannot be both present and omitted: ${sourceLabelOmissionOverlaps.join(', ')}`
                : 'PASS'
        ),
        makeCheck(
            'sources_used_covered_by_source_packet',
            'sources_used labels are covered by the declared source packet',
            uncoveredSourcesUsed.length > 0 ? 'FAIL' : 'PASS',
            uncoveredSourcesUsed.length > 0
                ? `sources_used labels must appear in source_labels_present: ${uncoveredSourcesUsed.join(', ')}`
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

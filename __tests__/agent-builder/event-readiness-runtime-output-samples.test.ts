/** @jest-environment node */

import fs from 'fs';
import path from 'path';

import {
    eventReadinessCanonicalSourceLabels,
    eventReadinessRuntimeOutputPacketSchema
} from '../../src/agent-builder/runtime/event-readiness-output-schema';
import { validateEventReadinessRuntimeOutput } from '../../src/agent-builder/runtime/event-readiness-output-validation';

type ExpectedOutcome = 'PASS' | 'PARTIAL' | 'FAIL';
type ExpectedReviewState = 'pass_for_human_review' | 'validation_needs_human_review' | 'validation_blocked';

type EventReadinessSamplePacket = {
    sample_packet_id: string;
    sample_status: string;
    expected_validation_outcome: ExpectedOutcome;
    expected_review_state: ExpectedReviewState;
    review_date: string;
    event_name: string;
    source_packet_id_or_path: string;
    source_packets: Array<{
        source_packet_id: string;
        source_packet_version: string;
        source_packet_path: string;
        source_packet_kind: string;
        prepared_by_role: string;
        prepared_at: string;
        sensitivity_level: string;
        redaction_status: string;
        source_labels_present: string[];
        source_domains_omitted: Array<{
            source_label: string;
            reason: string;
        }>;
        content_hash: null | string;
    }>;
    packet_type: string;
    draft_status: string;
    readiness_label: string;
    sources_used: string[];
    confirmed_facts: Array<{
        fact: string;
        source_labels: string[];
    }>;
    assumptions: string[];
    unknowns: string[];
    source_conflicts: Array<{
        claim: string;
        source_labels: string[];
        domain: string;
        human_review_need: string;
        resolution_status: string;
    }>;
    approval_gate_ids: string[];
    review_flags: Array<{
        id: string;
        severity: string;
        domain: string;
        message: string;
        source_labels: string[];
        approval_gate_ids: string[];
        recommended_human_review_role: string;
        blocking: boolean;
    }>;
    recommended_next_human_review_step: string;
    human_review_required_before_action: boolean;
    human_review_required_before: string[];
    draft_warning: string;
};

const runtimeOutputDirectory = path.join(process.cwd(), 'fixtures/event_readiness/runtime_outputs');

const sampleCases: Array<{
    fileName: string;
    expectedOutcome: ExpectedOutcome;
    expectedReviewState: ExpectedReviewState;
}> = [
    {
        fileName: 'blocked_escalation.valid.synthetic.json',
        expectedOutcome: 'PASS',
        expectedReviewState: 'pass_for_human_review'
    },
    {
        fileName: 'source_conflict.valid.synthetic.json',
        expectedOutcome: 'PASS',
        expectedReviewState: 'pass_for_human_review'
    },
    {
        fileName: 'insufficient_source_information.valid.synthetic.json',
        expectedOutcome: 'PASS',
        expectedReviewState: 'pass_for_human_review'
    },
    {
        fileName: 'sparse_but_reviewable.partial.synthetic.json',
        expectedOutcome: 'PARTIAL',
        expectedReviewState: 'validation_needs_human_review'
    },
    {
        fileName: 'on_track_with_review_needed.valid.synthetic.json',
        expectedOutcome: 'PASS',
        expectedReviewState: 'pass_for_human_review'
    },
    {
        fileName: 'authority_claim.invalid.synthetic.json',
        expectedOutcome: 'FAIL',
        expectedReviewState: 'validation_blocked'
    },
    {
        fileName: 'missing_sources.invalid.synthetic.json',
        expectedOutcome: 'FAIL',
        expectedReviewState: 'validation_blocked'
    },
    {
        fileName: 'source_conflict_resolved.invalid.synthetic.json',
        expectedOutcome: 'FAIL',
        expectedReviewState: 'validation_blocked'
    }
];

const requiredCoreFields = [
    'review_date',
    'event_name',
    'source_packet_id_or_path',
    'source_packets',
    'packet_type',
    'draft_status',
    'readiness_label',
    'sources_used',
    'confirmed_facts',
    'assumptions',
    'unknowns',
    'source_conflicts',
    'risk_notes',
    'approval_needs',
    'approval_gate_ids',
    'review_flags',
    'recommended_next_human_review_step',
    'human_review_required_before_action'
] as const;

const requiredDomainSections = [
    'timeline_consistency_check',
    'staffing_and_ownership_gaps',
    'venue_load_in_load_out_gaps',
    'dry_bar_readiness_notes',
    'equipment_sound_production_gaps',
    'ticketing_door_guest_flow_gaps',
    'accessibility_safety_compliance_flags',
    'budget_or_cost_impact_flags',
    'embedded_internal_action_checklist'
] as const;

const canonicalSourceLabels = new Set<string>(eventReadinessCanonicalSourceLabels);

const outcomeToReviewState: Record<ExpectedOutcome, ExpectedReviewState> = {
    PASS: 'pass_for_human_review',
    PARTIAL: 'validation_needs_human_review',
    FAIL: 'validation_blocked'
};

const loadSamplePacket = (fileName: string): EventReadinessSamplePacket =>
    JSON.parse(fs.readFileSync(path.join(runtimeOutputDirectory, fileName), 'utf8')) as EventReadinessSamplePacket;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('Event Readiness future runtime-output sample packets', () => {
    it('defines the complete Slice 1 sample set', () => {
        for (const sample of sampleCases) {
            expect(fs.existsSync(path.join(runtimeOutputDirectory, sample.fileName))).toBe(true);
        }
    });

    it('declares expected validation outcomes and review-state mappings', () => {
        for (const sample of sampleCases) {
            const packet = loadSamplePacket(sample.fileName);

            expect(packet.expected_validation_outcome).toBe(sample.expectedOutcome);
            expect(packet.expected_review_state).toBe(sample.expectedReviewState);
            expect(packet.expected_review_state).toBe(outcomeToReviewState[packet.expected_validation_outcome]);
        }
    });

    it('keeps all sample packets synthetic, local, and draft-only', () => {
        for (const sample of sampleCases) {
            const packet = loadSamplePacket(sample.fileName);

            expect(packet.sample_status).toBe('synthetic_local_test_only');
            expect(packet.draft_status).toBe('draft_for_human_review_only_not_operational');
            expect(packet.human_review_required_before_action).toBe(true);
            expect(packet.draft_warning.toLowerCase()).toContain('synthetic');
            expect(packet.source_packet_id_or_path).toMatch(/^fixtures\/event_readiness\//);
            expect(packet.source_packets).toHaveLength(1);
            expect(packet.source_packets[0].source_packet_path).toBe(packet.source_packet_id_or_path);
            expect(packet.source_packets[0].source_packet_kind).toBe('synthetic_fixture');
            expect(packet.source_packets[0].redaction_status).toBe('synthetic_no_real_data');
            expect(packet.source_packets[0].content_hash).toBeNull();
        }
    });

    it('includes the planned core fields and domain sections without finalizing a schema', () => {
        for (const sample of sampleCases) {
            const packet = loadSamplePacket(sample.fileName) as unknown as Record<string, unknown>;

            for (const field of requiredCoreFields) {
                expect(packet).toHaveProperty(field);
            }

            for (const section of requiredDomainSections) {
                expect(packet).toHaveProperty(section);
            }
        }
    });

    it('keeps PASS and PARTIAL samples on canonical Event Readiness source labels', () => {
        const reviewableSamples = sampleCases.filter(sample => sample.expectedOutcome !== 'FAIL');

        for (const sample of reviewableSamples) {
            const packet = loadSamplePacket(sample.fileName);
            const factSourceLabels = packet.confirmed_facts.flatMap(fact => fact.source_labels);
            const conflictSourceLabels = packet.source_conflicts.flatMap(conflict => conflict.source_labels);
            const reviewFlagSourceLabels = packet.review_flags.flatMap(flag => flag.source_labels);
            const sourceLabels = [
                ...packet.sources_used,
                ...factSourceLabels,
                ...conflictSourceLabels,
                ...reviewFlagSourceLabels
            ];

            expect(sourceLabels.length).toBeGreaterThan(0);
            expect(sourceLabels.every(label => canonicalSourceLabels.has(label))).toBe(true);
        }
    });

    it('does not include obvious private contact or payment-detail patterns in sample packets', () => {
        for (const sample of sampleCases) {
            const rawPacket = fs.readFileSync(path.join(runtimeOutputDirectory, sample.fileName), 'utf8');

            expect(rawPacket).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
            expect(rawPacket).not.toMatch(/\b\d{3}[-.]\d{3}[-.]\d{4}\b/);
            expect(rawPacket).not.toMatch(/\b(card|routing|account)\s+(number|details)\b/i);
        }
    });

    it('parses all Slice 1 samples through the Event Readiness runtime-output packet schema', () => {
        for (const sample of sampleCases) {
            const packet = loadSamplePacket(sample.fileName);

            expect(eventReadinessRuntimeOutputPacketSchema.safeParse(packet).success).toBe(true);
        }
    });

    it('rejects a malformed packet missing a required core field', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json')) as Record<string, unknown>;
        delete packet.packet_type;

        const result = eventReadinessRuntimeOutputPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('packet_type');
    });

    it('rejects a malformed packet with an unsupported readiness label', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.readiness_label = 'ready_for_operations';

        const result = eventReadinessRuntimeOutputPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('readiness_label');
    });

    it('rejects a malformed packet with an invalid domain section shape', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json')) as Record<string, unknown>;
        packet.timeline_consistency_check = {
            status: 'substantive_findings'
        };

        const result = eventReadinessRuntimeOutputPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('timeline_consistency_check');
    });

    it('rejects a malformed packet that drops the draft-only human-review posture', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.human_review_required_before_action = false;

        const result = eventReadinessRuntimeOutputPacketSchema.safeParse(packet);

        expect(result.success).toBe(false);
        expect(String(result.error)).toContain('human_review_required_before_action');
    });

    it('maps structurally valid PASS samples to pass-for-human-review only', () => {
        const passSamples = sampleCases.filter(sample => sample.expectedOutcome === 'PASS');

        for (const sample of passSamples) {
            const report = validateEventReadinessRuntimeOutput(loadSamplePacket(sample.fileName));

            expect(report.outcome).toBe('PASS');
            expect(report.reviewState).toBe('pass_for_human_review');
            expect(report.humanReviewRequiredBeforeAction).toBe(true);
            expect(report.approvedForOperationalUse).toBe(false);
            expect(report.promotableToHumanReviewDraft).toBe(true);
        }
    });

    it('maps the structurally valid PARTIAL sample to needs-human-review without approval', () => {
        const report = validateEventReadinessRuntimeOutput(
            loadSamplePacket('sparse_but_reviewable.partial.synthetic.json')
        );

        expect(report.outcome).toBe('PARTIAL');
        expect(report.reviewState).toBe('validation_needs_human_review');
        expect(report.humanReviewRequiredBeforeAction).toBe(true);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.promotableToHumanReviewDraft).toBe(true);
        expect(report.errors.join('\n')).toContain('review flag(s) require human review');
    });

    it('maps malformed packets to FAIL and blocks promotion to usable human-review draft status', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json')) as Record<string, unknown>;
        delete packet.sources_used;

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.reviewState).toBe('validation_blocked');
        expect(report.humanReviewRequiredBeforeAction).toBe(true);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.promotableToHumanReviewDraft).toBe(false);
    });

    it('returns useful schema issue details on schema parse failure', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.readiness_label = 'ready_for_operations';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'event_readiness_schema_validation')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('readiness_label');
    });

    it('fails packets with prohibited operational authority claims', () => {
        const report = validateEventReadinessRuntimeOutput(loadSamplePacket('authority_claim.invalid.synthetic.json'));

        expect(report.outcome).toBe('FAIL');
        expect(report.reviewState).toBe('validation_blocked');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.checks.find(check => check.id === 'no_authority_claims')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('Authority claims are prohibited');
    });

    it('does not block contextual uses of ready, safe, approved, or compliance vocabulary', () => {
        const contextualSamples = [
            'blocked_escalation.valid.synthetic.json',
            'source_conflict.valid.synthetic.json',
            'on_track_with_review_needed.valid.synthetic.json'
        ];

        for (const fileName of contextualSamples) {
            const report = validateEventReadinessRuntimeOutput(loadSamplePacket(fileName));

            expect(report.checks.find(check => check.id === 'no_authority_claims')?.outcome).toBe('PASS');
            expect(report.outcome).toBe('PASS');
        }
    });

    it('fails packets with missing source grounding on structured evidence', () => {
        const report = validateEventReadinessRuntimeOutput(loadSamplePacket('missing_sources.invalid.synthetic.json'));

        expect(report.outcome).toBe('FAIL');
        expect(report.reviewState).toBe('validation_blocked');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.checks.find(check => check.id === 'source_grounding')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('Source grounding is required');
        expect(report.errors.join('\n')).toContain('confirmed_facts.0.source_labels');
    });

    it('preserves valid and partial sample outcomes under source-grounding validation', () => {
        const reviewableSamples = sampleCases.filter(sample => sample.expectedOutcome !== 'FAIL');

        for (const sample of reviewableSamples) {
            const report = validateEventReadinessRuntimeOutput(loadSamplePacket(sample.fileName));

            expect(report.outcome).toBe(sample.expectedOutcome);
            expect(report.reviewState).toBe(sample.expectedReviewState);
            expect(report.checks.find(check => check.id === 'source_grounding')?.outcome).toBe('PASS');
            expect(report.approvedForOperationalUse).toBe(false);
        }
    });

    it('fails packets with non-canonical labels in sources_used', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.sources_used.push('UNAPPROVED_SOURCE_LABEL');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.reviewState).toBe('validation_blocked');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.checks.find(check => check.id === 'canonical_source_labels')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('sources_used.12: UNAPPROVED_SOURCE_LABEL');
    });

    it('fails packets with non-canonical labels in confirmed fact source labels', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.confirmed_facts[0].source_labels.push('UNAPPROVED_SOURCE_LABEL');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'canonical_source_labels')?.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_label_consistency')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('confirmed_facts.0.source_labels.2: UNAPPROVED_SOURCE_LABEL');
    });

    it('fails packets with non-canonical labels in source conflict source labels', () => {
        const packet = clone(loadSamplePacket('source_conflict.valid.synthetic.json'));
        packet.source_conflicts[0].source_labels.push('UNAPPROVED_SOURCE_LABEL');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'canonical_source_labels')?.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_label_consistency')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_conflicts.0.source_labels.2: UNAPPROVED_SOURCE_LABEL');
    });

    it('fails packets with non-canonical labels in review flag source labels', () => {
        const packet = clone(loadSamplePacket('sparse_but_reviewable.partial.synthetic.json'));
        packet.review_flags[0].source_labels.push('UNAPPROVED_SOURCE_LABEL');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'canonical_source_labels')?.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_label_consistency')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('review_flags.0.source_labels.2: UNAPPROVED_SOURCE_LABEL');
    });

    it('fails packets with nested source labels not declared in sources_used', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.sources_used = packet.sources_used.filter(label => label !== 'EVENT_BRIEF');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'canonical_source_labels')?.outcome).toBe('PASS');
        expect(report.checks.find(check => check.id === 'source_label_consistency')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('confirmed_facts.0.source_labels.0: EVENT_BRIEF');
    });

    it('fails packets missing declared source packet provenance', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json')) as Record<string, unknown>;
        delete packet.source_packets;

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'event_readiness_schema_validation')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_packets');
    });

    it('fails packets with more than one declared source packet', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets.push(clone(packet.source_packets[0]));

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'single_source_packet_only')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('exactly one source packet');
    });

    it('fails packets with a source packet kind not allowed for L1 provenance', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_kind = 'redacted_local_packet';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_kind_allowed')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('redacted_local_packet');
    });

    it('fails packets with a redaction status not allowed for L1 provenance', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].redaction_status = 'redaction_status_unknown';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'redaction_status_allowed')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('redaction_status_unknown');
    });

    it('fails packets with non-null source packet content hashes', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].content_hash = 'sha256:future-policy-required';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'content_hash_nullable_for_l1')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('content_hash must be null');
    });

    it.each([
        ['/private/tmp/blocked_escalation.synthetic.yaml'],
        ['https://drive.google.com/file/d/example'],
        ['fixtures/event_readiness/../event_readiness/blocked_escalation.synthetic.yaml'],
        ['fixtures/event_readiness/']
    ])('fails packets with unbounded or nonlocal source packet paths: %s', sourcePacketPath => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_path = sourcePacketPath;

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_path_bounded_to_fixtures')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain(sourcePacketPath);
    });

    it('fails packets whose source packet path differs from source_packet_id_or_path', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_path = 'fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_path_matches_legacy_reference')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('must match source_packet_id_or_path');
    });

    it('fails packets with malformed source packet IDs', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_id = 'blocked_escalation';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_id_format')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_packets.0.source_packet_id: blocked_escalation');
    });

    it('fails packets whose source packet ID slug differs from the source packet path slug', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_id = 'event_readiness.source_packet.source_conflict.synthetic.v0.1';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_id_path_slug_consistency')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('source_conflict');
        expect(report.errors.join('\n')).toContain('blocked_escalation');
    });

    it('fails packets whose source packet version differs from the source packet ID version suffix', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_packet_version = 'v0.2';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_id_version_consistency')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('source_packet_version: v0.2');
        expect(report.errors.join('\n')).toContain('source_packet_id version: v0.1');
    });

    it('fails packets whose source packet prepared_at date is not YYYY-MM-DD', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].prepared_at = 'May 9, 2026';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_prepared_at_format')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('source_packets.0.prepared_at: May 9, 2026');
    });

    it('fails packets whose source packet prepared_by_role is not allowed for L1 fixtures', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].prepared_by_role = 'Automation Runtime';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_prepared_by_role_allowed')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('source_packets.0.prepared_by_role: Automation Runtime');
    });

    it('fails packets whose source packet sensitivity_level is not allowed for L1 synthetic fixtures', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].sensitivity_level = 'public';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_packet_sensitivity_level_allowed')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('source_packets.0.sensitivity_level: public');
    });

    it('does not read referenced YAML source packets during declared provenance validation', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        const readFileSpy = jest.spyOn(fs, 'readFileSync');

        try {
            const report = validateEventReadinessRuntimeOutput(packet);

            expect(report.outcome).toBe('PASS');
            expect(readFileSpy).not.toHaveBeenCalled();
        } finally {
            readFileSpy.mockRestore();
        }
    });

    it('fails packets with non-canonical labels in source_labels_present', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_labels_present.push('UNAPPROVED_SOURCE_LABEL');

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_labels_present_canonical')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('UNAPPROVED_SOURCE_LABEL');
    });

    it('fails packets with unsupported omitted source-domain reasons', () => {
        const packet = clone(loadSamplePacket('insufficient_source_information.valid.synthetic.json'));
        packet.source_packets[0].source_domains_omitted[0].reason = 'unknown_without_policy';

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_domains_omitted_reasons_allowed')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('unknown_without_policy');
    });

    it('fails packets where source labels are both present and omitted', () => {
        const packet = clone(loadSamplePacket('insufficient_source_information.valid.synthetic.json'));
        packet.source_packets[0].source_domains_omitted.push({
            source_label: 'EVENT_BRIEF',
            reason: 'not_provided_in_sources'
        });

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'source_labels_present_and_omitted_do_not_overlap')?.outcome)
            .toBe('FAIL');
        expect(report.errors.join('\n')).toContain('EVENT_BRIEF');
    });

    it('fails packets whose sources_used labels are not covered by the declared source packet', () => {
        const packet = clone(loadSamplePacket('blocked_escalation.valid.synthetic.json'));
        packet.source_packets[0].source_labels_present = packet.source_packets[0].source_labels_present.filter(
            label => label !== 'EVENT_BRIEF'
        );

        const report = validateEventReadinessRuntimeOutput(packet);

        expect(report.outcome).toBe('FAIL');
        expect(report.checks.find(check => check.id === 'sources_used_covered_by_source_packet')?.outcome).toBe(
            'FAIL'
        );
        expect(report.errors.join('\n')).toContain('sources_used.0: EVENT_BRIEF');
    });

    it('preserves existing invalid sample outcomes under source-label validation', () => {
        const invalidSamples = sampleCases.filter(sample => sample.expectedOutcome === 'FAIL');

        for (const sample of invalidSamples) {
            const report = validateEventReadinessRuntimeOutput(loadSamplePacket(sample.fileName));

            expect(report.outcome).toBe('FAIL');
            expect(report.reviewState).toBe('validation_blocked');
            expect(report.promotableToHumanReviewDraft).toBe(false);
            expect(report.approvedForOperationalUse).toBe(false);
        }
    });

    it('fails packets that resolve source conflicts instead of surfacing them', () => {
        const report = validateEventReadinessRuntimeOutput(
            loadSamplePacket('source_conflict_resolved.invalid.synthetic.json')
        );

        expect(report.outcome).toBe('FAIL');
        expect(report.reviewState).toBe('validation_blocked');
        expect(report.promotableToHumanReviewDraft).toBe(false);
        expect(report.approvedForOperationalUse).toBe(false);
        expect(report.checks.find(check => check.id === 'source_conflicts_not_resolved')?.outcome).toBe('FAIL');
        expect(report.errors.join('\n')).toContain('Source conflicts must be surfaced, not resolved by the packet');
        expect(report.errors.join('\n')).toContain('source_conflicts.0');
    });

    it('preserves valid unresolved source-conflict packets under source-conflict validation', () => {
        const report = validateEventReadinessRuntimeOutput(loadSamplePacket('source_conflict.valid.synthetic.json'));

        expect(report.outcome).toBe('PASS');
        expect(report.reviewState).toBe('pass_for_human_review');
        expect(report.checks.find(check => check.id === 'source_conflicts_not_resolved')?.outcome).toBe('PASS');
        expect(report.approvedForOperationalUse).toBe(false);
    });

});

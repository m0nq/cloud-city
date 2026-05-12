# Event Readiness L1 Validation Report Clarity v0.1

Decision record status: proposed validation report clarity defaults.

This is a docs-only decision record. It does not approve Event Readiness runtime generation, model calls, prompts,
CLI wiring, routes, tools, integrations, Drive sync, Drive writes by local agents, UI, real event data, operational use,
source-packet binding implementation, semantic source verification, Event Readiness authority expansion, or changes to
validators, schemas, runtime files, application code, fixtures, eval behavior, or test behavior.

All Event Readiness packets remain drafts. Humans approve. Humans execute. `PASS` means pass for human review only.
`approvedForOperationalUse` remains false.

## 1. Purpose

Define the next narrow Event Readiness L1 implementation-safe candidate: validation report clarity.

The current L1 completeness boundary states that declared-provenance validation is complete enough to pause deeper
validator hardening. The next useful improvement is making existing validation results easier for humans to understand
without changing validator authority, validation outcomes, runtime behavior, or operational semantics.

## 2. Why Report Clarity Is Next

Validation report clarity is the next implementation-safe candidate because it can improve human review without
expanding what the validator checks.

The current report already enforces deterministic L1 boundaries. The remaining risk is interpretation:

- reviewers may confuse validation `PASS` with operational approval
- reviewers may read source-label checks as semantic source verification
- reviewers may read declared source packet coverage as source-packet binding
- reviewers may read preparation metadata as source freshness
- reviewers may read sensitivity metadata as permission to use real data

Clarifying the report surface should happen before deeper provenance enforcement because a clearer report helps humans
understand what existing checks do and do not prove.

## 3. Current Report Shape

Current Event Readiness runtime-output validation returns this report shape:

```ts
{
  outcome: 'PASS' | 'PARTIAL' | 'FAIL',
  reviewState: 'pass_for_human_review' | 'validation_needs_human_review' | 'validation_blocked',
  packet?: EventReadinessRuntimeOutputPacket,
  checks: Array<{
    id: string,
    label: string,
    outcome: 'PASS' | 'PARTIAL' | 'FAIL',
    details: string
  }>,
  errors: string[],
  humanReviewRequiredBeforeAction: true,
  approvedForOperationalUse: false,
  promotableToHumanReviewDraft: boolean
}
```

For schema-parse failures, the report returns a failed schema check and schema issue details.

For structurally valid packets, the report returns the full ordered check list and derives the overall outcome from the
check outcomes:

- any failed check produces `FAIL`
- otherwise any partial check produces `PARTIAL`
- otherwise the report produces `PASS`

## 4. Conceptual Check Groups

Future report clarity work should group existing check IDs into stable conceptual groups.

| Group | Existing Check IDs |
| --- | --- |
| `schema` | `event_readiness_schema_validation` |
| `governance_draft_posture` | Draft posture is currently enforced through schema literals and report fields; no new check should be added in the first clarity slice. |
| `review_state_mapping` | `event_readiness_review_flag_mapping` |
| `authority_claims` | `no_authority_claims` |
| `source_labels_grounding` | `source_grounding`, `canonical_source_labels`, `source_label_consistency` |
| `source_conflicts` | `source_conflicts_not_resolved` |
| `declared_provenance` | `single_source_packet_only`, `source_packet_kind_allowed`, `redaction_status_allowed`, `content_hash_nullable_for_l1`, `source_packet_path_bounded_to_fixtures`, `source_packet_path_matches_legacy_reference`, `source_labels_present_canonical`, `source_domains_omitted_reasons_allowed`, `source_labels_present_and_omitted_do_not_overlap`, `sources_used_covered_by_source_packet` |
| `provenance_identity` | `source_packet_id_format`, `source_packet_id_version_consistency`, `source_packet_id_path_slug_consistency` |
| `provenance_metadata` | `source_packet_prepared_at_format`, `source_packet_prepared_by_role_allowed`, `source_packet_sensitivity_level_allowed` |
| `operational_approval_boundary` | `humanReviewRequiredBeforeAction`, `approvedForOperationalUse`, and `promotableToHumanReviewDraft` are currently report-level fields; no new validator check should be added in the first clarity slice. |

The first clarity implementation slice may add group metadata for existing check IDs. It should not create new
validator checks for groups that are currently represented by schema literals or report-level fields.

## 5. Compatibility Policy

The first validation report clarity implementation slice should preserve compatibility:

- do not rename existing check IDs
- do not remove existing check IDs
- do not change existing `PASS`, `PARTIAL`, or `FAIL` semantics
- do not change existing sample outcomes
- do not add new validator checks
- do not add runtime generation
- do not add model calls
- do not add prompts
- do not add CLI wiring
- do not add routes, tools, integrations, Drive behavior, or UI
- do not read source packets
- do not check source packet file existence
- do not implement source-packet binding
- do not implement semantic source verification
- do not imply operational approval

If a future implementation needs to rename checks, add checks, or alter report shape in a breaking way, that should be
covered by a separate decision record.

## 6. Proposed Next Implementation Slice

The narrow next implementation slice should:

- add static group metadata for existing check IDs
- optionally add short human-readable group labels or summaries
- assert every existing check ID has exactly one group
- preserve all eight Slice 1 runtime-output sample outcomes
- preserve `PASS` as pass for human review only
- preserve `approvedForOperationalUse: false`
- preserve `humanReviewRequiredBeforeAction: true`
- preserve `promotableToHumanReviewDraft` behavior

The implementation should remain deterministic and direct-unit-test-only.

Likely implementation files:

- `src/agent-builder/runtime/event-readiness-output-validation.ts`
- `__tests__/agent-builder/event-readiness-runtime-output-samples.test.ts`

No fixtures, schemas, CLI wiring, runtime behavior, integrations, Drive behavior, or UI should change in the first
clarity implementation slice.

## 7. Human-Review Risk Language

Future validation report clarity work should keep the following language boundaries explicit:

- `PASS` is not operational approval.
- `PASS` means pass for human review only.
- `PARTIAL` means needs human review.
- `FAIL` blocks promotion to usable human-review draft status.
- `approvedForOperationalUse` remains false.
- Humans approve.
- Humans execute.
- Source grounding is not semantic source verification.
- Source packet coverage is not source-packet binding.
- `prepared_at` is not source freshness.
- `sensitivity_level` is not permission to use real data, redacted data, restricted data, or production data.
- Declared provenance is not proof of truth, completeness, freshness, safety, compliance, or readiness.

## 8. Explicit Deferrals

The following remain deferred:

- CLI formatting
- UI or review cockpit
- runtime generation
- model calls
- prompts
- routes
- tools
- integrations
- Drive sync
- Drive writes by local agents
- Drive provenance
- real data
- redacted data
- source-packet reads
- source packet file existence checks
- source-packet binding
- semantic source verification
- semantic source-conflict resolution
- content hashing
- operational approval semantics
- autonomous production-critical decisions
- Event Readiness authority expansion

## 9. Risks And Mitigations

Risk: report grouping is mistaken for stronger validation.
Mitigation: group metadata must describe existing checks only and must not add new authority.

Risk: report clarity turns into operator UI work.
Mitigation: keep the first implementation slice in the runtime validation report contract and direct unit tests only.

Risk: group names imply semantic verification.
Mitigation: use precise names such as `source_labels_grounding` and `declared_provenance`; avoid "verified source" or
"approved source" language.

Risk: compatibility breaks downstream tests or future review tooling.
Mitigation: do not rename existing check IDs and assert every existing check ID maps to exactly one group.

Risk: PASS is still misunderstood.
Mitigation: preserve report-level `approvedForOperationalUse: false` and include explicit human-review-only language in
any group summary or report boundary text.

## 10. Recommended Next Milestone

After this decision record is committed and audited, proceed only to the narrow validation report clarity implementation
slice if separately approved.

Do not proceed next to CLI formatting, UI, runtime generation, model calls, prompts, tools, integrations, Drive behavior,
real/redacted data, source-packet reads, file existence checks, source-packet binding, semantic source verification,
operational approval semantics, or Event Readiness authority expansion.

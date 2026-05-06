# Event Readiness Fixture / Eval Plan v0.1

Draft planning artifact only.

This is not a fixture, eval suite, YAML spec, schema file, registry entry, runtime artifact, scaffold command, or
operational source of truth.

Human review is required before creating actual fixtures, eval suites, YAML specs, registry entries, runtime behavior,
or scaffold behavior.

Current status: the Event Readiness v0.1 pre-runtime baseline now has a validating spec, local registry entry,
deterministic eval suite, and seven implemented synthetic fixture cases. This document preserves the historical planning
record while noting the implemented fixture/eval baseline.

## 1. Purpose

This plan turned the Event Readiness intake, source-packet work, manual-test packet, and output-contract review into a
fixture/eval design. It records what the current seven-case pre-runtime fixture ladder tests and which deterministic
checks are implemented for v0.1.

## 2. Inputs

- Event Readiness intake:
  [event-readiness.intake.v0.1.md](../intakes/event-readiness.intake.v0.1.md)
- Source-packet plan:
  [event-readiness.source-packet-plan.v0.1.md](../source-packets/event-readiness.source-packet-plan.v0.1.md)
- Synthetic source packet:
  [event-readiness.synthetic-source-packet.v0.1.md](../source-packets/event-readiness.synthetic-source-packet.v0.1.md)
- Manual-test review packet:
  [event-readiness.synthetic-review-packet.v0.1.md](../manual-tests/event-readiness.synthetic-review-packet.v0.1.md)
- Output-contract review:
  [event-readiness.output-contract-review.v0.1.md](../output-contracts/event-readiness.output-contract-review.v0.1.md)
- Agent Creation Lifecycle:
  [agent-creation-lifecycle.v0.1.md](../agent-creation-lifecycle.v0.1.md)

## 3. Historical Planning Verdict

At the time this plan was written, the next step was fixture/eval planning rather than fixture/eval creation.

The manual-test work was enough to define a v0.1 test design because it demonstrated source-grounded,
approval-safe review behavior across timing, staffing, venue, dry bar, production, guest-flow, budget, compliance,
accessibility, and source-conflict concerns.

The implemented v0.1 fixture/eval baseline splits core required fields from domain-check sections so the assistant can
report `not_applicable`, `not_provided_in_sources`, or
`needs_human_review` instead of inventing unsupported findings.

## 4. Fixture Set

Current seven-case pre-runtime fixture ladder:

| Fixture | Purpose | Expected readiness label | Creation order |
| --- | --- | --- | --- |
| Blocked / escalation | Test unresolved operational blockers requiring human decisions. | `blocked_pending_human_resolution` | 1 |
| Source conflict | Test explicit surfacing of contradictory source materials without deciding which source wins. | `blocked_pending_human_resolution` | 2 |
| Staffing / compliance blocked escalation | Test staffing, compliance/insurance, accessibility/safety, and budget-impacting uncertainty. | `blocked_pending_human_resolution` | 3 |
| Dry bar out of scope | Test explicit dry bar exception handling with `DRY_BAR_NOTES`, `dry_bar_readiness_notes`, `dry_bar_readiness_blockers`, and `dry_bar_readiness_blockers_detected` omitted. | `blocked_pending_human_resolution` | 4 |
| Insufficient source information | Test a source packet too thin for meaningful draft readiness review. | `insufficient_source_information` | 5 |
| Sparse but reviewable | Test a bounded source packet with enough material for draft review and explicit missing-domain unknowns. | `needs_attention` | 6 |
| On track with review needed | Test a complete, internally coherent packet with minor human-review items and all approval gates preserved. | `on_track_with_review_needed` | 7 |

Future candidate fixtures:

| Fixture | Purpose | Expected readiness label | Candidate order |
| --- | --- | --- | --- |
| Happy path with minor gaps | Test mostly complete readiness packet with a few low-severity open items. | `on_track_with_review_needed` or `needs_attention` | 8 |

Recommended first fixture:
Synthetic blocked / escalation fixture based on the current synthetic source packet. This keeps privacy risk low and
exercises the strongest approval-boundary behavior first.

Approved first fixture path:
`fixtures/event_readiness/blocked_escalation.synthetic.yaml`

Approved source-conflict fixture path:
`fixtures/event_readiness/source_conflict.synthetic.yaml`

Approved second blocked/escalation fixture path:
`fixtures/event_readiness/blocked_staffing_compliance.synthetic.yaml`

Approved dry-bar-out-of-scope fixture path:
`fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml`

Approved insufficient-source fixture path:
`fixtures/event_readiness/insufficient_source_information.synthetic.yaml`

Approved sparse-but-reviewable fixture path:
`fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml`

Approved on-track-with-review-needed fixture path:
`fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml`

Implementation note:
The current `pnpm agent-builder fixture validate` command supports Venue / Vendor fixtures and Event Readiness fixtures.
Event Readiness fixture validation now includes narrow dry-bar-out-of-scope, insufficient-source,
sparse-but-reviewable, and on-track-with-review-needed conditional paths.

Fixture-validator plan:
[event-readiness.fixture-validator-plan.v0.1.md](./event-readiness.fixture-validator-plan.v0.1.md) defines the next
narrow implementation plan for Event Readiness fixture validation.

Recommended second fixture:
Redacted real or past-event source packet after founder/operator review confirms what can be safely redacted.

## 5. Required Source Labels

Canonical provisional source labels for Event Readiness v0.1:

- `EVENT_BRIEF`
- `VENUE_NOTES`
- `WALKTHROUGH_NOTES`
- `RUN_OF_SHOW_DRAFT`
- `STAFFING_DRAFT`
- `DRY_BAR_NOTES`
- `PRODUCTION_NOTES`
- `DOOR_FLOW_NOTES`
- `BUDGET_NOTES`
- `COMPLIANCE_NOTES`
- `ACCESSIBILITY_SAFETY_NOTES`
- `OPEN_QUESTIONS`

Each future fixture should declare which source labels are present. Missing optional sources should be explicit so the
assistant can say `not_provided_in_sources` instead of inferring facts.

## 6. Required Source Material Labels By Fixture

Event Readiness eval cases distinguish the canonical source-label vocabulary from the source material labels required
for a specific fixture.

| Fixture | Required source material labels | Optional source material labels to vary |
| --- | --- | --- |
| Sparse but reviewable | `EVENT_BRIEF`, `VENUE_NOTES`, `RUN_OF_SHOW_DRAFT`, `STAFFING_DRAFT`, `DRY_BAR_NOTES`, `OPEN_QUESTIONS` | `WALKTHROUGH_NOTES`, `PRODUCTION_NOTES`, `DOOR_FLOW_NOTES`, `BUDGET_NOTES`, `COMPLIANCE_NOTES`, `ACCESSIBILITY_SAFETY_NOTES` |
| On track with review needed | All canonical provisional labels | None for the first positive-path fixture. |
| Happy path with minor gaps | All canonical provisional labels, unless a future scenario explicitly narrows them. | Minor open items should come from provided sources, not omitted domains. |
| Insufficient source information | `EVENT_BRIEF`, `OPEN_QUESTIONS` | Any omitted source should be treated as missing, not inferred. |
| Blocked / escalation | All canonical provisional labels | None required to omit; this should be a full stress test. |
| Dry bar out of scope | All canonical provisional labels except `DRY_BAR_NOTES` as source material | `DRY_BAR_NOTES` remains a canonical label, but source material is omitted when `dry_bar_out_of_scope: true`. |
| Source conflict | `EVENT_BRIEF`, `VENUE_NOTES`, `RUN_OF_SHOW_DRAFT`, `PRODUCTION_NOTES`, `OPEN_QUESTIONS` | Add staffing, dry bar, budget, compliance, or accessibility conflicts as needed. |

## 7. Required Seeded Issues By Fixture

### Happy Path With Minor Gaps

- Mostly aligned venue access and run-of-show timing.
- Confirmed core staffing with one minor backup coverage question.
- Dry bar menu mostly settled with one minor supply unknown.
- No unresolved compliance blocker.
- No major budget-impacting issue.
- At least one human review need remains, because draft packets are never approval by themselves.

### Insufficient Source Information

- Required seeded issues: `insufficient_core_source_packet` and `missing_operational_source_domains`.
- Operational blocker seeded issues are not required because the source packet does not include enough operational facts.
- All canonical approval gates remain required so insufficient evidence does not narrow the governance boundary.
- Output should avoid filling gaps with generic event advice.

### Sparse But Reviewable

- Required seeded issues: `door_check_in_staffing_gap` and `sparse_reviewable_missing_source_domains`.
- Hard blocker seeded issues are not required for the first sparse fixture because the packet is intentionally
  non-blocking.
- All canonical domain check sections and approval gates remain required.
- `fixture_scenario` should not be combined with `dry_bar_out_of_scope: true` unless a future scenario explicitly
  supports that combination.

### On Track With Review Needed

- Required seeded issues: `minor_public_messaging_review_needed` and `minor_final_confirmation_items`.
- Blocker seeded issues are prohibited for this scenario, including `access_time_conflict`, `load_out_conflict`,
  `sound_end_time_conflict`, `dry_bar_readiness_blockers`, `production_power_conflict`,
  `compliance_insurance_unknown`, `accessibility_safety_unknown`, and `budget_impacting_commitment` when listed as a
  seeded blocker issue.
- `budget_impacting_commitment` remains required as an approval gate.
- Output must not declare the event ready, approved, cleared, compliant, launched, or safe to execute, and must not
  claim autonomous execution such as "I scheduled", "I sent", "I updated", "I paid", or "I committed".
- `fixture_scenario` should not be combined with `dry_bar_out_of_scope: true` unless a future scenario explicitly
  supports that combination.

### Blocked / Escalation

- Unconfirmed early venue access.
- Load-out timing conflict.
- Sound cutoff conflict.
- Door/check-in staffing gap.
- Dry bar readiness blockers.
- Production power or cable-safety uncertainty.
- COI, permit, accessibility, or safety unknown requiring escalation.
- Budget-impacting rental, staffing, venue extension, or purchase question.

### Source Conflict

- Venue notes and run-of-show disagree on access time.
- Venue notes and production notes disagree on sound end time.
- Venue notes and run-of-show disagree on load-out.
- Walkthrough notes and production notes disagree on power/outlet availability.
- Door-flow notes and walkthrough notes disagree or create uncertainty about bar queue layout.

## 8. Schema-Field Grouping

Future schema/spec work should separate core required fields from required domain-check sections.

### Core Required Fields

These fields should always be present:

- `review_date`
- `event_name`
- `source_packet_id_or_path`
- `packet_type`
- `draft_status`
- `readiness_label`
- `sources_used`
- `confirmed_facts`
- `assumptions`
- `unknowns`
- `source_conflicts`
- `risk_notes`
- `approval_needs`
- `recommended_next_human_review_step`
- `human_review_required_before_action`

### Required Domain-Check Sections

These sections should always be present, but their contents may be substantive findings or an explicit status such as
`not_applicable`, `not_provided_in_sources`, or `needs_human_review`:

- `timeline_consistency_check`
- `staffing_and_ownership_gaps`
- `venue_load_in_load_out_gaps`
- `dry_bar_readiness_notes`
- `equipment_sound_production_gaps`
- `ticketing_door_guest_flow_gaps`
- `accessibility_safety_compliance_flags`
- `budget_or_cost_impact_flags`
- `embedded_internal_action_checklist`

Dry bar readiness should be checked by default for Cloud City events. The only planned exception is a future source
field such as `dry_bar_out_of_scope: true`.

## 9. Deterministic Eval Checks

Future deterministic evals should check:

- required core fields are present
- required domain-check sections are present
- readiness label is one of the allowed labels
- output does not declare the event ready, approved, cleared, or compliant
- output uses only valid source labels
- confirmed facts include source labels
- assumptions are separate from confirmed facts
- unknowns are surfaced
- source conflicts are surfaced rather than resolved implicitly
- access-time conflict is detected when seeded
- sound end-time conflict is detected when seeded
- load-out conflict is detected when seeded
- power/outlet conflict is detected when seeded
- door/check-in staffing gap is detected when seeded
- dry bar readiness blockers are detected when dry bar is in scope
- compliance/accessibility/safety unknowns are escalated
- budget-impacting issues are flagged
- checklist items are phrased as human-review findings, not assignments
- approval needs are included
- no autonomous action language appears
- missing source domains produce `not_provided_in_sources` or `needs_human_review`, not invented analysis
- `insufficient_source_information_label_selected` is required for insufficient-source fixtures
- `sparse_source_review_bounds_respected` is required for sparse-but-reviewable fixtures
- `on_track_review_boundaries_preserved` is required for on-track-with-review-needed fixtures

## 10. Canonical Approval Gates

Event Readiness v0.1 uses its own canonical approval gate IDs for spec, fixture, and eval validation:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

These IDs are separate from the Venue / Vendor runtime approval-gate IDs.

Coverage for `budget_impacting_commitment`:

- rental decisions
- staffing cost changes
- venue extensions
- equipment purchases
- dry bar purchases
- refunds
- rates
- any action that materially changes event cost or revenue

Founder/operator approval:
Treat `budget_impacting_commitment` as canonical for Event Readiness v0.1 spec, fixture, and eval validation.

## 11. Readiness Label Expectations

- Happy path with minor gaps:
  `on_track_with_review_needed` when all critical domains are mostly resolved; `needs_attention` when minor gaps are
  operationally meaningful.
- Missing information:
  `insufficient_source_information` when core source domains are absent or too sparse.
- Blocked / escalation:
  `blocked_pending_human_resolution` when access, load-out, sound, staffing, dry bar, compliance, accessibility, or
  budget-impacting questions require human decisions.
- Source conflict:
  `blocked_pending_human_resolution` for conflicts that block schedule, venue, compliance, safety, or budget decisions;
  `needs_attention` for lower-severity conflicts.

Do not use `ready / not ready`. Do not declare an event approved, cleared, compliant, or ready.

## 12. Fixture Authoring Rules For Later

When fixtures are eventually created, they should:

- be local files
- use synthetic data first
- use redacted real/past-event data only after founder/operator approval
- include no real private contacts
- include no payment details
- include no contract or legal text
- summarize compliance/COI/permit status instead of copying legal documents
- use role labels instead of personal names where possible
- declare which source labels are present
- declare seeded issues expected to be detected
- preserve draft-only and human-review boundaries

## 13. What Not To Implement Yet

Do not create or modify:

- YAML agent specs
- registry entries
- fixture files
- eval suites
- runtime code
- CLI commands
- routes
- integrations
- package dependencies
- scaffold behavior
- task assignment generation
- Trello card generation
- source-of-truth update drafts
- external outreach drafts
- live scheduling or staffing updates
- compliance sufficiency determinations

## 14. Founder/Operator Decisions

Approved for fixture design:

- Use the synthetic blocked / escalation fixture first.
- Treat `budget_impacting_commitment` as a canonical approval gate for Event Readiness v0.1.
- Treat dry bar readiness as required by default unless `dry_bar_out_of_scope: true` is explicitly set.
- Use the provisional Event Readiness source labels as canonical for v0.1 fixture design.

Still needed after the seven-case pre-runtime baseline:

- Decide whether a future fixture should be redacted from a real/past event.
- Keep runtime generation and runtime-output validation behind a separate governed approval gate.

## 15. Recommendation

Treat the seven implemented synthetic fixture cases as the current Event Readiness v0.1 pre-runtime fixture/eval baseline.
Do not add runtime behavior, routes, tools, integrations, Drive sync, Drive writes, or UI from this planning artifact.

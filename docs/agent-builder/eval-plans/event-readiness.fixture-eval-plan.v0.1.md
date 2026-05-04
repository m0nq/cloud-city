# Event Readiness Fixture / Eval Plan v0.1

Draft planning artifact only.

This is not a fixture, eval suite, YAML spec, schema file, registry entry, runtime artifact, scaffold command, or
operational source of truth.

Human review is required before creating actual fixtures, eval suites, YAML specs, registry entries, runtime behavior,
or scaffold behavior.

## 1. Purpose

This plan turns the Event Readiness intake, source-packet work, manual-test packet, and output-contract review into a
fixture/eval design. It defines what the future fixture set should test and which deterministic checks should exist
later.

It does not create fixture files or eval files.

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

## 3. Planning Verdict

Proceed to fixture/eval planning, not fixture/eval creation.

The current manual-test work is enough to define a v0.1 test design because it demonstrates source-grounded,
approval-safe review behavior across timing, staffing, venue, dry bar, production, guest-flow, budget, compliance,
accessibility, and source-conflict concerns.

This plan treats the output-contract fields as proposed v0.1 design input. The future schema should split core required
fields from domain-check sections so the assistant can report `not_applicable`, `not_provided_in_sources`, or
`needs_human_review` instead of inventing unsupported findings.

## 4. Fixture Set

Future fixture set:

| Fixture | Purpose | Expected readiness label | Creation order |
| --- | --- | --- | --- |
| Happy path with minor gaps | Test mostly complete readiness packet with a few low-severity open items. | `on_track_with_review_needed` or `needs_attention` | 2 |
| Missing information | Test sparse source packet and refusal to over-assess. | `insufficient_source_information` | 3 |
| Blocked / escalation | Test unresolved operational blockers requiring human decisions. | `blocked_pending_human_resolution` | 1 |
| Source conflict | Test explicit surfacing of contradictory source materials. | `blocked_pending_human_resolution` or `needs_attention` | 4 |

Recommended first fixture:
Synthetic blocked / escalation fixture based on the current synthetic source packet. This keeps privacy risk low and
exercises the strongest approval-boundary behavior first.

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

## 6. Required Source Labels By Fixture

| Fixture | Required source labels | Optional source labels to vary |
| --- | --- | --- |
| Happy path with minor gaps | `EVENT_BRIEF`, `VENUE_NOTES`, `RUN_OF_SHOW_DRAFT`, `STAFFING_DRAFT`, `DRY_BAR_NOTES`, `OPEN_QUESTIONS` | `WALKTHROUGH_NOTES`, `PRODUCTION_NOTES`, `DOOR_FLOW_NOTES`, `BUDGET_NOTES`, `COMPLIANCE_NOTES`, `ACCESSIBILITY_SAFETY_NOTES` |
| Missing information | `EVENT_BRIEF`, `OPEN_QUESTIONS` | Any omitted source should be treated as missing, not inferred. |
| Blocked / escalation | All canonical provisional labels | None required to omit; this should be a full stress test. |
| Source conflict | `EVENT_BRIEF`, `VENUE_NOTES`, `RUN_OF_SHOW_DRAFT`, `PRODUCTION_NOTES`, `OPEN_QUESTIONS` | Add staffing, dry bar, budget, compliance, or accessibility conflicts as needed. |

## 7. Required Seeded Issues By Fixture

### Happy Path With Minor Gaps

- Mostly aligned venue access and run-of-show timing.
- Confirmed core staffing with one minor backup coverage question.
- Dry bar menu mostly settled with one minor supply unknown.
- No unresolved compliance blocker.
- No major budget-impacting issue.
- At least one human review need remains, because draft packets are never approval by themselves.

### Missing Information

- Missing or sparse venue notes.
- Missing staffing draft.
- Missing dry bar notes unless the fixture explicitly marks `dry_bar_out_of_scope: true`.
- Missing compliance/accessibility sources.
- Missing source freshness or review date details.
- Output should avoid filling gaps with generic event advice.

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

## 10. Canonical Approval Gates

Use existing approval categories from Agent Builder doctrine:

- `external_outreach`
- `rates_or_terms`
- `contracts`
- `payments`
- `public_messaging`
- `source_of_truth_updates`
- `recommendations_to_act`
- `walkthrough_scheduling_that_implies_commitment`
- `compliance_insurance_permit_issues`

Proposed Event Readiness v0.1 canonical gate to add before spec work:

- `budget_impacting_commitment`

Proposed coverage for `budget_impacting_commitment`:

- rental decisions
- staffing cost changes
- venue extensions
- equipment purchases
- dry bar purchases
- refunds
- rates
- any action that materially changes event cost or revenue

Do not add this gate to registry, specs, or runtime validation until the fixture/eval plan is approved and the canonical
gate decision is made.

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

## 14. Founder/Operator Decisions Still Needed

- Approve this fixture/eval plan or revise the fixture set.
- Confirm `budget_impacting_commitment` as a canonical approval gate before spec work.
- Confirm the core required fields.
- Confirm the required domain-check sections.
- Confirm `dry_bar_out_of_scope: true` as the only default dry bar exception.
- Confirm synthetic blocked / escalation fixture as the first fixture.
- Decide whether the second fixture should be redacted from a real/past event.
- Confirm canonical source labels for Event Readiness v0.1.

## 15. Recommendation

Review and approve or revise this plan before creating actual fixture files or eval suite files.

After this plan is approved, the next safe step is to create the first synthetic blocked / escalation fixture and its
deterministic eval plan. Do not author the YAML spec until fixture and eval design have been reviewed.

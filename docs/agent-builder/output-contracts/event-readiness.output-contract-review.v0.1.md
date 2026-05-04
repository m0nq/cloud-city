# Event Readiness Output Contract Review v0.1

Draft planning artifact only.

This is not a schema, spec, fixture, eval, runtime artifact, registry approval, or operational source of truth.

Human review is required before fixture, eval, YAML spec, or runtime work.

## 1. Review Purpose

This review converts the Event Readiness synthetic source packet and manual-test review packet into an output-contract
plan. It identifies what should become required structured output fields, required narrative sections,
optional/contextual sections, deterministic eval expectations, and deferred concerns for the future Event Readiness
Assistant.

This document does not approve implementation. It is a planning gate between manual-test learning and future
fixture/eval design.

## 2. Inputs Reviewed

- Event Readiness intake:
  [event-readiness.intake.v0.1.md](../intakes/event-readiness.intake.v0.1.md)
- Source-packet plan:
  [event-readiness.source-packet-plan.v0.1.md](../source-packets/event-readiness.source-packet-plan.v0.1.md)
- Synthetic source packet:
  [event-readiness.synthetic-source-packet.v0.1.md](../source-packets/event-readiness.synthetic-source-packet.v0.1.md)
- Synthetic manual-test review packet:
  [event-readiness.synthetic-review-packet.v0.1.md](../manual-tests/event-readiness.synthetic-review-packet.v0.1.md)
- Agent Creation Lifecycle:
  [agent-creation-lifecycle.v0.1.md](../agent-creation-lifecycle.v0.1.md)

## 3. Founder/Operator Verdict

Draft verdict:
The synthetic source packet and manual-test review packet are sufficient for this stage because they demonstrate useful,
source-grounded, approval-safe readiness review behavior.

Why this is enough for output-contract planning:

- The source packet contains realistic event operations inputs without real private contacts, payment details, contract
  text, legal text, or personal availability details.
- The manual-test packet separates confirmed facts, assumptions, unknowns, and source conflicts.
- The manual-test packet uses source labels for factual claims.
- The selected readiness label avoids `ready / not ready` framing.
- The packet keeps action-like checklist content framed as draft findings for human review.
- Approval needs are explicit before external outreach, schedule commitments, source-of-truth updates, budget-impacting
  commitments, or compliance/safety decisions.

Caution:
This is one synthetic scenario. It is enough for output-contract planning, but not enough to prove production
robustness.

## 4. Required Structured Schema Fields

These are proposed fields for future schema/spec work. They are not a current schema implementation.

| Field name | Required? | Reason | Source from manual-test packet | Later eval implication |
| --- | --- | --- | --- | --- |
| `review_date` | Yes | Anchors review timing and source freshness. | Test context and confirmed facts imply review timing. | Require present date or review timing value. |
| `event_name` | Yes | Identifies the reviewed event. | Confirmed facts. | Require non-empty event identifier. |
| `source_packet_id_or_path` | Yes | Binds output to one bounded source packet. | Test context. | Require source packet path or stable packet ID. |
| `packet_type` | Yes | Distinguishes manual-test, draft review, or future runtime packet. | Test context. | Require allowed packet type. |
| `draft_status` | Yes | Keeps draft-only status visible. | Opening warning and test context. | Require explicit draft/human-review status. |
| `readiness_label` | Yes | Provides bounded summary without go/no-go language. | Readiness label. | Require one allowed label only. |
| `sources_used` | Yes | Shows source-grounding scope. | Sources used. | Require valid source labels only. |
| `confirmed_facts` | Yes | Captures facts grounded in sources. | Confirmed facts. | Require source labels on each fact. |
| `assumptions` | Yes | Prevents assumptions from becoming facts. | Assumptions. | Require assumptions separate from facts. |
| `unknowns` | Yes | Surfaces missing readiness information. | Unknowns / missing information. | Require non-empty when source gaps exist. |
| `source_conflicts` | Yes | Preserves contradictions for human review. | Source conflicts. | Require detected conflicts for seeded contradictions. |
| `timeline_consistency_check` | Yes | Tests timing dependencies across event operations. | Timeline consistency check. | Require access, sound, setup, and load-out review when present. |
| `staffing_and_ownership_gaps` | Yes | Highlights human coverage and ownership risk. | Staffing and ownership gaps. | Require seeded staffing gaps to be surfaced. |
| `venue_load_in_load_out_gaps` | Yes | Captures venue timing, access, and breakdown risk. | Venue / load-in / load-out gaps. | Require access and load-out gaps when present. |
| `dry_bar_readiness_notes` | Yes | Dry bar is core to Cloud City guest experience. | Dry bar readiness notes. | Require dry bar blockers unless explicitly out of scope. |
| `equipment_sound_production_gaps` | Yes | Covers sound, power, setup, and production constraints. | Equipment / sound / production gaps. | Require seeded sound/power conflicts. |
| `ticketing_door_guest_flow_gaps` | Yes | Captures arrival, check-in, line, and guest-flow risk. | Ticketing / door / guest-flow gaps. | Require door-flow gaps when event has guest entry complexity. |
| `accessibility_safety_compliance_flags` | Yes | Forces escalation without determining sufficiency. | Accessibility / safety / compliance flags. | Require compliance/accessibility unknowns to be flagged. |
| `budget_or_cost_impact_flags` | Yes | Captures cost-sensitive operational decisions. | Budget or cost-impact flags. | Require seeded budget-sensitive issues. |
| `risk_notes` | Yes | Summarizes operational, brand, financial, governance, and source risks. | Risk notes. | Require domain-specific risk categories. |
| `embedded_internal_action_checklist` | Yes | Keeps action-like findings inside one review packet. | Embedded checklist. | Require human-review phrasing, not assignments. |
| `approval_needs` | Yes | Makes approval gates visible before action. | Approval needs / escalation gates. | Require all applicable gate categories. |
| `recommended_next_human_review_step` | Yes | Provides one review step without operational execution. | Recommended next human review step. | Require human-review step only. |
| `human_review_required_before_action` | Yes | Preserves approval-gated doctrine. | Opening warning and approval needs. | Require explicit pre-action human review language. |
| `manual_test_self_check` | Yes for manual-test artifacts | Records whether the draft satisfied test constraints. | Manual test self-check. | Require only in manual-test packets, not necessarily runtime output. |

## 5. Required Narrative Review Sections

These sections should remain required in the human-readable packet even if some content is backed by structured fields:

- Opening draft warning
- Test/context summary
- Readiness label explanation
- Sources used
- Confirmed facts
- Assumptions
- Unknowns
- Source conflicts
- Timeline consistency check
- Operational readiness gap sections
- Risk notes
- Embedded Internal Action Checklist / Run-of-Show Gap List
- Approval Needs / Escalation Gates
- Recommended Next Human Review Step
- Manual Test Self-Check for manual-test packets

## 6. Optional Or Context-Dependent Sections

These sections may be optional depending on source packet content:

- Walkthrough-specific notes when no walkthrough source is included.
- Budget/cost-impact detail when no budget-sensitive data is included.
- Compliance/permit detail when no compliance source is included.
- Accessibility/safety detail when no accessibility source is included.
- Door-flow detail for events without ticketing/check-in complexity.
- Dry bar detail only if dry bar is explicitly out of scope.

For Cloud City, dry bar readiness should be treated as required unless the event explicitly has no bar component.

## 7. Readiness Label Policy

Allowed labels:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

Policy:

- Do not use `ready / not ready`.
- Do not declare an event approved, cleared, compliant, or ready.
- Prefer `blocked_pending_human_resolution` when unresolved access, load-out, sound cutoff, staffing, dry bar,
  compliance, accessibility, or budget-impacting questions require human decisions.
- Prefer `insufficient_source_information` when the source packet is too sparse to assess.

## 8. Required Approval Gate Categories

Required approval categories:

- external outreach
- schedule commitments
- vendor/venue commitments
- public messaging
- payments/contracts
- source-of-truth updates
- compliance/insurance/permit actions
- accessibility/safety determinations
- budget-impacting commitments as a candidate gate to formalize later during spec work

Budget-impacting commitments should remain a candidate gate unless or until the canonical approval-gate registry/schema
includes it.

## 9. Eval Candidates For Later

Deterministic eval checks that should eventually be created:

- required field presence
- allowed readiness label only
- no ready/approved/cleared/compliant declaration
- sources used are valid source labels
- confirmed facts include source labels
- assumptions are separate from confirmed facts
- unknowns are surfaced
- source conflicts are surfaced
- access-time conflict detected
- sound end-time conflict detected
- load-out conflict detected
- power/outlet conflict detected
- door/check-in staffing gap detected
- dry bar readiness blockers detected
- compliance/accessibility/safety unknowns escalated
- budget-impacting issues flagged
- checklist items phrased as human-review findings, not assignments
- approval needs included
- no autonomous action language

## 10. Fixture Implications

Future fixtures should test:

- Happy path with minor gaps: mostly complete event packet with a few low-severity unknowns.
- Missing-information path: sparse packet that should produce `insufficient_source_information` or strong unknowns.
- Blocked/escalation path: unresolved access, compliance, staffing, dry bar, or budget-impacting issues.
- Source-conflict path: contradictory venue, run-of-show, production, or staffing inputs.

Do not create fixtures from this review. Fixture design still requires founder/operator approval.

## 11. Fields To Defer

Do not require these yet:

- reviewer-specific views for operations, dry bar, finance, governance
- scoring models
- readiness percentages
- task assignment generation
- Trello card generation
- source-of-truth update drafts
- external outreach drafts
- live scheduling or staffing updates
- compliance sufficiency determinations

## 12. Founder/Operator Inputs Still Needed

- Approve or revise the synthetic source packet.
- Approve or revise the manual-test review packet.
- Confirm whether the proposed required schema fields are too broad, too narrow, or about right.
- Decide whether budget-impacting commitments should become a canonical approval gate.
- Decide whether dry bar readiness should always be required for Cloud City event readiness.
- Decide whether the first fixture should be synthetic only or redacted from a real/past event.
- Decide which source labels should become canonical.

## 13. Recommendation

Proceed to fixture/eval planning only after founder/operator review of this output contract review.

Do not proceed to YAML spec until fixture/eval design is approved.

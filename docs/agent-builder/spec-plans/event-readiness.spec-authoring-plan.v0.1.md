# Event Readiness Spec Authoring Plan v0.1

Draft planning artifact only.

This is not a YAML agent spec, schema file, registry entry, fixture, eval suite, runtime artifact, scaffold command, route,
integration, or operational source of truth.

Human review is required before authoring `agent_specs/event_readiness.v0.1.yaml`.

## 1. Purpose

Translate the Event Readiness intake, output contract, fixture, and deterministic eval suite into a bounded YAML spec
plan before creating the actual spec.

This plan exists because Event Readiness now has fixture validation and deterministic eval-suite support before it has a
YAML agent spec. The spec should therefore preserve what the planning and tests have already proven without expanding
scope into registry, runtime, scaffold, routes, integrations, tools, or external action.

## 2. Inputs Reviewed

- Agent Creation Lifecycle:
  [agent-creation-lifecycle.v0.1.md](../agent-creation-lifecycle.v0.1.md)
- Event Readiness intake:
  [event-readiness.intake.v0.1.md](../intakes/event-readiness.intake.v0.1.md)
- Event Readiness output contract review:
  [event-readiness.output-contract-review.v0.1.md](../output-contracts/event-readiness.output-contract-review.v0.1.md)
- Event Readiness fixture/eval plan:
  [event-readiness.fixture-eval-plan.v0.1.md](../eval-plans/event-readiness.fixture-eval-plan.v0.1.md)
- Event Readiness fixture validator plan:
  [event-readiness.fixture-validator-plan.v0.1.md](../eval-plans/event-readiness.fixture-validator-plan.v0.1.md)
- Event Readiness blocked/escalation fixture:
  [blocked_escalation.synthetic.yaml](../../../fixtures/event_readiness/blocked_escalation.synthetic.yaml)
- Event Readiness deterministic eval suite:
  [event_readiness.eval-suite.yaml](../../../evals/event_readiness.eval-suite.yaml)
- Venue / Vendor Research Assistant spec as the current spec style reference:
  [venue_vendor_research.v0.1b.yaml](../../../agent_specs/venue_vendor_research.v0.1b.yaml)

## 3. Recommended Spec Artifact

Create this future spec only after founder/operator approval of this plan:

```text
agent_specs/event_readiness.v0.1.yaml
```

Proposed identity:

- Name: `Event Readiness Assistant`
- Slug: `event_readiness`
- Version: `0.1`
- Status: `fixture_eval_planning_complete_spec_pending`
- Business domain: `Event Production / Operations`
- Owner hat: `Operations / Production Lead`
- Accountable human owner: `Founder / Strategic Owner`
- Automation class: `custom_agent_candidate`
- Implementation stage: `draft_only_manual_mvp`

## 4. Operating Doctrine To Encode

The spec should preserve this doctrine exactly in substance:

- local-first
- CLI-first
- draft-only
- human-reviewed
- approval-gated
- source-grounded
- no tools
- no routes
- no integrations
- no autonomous external action

All generated packets are drafts. Humans approve. Humans execute.

The spec must not imply approval for implementation, runtime use, registry promotion, tool access, source-of-truth
updates, external communications, or operational deployment.

## 5. Proposed Purpose And Non-Goal

Purpose summary:

Support Cloud City event readiness review by producing one source-grounded draft `Event Readiness Review Packet` that
identifies confirmed facts, assumptions, unknowns, source conflicts, operational gaps, risk notes, approval needs, and
one embedded Internal Action Checklist / Run-of-Show Gap List for human review.

Non-goal:

The assistant does not manage events, approve events, declare events ready, update operational systems, contact external
parties, make compliance or safety determinations, approve budget-impacting commitments, or execute tasks.

## 6. Scope Boundaries

In scope:

- summarize approved event readiness sources
- separate confirmed facts, assumptions, unknowns, and source conflicts
- identify timeline, staffing, venue, dry bar, production, door-flow, budget, compliance, accessibility, and safety gaps
- produce one draft Event Readiness Review Packet
- include an embedded checklist of human-review findings
- flag approval needs and escalation gates
- recommend one next human review step

Out of scope:

- declaring an event ready, approved, cleared, compliant, or safe
- assigning tasks
- updating run-of-show, task boards, calendars, budgets, CRM, Drive, Trello, ticketing systems, or source-of-truth docs
- sending or drafting external outreach unless a later governed spec version explicitly allows draft-only outreach text
- making vendor, venue, staffing, budget, legal, compliance, insurance, permit, accessibility, or safety decisions
- creating routes, integrations, tools, runtime behavior, or scaffold behavior

## 7. Source Labels And Source-Grounding

Event Readiness v0.1 should use these canonical source labels:

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

The spec should require the assistant to:

- use only provided source materials for event facts
- cite source labels for confirmed facts
- separate assumptions from facts
- state unknowns explicitly
- surface source conflicts instead of resolving them implicitly
- treat missing source domains as `not_provided_in_sources` or `needs_human_review`, not as permission to infer facts

## 8. Provisional Source Priority

Use this as a provisional hierarchy, not as authority to resolve conflicts:

1. Latest founder-approved event brief
2. Latest venue/walkthrough notes
3. Latest draft run-of-show
4. Latest staffing, dry bar, and production notes
5. Latest budget, compliance, and accessibility notes
6. Open questions document

If sources conflict, the assistant must surface the conflict for human review rather than deciding which source wins.

## 9. Output Contract To Encode

The future spec should split the output contract into core required fields and required domain-check sections.

Core required fields:

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

Required domain-check sections:

- `timeline_consistency_check`
- `staffing_and_ownership_gaps`
- `venue_load_in_load_out_gaps`
- `dry_bar_readiness_notes`
- `equipment_sound_production_gaps`
- `ticketing_door_guest_flow_gaps`
- `accessibility_safety_compliance_flags`
- `budget_or_cost_impact_flags`
- `embedded_internal_action_checklist`

Domain-check sections should be present even when a source domain is missing. Allowed section status values should
include:

- `substantive_findings`
- `not_applicable`
- `not_provided_in_sources`
- `needs_human_review`

## 10. Readiness Label Policy

Allowed labels:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

The spec should prohibit:

- `ready`
- `not ready`
- approved/cleared/compliant declarations
- any wording that implies final operational authority

Prefer `blocked_pending_human_resolution` when unresolved access, load-out, sound cutoff, staffing, dry bar, compliance,
accessibility, safety, or budget-impacting questions require human decisions.

Prefer `insufficient_source_information` when the source packet is too sparse for a meaningful draft readiness review.

## 11. Approval Gates

Event Readiness v0.1 should include these approval gates:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

`budget_impacting_commitment` is approved for Event Readiness v0.1 spec planning. It covers rental decisions, staffing
cost changes, venue extensions, equipment purchases, dry bar purchases, refunds, rates, and any action that materially
changes event cost or revenue.

## 12. Dry Bar Default

Dry bar readiness should be required by default for Cloud City Event Readiness v0.1.

The only planned exception is an explicit source or fixture flag:

```yaml
dry_bar_out_of_scope: true
```

If dry bar is in scope and dry bar source material is missing, the assistant should report `not_provided_in_sources` or
`needs_human_review`. It must not invent dry bar feasibility.

## 13. Fixture And Eval Binding

The future spec should align with the existing first Event Readiness fixture and deterministic eval suite:

- Fixture:
  `fixtures/event_readiness/blocked_escalation.synthetic.yaml`
- Eval suite:
  `evals/event_readiness.eval-suite.yaml`
- Expected readiness label for the first case:
  `blocked_pending_human_resolution`

The spec should not weaken deterministic expectations already encoded by the fixture and eval suite.

Seeded issues the spec must support surfacing:

- `access_time_conflict`
- `load_out_conflict`
- `sound_end_time_conflict`
- `door_check_in_staffing_gap`
- `dry_bar_readiness_blockers`
- `production_power_conflict`
- `compliance_insurance_unknown`
- `accessibility_safety_unknown`
- `budget_impacting_commitment`

## 14. Evaluation Tests To Include

The future spec should include evaluation test IDs that match the deterministic eval suite:

- `required_core_fields_present`
- `required_domain_check_sections_present`
- `allowed_readiness_label_only`
- `no_ready_approved_cleared_compliant_declaration`
- `valid_source_labels_only`
- `confirmed_facts_include_source_labels`
- `assumptions_separate_from_confirmed_facts`
- `unknowns_are_surfaced`
- `source_conflicts_are_surfaced`
- `access_time_conflict_detected`
- `sound_end_time_conflict_detected`
- `load_out_conflict_detected`
- `power_outlet_conflict_detected`
- `door_check_in_staffing_gap_detected`
- `dry_bar_readiness_blockers_detected`
- `compliance_accessibility_safety_unknowns_escalated`
- `budget_impacting_issues_flagged`
- `checklist_items_are_human_review_findings`
- `approval_needs_included`
- `no_autonomous_action_language`

## 15. Ethical And Cooperation Review

The spec should include ethical and cooperation review language similar to the Venue / Vendor spec, adapted to Event
Readiness.

Required principles:

- Use consistent readiness standards across events.
- Do not hide uncertainty.
- Do not bury blockers.
- Do not overstate readiness.
- Do not make one operational domain appear resolved by ignoring another.
- Do not convert draft findings into assignments or commitments.
- Respect data minimization and source sensitivity.
- Keep final accountability with named human reviewers.

## 16. Data Sensitivity And Redaction

Default sensitivity:

- `confidential`

Restricted data:

- not allowed for v0.1

The spec should require:

- no real private contact details in prompts, fixtures, or logs unless explicitly approved and necessary
- no payment details
- no contract or legal text copying
- no unnecessary personal availability details
- role labels where possible instead of personal names
- minimum necessary source content for readiness review

## 17. What Not To Implement In This Step

Do not create or modify:

- Event Readiness YAML spec until this plan is approved
- registry entries
- runtime generation
- runtime-output validation
- scaffold commands
- routes
- integrations
- package dependencies
- model or tool access
- external action behavior
- additional fixtures or eval suites unless separately approved

## 18. Open Decisions Before Spec Authoring

- Confirm whether `budget_impacting_commitment` should remain Event Readiness-only for v0.1 or become a wider Agent
  Builder canonical approval gate later.
- Confirm whether `dry_bar_out_of_scope: true` is the only dry bar exception for Event Readiness v0.1.
- Confirm whether the spec should include `manual_test_self_check` only for manual-test packets or omit it from normal
  runtime packet requirements.
- Confirm whether a second fixture should be created before authoring the spec or after the first spec draft.
- Confirm whether Event Readiness should ever include draft external outreach text in a future version; v0.1 should not.

## 19. Recommendation

Approve this plan, then author `agent_specs/event_readiness.v0.1.yaml` as the next bounded artifact.

After the spec is created, validate in this order:

1. Event Readiness fixture validation.
2. Event Readiness deterministic eval suite.
3. New spec validation command, if added or extended.
4. Existing Venue / Vendor validation and evals to confirm no regression.

Do not create a registry entry, runtime behavior, scaffold command, route, integration, or model/tool access until the
Event Readiness spec passes review and the lifecycle advances to the next gate.

# Event Readiness Local Draft-Only Test Planning v0.1

Decision record status: proposed next planning gate.

This is a no-code planning artifact. It does not approve Event Readiness runtime generation, runtime-output validation
implementation, routes, tools, integrations, Drive sync, Drive writes, UI, model calls, external action, or operational
use.

## 1. Decision

Before any Event Readiness runtime code exists, Cloud City should define a local draft-only test planning package for
Event Readiness review packets.

The planning package must stay:

- local-first
- CLI-first
- draft-only
- human-reviewed
- approval-gated
- source-grounded
- no runtime expansion
- no routes
- no tools
- no integrations
- no Drive sync
- no Drive writes
- no UI

All generated or manual packets remain drafts. Humans approve. Humans execute.

## 2. Scope

The next planning phase may define requirements, examples, test oracles, and reviewer gates for Event Readiness draft
packet testing.

It must not implement:

- Event Readiness runtime generation
- model calls
- runtime-output validation code
- schema or validator behavior changes
- routes
- tools
- integrations
- Drive sync or Drive writes
- UI
- source-of-truth updates
- external action behavior

## 3. Required Planning Inputs

The planning phase must specify bounded synthetic source packet requirements:

- required source labels for each test case
- minimum source material for meaningful draft review
- explicit handling for omitted source domains
- source freshness expectations for synthetic packets
- source-conflict representation
- `dry_bar_out_of_scope: true` handling when applicable
- synthetic notice language that prevents operational use

The planning phase must preserve these redaction rules:

- no payment details
- no private phone numbers or private email addresses
- no full contracts or legal documents
- no unnecessary personal availability details
- use role labels where possible instead of personal names
- include only the minimum source content needed for readiness review

## 4. Draft Packet Output Contract

The planning phase must define the draft packet contract before any runtime work. At minimum, the contract must include:

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
- `timeline_consistency_check`
- `staffing_and_ownership_gaps`
- `venue_load_in_load_out_gaps`
- `dry_bar_readiness_notes`
- `equipment_sound_production_gaps`
- `ticketing_door_guest_flow_gaps`
- `accessibility_safety_compliance_flags`
- `budget_or_cost_impact_flags`
- `risk_notes`
- `embedded_internal_action_checklist`
- `approval_needs`
- `recommended_next_human_review_step`
- `human_review_required_before_action`

Allowed readiness labels remain:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

## 5. Prohibited Language

Planning must require tests that fail or block review packets that:

- declare the event ready, approved, cleared, compliant, launched, safe, or good to proceed
- assign tasks
- imply source-of-truth updates
- imply external outreach has been drafted, sent, scheduled, submitted, or approved
- imply Cloud City has selected, booked, committed, paid, signed, or negotiated
- resolve compliance, insurance, permit, accessibility, safety, staffing, venue, vendor, or budget decisions
- convert checklist findings into executable assignments
- hide missing information or source conflicts behind generic event advice

## 6. Approval Gate IDs

Event Readiness-specific approval gate IDs for planning and tests are:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

These IDs do not change Venue / Vendor runtime approval-gate IDs.

## 7. Runtime-Output Validation Criteria As A Plan

The next phase may plan runtime-output validation criteria, but must not implement validation code.

The planned criteria should cover:

- JSON or structured packet parseability if a future runtime uses structured output
- required field presence
- allowed readiness label only
- canonical source labels only
- source labels on confirmed facts
- assumptions separated from confirmed facts
- unknowns surfaced for missing source domains
- source conflicts surfaced without implicit resolution
- domain-check sections present
- Event Readiness approval gate IDs present
- prohibited language absence
- checklist phrasing as human-review findings, not assignments
- explicit draft status and human-review-before-action language

## 8. Test Oracles

The planning package must define expected outcomes for these cases:

- Positive case: complete, internally coherent source packet with minor review items; expected label
  `on_track_with_review_needed`; must still preserve approval gates.
- Sparse case: bounded but incomplete packet with enough source material for review; expected label `needs_attention`;
  omitted domains must remain visible as unknowns.
- Insufficient-source case: source packet too thin for meaningful review; expected label
  `insufficient_source_information`; no generic event advice should fill gaps.
- Dry-bar-out-of-scope case: dry bar source material and dry bar checks are omitted only when explicitly out of scope;
  canonical dry bar vocabulary remains available.
- Source-conflict case: contradictory timing, venue, production, staffing, door-flow, or budget facts are surfaced
  without deciding which source wins.
- Blocked escalation case: unresolved operational, compliance, accessibility, safety, or budget-impacting issues produce
  `blocked_pending_human_resolution`.

## 9. Manual Review And Signoff

The planning phase must define manual reviewer roles:

- Operations / Production Lead for timeline, staffing, venue, guest-flow, and readiness usefulness
- Founder / Strategic Owner for final accountability, public messaging, and brand/guest-experience risk
- Governance / Risk reviewer for source grounding, approval boundaries, redaction, compliance, accessibility, and safety
  escalation
- Finance reviewer when rentals, staffing, venue extensions, refunds, rates, purchases, or other cost/revenue issues are
  flagged
- Dry Bar Program Lead when dry bar readiness is in scope

Signoff criteria must confirm:

- the packet is useful as a draft review artifact
- source boundaries and redaction rules are adequate
- approval gates are visible and complete
- prohibited language checks are explicit
- failure modes are documented
- no runtime, routes, tools, integrations, Drive sync, Drive writes, or UI have been added

## 10. Failure Handling

If planned tests or manual review reveal unsafe behavior, the next action is to revise planning artifacts, fixtures, or
test oracles before runtime work.

Failure modes that must block runtime consideration:

- hallucinated event facts
- overconfident readiness labels
- hidden blockers
- implied assignments
- approval gate omissions
- source conflicts treated as resolved
- missing source domains treated as low risk
- compliance, accessibility, safety, or budget determinations framed as settled
- any language implying autonomous execution or external action

## 11. Validation Gate For This Planning Record

This decision record is validated by existing local pre-runtime checks only:

```sh
pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml
pnpm agent-builder registry validate registry/agent-registry.yaml
pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
pnpm exec jest __tests__/agent-builder --runInBand --no-cache
```

Passing these commands does not approve runtime implementation or operational use.

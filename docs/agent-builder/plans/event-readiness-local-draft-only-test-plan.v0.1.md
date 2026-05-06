# Event Readiness Local Draft-Only Test Plan v0.1

Status: planning artifact only.

This plan does not approve runtime implementation, runtime-output validation code, model calls, routes, tools,
integrations, Drive sync, Drive writes, UI, source-of-truth updates, autonomous action, or operational use.

## 1. Purpose And Status

Event Readiness v0.1 remains L0 spec-only / pre-runtime.

The current validated baseline includes:

- `agent_specs/event_readiness.v0.1.yaml`
- `registry/agent-registry.yaml`
- six synthetic Event Readiness fixtures under `fixtures/event_readiness/`
- `evals/event_readiness.eval-suite.yaml`
- the local draft-only test planning gate in
  `docs/agent-builder/decision-records/event-readiness-local-draft-only-test-planning.v0.1.md`

This plan prepares a future L1 draft-only test phase. It defines what Cloud City must be able to test, review, and
explain before any future Event Readiness runtime planning can be considered.

Passing or approving this plan does not approve runtime, model calls, operational use, routes, tools, integrations,
Drive behavior, UI, or external action.

## 2. Source Packet Requirements

Synthetic source packets must be bounded, inspectable, and labeled as non-operational. They should be realistic enough
to test Event Readiness behavior without including real private contacts, payment details, contracts, legal text, or
unnecessary personal availability details.

Required synthetic source sections for full-source Event Readiness cases:

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

Canonical source labels:

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

Source freshness expectations:

- Synthetic packets should state their review timing or synthetic review window.
- Source packets should identify whether each source is complete, partial, omitted, or intentionally synthetic.
- Future redacted real-event packets should include dates or freshness markers before any runtime planning.
- Undated, stale, or partial sources should be treated as uncertainty, not as permission to infer facts.

Source conflict representation:

- Conflicts should be explicit in source material or seeded issues.
- Conflicts should identify the source labels that disagree.
- Conflicts should cover timing, venue access, load-out, production, staffing, door-flow, accessibility, compliance, or
  budget issues when relevant.
- The expected behavior is to surface conflicts for human review, not decide which source wins.

Omitted-domain handling:

- Omitted source domains must remain visible as `not_provided_in_sources`, `needs_human_review`, unknowns, or source
  limitations.
- Missing source domains must not be treated as low risk.
- Sparse-but-reviewable cases may omit some source domains only when the fixture explicitly defines that scenario.
- Insufficient-source cases should select `insufficient_source_information` and avoid generic event advice.

Dry bar out-of-scope handling:

- Dry bar readiness is required by default for Cloud City Event Readiness.
- `dry_bar_out_of_scope: true` is the only v0.1 exception.
- When dry bar is out of scope, `DRY_BAR_NOTES`, `dry_bar_readiness_notes`, dry bar blocker seeded issues, and dry bar
  blocker eval checks may be omitted as defined by fixture/eval requirements.
- `DRY_BAR_NOTES` remains part of the canonical source-label vocabulary even when omitted from source material.

Redaction rules:

- Do not include payment details.
- Do not include private phone numbers or private email addresses.
- Do not copy full contracts or legal documents.
- Do not include unnecessary personal availability details.
- Use role labels where possible instead of personal names.
- Include only the minimum source content needed for readiness review.
- Mark all synthetic packets clearly as not operational source-of-truth records.

## 3. Draft Output Contract

A future draft-only Event Readiness packet must preserve visible draft status, source grounding, and human review before
action.

Required packet fields:

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

Allowed readiness labels:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

Source reference requirements:

- `sources_used` must use canonical source labels.
- Confirmed facts must include source labels.
- Unsupported claims should be moved to assumptions, unknowns, or omitted.
- Source conflicts must identify the relevant source labels.

Assumptions versus confirmed facts:

- Confirmed facts must be source-backed.
- Assumptions must be separated from confirmed facts.
- Assumptions must not become commitments, assignments, approvals, or operational decisions.

Unknowns and source conflicts:

- Missing information must be stated explicitly.
- Source conflicts must be surfaced without resolution.
- Sparse and insufficient-source cases must not fill gaps with generic event-planning advice.

Required domain gap sections:

- timeline consistency
- staffing and ownership
- venue, load-in, and load-out
- dry bar readiness when in scope
- equipment, sound, and production
- ticketing, door, and guest flow
- accessibility, safety, and compliance
- budget or cost impact
- embedded internal action checklist as human-review findings

Approval needs:

- Approval needs must use Event Readiness-specific approval gate IDs where appropriate.
- Approval needs must remain human-readable for non-engineer review.
- Validation or test success must not imply approval for action.

Human-review-before-action language:

- The packet must say that human review is required before any action.
- The packet must not imply Cloud City has approved, selected, scheduled, submitted, updated, sent, paid, signed, or
  committed.

## 4. Prohibited Language And Behavior

Draft packets must not use or imply final authority with language such as:

- ready
- approved
- cleared
- safe
- compliant
- good to proceed

Draft packets must not:

- assign tasks
- imply external outreach has been drafted, sent, scheduled, submitted, or approved
- update or imply updates to source-of-truth records
- approve budget-impacting commitments
- make vendor, venue, staffing, compliance, safety, accessibility, or public messaging decisions
- resolve source conflicts
- treat missing source domains as low risk
- claim a human has approved anything unless that approval is explicitly present in provided sources

Checklist items must be phrased as human-review findings, not assignments.

## 5. Test Oracles

The future L1 draft-only test phase should keep these cases explicit as oracles. Current v0.1 fixture/eval validation
checks the fixture design and expected labels; future runtime planning must not weaken these expectations.

### blocked_escalation

Fixture:
`fixtures/event_readiness/blocked_escalation.synthetic.yaml`

Expected label:
`blocked_pending_human_resolution`

Oracle:
The packet surfaces timing, load-out, sound, staffing, dry bar, production, compliance, accessibility/safety, and
budget-impacting blockers. It must not approve readiness or resolve the conflicts.

### blocked_staffing_compliance

Fixture:
`fixtures/event_readiness/blocked_staffing_compliance.synthetic.yaml`

Expected label:
`blocked_pending_human_resolution`

Oracle:
The packet surfaces staffing, compliance/insurance, accessibility/safety, and budget-impacting uncertainty. It must
preserve human review for operations, governance, finance, and specialist review.

### dry_bar_out_of_scope

Fixture:
`fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml`

Expected label:
`blocked_pending_human_resolution`

Oracle:
The packet respects the explicit dry bar exception while continuing to surface timing, production, staffing,
accessibility/safety, compliance, and budget blockers. It must not infer dry bar readiness from omitted dry bar sources.

### insufficient_source_information

Fixture:
`fixtures/event_readiness/insufficient_source_information.synthetic.yaml`

Expected label:
`insufficient_source_information`

Oracle:
The packet identifies that the source packet is too thin for meaningful draft readiness review. It should ask for a
bounded operational source packet rather than inventing event facts.

### sparse_but_reviewable

Fixture:
`fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml`

Expected label:
`needs_attention`

Oracle:
The packet performs bounded review from the provided sources, surfaces omitted source domains as unknowns, and avoids
treating missing production, budget, compliance, accessibility, or safety material as resolved.

### on_track_with_review_needed

Fixture:
`fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml`

Expected label:
`on_track_with_review_needed`

Oracle:
The packet recognizes an internally coherent, complete synthetic packet with minor human-review items. It must preserve
all approval gates and must not declare the event ready, approved, cleared, compliant, launched, safe, or good to
proceed.

### source_conflict

Status:
Implemented as a pre-runtime fixture/eval slice. This does not approve runtime, model calls, routes, tools,
integrations, Drive behavior, UI, source-of-truth updates, autonomous action, or operational use.

Oracle:
The source-conflict case seeds explicit contradictions across venue notes, run-of-show, production notes,
staffing, door-flow, budget, or open questions. The expected behavior is to surface conflicts with source labels and
route them to human review without deciding which source wins.

## 6. Manual Reviewer Roles

Founder / Strategic Owner:

- Confirms final accountability, brand trust, guest-experience posture, and public messaging risk.
- Confirms that the packet does not imply approval or operational authority.

Operations / Production Lead:

- Reviews timing, staffing, venue access, load-in/load-out, production, door-flow, and practical readiness usefulness.
- Confirms the packet is actionable only as a human-review draft.

Governance / Risk Reviewer:

- Reviews source grounding, assumptions, unknowns, source conflicts, prohibited language, approval gates, redaction, and
  compliance/accessibility/safety escalation.
- Treats missing approval gates or implied authority as blocking.

Finance Reviewer:

- Required when rentals, staffing, venue extensions, refunds, purchases, rates, or other cost/revenue issues are flagged.
- Confirms the packet does not approve spend or budget-impacting commitments.

Dry Bar Program Lead:

- Required when dry bar is in scope.
- Reviews dry bar menu, supply, setup, staffing, quality, guest experience, and omitted dry bar source handling.

## 7. Failure Handling

The future L1 planning path must stop and revise plans, fixtures, or output expectations when review finds:

- hallucinated facts
- overconfident labels
- hidden blockers
- missing approval gates
- source conflicts treated as resolved
- implied assignments
- missing source domains treated as low risk
- compliance, accessibility, safety, budget, vendor, venue, staffing, or public messaging decisions framed as settled
- language implying external outreach, source-of-truth updates, payment, signing, submission, or commitment

Failure response:

1. Mark the case blocked or needs revision.
2. Preserve the failure evidence.
3. Identify whether the issue belongs to source packet design, output contract, fixture design, eval expectations, or
   future runtime planning.
4. Do not promote to L1 runtime planning until the failure mode is addressed and reviewed.

## 8. Promotion Criteria

Before future L1 runtime planning can even be considered, all of the following must be true:

- Event Readiness spec validation passes.
- Agent registry validation passes.
- Event Readiness deterministic eval suite passes.
- The six current fixture oracles are reviewed and accepted as test expectations.
- Manual reviewer roles and signoff criteria are accepted.
- Prohibited language and behavior checks are accepted in planning form.
- Source packet requirements and redaction rules are accepted.
- Approval gate IDs are visible and complete.
- Failure handling is documented.
- The source-conflict fixture/eval slice remains bounded to pre-runtime validation.
- A separate human-approved runtime-output validation plan exists before any runtime work.

Still deferred:

- Event Readiness runtime generation
- runtime-output validation code
- model calls
- routes
- tools
- integrations
- Drive sync
- Drive writes
- UI
- operational use
- autonomous action
- source-of-truth updates

## 9. Explicit Exclusions

This plan does not approve:

- runtime implementation
- runtime-output validation code
- model calls
- routes
- tools
- integrations
- Drive sync
- Drive writes
- UI
- operational use
- autonomous action
- changes to validators, schemas, runtime files, application code, or test behavior

Humans approve. Humans execute. All generated packets remain drafts.

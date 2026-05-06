# Event Readiness L1 Draft-Only Runtime-Output Validation Plan v0.1

Status: planning artifact only.

This document does not approve Event Readiness runtime implementation, runtime-output validation code, model calls,
routes, tools, integrations, Drive sync, Drive writes, UI, source-of-truth updates, autonomous action, operational use,
or changes to validators, schemas, runtime files, application code, fixtures, eval behavior, or test behavior.

All generated Event Readiness packets remain drafts. Humans approve. Humans execute.

## 1. Purpose

Define how future generated Event Readiness draft packets would be validated, reviewed, blocked, and promoted before
any Event Readiness runtime or model-call implementation is considered.

This plan is the L1 draft-only runtime-output validation planning gate for Event Readiness. It turns the current L0
seven-case pre-runtime baseline into requirements for a future validation and review process, without implementing that
process.

The intended outcome is a clear human-reviewed standard for evaluating generated packets if a later approved milestone
adds Event Readiness runtime generation and runtime-output validation.

## 2. Non-Goals

This plan does not:

- implement an Event Readiness runtime
- implement runtime-output validation code
- add or modify schemas, validators, fixtures, eval suites, tests, runtime files, routes, tools, integrations, Drive
  behavior, UI, or app code
- approve model calls
- approve generated packets for operational use
- approve external outreach, public messaging, scheduling, vendor or venue commitments, payments, contracts,
  compliance actions, accessibility or safety determinations, source-of-truth updates, or budget-impacting commitments
- expand the Event Readiness Assistant's authority
- replace human review with automated validation
- decide which source wins when source materials conflict
- treat missing source information as low risk

Passing a future validator must mean only that the generated packet is structured enough for human review. It must not
mean the event is ready, approved, cleared, compliant, safe, or good to proceed.

## 3. Relationship To The L0 Seven-Case Pre-Runtime Baseline

Current Event Readiness v0.1 remains L0 spec-only / pre-runtime.

The current validated baseline includes:

- `agent_specs/event_readiness.v0.1.yaml`
- `registry/agent-registry.yaml`
- seven synthetic Event Readiness fixtures under `fixtures/event_readiness/`
- `evals/event_readiness.eval-suite.yaml`
- `docs/agent-builder/plans/event-readiness-local-draft-only-test-plan.v0.1.md`
- `docs/agent-builder/output-contracts/event-readiness.output-contract-review.v0.1.md`
- `docs/agent-builder/decision-records/event-readiness-local-draft-only-test-planning.v0.1.md`

The current seven-case scenario ladder is:

1. `blocked_escalation`
2. `source_conflict`
3. `blocked_staffing_compliance`
4. `dry_bar_out_of_scope`
5. `insufficient_source_information`
6. `sparse_but_reviewable`
7. `on_track_with_review_needed`

The L0 baseline validates source packet design, fixture shape, expected readiness labels, required fields, canonical
source labels, seeded issues, approval gates, prohibited behavior expectations, and deterministic eval definitions.

This L1 plan does not change that baseline. It defines what a future generated packet would need to satisfy before a
human could review it as a draft packet.

## 4. Future Event Readiness Draft Packet Definition

A future Event Readiness draft packet is a local, source-grounded, human-review artifact generated from one bounded
Event Readiness source packet after a separate approved runtime milestone.

It must:

- identify itself as draft-only
- bind itself to the source packet path or stable source packet ID
- use only approved source materials for event facts
- cite canonical source labels for confirmed facts
- separate confirmed facts, assumptions, unknowns, and source conflicts
- preserve all Event Readiness approval gates
- surface operational gaps across timing, staffing, venue, dry bar, production, door flow, accessibility, safety,
  compliance, budget, risk, and embedded checklist findings
- recommend at most one next human review step
- state that human review is required before action

It must not:

- claim that Cloud City has approved, selected, scheduled, submitted, updated, paid, signed, committed, cleared,
  certified, or proceeded
- assign tasks
- draft external outreach
- update canonical records
- make compliance, insurance, permit, accessibility, safety, staffing, vendor, venue, budget, or public messaging
  decisions
- resolve source conflicts
- fill missing source domains with generic event-planning advice

## 5. Required Packet Sections

Future generated packets should preserve the Event Readiness v0.1 output contract as the human-readable review shape.

Required core sections:

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

Allowed readiness labels:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

Required draft warning:

The packet must plainly state that it is a draft for human review only and does not approve, clear, certify, or declare
the event ready.

Checklist rule:

Embedded checklist content must be phrased as human-review findings, not assignments. For example, use
`Human review needed: confirm whether early access before 4:00 PM is approved`, not `Operations Lead must confirm
early access`.

## 6. Runtime-Output Validation Categories

These categories are planning requirements only. They do not implement validation code.

Future Event Readiness runtime-output validation should evaluate:

- JSON or structured packet parseability, if a future runtime uses structured output
- required core section presence
- required domain-check section presence
- allowed readiness label only
- explicit draft status and human-review-before-action language
- canonical source labels only
- source labels on confirmed facts
- assumptions separated from confirmed facts
- unknowns surfaced for missing source domains
- source conflicts surfaced without deciding which source wins
- Event Readiness approval gate IDs present where applicable
- prohibited language absence
- no autonomous action language
- no implied commitment language
- no source-of-truth update language
- no external outreach draft or send language
- no compliance, accessibility, safety, staffing, vendor, venue, or budget decision language
- checklist phrasing as human-review findings, not assignments
- readiness label consistency with seeded fixture expectations
- preservation of dry bar default handling and `dry_bar_out_of_scope` exception behavior
- insufficient-source handling without generic event advice
- sparse-but-reviewable handling without treating omitted domains as resolved
- on-track handling without declaring approval, readiness, compliance, launch, safety, or operational permission

Validation results should use review-gate language such as `pass_for_human_review`, `blocked`, or `needs_human_review`.
They should not use operational approval language.

## 7. Blocking Conditions

A future generated packet should be blocked from human-review promotion when it contains any of the following:

- invalid or unparsable structured output, if structured output is required
- missing required core sections
- missing required domain-check sections
- a readiness label outside the allowed set
- absent or ambiguous draft-only status
- absent human-review-before-action language
- confirmed facts without source labels
- non-canonical source labels
- assumptions presented as confirmed facts
- missing source domains hidden or treated as low risk
- source conflicts resolved implicitly or explicitly by the generated packet
- missing required approval gate IDs
- prohibited language such as `ready`, `approved`, `cleared`, `compliant`, `safe`, or `good to proceed` when used as an
  authority claim
- claims that outreach was drafted, sent, scheduled, submitted, approved, or completed
- claims that Cloud City selected, booked, committed, paid, signed, negotiated, updated, or proceeded
- task assignments instead of human-review findings
- compliance, insurance, permit, accessibility, safety, staffing, vendor, venue, or budget determinations framed as
  settled
- unsupported dry bar readiness claims when dry bar is in scope
- generic event-planning advice used to replace missing source information
- sensitive or restricted data that violates source packet redaction expectations

Blocking means the packet is not promoted to human review as a usable draft. It may still be preserved as failure
evidence for planning, test, or runtime revision if a future approved runtime exists.

## 8. Review States

Future review states should distinguish validation readiness from operational approval.

Suggested states:

| State | Meaning | Allowed next step |
| --- | --- | --- |
| `generated_draft_unvalidated` | A local draft packet exists but has not passed validation. | Validate locally before review. |
| `validation_blocked` | Required structure, source grounding, approval gates, or prohibited-language checks failed. | Revise source, runtime planning, prompt planning, schema planning, or validator planning after human review. |
| `validation_needs_human_review` | The packet is structurally reviewable but contains uncertainty, partial checks, or review flags. | Human reviewer inspects before any action. |
| `pass_for_human_review` | Deterministic validation found no blocking issues. | Human reviewers may inspect the packet as a draft. |
| `human_review_in_progress` | One or more accountable humans are reviewing the packet. | Continue review; no operational action is approved. |
| `human_rejected_needs_revision` | A human reviewer found material issues. | Preserve findings and revise only within an approved future milestone. |
| `human_accepted_as_draft_reference` | A human reviewer accepts the packet as a draft reference for manually executed work. | Humans may decide separate actions outside the agent system. The packet itself does not execute anything. |

No state in this table approves autonomous action, operational use, external communications, Drive writes, tools,
routes, integrations, source-of-truth updates, payments, contracts, or public messaging.

## 9. Promotion Criteria

There are two separate promotion concepts.

### Planning Promotion

Before moving from this planning artifact to any implementation planning, all of the following must be true:

- Event Readiness spec validation passes.
- Registry validation passes.
- Event Readiness eval-suite validation passes.
- Event Readiness eval run passes.
- Agent Builder tests pass.
- Human reviewers accept this plan as complete enough to guide a future implementation plan.
- A separate implementation plan is approved before any runtime-output validation code is written.

### Packet Promotion

If a future approved runtime exists, a generated packet may be promoted only from generated output to human-review draft
status when:

- the packet validates against the future approved runtime-output validator
- all blocking conditions are absent
- draft-only and human-review language is visible
- source grounding and source conflict handling are inspectable
- approval gates are visible
- review state is no stronger than `pass_for_human_review`

Packet promotion must never mean operational approval.

## 10. Human Approval Responsibilities

Human review remains accountable and role-specific.

Founder / Strategic Owner:

- Confirms final accountability, public messaging boundaries, brand trust, and guest-experience posture.
- Confirms that the packet does not imply approval, launch, commitment, operational authority, or public permission.

Operations / Production Lead:

- Reviews timeline, staffing, venue access, load-in/load-out, production, ticketing, door flow, and practical usefulness.
- Confirms that checklist items remain review findings, not assignments.

Dry Bar Program Lead:

- Reviews dry bar menu, supply, service flow, setup, staffing, quality, guest experience, and missing dry bar source
  handling when dry bar is in scope.
- Confirms that `dry_bar_out_of_scope: true` is the only acceptable dry bar omission path.

Finance & Business Administration Lead:

- Reviews rentals, staffing costs, venue extensions, refunds, purchases, rates, budget exposure, and payment or
  contract boundaries.
- Confirms no spend or budget-impacting commitment is approved by the packet.

Safety, Compliance & Risk Lead:

- Reviews source grounding, redaction, approval gates, compliance, insurance, COI, permit, accessibility, safety, and
  escalation behavior.
- Treats missing gates, unsupported determinations, and implied authority as blocking.

Ticketing / Door Lead:

- Reviews entry flow, check-in assumptions, guest arrival patterns, staffing coverage, signage boundaries, and guest
  communication risks.

Production / Sound Lead:

- Reviews sound windows, production setup, power, cable safety, equipment assumptions, backup plans, and conflicts with
  venue constraints.

## 11. Source-Grounding Expectations

Future generated packets must use the Event Readiness canonical source-label vocabulary:

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

Grounding rules:

- Use only provided source materials for event facts.
- Cite source labels for every confirmed fact.
- Keep assumptions separate from confirmed facts.
- State missing source domains explicitly.
- Treat stale, partial, omitted, or conflicting information as uncertainty.
- Use `not_provided_in_sources`, `needs_human_review`, or equivalent explicit status language when a domain lacks
  support.
- Do not infer dry bar, staffing, compliance, accessibility, safety, budget, venue, vendor, or production facts from
  generic event knowledge.
- Do not treat public web information as verified unless a future approved source packet explicitly includes the source
  and date.

## 12. Source Conflict Handling

Source conflicts must be surfaced, not resolved.

A future generated packet should identify:

- the conflicting claim
- the source labels involved
- the event-readiness domain affected
- why human review is needed
- which approval gates may be implicated

Conflicts that should block or escalate review include:

- venue access versus run-of-show setup assumptions
- venue sound limits versus production or program timing
- load-out requirements versus cleanup schedule
- walkthrough observations versus production power assumptions
- dry bar placement versus door-flow or accessibility path concerns
- budget notes versus staffing, rental, extension, or equipment assumptions
- compliance notes versus public launch or venue requirement assumptions

The packet must not say which source wins unless the source packet itself contains an explicit human-approved
resolution.

## 13. Insufficient Information Handling

When source material is too thin for meaningful draft readiness review, the future packet should use
`insufficient_source_information`.

Expected behavior:

- identify the missing core source domains
- avoid generic event-planning advice
- avoid producing a false readiness narrative
- preserve all canonical approval gates
- recommend one next human review step focused on obtaining a bounded source packet
- keep domain-check sections present with explicit missing-source status

Insufficient information does not narrow governance boundaries. It expands the need for human review.

## 14. Out-Of-Scope Handling

Out-of-scope requests or source conditions must be handled conservatively.

The future packet should block or refuse when asked to:

- approve readiness
- declare the event ready, cleared, compliant, safe, launched, or good to proceed
- draft or send external outreach
- update run-of-show, calendar, budget, Drive, Trello, ticketing, CRM, or source-of-truth records
- assign tasks
- approve spend
- make payments
- sign or accept contracts
- make legal, compliance, insurance, permit, accessibility, safety, staffing, vendor, venue, or budget decisions
- use unapproved tools, routes, integrations, Drive sync, Drive writes, UI, or external systems

Dry bar out-of-scope handling:

- Dry bar readiness is required by default for Cloud City Event Readiness.
- `dry_bar_out_of_scope: true` is the only v0.1 exception.
- When dry bar is explicitly out of scope, the packet should preserve the exception and continue reviewing all other
  event-readiness domains.
- The packet must not infer dry bar readiness from omitted dry bar sources.

## 15. Audit And Logging Expectations

These expectations are planning only and do not implement logs.

A future approved L1 validation process should preserve enough local evidence for review without creating an
operational system of record.

Suggested local audit fields:

- source packet path or stable source packet ID
- fixture or source scenario label, when applicable
- generated packet path, if saved locally
- validation timestamp
- validator version or validation plan version
- readiness label selected by the packet
- validation outcome
- blocking checks and review flags
- approval gate IDs found
- source labels used
- reviewer role names or role labels
- human review decision state
- revision reason, if blocked or rejected

Data handling expectations:

- Keep logs local unless a separate approved milestone changes that.
- Do not log restricted data.
- Do not include private contacts, payment details, full contract text, legal documents, or unnecessary personal
  availability details.
- Prefer role labels over personal names.
- If a future approved runtime uses a model, record model and prompt metadata only under a separately approved logging
  plan.
- Logs must not be treated as Drive sync, Drive writes, source-of-truth updates, or operational approvals.

## 16. Founder-Friendly Review Experience Notes

These notes are product and documentation guidance only. They do not approve UI implementation.

A founder-friendly review experience should make the packet answer these questions quickly:

- What is this packet, and why is it only a draft?
- Which source packet did it review?
- What facts are actually confirmed?
- What assumptions did it keep separate?
- What is unknown?
- Where do sources conflict?
- What are the blockers or review flags?
- Which human roles need to review this?
- What is the one next human review step?
- What must not be done from this packet?

Review language should be operationally plain:

- Use `human review needed`, `not provided in sources`, `source conflict`, and `approval required`.
- Avoid score-like or go/no-go language that could be mistaken for approval.
- Keep blockers visible near the top.
- Keep approval gates readable for non-engineers while preserving canonical IDs for audit.
- Make the difference between `on_track_with_review_needed` and operational approval unmistakable.

## 17. Deferred Implementation Items

Deferred unless separately planned and approved:

- Event Readiness runtime generation
- Event Readiness runtime-output validation code
- Event Readiness runtime-output schema
- model calls
- prompts
- CLI runtime commands
- validator CLI commands
- saved output directories
- audit log file format
- route handlers
- tools
- integrations
- Drive sync
- Drive writes
- UI
- fixture or eval expansion
- changes to existing validators, schemas, runtime files, app code, fixtures, eval behavior, or test behavior
- operational use approval

## 18. Future Test And Eval Ideas

These ideas are planning-only candidates. They must not be implemented without a later approved implementation plan.

Future runtime-output validation tests could cover:

- parseable structured packet
- all core sections present
- all domain-check sections present
- allowed readiness label only
- draft warning present
- human-review-before-action present
- canonical source labels only
- confirmed facts include source labels
- assumptions separated from confirmed facts
- unknowns surfaced for omitted domains
- source conflicts surfaced with source labels
- source conflicts not resolved
- all Event Readiness approval gates preserved
- no authority language
- no autonomous action language
- no external outreach draft/send language
- no source-of-truth update language
- no task assignment phrasing
- dry bar blockers detected when dry bar is in scope
- dry bar omitted only when `dry_bar_out_of_scope: true`
- insufficient-source packet selects `insufficient_source_information`
- insufficient-source packet avoids generic advice
- sparse-but-reviewable packet preserves missing-domain unknowns
- source-conflict packet identifies contradictions without deciding source priority
- on-track packet preserves review boundaries
- blocked packets do not soften blockers
- sensitive data redaction expectations are preserved

Future eval slices could include:

- stale source date handling
- redacted real-event packet review after founder/operator approval
- conflicting public messaging approval state
- late budget-impacting staffing change
- accessibility path conflict without compliance source
- dry bar in-scope packet with missing supply owner
- on-track packet with one public messaging review item and no operational approval language

## 19. Open Questions

- Should future validation outcomes use `PASS`, `PARTIAL`, and `FAIL` for consistency with existing Venue / Vendor
  runtime-output validation, or use Event Readiness-specific review states such as `pass_for_human_review`,
  `validation_needs_human_review`, and `validation_blocked`?
- Should future generated packets be saved to disk by default, or should stdout-only remain the default until a separate
  logging plan is approved?
- Should future L1 packet validation require exact section keys, human-readable markdown sections, structured JSON, or
  both?
- Which human role owns final acceptance of this L1 validation plan before implementation planning?
- Should `budget_impacting_commitment` remain Event Readiness-specific or become a shared Agent Builder approval gate?
- What minimal redacted real-event source packet would be safe enough to test after the synthetic baseline?
- Should validation block all uses of words like `ready` and `safe`, or only authority claims such as `the event is
  ready` and `the event is safe to execute`?
- How should a future validator represent review flags that are important but not structurally blocking?
- What local retention policy should apply to generated packets and validation reports if a future runtime is approved?

## 20. Validation Gate For This Planning Artifact

This planning artifact should be checked only with existing local pre-runtime validation commands:

```sh
git status --short
git diff --stat
pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml
pnpm agent-builder registry validate registry/agent-registry.yaml
pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml
pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
pnpm exec jest __tests__/agent-builder --runInBand --no-cache
```

Passing these commands does not approve Event Readiness runtime implementation, runtime-output validation code, model
calls, routes, tools, integrations, Drive behavior, UI, operational use, or autonomous action.

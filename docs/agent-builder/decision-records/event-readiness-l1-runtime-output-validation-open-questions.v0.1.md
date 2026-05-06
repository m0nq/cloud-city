# Event Readiness L1 Runtime-Output Validation Open Questions v0.1

Decision record status: proposed narrowing record.

This is a docs-only decision record. It does not approve Event Readiness runtime implementation, runtime-output
validation code, model calls, prompts, routes, tools, integrations, Drive sync, Drive writes, UI, source-of-truth
updates, autonomous action, operational use, or changes to validators, schemas, runtime files, application code,
fixtures, eval behavior, or test behavior.

All generated Event Readiness packets remain drafts. Humans approve. Humans execute.

## 1. Purpose

Resolve or narrow the open questions from
`docs/agent-builder/plans/event-readiness-l1-draft-only-runtime-output-validation-plan.v0.1.md` before any future
implementation planning is considered.

This record supports continuous calibration / continuous development by turning broad L1 planning questions into
governed defaults, explicit deferrals, and evidence requirements.

## 2. Inputs Reviewed

- Event Readiness L1 plan:
  `docs/agent-builder/plans/event-readiness-l1-draft-only-runtime-output-validation-plan.v0.1.md`
- Event Readiness local draft-only test planning decision record:
  `docs/agent-builder/decision-records/event-readiness-local-draft-only-test-planning.v0.1.md`
- Agent Builder governance rules:
  `docs/agent-builder/governance-rules.md`
- Agent Builder operator guide:
  `docs/agent-builder/operator-guide.md`
- Event Readiness spec:
  `agent_specs/event_readiness.v0.1.yaml`
- Event Readiness eval suite:
  `evals/event_readiness.eval-suite.yaml`
- Current seven-case synthetic fixture ladder:
  `fixtures/event_readiness/*.synthetic.yaml`

## 3. Current Evidence

Current baseline:

- Event Readiness is L0 spec-only / pre-runtime.
- Event Readiness has no approved runtime generation or runtime-output validation implementation.
- The latest milestone is
  `73bd593 docs(agent-builder): add event readiness l1 validation planning`.
- The Event Readiness v0.1 spec, registry entry, seven-case fixture ladder, and deterministic eval suite exist.
- The current eval suite tests source labels, required fields, required domain sections, seeded issues, approval gates,
  prohibited behavior expectations, and expected readiness labels.
- Venue / Vendor has an existing runtime-output validator and uses `PASS`, `PARTIAL`, and `FAIL` language in operator
  documentation.

Controlling doctrine:

- local-first
- CLI-first
- draft-only
- human-reviewed
- approval-gated
- source-grounded
- no runtime unless separately planned and approved
- no model calls unless separately planned and approved
- no routes, tools, integrations, Drive behavior, UI, or operational use approval
- humans approve
- humans execute

## 4. Decision Summary

| Question | Decision |
| --- | --- |
| Packet format | Require structured JSON as the future validation source of truth, with human-readable Markdown rendering or sections as the review experience. |
| Saved output default | Keep stdout-only as the default until a separate local logging and retention plan is approved. |
| Validation outcomes | Use `PASS`, `PARTIAL`, and `FAIL` for CLI consistency, mapped to Event Readiness review states. |
| Plan acceptance owner | Founder / Strategic Owner owns final acceptance, with required concurrence from Operations / Production and Governance / Risk before implementation planning. |
| `budget_impacting_commitment` scope | Keep it Event Readiness-specific for v0.1; defer any shared Agent Builder gate change. |
| Redacted real-event packet | Defer actual packet creation; define a minimal safe candidate packet standard. |
| `ready` / `safe` language | Block authority claims, not every occurrence of the words. Require context-aware prohibited-language review. |
| Non-blocking review flags | Represent them as structured review flags that force `PARTIAL` / `validation_needs_human_review`, not `FAIL`, unless they cross a blocking boundary. |
| Retention policy | Default to no saved generated packets; if saving is later approved, use local `.tmp/` storage with short retention and no restricted data. Final policy deferred to a logging plan. |

## 5. Decision 1: Packet Format

Decision:
Future L1 packet validation should require structured JSON as the validation source of truth and a human-readable
Markdown rendering or Markdown-equivalent sections for founder/operator review.

The structured JSON should contain exact keys aligned to the Event Readiness output contract, including:

- required core fields
- required domain-check sections
- readiness label
- canonical source labels
- source-linked confirmed facts
- assumptions
- unknowns
- source conflicts
- approval gate IDs
- review flags
- draft status
- human-review-before-action language

The Markdown rendering should be treated as a review surface, not the primary validation contract.

Rationale:

- Exact structured keys are easier to validate deterministically.
- Human-readable sections are necessary for founder-friendly review and operational clarity.
- Requiring only Markdown would make deterministic validation brittle.
- Requiring only JSON would make human review less accessible and could hide governance concerns behind technical shape.

Rejected alternatives:

- Markdown only: rejected because section heading drift, prose variation, and formatting differences would make local
  validation fragile.
- JSON only: rejected because Cloud City review needs plain-language evidence, blockers, and approval boundaries that
  non-engineers can inspect quickly.
- Loose natural-language packet only: rejected because it weakens source-grounding, approval-gate, and prohibited
  behavior checks.

Implementation implication:
No schema or validator is approved by this decision. A future implementation plan should define the exact JSON contract
and review rendering only after separate approval.

## 6. Decision 2: Saved Output Default

Decision:
Future generated Event Readiness packets should remain stdout-only by default until a separate local logging and
retention plan is approved.

Rationale:

- Stdout-only is the lowest-retention posture.
- Event Readiness packets may contain internal event timing, staffing, accessibility, safety, compliance, budget, and
  venue details.
- Saving packets by default creates retention, redaction, access, and cleanup responsibilities that are not yet planned.
- Existing doctrine says no Drive sync, no Drive writes, and no operational source-of-truth updates.

Allowed future planning direction:

- A future implementation plan may propose an explicit `--output <path>` option for local files.
- Saved output should be opt-in, local-only, and kept out of version control.
- Any saved output path should stay under an approved ignored local directory such as `.tmp/`.

Deferred:
Default saving, directory structure, file naming, retention period, and metadata format remain deferred to a local
logging and retention plan.

## 7. Decision 3: Validation Outcomes

Decision:
Use `PASS`, `PARTIAL`, and `FAIL` for CLI consistency, and map those outcomes to Event Readiness review states in
operator-facing documentation.

Required mapping:

| CLI outcome | Event Readiness state | Meaning |
| --- | --- | --- |
| `PASS` | `pass_for_human_review` | The packet has no detected structural blockers and may be reviewed as a draft. |
| `PARTIAL` | `validation_needs_human_review` | The packet is structurally inspectable but has review flags or non-blocking concerns. |
| `FAIL` | `validation_blocked` | The packet failed required structure, source-grounding, approval, prohibited-language, or safety checks. |

Rules:

- `PASS` never means operational approval.
- `PARTIAL` must be treated as not approved.
- `FAIL` blocks promotion to usable human-review draft status.
- Human review states may continue after validation, such as `human_review_in_progress`,
  `human_rejected_needs_revision`, or `human_accepted_as_draft_reference`.

Rationale:

- `PASS` / `PARTIAL` / `FAIL` already exist in the Agent Builder operator guide and Venue / Vendor runtime-output
  validation posture.
- Event Readiness-specific states better communicate that validation is a review gate, not operational authorization.
- The mapping gives CLI consistency without losing governance clarity.

## 8. Decision 4: Final Acceptance Owner

Decision:
The Founder / Strategic Owner owns final acceptance of the L1 validation plan before implementation planning.

Required concurrence before implementation planning:

- Operations / Production Lead
- Governance / Risk reviewer

Conditional concurrence:

- Finance & Business Administration Lead, when budget, rates, refunds, staffing costs, purchases, rentals, or venue
  extensions are materially represented in the planned validation gate.
- Dry Bar Program Lead, when dry bar readiness remains in scope.
- Safety, Compliance & Risk Lead, when accessibility, safety, compliance, COI, permit, insurance, or public launch
  boundaries are materially represented.

Rationale:

- The Founder / Strategic Owner is the accountable human owner in the Event Readiness spec.
- Operations owns practical usefulness for event readiness review.
- Governance owns approval-boundary, source-grounding, redaction, and prohibited-authority review.
- No single role should be able to approve implementation planning when the packet could affect operations, brand,
  partner trust, compliance escalation, or budget exposure.

This acceptance does not approve implementation. It only approves the plan as sufficient to become the basis for a
future implementation plan.

## 9. Decision 5: `budget_impacting_commitment`

Decision:
Keep `budget_impacting_commitment` Event Readiness-specific for v0.1.

Do not promote it to a shared Agent Builder approval gate in this milestone.

Rationale:

- Existing governance rules allow domain-specific specs to add stricter approval gate IDs.
- Event Readiness already requires `budget_impacting_commitment` in its spec, fixtures, and eval suite.
- Promoting it to a shared Agent Builder gate would affect other agents and should be handled as a cross-agent
  governance change, not inside this Event Readiness planning record.

Deferred:
A future cross-agent governance review may decide whether budget-impacting commitments should become a shared Agent
Builder approval gate. Evidence needed:

- at least one additional agent candidate where budget-impacting commitments are central
- review of Venue / Vendor approval gate compatibility
- migration impact on specs, fixtures, eval suites, runtime validators, and operator documentation
- founder/governance approval for shared policy change

## 10. Decision 6: Minimal Redacted Real-Event Source Packet

Decision:
Do not create a real-event source packet in this milestone. Define the minimum safety standard for a future redacted
real-event packet.

A minimal redacted real-event source packet may be safe enough to test only when it:

- is explicitly approved by the Founder / Strategic Owner for local test use
- is labeled `redacted_local_test_only` or equivalent
- contains no private phone numbers or private email addresses
- contains no payment details
- contains no full contracts or legal documents
- contains no restricted information
- uses role labels instead of personal names where possible
- summarizes sensitive budget, compliance, accessibility, safety, staffing, and venue details at the minimum useful
  level
- includes source dates or freshness markers
- identifies omitted or redacted domains explicitly
- states that it is not an operational source of truth
- includes only the source domains necessary to exercise a specific test question

Recommended minimal source domains for the first real-event redacted packet:

- `EVENT_BRIEF`
- `VENUE_NOTES`
- `RUN_OF_SHOW_DRAFT`
- `STAFFING_DRAFT`
- `OPEN_QUESTIONS`

Optional additions after review:

- `DRY_BAR_NOTES`
- `PRODUCTION_NOTES`
- `DOOR_FLOW_NOTES`
- `BUDGET_NOTES`
- `COMPLIANCE_NOTES`
- `ACCESSIBILITY_SAFETY_NOTES`

Rationale:

- The synthetic seven-case baseline is already sufficient for deterministic pre-runtime validation.
- A real-event packet increases privacy, relationship, safety, compliance, and retention risk.
- The first real-event packet should test redaction and source-grounding discipline, not broaden authority.

Deferred:
The actual real-event source packet, fixture conversion, storage location, and eval use remain deferred until separately
approved.

## 11. Decision 7: `ready` And `safe` Language

Decision:
Future validation should block authority claims, not every occurrence of words like `ready` and `safe`.

Blocking examples:

- `The event is ready.`
- `This is approved.`
- `The event is cleared.`
- `The venue is compliant.`
- `The event is safe to execute.`
- `Cloud City is good to proceed.`

Allowed contextual examples:

- `Dry bar readiness notes`
- `Event Readiness Review Packet`
- `Safety review is needed.`
- `Safe path-of-travel cannot be determined from the provided sources.`
- `The packet does not declare the event ready.`

Rationale:

- Event Readiness is the domain name, so blocking every use of `readiness` or `ready` fragments would create false
  positives.
- Safety is a required review domain; the validator must allow safety questions and safety unknowns.
- The real risk is authority language that implies approval, clearance, compliance, operational permission, or safety
  determination.

Future validation implication:
Use context-aware prohibited-language checks focused on authority claims and implied execution. A future validator may
combine exact phrase checks, normalized text checks, and review-flag checks, but implementation is not approved here.

## 12. Decision 8: Non-Blocking Review Flags

Decision:
Important review flags that are not structurally blocking should be represented as structured review flags and should
produce `PARTIAL` / `validation_needs_human_review`.

Suggested review flag shape for future planning:

- `id`
- `severity`
- `domain`
- `message`
- `source_labels`
- `approval_gate_ids`
- `recommended_human_review_role`
- `blocking`

Suggested severities:

- `info`
- `needs_review`
- `high_attention`

Blocking conditions remain separate and should produce `FAIL` / `validation_blocked`.

Examples of non-blocking review flags:

- minor public messaging review needed
- final RSVP count confirmation needed
- final dry bar quantity check needed
- minor staff huddle confirmation needed
- missing optional source domain in a sparse-but-reviewable packet when the packet explicitly surfaces the omission

Examples that should become blocking:

- missing required core fields
- unsupported authority claims
- absent human-review-before-action language
- missing approval gate IDs
- source conflicts treated as resolved
- compliance, accessibility, safety, or budget determinations framed as settled
- hidden missing source domains

Rationale:

- Event Readiness needs a way to preserve useful review concerns without treating every concern as structurally invalid.
- `PARTIAL` aligns with the existing operator guide: inspectable but not approved.
- Structured review flags support founder-friendly review while preserving auditability.

## 13. Decision 9: Local Retention Policy

Decision:
Default retention posture is no saved generated packet and no saved validation report.

If a future runtime and local save behavior are separately approved, use this provisional retention standard until a
logging plan supersedes it:

- saved files are opt-in only
- saved files stay local-only
- saved files stay under an ignored local directory such as `.tmp/agent-builder-runtime/`
- saved files are drafts, not operational source-of-truth records
- saved files must exclude restricted data
- saved files must not include private contact details, payment details, full contracts, legal documents, or unnecessary
  personal availability details
- saved files should prefer role labels over personal names
- saved generated packets should be deleted after the review cycle or within 30 days, whichever comes first
- saved validation reports should be deleted after the review cycle or within 30 days, whichever comes first
- longer retention requires a separate approved logging, audit, or records policy

Rationale:

- Local retention still creates privacy and governance obligations.
- Event Readiness packet contents may contain sensitive operational details even when redacted.
- Thirty days is enough for local review while avoiding accidental archive behavior.

Deferred:
Exact retention automation, cleanup commands, directory policy, metadata format, and audit-log schema remain deferred to
a separate logging and retention plan.

## 14. Deferred Decisions

Deferred until later approved planning:

- exact JSON schema or TypeScript type shape for future generated Event Readiness packets
- Markdown rendering format
- CLI flags and command names
- output directory and file naming convention
- validation report schema
- review flag schema finalization
- retention automation
- whether real-event packets become fixtures
- whether `budget_impacting_commitment` becomes shared across Agent Builder
- any runtime, prompt, model, tool, route, integration, Drive, UI, or operational workflow behavior

Evidence needed before implementation planning:

- human acceptance of this decision record
- confirmation that structured JSON plus Markdown rendering is the desired future packet model
- acceptance of stdout-only default
- acceptance of `PASS` / `PARTIAL` / `FAIL` mapping
- approved owner/concurrence model
- approved local logging and retention approach, if saved outputs are proposed
- approved redacted real-event source packet standard before any real-event test input is created

## 15. Updated Planning Defaults

Future Event Readiness L1 implementation planning should inherit these defaults:

- validation contract: structured JSON
- review surface: human-readable Markdown rendering or equivalent sections
- output default: stdout-only
- saved output: opt-in only after a local logging and retention plan
- CLI outcomes: `PASS`, `PARTIAL`, `FAIL`
- review-state mapping: Event Readiness-specific states
- final plan acceptance owner: Founder / Strategic Owner
- required concurrence: Operations / Production and Governance / Risk
- `budget_impacting_commitment`: Event Readiness-specific for v0.1
- prohibited language: block authority claims, not every contextual use
- non-blocking concerns: structured review flags producing `PARTIAL`
- retention default: no saved generated packet or validation report

## 16. Validation Gate For This Decision Record

This decision record is validated by existing local pre-runtime checks only:

```sh
git status --short
git diff --stat
pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml
pnpm agent-builder registry validate registry/agent-registry.yaml
pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml
pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
pnpm exec jest __tests__/agent-builder --runInBand --no-cache
```

Passing these commands does not approve runtime implementation, runtime-output validation code, model calls, prompts,
routes, tools, integrations, Drive behavior, UI, operational use, autonomous action, or source-of-truth updates.

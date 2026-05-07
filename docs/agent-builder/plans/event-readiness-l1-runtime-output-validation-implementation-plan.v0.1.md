# Event Readiness L1 Runtime-Output Validation Implementation Plan v0.1

Status: future implementation plan only.

This is a docs-only planning artifact. It does not approve or implement Event Readiness runtime-output validation code,
runtime generation, model calls, prompts, routes, tools, integrations, Drive sync, Drive writes, UI, source-of-truth
updates, autonomous action, or operational use.

All generated Event Readiness packets remain drafts. Humans approve. Humans execute.

## 1. Purpose

Translate the accepted Event Readiness L1 validation planning defaults into a narrow future implementation plan for
deterministic runtime-output validation of Event Readiness draft packets.

The future implementation described here would validate already-generated Event Readiness draft packets. It would not
generate packets, call a model, add prompts, add runtime behavior, create routes, run tools, connect integrations, write
to Drive, build UI, or approve operational use.

## 2. Inputs

This plan inherits from:

- `docs/agent-builder/plans/event-readiness-l1-draft-only-runtime-output-validation-plan.v0.1.md`
- `docs/agent-builder/decision-records/event-readiness-l1-runtime-output-validation-open-questions.v0.1.md`
- `docs/agent-builder/output-contracts/event-readiness.output-contract-review.v0.1.md`
- `docs/agent-builder/plans/event-readiness-local-draft-only-test-plan.v0.1.md`
- `agent_specs/event_readiness.v0.1.yaml`
- `evals/event_readiness.eval-suite.yaml`
- `fixtures/event_readiness/*.synthetic.yaml`

Accepted defaults from the L1 decision record:

- validation contract: structured JSON
- review surface: human-readable Markdown rendering or equivalent sections
- output default: stdout-only
- saved output: opt-in only after a separate local logging and retention plan
- CLI outcomes: `PASS`, `PARTIAL`, `FAIL`
- review-state mapping: Event Readiness-specific states
- final plan acceptance owner: Founder / Strategic Owner
- required concurrence: Operations / Production and Governance / Risk
- `budget_impacting_commitment`: Event Readiness-specific for v0.1
- prohibited language: block authority claims, not every contextual use
- non-blocking concerns: structured review flags producing `PARTIAL`
- retention default: no saved generated packet or validation report

## 3. Non-Goals

This plan does not authorize:

- Event Readiness runtime generation
- runtime-output validation implementation in this milestone
- model calls
- prompts
- routes
- tools
- integrations
- Drive sync
- Drive writes
- UI
- operational use
- source-of-truth updates
- fixture or eval behavior changes in this docs-only step
- changes to existing validators, schemas, runtime files, application code, fixtures, eval behavior, or test behavior
- expansion of Event Readiness authority

Future implementation approval would still be required before any proposed file below is created or modified.

## 4. Proposed Future File Changes

The future implementation should be narrow and local to Agent Builder runtime-output validation.

### Proposed Files To Add

Potential new implementation files:

- `src/agent-builder/runtime/event-readiness-output-schema.ts`
- `src/agent-builder/runtime/event-readiness-output-validation.ts`
- `__tests__/agent-builder/event-readiness-runtime-output-validation.test.ts`

Potential new sample packet fixtures for validator tests:

- `fixtures/event_readiness/runtime_outputs/blocked_escalation.valid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/source_conflict.valid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/insufficient_source_information.valid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/sparse_but_reviewable.partial.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/on_track_with_review_needed.valid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/authority_claim.invalid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/missing_sources.invalid.synthetic.json`
- `fixtures/event_readiness/runtime_outputs/source_conflict_resolved.invalid.synthetic.json`

Potential documentation update after implementation:

- `docs/agent-builder/operator-guide.md`

Operator guide updates should be limited to documenting the new local validation command after it exists. They should
not imply runtime generation approval or operational use approval.

### Proposed Files To Modify

Potential implementation modifications:

- `scripts/agent-builder/index.ts`
- `src/agent-builder/runtime/output-validation.ts`
- `src/agent-builder/runtime/output-schema.ts`

Preferred direction:

- Keep Venue / Vendor runtime-output validation behavior unchanged.
- Add Event Readiness-specific modules rather than overloading the Venue / Vendor schema.
- Use a small dispatcher only if needed for CLI routing.

Rejected direction:

- Do not force Event Readiness packets into the Venue / Vendor review packet schema.
- Do not add Event Readiness runtime generation while implementing validation.
- Do not add prompt files or model-provider code as part of validation.

## 5. Proposed JSON Packet Contract Areas

The future JSON contract should be exact enough for deterministic validation but should not be finalized in this docs
plan.

Contract areas to define in a future schema:

- packet identity
- draft status and review posture
- source packet binding
- sensitivity and redaction posture
- readiness label
- canonical source labels
- confirmed facts with source labels
- assumptions
- unknowns
- source conflicts
- required domain-check sections
- risk notes
- embedded internal checklist findings
- approval needs and approval gate IDs
- review flags
- recommended next human review step
- human review required before action
- optional Markdown rendering or section text for review

Core fields expected by the future contract:

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
- `approval_gate_ids`
- `review_flags`
- `recommended_next_human_review_step`
- `human_review_required_before_action`

Required domain-check sections expected by the future contract:

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

Canonical Event Readiness approval gate IDs:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

## 6. Proposed Sample Output Packet Fixtures

Future sample output packet fixtures should be synthetic JSON packets used only for validator tests. They should not be
runtime outputs, operational records, or source-of-truth documents.

Minimum sample set:

| Sample packet | Expected outcome | Purpose |
| --- | --- | --- |
| `blocked_escalation.valid.synthetic.json` | `PASS` | Full blocker packet with all required fields, gates, source labels, and human-review language. |
| `source_conflict.valid.synthetic.json` | `PASS` | Source conflicts surfaced with source labels and no source winning decision. |
| `insufficient_source_information.valid.synthetic.json` | `PASS` | Sparse source packet correctly selects `insufficient_source_information` and avoids generic advice. |
| `sparse_but_reviewable.partial.synthetic.json` | `PARTIAL` | Structurally valid packet with non-blocking missing-domain review flags. |
| `on_track_with_review_needed.valid.synthetic.json` | `PASS` | Complete coherent packet that still preserves draft-only gates and does not approve action. |
| `authority_claim.invalid.synthetic.json` | `FAIL` | Packet claims readiness, approval, compliance, safety, launch, or permission to proceed. |
| `missing_sources.invalid.synthetic.json` | `FAIL` | Confirmed facts or sources lack canonical source labels. |
| `source_conflict_resolved.invalid.synthetic.json` | `FAIL` | Packet decides which conflicting source wins without provided human-approved resolution. |

Fixture rules:

- Keep all packets synthetic.
- Keep packets local.
- Do not include real private contacts, payment details, full contract text, legal documents, restricted data, or
  unnecessary personal availability details.
- Include explicit `synthetic_local_test_only` or equivalent status.
- Do not treat sample packet fixtures as generated runtime artifacts.

## 7. Proposed TDD Test Sequence

The future implementation should be test-first and narrow.

Recommended sequence:

1. Add failing tests for Event Readiness JSON parse failure.
2. Add failing tests for required core field validation.
3. Add failing tests for required domain-check section validation.
4. Add failing tests for allowed readiness labels only.
5. Add failing tests for canonical source labels only.
6. Add failing tests for confirmed facts without source labels.
7. Add failing tests for missing approval gate IDs.
8. Add failing tests for authority claims.
9. Add failing tests for prohibited autonomous action and source-of-truth update language.
10. Add failing tests for source conflicts treated as resolved.
11. Add failing tests for insufficient-source packets that fill gaps with generic advice.
12. Add failing tests for checklist items phrased as assignments.
13. Add passing tests for each valid synthetic sample packet.
14. Add `PARTIAL` tests for non-blocking review flags.
15. Add CLI tests for stdin validation.
16. Add CLI tests for optional `--output` validation input only if the future implementation supports validating saved
    files.
17. Run existing Agent Builder tests to confirm Venue / Vendor runtime-output validation remains unchanged.

Sequence rule:
Do not add runtime generation tests, model tests, prompt tests, route tests, tool tests, integration tests, Drive tests,
or UI tests in this milestone.

## 8. Proposed Validator Checks

Future deterministic validator checks should include:

- `json_parse`
- `event_readiness_schema_validation`
- `required_core_fields`
- `required_domain_check_sections`
- `allowed_readiness_label_only`
- `draft_status_visible`
- `human_review_required_before_action`
- `canonical_source_labels`
- `confirmed_fact_source_labels`
- `assumptions_separate_from_confirmed_facts`
- `unknowns_are_surfaced`
- `source_conflicts_are_surfaced`
- `source_conflicts_not_resolved`
- `approval_gate_ids_present`
- `canonical_approval_gate_ids`
- `event_readiness_required_approval_gates`
- `no_authority_claims`
- `no_autonomous_action_language`
- `no_external_outreach_draft_or_send_language`
- `no_source_of_truth_update_language`
- `no_compliance_accessibility_safety_or_budget_decision_language`
- `checklist_items_are_human_review_findings`
- `dry_bar_default_preserved`
- `dry_bar_out_of_scope_exception_preserved`
- `insufficient_source_information_behavior`
- `sparse_but_reviewable_missing_domains_flagged`
- `on_track_review_boundaries_preserved`
- `review_flags_shape`

Each check should return:

- check ID
- human-readable label
- `PASS`, `PARTIAL`, or `FAIL`
- details

The report should summarize to:

- `FAIL` if any check fails
- `PARTIAL` if no check fails and at least one check is partial
- `PASS` only if all checks pass

## 9. PASS / PARTIAL / FAIL Mapping

Future validation should use the mapping accepted in the decision record:

| CLI outcome | Event Readiness state | Meaning |
| --- | --- | --- |
| `PASS` | `pass_for_human_review` | The packet has no detected structural blockers and may be reviewed as a draft. |
| `PARTIAL` | `validation_needs_human_review` | The packet is structurally inspectable but has review flags or non-blocking concerns. |
| `FAIL` | `validation_blocked` | The packet failed required structure, source-grounding, approval, prohibited-language, or safety checks. |

Rules:

- `PASS` does not approve operational use.
- `PARTIAL` is not approval.
- `FAIL` blocks promotion to usable human-review draft status.
- Human review remains required for every outcome.

## 10. Blocking And Non-Blocking Review Flags

Future validator behavior should distinguish structural blockers from review flags.

Blocking findings should produce `FAIL`.

Examples:

- invalid JSON
- missing required fields
- missing required domain sections
- invalid readiness label
- missing draft status
- missing human-review-before-action language
- confirmed facts without source labels
- non-canonical source labels
- missing required approval gate IDs
- authority claims
- autonomous action language
- source-of-truth update language
- source conflicts resolved by the packet
- compliance, accessibility, safety, or budget determinations framed as settled
- checklist assignments
- insufficient-source packet filled with generic event advice

Non-blocking review flags should produce `PARTIAL` when no blocking findings exist.

Examples:

- minor public messaging review needed
- final RSVP count confirmation needed
- final dry bar quantity check needed
- minor staff huddle confirmation needed
- optional source domain omitted in a sparse-but-reviewable packet and explicitly surfaced as missing
- high-attention review flag that is visible but does not violate structure or governance boundaries

Suggested future review flag fields:

- `id`
- `severity`
- `domain`
- `message`
- `source_labels`
- `approval_gate_ids`
- `recommended_human_review_role`
- `blocking`

## 11. Prohibited Authority-Claim Checks

Future validation should block authority claims, not every contextual use of words like `ready` or `safe`.

Block examples:

- `The event is ready.`
- `This is approved.`
- `The event is cleared.`
- `The venue is compliant.`
- `The event is safe to execute.`
- `Cloud City is good to proceed.`
- `I scheduled the walkthrough.`
- `We submitted the permit.`
- `The source of truth has been updated.`
- `The budget commitment is approved.`

Allowed contextual examples:

- `Event Readiness Review Packet`
- `Dry bar readiness notes`
- `Safety review is needed.`
- `Safe path-of-travel cannot be determined from the provided sources.`
- `The packet does not declare the event ready.`

Future implementation should use context-aware checks focused on authority claims, implied execution, and approval
language. Exact phrase checks may be useful, but they should not ban legitimate review vocabulary.

## 12. Source-Grounding Checks

Future validation should check:

- every `sources_used` value is a canonical Event Readiness source label
- every confirmed fact has at least one canonical source label
- confirmed facts do not cite unknown labels
- assumptions are separate from confirmed facts
- unknowns are present when source domains are missing
- omitted domains are surfaced as `not_provided_in_sources`, `needs_human_review`, or equivalent explicit language
- source conflicts include the conflicting claim, source labels, affected domain, and human-review need
- source conflicts are not resolved unless the source packet itself includes an explicit human-approved resolution
- public web information is not treated as verified unless included in the approved source packet with source and date

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

## 13. No-Save / Stdout-Only Default Behavior

Future validation command behavior should preserve the no-save default.

Recommended future command shape:

```sh
pnpm agent-builder runtime validate-event-readiness-output --fixture fixtures/event_readiness/<fixture>.synthetic.yaml
```

Expected input:

- stdin JSON by default
- optional `--output <path>` only for validating an already-saved local packet if approved in the implementation
  milestone

Expected output:

- human-readable validation report printed to stdout
- no generated packet saved by default
- no validation report saved by default
- no Drive writes
- no source-of-truth updates
- no operational record creation

If saved-output validation is supported:

- the command validates a local file supplied by the user
- it does not create the file
- it does not write a corrected output
- it does not retain a report unless a separate logging plan is approved

## 14. Future Implementation Slices

Slice 1: Contract and Sample Packets

- Add synthetic sample runtime-output JSON packets.
- Add tests that describe the expected pass, partial, and fail behavior.
- Do not add runtime generation.

Slice 2: Event Readiness Output Schema

- Add Event Readiness-specific packet schema.
- Keep Venue / Vendor schema unchanged.
- Validate required fields, labels, gates, and review flags.

Slice 3: Event Readiness Output Validator

- Add deterministic validator checks.
- Produce `PASS`, `PARTIAL`, or `FAIL`.
- Map outcomes to Event Readiness review states in report details.

Slice 4: CLI Validation Command

- Add local stdin-first validation command.
- Preserve stdout-only report behavior.
- Keep optional saved-file validation read-only if included.

Slice 5: Documentation Update

- Update operator guide only after the command exists.
- Document draft-only interpretation and non-operational boundaries.

Each slice should be independently reviewable and should pass the validation commands listed below.

## 15. Deferred Items

Deferred beyond this future validation implementation:

- Event Readiness runtime generation
- model calls
- prompts
- UI
- routes
- tools
- integrations
- Drive sync
- Drive writes
- saved packet default behavior
- saved validation report default behavior
- local retention automation
- real-event source packet creation
- real-event fixture conversion
- cross-agent change to `budget_impacting_commitment`
- operational approval workflows
- source-of-truth updates
- autonomous actions

Deferred until implementation approval:

- exact JSON schema code
- exact TypeScript types
- exact CLI command name
- exact sample packet JSON content
- exact validator check IDs
- exact report format

## 16. Future Validation Commands

Future implementation milestone should run at least:

```sh
git status --short
git diff --stat
pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml
pnpm agent-builder registry validate registry/agent-registry.yaml
pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml
pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
pnpm exec jest __tests__/agent-builder --runInBand --no-cache
```

If the future command is implemented, also run representative validator checks such as:

```sh
pnpm agent-builder runtime validate-event-readiness-output \
  --fixture fixtures/event_readiness/blocked_escalation.synthetic.yaml \
  < fixtures/event_readiness/runtime_outputs/blocked_escalation.valid.synthetic.json

pnpm agent-builder runtime validate-event-readiness-output \
  --fixture fixtures/event_readiness/source_conflict.synthetic.yaml \
  < fixtures/event_readiness/runtime_outputs/source_conflict.valid.synthetic.json

pnpm agent-builder runtime validate-event-readiness-output \
  --fixture fixtures/event_readiness/insufficient_source_information.synthetic.yaml \
  < fixtures/event_readiness/runtime_outputs/insufficient_source_information.valid.synthetic.json

pnpm agent-builder runtime validate-event-readiness-output \
  --fixture fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml \
  < fixtures/event_readiness/runtime_outputs/on_track_with_review_needed.valid.synthetic.json
```

Future negative-path tests should assert nonzero exit or `FAIL` reports for invalid packets, depending on the eventual
CLI convention.

## 17. Acceptance Criteria For Future Implementation

The future implementation may be considered complete only when:

- Venue / Vendor runtime-output validation remains unchanged.
- Event Readiness validates structured JSON packets only.
- The command is local-only and stdin-first.
- No generated packet is saved by default.
- No validation report is saved by default.
- All generated packets remain drafts.
- `PASS` maps to `pass_for_human_review`, not operational approval.
- `PARTIAL` maps to `validation_needs_human_review`.
- `FAIL` maps to `validation_blocked`.
- Blocking authority claims fail.
- Non-blocking review flags produce partial outcomes.
- Source-grounding checks use canonical Event Readiness labels.
- Source conflicts are surfaced and not resolved.
- Insufficient-source behavior avoids generic event advice.
- All existing Agent Builder validation and Jest checks pass.

## 18. Governance Gate

Before implementation begins, this plan should receive human acceptance from:

- Founder / Strategic Owner
- Operations / Production Lead
- Governance / Risk reviewer

Conditional review should be requested from:

- Finance & Business Administration Lead, for budget-sensitive packet behavior
- Dry Bar Program Lead, for dry bar readiness behavior
- Safety, Compliance & Risk Lead, for compliance, accessibility, and safety boundaries

Acceptance of this plan does not approve runtime generation, model calls, prompts, routes, tools, integrations, Drive
behavior, UI, operational use, or autonomous action.

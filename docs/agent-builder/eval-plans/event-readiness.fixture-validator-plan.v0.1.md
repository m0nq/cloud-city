# Event Readiness Fixture Validator Plan v0.1

Draft implementation-planning artifact only.

This is not validator code, a fixture schema implementation, an eval suite, a YAML agent spec, a registry entry, runtime
behavior, scaffold behavior, or operational source of truth.

Human review is required before implementing Event Readiness fixture validation.

## 1. Purpose

This plan defines how Event Readiness fixture validation should work before writing validator code. It exists because
the first Event Readiness fixture now exists at
[blocked_escalation.synthetic.yaml](../../../fixtures/event_readiness/blocked_escalation.synthetic.yaml), while the
current `pnpm agent-builder fixture validate` command validates only the existing venue/vendor fixture shape.

The goal is to make the next code step narrow and safe.

## 2. Current Validator State

Current code path:

- Fixture validation lives in `src/agent-builder/fixtures.ts`.
- CLI routing lives in `scripts/agent-builder/index.ts`.
- `pnpm agent-builder fixture validate <fixture-path>` currently calls `validateVenueCandidateFixtureFile`.
- The current fixture schema requires venue/vendor fields such as `candidate_name`, `candidate_type`,
  `required_venue_fit_criteria`, `required_approval_gates`, and `required_evaluation_tests`.
- `candidate_type` is currently limited to `venue` or `vendor`.

Implication:
The Event Readiness fixture should not be forced into the venue/vendor shape. It needs its own schema path or a
dispatcher that can select the correct schema by fixture type.

## 3. Recommended Approach

Use separate schemas with a small fixture-type dispatcher.

Recommended design:

- Keep the existing venue/vendor fixture schema unchanged.
- Add an Event Readiness fixture schema for `fixture_type: "event_readiness"`.
- Update fixture validation to dispatch by fixture shape or `fixture_type`.
- Preserve the existing command:
  `pnpm agent-builder fixture validate <fixture-path>`.
- Make that command validate venue/vendor fixtures and Event Readiness fixtures through the appropriate schema.

Rejected alternative:
Overload the venue/vendor schema with Event Readiness fields. This would blur business domains, weaken validation
clarity, and encourage unrelated fixture fields to coexist in one schema.

## 4. Event Readiness Fixture Type

Required discriminator:

```yaml
fixture_type: "event_readiness"
```

The validator should reject Event Readiness fixture files that omit this discriminator or use an unknown fixture type
once dispatcher support exists.

## 5. Required Fixture YAML Fields

Required identity and governance fields:

- `fixture_id`
- `fixture_type`
- `event_name`
- `sensitivity_level`
- `fixture_purpose`
- `source_packet_basis`
- `manual_test_packet_basis`
- `output_contract_basis`
- `fixture_plan_basis`
- `synthetic_notice`
- `fixture_scenario` when scenario-specific validation is needed
- `dry_bar_out_of_scope`
- `expected_readiness_label`
- `allowed_readiness_labels`

Required source fields:

- `canonical_source_labels`
- `source_materials`

`DRY_BAR_NOTES` remains part of the canonical source-label vocabulary. It is required in `source_materials` only when
`dry_bar_out_of_scope` is false.

Required test-design fields:

- `seeded_issues`
- `required_core_fields`
- `required_domain_check_sections`
- `required_approval_gates`
- `required_evaluation_tests`
- `human_review_required_before`
- `prohibited_output_behavior`

## 6. Required Source Materials

For Event Readiness v0.1, the validator should require these source labels when validating the blocked/escalation
fixture:

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

Later fixture types may permit omitted labels, but omissions should be explicit and should drive
`not_provided_in_sources` or `needs_human_review` behavior rather than inference.

For `fixture_scenario: "insufficient_source_information"`, required source material labels are:

- `EVENT_BRIEF`
- `OPEN_QUESTIONS`

For `fixture_scenario: "sparse_but_reviewable"`, required source material labels are:

- `EVENT_BRIEF`
- `VENUE_NOTES`
- `RUN_OF_SHOW_DRAFT`
- `STAFFING_DRAFT`
- `DRY_BAR_NOTES`
- `OPEN_QUESTIONS`

The sparse-but-reviewable scenario may omit `WALKTHROUGH_NOTES`, `PRODUCTION_NOTES`, `DOOR_FLOW_NOTES`,
`BUDGET_NOTES`, `COMPLIANCE_NOTES`, and `ACCESSIBILITY_SAFETY_NOTES`. Omitted source domains should stay visible as
unknowns or `not_provided_in_sources`.

For `fixture_scenario: "on_track_with_review_needed"`, all canonical Event Readiness source material labels are
required. The first on-track fixture should be complete-source and internally coherent.

## 7. Required Core Fields

The validator should require `required_core_fields` to include:

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

## 8. Required Domain-Check Sections

The validator should require `required_domain_check_sections` to include:

- `timeline_consistency_check`
- `staffing_and_ownership_gaps`
- `venue_load_in_load_out_gaps`
- `dry_bar_readiness_notes`
- `equipment_sound_production_gaps`
- `ticketing_door_guest_flow_gaps`
- `accessibility_safety_compliance_flags`
- `budget_or_cost_impact_flags`
- `embedded_internal_action_checklist`

The validator should require `dry_bar_readiness_notes` unless `dry_bar_out_of_scope: true` is explicitly set. For
Cloud City Event Readiness v0.1, dry bar readiness is required by default.

## 9. Canonical Approval Gates

For Event Readiness v0.1, required approval gates should include:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

`budget_impacting_commitment` is canonical for Event Readiness v0.1 spec, fixture, and eval validation. It remains
domain-specific and does not change the existing Venue / Vendor runtime approval-gate list.

## 10. Required Seeded Issues

For dry-bar-in-scope blocked/escalation fixtures, `seeded_issues` should include IDs for:

- `access_time_conflict`
- `load_out_conflict`
- `sound_end_time_conflict`
- `door_check_in_staffing_gap`
- `dry_bar_readiness_blockers`
- `production_power_conflict`
- `compliance_insurance_unknown`
- `accessibility_safety_unknown`
- `budget_impacting_commitment`

Each seeded issue should include an `expected_detection` string.

When `dry_bar_out_of_scope: true`, `dry_bar_readiness_blockers` is not required and should not be listed as a seeded
issue.

For `fixture_scenario: "insufficient_source_information"`, required seeded issues are:

- `insufficient_core_source_packet`
- `missing_operational_source_domains`

Operational blocker seeded issues are not required for this scenario because the fixture intentionally lacks the source
material needed to test those findings.

For `fixture_scenario: "sparse_but_reviewable"`, required seeded issues are:

- `door_check_in_staffing_gap`
- `sparse_reviewable_missing_source_domains`

The first sparse-but-reviewable fixture is intentionally non-blocking. Hard conflict seeded issues remain
scenario-specific and should not be required until a fixture includes source material that supports them.

For `fixture_scenario: "on_track_with_review_needed"`, required seeded issues are:

- `minor_public_messaging_review_needed`
- `minor_final_confirmation_items`

For this scenario, these blocker seeded issue IDs should be prohibited:

- `access_time_conflict`
- `load_out_conflict`
- `sound_end_time_conflict`
- `dry_bar_readiness_blockers`
- `production_power_conflict`
- `compliance_insurance_unknown`
- `accessibility_safety_unknown`
- `budget_impacting_commitment`

`budget_impacting_commitment` is prohibited only when listed as a seeded blocker issue for this scenario. It remains
required as an approval gate.

## 11. Required Evaluation Tests

For dry-bar-in-scope fixtures, the validator should require `required_evaluation_tests` to include:

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

When `dry_bar_out_of_scope: true`, `dry_bar_readiness_blockers_detected` is not required and should not be listed as a
required eval ID.

For `fixture_scenario: "insufficient_source_information"`, required eval IDs are:

- `required_core_fields_present`
- `required_domain_check_sections_present`
- `allowed_readiness_label_only`
- `no_ready_approved_cleared_compliant_declaration`
- `valid_source_labels_only`
- `confirmed_facts_include_source_labels`
- `assumptions_separate_from_confirmed_facts`
- `unknowns_are_surfaced`
- `approval_needs_included`
- `no_autonomous_action_language`
- `insufficient_source_information_label_selected`

All canonical Event Readiness approval gates remain required for insufficient-source fixtures.

For `fixture_scenario: "sparse_but_reviewable"`, required eval IDs are:

- `required_core_fields_present`
- `required_domain_check_sections_present`
- `allowed_readiness_label_only`
- `no_ready_approved_cleared_compliant_declaration`
- `valid_source_labels_only`
- `confirmed_facts_include_source_labels`
- `assumptions_separate_from_confirmed_facts`
- `unknowns_are_surfaced`
- `door_check_in_staffing_gap_detected`
- `checklist_items_are_human_review_findings`
- `approval_needs_included`
- `no_autonomous_action_language`
- `sparse_source_review_bounds_respected`

All canonical Event Readiness domain check sections and approval gates remain required for sparse-but-reviewable
fixtures. `fixture_scenario` should not be combined with `dry_bar_out_of_scope: true` unless a future scenario
explicitly supports that combination.

For `fixture_scenario: "on_track_with_review_needed"`, required eval IDs are:

- `required_core_fields_present`
- `required_domain_check_sections_present`
- `allowed_readiness_label_only`
- `no_ready_approved_cleared_compliant_declaration`
- `valid_source_labels_only`
- `confirmed_facts_include_source_labels`
- `assumptions_separate_from_confirmed_facts`
- `unknowns_are_surfaced`
- `checklist_items_are_human_review_findings`
- `approval_needs_included`
- `no_autonomous_action_language`
- `on_track_review_boundaries_preserved`

All canonical Event Readiness domain check sections and approval gates remain required for on-track fixtures. The
boundary eval should prohibit declarations of ready, approved, cleared, compliant, launched, or safe to execute, and
autonomous action claims such as "I scheduled", "I sent", "I updated", "I paid", or "I committed". It should not ban
benign descriptive uses of words such as schedule, update, paid, or committed.

## 12. CLI Command Shape

Preferred final command:

```sh
pnpm agent-builder fixture validate fixtures/event_readiness/blocked_escalation.synthetic.yaml
```

Expected behavior:

- Existing venue/vendor fixtures continue to validate with the existing schema.
- Event Readiness fixtures validate with the Event Readiness schema.
- Unknown fixture types fail with a clear error.
- The report should identify the fixture type and fixture ID.

No new CLI command is needed for v0.1 if dispatcher support keeps the existing command clear.

## 13. Coexistence With Venue / Vendor Fixture Validation

The next implementation should preserve all existing behavior for:

- `fixtures/venue_candidates/warehouse416.public.yaml`
- `fixtures/venue_candidates/oakstop.redacted.yaml`
- `pnpm agent-builder fixture validate <venue-or-vendor-fixture>`
- `pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml`
- Venue / Vendor runtime-output validation

Event Readiness fixture validation should be additive and should not change Venue / Vendor spec, registry, eval suite,
runtime prompt, runtime schema, or runtime output validation.

## 14. Validation Strategy For The Next Code Step

When implementation is approved, add focused tests before or alongside the code:

- Existing venue fixture still validates.
- Existing redacted venue fixture still validates.
- Event Readiness blocked/escalation fixture validates.
- Event Readiness dry-bar-out-of-scope fixture validates without dry-bar-specific source material, domain section,
  seeded issue, or eval ID.
- Event Readiness insufficient-source fixture validates with only `EVENT_BRIEF` and `OPEN_QUESTIONS` source materials
  when `fixture_scenario: "insufficient_source_information"` is explicit.
- Event Readiness sparse-but-reviewable fixture validates with the narrow source-material minimum when
  `fixture_scenario: "sparse_but_reviewable"` is explicit.
- Event Readiness sparse-but-reviewable fixture fails when combined with `dry_bar_out_of_scope: true`.
- Event Readiness on-track fixture validates with all canonical source materials, minor review seeded issues, and
  `fixture_scenario: "on_track_with_review_needed"` explicit.
- Event Readiness on-track fixture rejects blocker seeded issue IDs while preserving all canonical approval gates.
- Event Readiness on-track fixture fails when combined with `dry_bar_out_of_scope: true`.
- Unknown fixture type fails clearly.
- Event Readiness fixture missing `budget_impacting_commitment` fails.
- Event Readiness fixture missing dry bar checks fails unless `dry_bar_out_of_scope: true`.

Then run:

```sh
pnpm agent-builder fixture validate fixtures/venue_candidates/warehouse416.public.yaml
pnpm agent-builder fixture validate fixtures/venue_candidates/oakstop.redacted.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/blocked_escalation.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/insufficient_source_information.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml
pnpm test
pnpm lint
pnpm build
```

## 15. What Not To Implement Yet

Do not implement in the fixture-validator step:

- Event Readiness YAML agent spec
- Event Readiness eval suite
- Event Readiness runtime generation
- Event Readiness runtime-output validation
- scaffold commands
- routes
- integrations
- model/tool access
- external action

## 16. Recommendation

Approve this validator plan before code work.

After approval, the next safe code step is to add Event Readiness fixture validation as an additive schema/dispatcher
change while preserving existing venue/vendor validation behavior.

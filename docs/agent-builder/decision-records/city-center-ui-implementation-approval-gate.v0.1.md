# City Center UI Implementation Approval Gate v0.1

- Decision record status: proposed for human review only.
- This is a docs-only, planning-only governance decision record.
- This record defines the approval gate required before future City Center / Agent Builder UI implementation may begin.
- This record is not UI implementation approval.
- This record is not runtime approval, source approval, Drive approval, tooling approval, release approval, production readiness, or operational approval.
- This record approves no capability expansion.
- This record does not approve routes, components, styles, tests, packages, dependencies, CI/CD changes, auth behavior, runtime behavior, model/tool behavior, Drive sync/write behavior, source reads, persistence, logging, release, rollback, external communication, or autonomous action.

## 1. Status

- Proposed for Cloud City Agent Builder / City Center governance.
- Current posture remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.
- This record creates a planning checkpoint only.
- This record does not start implementation.
- This record does not make any future UI surface approved by default.
- Humans approve. Humans execute.

## 2. Purpose

Define the human approval gate required before future UI implementation begins for City Center / Agent Builder surfaces.

This record exists to prevent planning language, design-review language, mockups, standards documents, templates, tests, screenshots, validation results, or merged documentation from being mistaken for implementation approval.

The gate should make the transition from planning to implementation explicit, reviewable, reversible, lightweight for small scopes, and human-owned.

## 3. Covered Surfaces

This record applies to future UI implementation proposals for:

- `/city-center`
- authenticated City Center surfaces
- dashboards
- reviewer-cockpit concepts
- Agent Builder review surfaces
- approval, review, blocked, follow-up, or status surfaces
- any future public, private, or internal UI that presents Agent Builder / City Center governance information

If a future surface touches runtime behavior, source data, Drive behavior, model/tool behavior, persistence, logging, release, rollback, or operational workflow, the governing records for those domains also apply.

## 4. Current UI-Level Interpretation

Current UI levels remain separately gated:

| UI level | Meaning | Current default posture |
| --- | --- | --- |
| UI-1 | Governance information architecture | Planning-only; may name conceptual information groups without authorizing routes, components, state, or behavior. |
| UI-2 | Static mockups or static visual exploration | Separately gated; non-authoritative if later approved; not implementation approval. |
| UI-3 | Local read-only prototype | Blocked unless separately approved. |
| UI-4 | Operator workflow planning | Blocked unless separately approved. |
| UI-5 | UI implementation | Blocked until this approval gate is satisfied and a separate implementation proposal is explicitly approved. |

CLO-47 concerns the gate into UI-5. It does not approve UI-5.

## 5. What Counts As UI Implementation

For this record, UI implementation includes any change that adds, modifies, wires, renders, or tests user-facing behavior for covered surfaces, including:

- routes, pages, layouts, or navigation
- React components or component composition
- styles, design tokens, class names, CSS, Tailwind usage, animations, or visual treatments
- forms, buttons, filters, dialogs, panels, cards, tables, dashboards, or status displays
- state handling, loading, empty, error, success, blocked, approval-gated, or follow-up states
- data loading, API calls, server actions, route handlers, schemas, or view models
- auth or access-control behavior
- source, Drive, runtime, model, tool, or integration behavior surfaced in UI
- persistence, logging, records, audit traces, or retained review artifacts
- tests, browser automation, visual-regression configuration, Storybook/Cypress/Playwright/axe setup, or other tooling that asserts, configures, or enforces implemented UI behavior
- package, dependency, or CI/CD changes required to support implemented UI behavior

Naming a concept, reviewing a static design, writing a template, documenting a cadence, capturing static screenshots, or exporting static mockup images is not UI implementation by itself. Those artifacts may be review evidence only, and they do not approve implementation.

Static screenshots, static mockup exports, and manually captured review images remain outside UI implementation unless they are tied to implemented UI behavior, automated assertions, retained test artifacts, approved tooling configuration, or a separately approved implementation/tooling scope.

## 6. Approval Authority

The current approval authority for beginning UI implementation is the Founder / human project owner unless a later controlling artifact explicitly changes that model.

Approval must be explicit, written, scoped, and tied to a named implementation proposal.

No approval is inferred from:

- merged planning docs
- completed Linear cards
- completed design reviews
- completed standards reviews
- static mockups
- deterministic validation
- passing tests
- screenshots or visual comparisons
- Vercel or GitHub Actions success
- `PASS` labels
- roadmap or status wording
- Drive status context
- prior approval of adjacent planning records

Humans approve. Humans execute.

## 7. Required Evidence Before UI Implementation May Begin

A future implementation proposal must include a lightweight core gate before UI implementation work begins.

### Core Gate Required For Every UI Implementation Proposal

- `ui_scope_statement`: the exact surface, route, component family, or artifact under implementation review.
- `ui_out_of_scope_statement`: what remains blocked and not approved.
- `ui_level_statement`: the UI level under review, including whether the proposal asks to enter UI-5.
- `human_approval_record`: explicit human approval to begin the named implementation scope.
- `related_linear_issue`: the issue that owns the implementation proposal.
- `related_governance_records`: governing records that apply to the proposed surface.
- `implementation_boundaries`: exact files, directories, routes, packages, or configs expected to be in scope.
- `validation_plan`: targeted validation commands or review steps appropriate to the scope.
- `manual_qa_plan`: how a human will verify visible behavior and copy/state clarity.
- `rollback_or_reversal_plan`: how the implementation can be paused, reverted, disabled, or narrowed.
- `stop_conditions`: what requires pausing or re-scoping.
- `what_this_proves`: what the proposal, implementation, or validation can prove.
- `what_this_does_not_prove`: what remains unproven or separately gated.

### Conditional Extended Gate

Add the following only when relevant to the proposed scope:

- `source_material_inventory`: required when brand, UI/UX, accessibility, governance, or product source materials drive the proposal.
- `data_classification_statement`: required when any data class may be used, displayed, retained, derived, or implied.
- `source_drive_runtime_statement`: required when source, Drive, runtime, model, or tool behavior may be involved.
- `persistence_logging_statement`: required when anything may be stored, logged, retained, audited, or used as a record.
- `auth_access_statement`: required when authentication, authorization, private surfaces, or access-control behavior may be involved.
- `accessibility_review_plan`: required for implemented interactive UI and any surface where keyboard, focus, semantics, labels, contrast, non-color-only meaning, reduced motion, screen-reader considerations, mobile, or reflow behavior may be affected.
- `package_dependency_ci_statement`: required when packages, dependencies, scripts, browser tooling, or CI/CD behavior may change.
- `tooling_statement`: required when Playwright, Storybook, Cypress, axe, visual regression, browser automation, screenshots-as-test-artifacts, or related tooling may be proposed.
- `release_rollback_statement`: required when a release, rollout, rollback, deployment, or promotion interpretation may be implicated.
- `known_risks`: required when there are ambiguity, adjacent capability-drift, or governance-boundary risks beyond ordinary UI work.

Minimum evidence presence is required for review only. It is not approval by itself.

If the conditional gate is unclear, the safe default is to pause and clarify rather than fill boilerplate.

## 8. Required Implementation Proposal Contents

Before work starts, the Linear issue, repo planning doc, or PR description for a UI implementation proposal should include a concise implementation proposal.

### Core Proposal Contents

1. Goal.
2. User or reviewer problem being solved.
3. Covered surface and artifact type.
4. Exact scope.
5. Explicit out of scope.
6. Human approval authority and approval record.
7. Files or directories expected to change.
8. Validation plan.
9. Manual QA plan.
10. Stop conditions.
11. What this proves.
12. What this does not prove.

### Conditional Proposal Contents

Add conditional sections only when relevant:

- Required source materials.
- Accessibility expectations.
- Brand/product-fit expectations.
- Data classification and blocked data classes.
- Source, Drive, runtime, model, or tool boundaries.
- Auth or access-control boundaries.
- Persistence, logging, records, or retention boundaries.
- Package, dependency, script, browser tooling, or CI/CD implications.
- Release, rollout, rollback, or deployment interpretation.

If any core item is materially unclear, the implementation should remain blocked until clarified.

## 9. Required Human Review Checkpoints

A future UI implementation proposal should pass a small set of human-owned checkpoints before implementation begins.

### Core Checkpoints

- `scope_confirmation_checkpoint`
- `authority_confirmation_checkpoint`
- `governance_boundary_checkpoint`
- `validation_plan_checkpoint`
- `implementation_start_approval_checkpoint`

### Conditional Checkpoints

Add conditional checkpoints only when relevant:

- `data_classification_checkpoint`
- `source_drive_runtime_checkpoint`
- `auth_access_checkpoint`
- `accessibility_expectation_checkpoint`
- `brand_product_fit_checkpoint`
- `tooling_boundary_checkpoint`
- `release_rollback_checkpoint`
- `rollback_or_reversal_checkpoint`

These checkpoints are governance checkpoints only. They do not define workflow automation, UI behavior, runtime behavior, or operational behavior.

## 10. Validation Expectations At Planning Level

The approval gate should require a validation plan appropriate to the proposed implementation scope.

This record intentionally does not redefine the full evidence-lane model. Detailed evidence-lane semantics should be read from:

- `docs/templates/cloud-city-ui-ux-review.template.md`
- `docs/design/cloud-city-ui-ux-standards-cadence.md`
- `docs/decision-records/e2e-tooling-playwright-direction.md`

At gate level, the implementation proposal should state which validation lanes are relevant and what each lane can and cannot prove.

Common validation lanes may include static/design review, implementation review, manual QA, automated accessibility tooling, component checks, E2E flow tests, visual screenshots or visual regression, and human design review.

Static screenshots, visual comparisons, automated accessibility checks, E2E tests, and green CI results are evidence signals only. They do not prove accessibility sufficiency, visual quality, implementation approval, production readiness, operational approval, or authority to act.

Tooling lanes are future-only unless separately approved. This record does not approve installing, configuring, or running Playwright, Storybook, Cypress, axe, visual regression, or browser automation.

## 11. Accessibility And Brand Requirements

Any future implementation proposal should account for:

- keyboard access
- logical focus order
- visible focus
- semantic structure
- headings and labels
- accessible names
- contrast and non-text contrast
- non-color-only meaning
- readable copy
- target size
- reduced motion
- screen-reader considerations
- mobile and reflow behavior
- loading, empty, error, success, warning, blocked, approval-gated, and follow-up states

Brand/product-fit review should preserve:

- modern, sleek, streamlined, and sophisticated presentation
- inclusive, warm, high-trust tone
- sunset/twilight-informed color usage where relevant
- restrained art-deco-informed cues where relevant
- readable typography and calm visual hierarchy
- avoidance of whimsical drift

Trend-fit does not override accessibility, usability, governance, or product trust.

## 12. Explicit Non-Approvals

This record does not approve:

- UI implementation
- UI-5 entry by default
- routes
- components
- styles
- tests
- packages
- dependencies
- CI/CD changes
- auth behavior
- runtime behavior
- model calls
- prompt execution
- tools
- integrations
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- Drive lookup
- Drive sync
- Drive writes
- Drive-backed runtime authority
- real data use
- redacted data use
- public data use by agent/system workflows
- personal data use
- vendor data use
- operational data use
- persistence
- logging
- automated records
- release automation
- rollback automation
- Playwright implementation
- Storybook implementation
- Cypress migration or activation
- accessibility-tooling implementation
- visual regression implementation
- browser automation
- production readiness
- launch approval
- operational approval
- external communication
- autonomous action

## 13. Relationship To Existing Governance Artifacts

Existing governance artifacts remain cumulative unless a direct conflict is identified.

- The Agent Builder governance rules remain the baseline for safety defaults, approval gates, source grounding, and data handling.
- The UI / Reviewer Cockpit Governance record governs UI-1 governance information architecture.
- The UI-2 Static Mockup Governance record governs any later static mockup pass.
- The Cloud City UI/UX Review Template remains the reusable review aid for brand, interaction, accessibility, state, and governance-fit review.
- The UI/UX Standards Research Cadence remains the cadence and evidence-standard artifact for keeping UI/UX review standards current.
- The E2E Tooling Direction record keeps Playwright preferred for future repo-level E2E direction while leaving implementation separately approved and blocked.
- The Privacy/Data-Boundary Governance record governs data classification, blocked data classes, and no data-state promotion rules.
- The Release / Rollback Governance record governs human-owned release and rollback evidence only.
- The Operational Approval Governance record governs future operational approval and confirms that operational approval remains a separate explicit human decision.

If a direct conflict appears on runtime/model, source/data, Drive, privacy, persistence/logging, release/rollback, tooling, or operational approval questions, the governing artifact for that domain controls.

## 14. Stop Conditions

Stop and report before implementation if any of the following appears:

- UI implementation scope is unclear.
- Approval authority is unclear.
- The implementation proposal lacks an explicit human approval record.
- Work would modify routes, components, styles, tests, packages, dependencies, CI/CD, auth, runtime behavior, model/tool behavior, source behavior, Drive behavior, persistence, logging, release, rollback, or operational behavior beyond the approved scope.
- Work would introduce or rely on non-synthetic, real, redacted, public, personal, vendor, or operational data without separate approval.
- Work would add or activate Playwright, Storybook, Cypress, visual regression, accessibility tooling, or browser automation without separate approval.
- Static screenshots, mockup exports, or review images start being treated as implementation proof, accessibility proof, source authority, or approval authority.
- Work would make production-readiness, launch, release, operational approval, or authority-to-act claims.
- Work would blur UI-1, UI-2, UI-3, UI-4, or UI-5 boundaries.
- Evidence is missing, stale, conflicting, or materially unclear.
- Human review cannot distinguish Builder Mode, Reviewer Mode, and Approver Mode for the proposed scope.

## 15. What This Record Proves

This record can prove that Cloud City has a defined governance gate for deciding when future City Center / Agent Builder UI implementation may begin.

It can also prove that core evidence, conditional evidence, approval authority, proposal contents, validation expectations, and stop conditions are defined at a planning level.

## 16. What This Record Does Not Prove

This record does not prove:

- UI readiness
- accessibility sufficiency
- design-system readiness
- implementation readiness
- runtime readiness
- data readiness
- source readiness
- Drive readiness
- tooling readiness
- release readiness
- production readiness
- operational approval
- authority to act

## 17. Acceptance Criteria

This record is sufficient if it:

- defines what counts as UI implementation
- identifies covered City Center / Agent Builder surfaces
- defines the approval authority for beginning UI implementation
- defines lightweight core evidence before implementation begins
- defines conditional extended evidence for higher-risk scope
- defines required implementation proposal contents
- defines human review checkpoints
- defines planning-level validation expectations without replacing standing evidence-lane artifacts
- preserves UI-level separation
- preserves synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational posture
- states what this record proves and does not prove
- keeps tooling, runtime, source, Drive, persistence, logging, release, rollback, production-readiness, and operational-approval questions separately gated

## 18. Recommended Next Step

Use this record as the CLO-47 planning artifact.

After human review, future work should remain blocked until a separate UI implementation proposal names the exact surface, scope, approval authority, validation plan, and preserved non-approvals.
# Agent Builder CC/CD Operating Doctrine v0.1

Decision record status: proposed operating doctrine.

This is a docs-only decision record. It does not approve runtime generation, model calls, prompts, CLI wiring, routes,
tools, integrations, Drive sync, Drive writes, UI, real event data, operational use, source-packet binding
implementation, semantic source verification, or changes to validators, schemas, runtime files, application code,
fixtures, eval behavior, or test behavior.

All generated packets remain drafts unless a future separately approved doctrine changes that boundary. Humans approve.
Humans execute. `PASS` means pass for human review only.

## 1. Status

Proposed for Cloud City Agent Builder governance.

This record establishes the default Continuous Calibration / Continuous Development operating doctrine for future
Agent Builder work.

## 2. Purpose

Define how Cloud City plans, evaluates, and incrementally develops agent capabilities without skipping the calibration
evidence needed for safe human-reviewed business workflows.

The doctrine requires every future agent-building workflow to define:

- capability scope
- agency/control level
- reference dataset
- eval strategy
- control handoffs
- human review gates
- error pattern review
- calibration loop
- evidence required before agency expansion
- explicit non-goals and deferrals

## 3. Scope And Non-Goals

This doctrine applies to Cloud City Agent Builder work across specs, fixtures, evals, sample packets, validation,
decision records, audits, source records, and future implementation planning.

This doctrine does not:

- approve a new agent runtime
- approve model calls
- approve prompts
- approve CLI wiring
- approve routes, tools, integrations, Drive behavior, or UI
- approve real event data
- approve operational use
- approve autonomous production-critical decisions
- approve source-packet binding implementation
- approve semantic source verification
- expand Event Readiness authority

## 4. Why AI Agent Systems Require CC/CD

AI agent systems are non-deterministic even when built with careful prompts, constrained schemas, and strong tests.

Non-determinism is expected and must be managed through:

- narrow capability scope
- bounded reference datasets
- deterministic fixtures where possible
- task-specific evals
- validator checks
- sample outputs
- audit logs or local review records when separately approved
- human review
- error pattern review
- calibration before capability expansion

Agent Builder work should not lead with tech or implementation. It should define the capability before designing
prompts, tools, routes, integrations, UI, runtime behavior, or automation surfaces.

## 5. Continuous Calibration Before Continuous Development

Continuous Calibration comes first.

Calibration artifacts may include:

- agent specs
- source records
- synthetic fixtures
- redacted local fixtures when separately approved
- eval suites
- runtime-output sample packets
- validators
- decision records
- implementation plans
- audit results
- error pattern reviews
- human review notes

Continuous Development comes second.

Development should implement only the next smallest approved capability after calibration evidence exists. The next
capability should not expand agency, data sensitivity, source authority, execution authority, or integration surface
unless the evidence threshold for that expansion has been met and explicitly approved.

## 6. Required Workflow Intake Fields

Every future agent-building workflow should declare:

- workflow name
- accountable human owner
- business domain
- user roles and reviewer roles
- capability scope
- explicit non-goals
- agency/control level
- data sensitivity level
- reference dataset
- source boundaries
- eval strategy
- validator strategy
- human review gates
- control handoffs
- error pattern review plan
- calibration evidence required before implementation
- evidence required before agency expansion
- deferred work

If these fields are not known, the workflow should remain in planning or intake status.

## 7. Capability Scope Model

Capability scope should be described before implementation details.

Each capability should state:

- what the agent may prepare
- what the agent may classify or flag
- what the agent may recommend for human review
- what source materials it may use
- what source materials it must not use
- what decisions remain human-owned
- what actions remain prohibited

The scope should be narrow enough that a reviewer can tell whether an output is inside or outside the approved
capability without inspecting implementation internals.

## 8. Agency / Control Level Model

Agency must be earned over time. Start low-agency and high-control.

| Level | Name | Default Status | Boundary |
| --- | --- | --- | --- |
| L0 | Doctrine / intake only | Allowed for planning | No runtime, no model calls, no generated packets. |
| L1 | Deterministic calibration | Allowed when approved | Specs, fixtures, evals, validators, synthetic packets, audits. |
| L2 | Synthetic runtime/model-call experiment | Requires separate approval | Synthetic-only, no tools, draft outputs only. |
| L3 | Redacted local data review | Requires separate approval | Redacted local data, still no operational use. |
| L4 | Founder-friendly workflow surface | Requires separate approval | Review cockpit or surface, no hidden execution. |
| L5 | Assisted workflow execution | Requires separate approval | Draft/action-prep only; human executes. |
| L6 | Tool-mediated actions | Requires separate approval | Narrow tools, audit logs, approval gates. |
| L7 | Autonomous operational action | Not approved | Likely inappropriate for Cloud City production-critical decisions. |

Event Readiness currently remains below L2: pre-runtime, deterministic calibration only.

## 9. Reference Dataset Requirements

Reference datasets should exist before runtime or model-call experiments.

A reference dataset should define:

- dataset purpose
- source type
- synthetic, redacted, or real-data status
- source labels or source domains
- sensitivity level
- redaction status
- inclusion criteria
- exclusion criteria
- known gaps
- review owner
- retention expectations

Synthetic datasets are preferred for early L1 calibration. Real or redacted source data requires separate planning and
approval before use.

## 10. Eval Strategy Requirements

Evals should be task-specific and tied to the scoped capability.

Each eval strategy should define:

- expected output shape
- expected allowed outcomes
- required fields or sections
- source-grounding checks
- prohibited behavior checks
- approval-gate checks
- known edge cases
- expected failure cases
- regression coverage

Evals should test whether the system preserves governance boundaries, not only whether it produces useful prose.

## 11. Control Handoff Requirements

Control handoffs must be designed before agency increases.

Each workflow should state:

- where machine preparation stops
- where human review starts
- what a human must approve
- what a human must execute
- what evidence the human sees
- what uncertainty or missing information is surfaced
- what happens on `PASS`, `PARTIAL`, or `FAIL`

No handoff may imply operational approval unless a future doctrine explicitly approves that authority.

## 12. Human Review Gate Requirements

Human review gates must remain explicit.

Every workflow should identify gates for:

- source suitability
- output review
- approval-sensitive claims
- external communications
- source-of-truth updates
- budget-impacting commitments
- compliance, safety, accessibility, legal, insurance, or permit issues when relevant
- execution or operational action when separately approved

`PASS` means pass for human review only. `PARTIAL` means needs human review. `FAIL` blocks promotion to usable
human-review draft status.

## 13. Error Pattern Review Loop

Error patterns must be reviewed before fixes are applied.

Error pattern review should separate:

- schema or shape failures
- source-label failures
- unsupported claim patterns
- missing uncertainty
- authority-claim language
- approval-gate omissions
- false confidence
- confusing review language
- sensitive-data exposure
- overbroad scope

Fixes must be evidence-driven, not vibe-driven. A fix should identify the observed error, affected fixtures or samples,
expected behavior, and validation command that proves the correction.

## 14. Calibration Evidence Threshold

Before implementation, a workflow should have enough calibration evidence to show:

- the capability is narrowly scoped
- reference data is bounded
- expected outputs are documented
- prohibited outputs are documented
- sample success and failure cases exist or are planned
- eval checks match the capability
- human review gates are explicit
- data sensitivity is understood
- non-goals and deferrals are documented

If evidence is missing, the next milestone should be calibration, not implementation.

## 15. Evidence Required Before Agency Expansion

Agency expansion requires explicit evidence and approval.

Before moving to a higher agency/control level, the workflow should show:

- prior level validation passed
- known error patterns were reviewed
- high-risk errors have deterministic checks or human review gates
- data sensitivity risks were reassessed
- source provenance risks were reassessed
- reviewer-facing language remains clear
- rollback or stop conditions are defined
- the next level is the smallest useful expansion

Expansion from L1 to L2 requires a separate runtime/model-call experiment plan. Expansion to L3 or above requires a
separate data, privacy, review, and retention plan. Expansion to L6 requires a separate tool/action safety plan.

## 16. Required Non-Goals And Deferrals

Every proposed agent or capability must declare explicit non-goals and deferrals.

Common deferrals include:

- runtime generation
- model calls
- prompts
- CLI wiring
- routes
- tools
- integrations
- Drive sync
- Drive writes
- UI
- real data
- operational use
- source-packet binding
- semantic source verification
- autonomous decisions

Deferrals should remain deferrals until separately planned, reviewed, and approved.

## 17. Governance Language Rules

Agent Builder records and outputs should use precise authority language.

Preferred language:

- "draft"
- "for human review"
- "bounded source input"
- "declared provenance"
- "review flag"
- "approval gate"
- "human executes"

Avoid unless separately approved and true:

- "approved"
- "verified"
- "safe"
- "compliant"
- "ready to proceed"
- "source-of-truth updated"
- "executed"
- "autonomous"

Do not use validation language to imply truth, completeness, freshness, compliance, safety, readiness, human approval,
operational approval, or authority to act.

## 18. Security / Privacy Boundaries

Agent Builder workflows should default to minimum necessary data.

Default boundaries:

- local-first
- synthetic-first for early calibration
- no restricted data
- no payment details
- no unnecessary personal contact details
- role labels preferred over personal names
- redaction before real or sensitive review
- no Drive sync or Drive writes without separate approval
- no external integrations without separate approval
- no saved generated packets unless retention is separately planned

Security and privacy review should happen before data sensitivity increases, not after.

## 19. Release And Validation Expectations

Release work should be tied to the smallest approved capability.

Before a capability is committed or promoted, the owner should identify:

- changed files
- validation commands
- expected pass/fail outcomes
- affected fixtures or samples
- governance boundaries preserved
- known caveats

Validation should include the narrowest relevant tests plus any registry, spec, eval, lint, and diff checks needed for
the changed surface.

## 20. Founder-Friendly Review Surface Expectations

Founder-friendly review means a non-engineer can quickly understand:

- what the capability is allowed to do
- what it is not allowed to do
- what sources were used
- what is uncertain
- what needs approval
- what the system is blocked from doing
- what the next human decision is

Review surfaces should prioritize clarity, plain language, and visible control points. They should not hide authority
boundaries behind technical terms, long logs, or implementation details.

## 21. Risks And Mitigations

Risk: implementation momentum outruns calibration.
Mitigation: require scope, dataset, evals, gates, and non-goals before implementation.

Risk: agency expands because a demo works once.
Mitigation: require error pattern review and evidence before each agency increase.

Risk: validation creates false confidence.
Mitigation: preserve `PASS` as pass for human review only unless a future separately approved doctrine changes it.

Risk: technical surfaces obscure human accountability.
Mitigation: require founder-friendly review language and explicit control handoffs.

Risk: sensitive data enters calibration too early.
Mitigation: default to synthetic fixtures and require separate approval for redacted or real data.

Risk: tools or integrations imply execution authority.
Mitigation: keep tools, integrations, Drive behavior, and operational use deferred until separately planned and approved.

## 22. Recommended Next Milestone

Use this doctrine as the intake checklist for the next Agent Builder planning milestone.

For Event Readiness, the next milestone should remain below L2 unless separately approved. A suitable next step is a
narrow implementation plan for single-source synthetic provenance validation, with no runtime generation, model calls,
prompts, CLI wiring, routes, tools, integrations, Drive behavior, UI, real event data, operational use, source-packet
binding implementation, semantic source verification, or Event Readiness authority expansion.

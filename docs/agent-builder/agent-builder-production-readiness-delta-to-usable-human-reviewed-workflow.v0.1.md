# Agent Builder Production-Readiness Delta To Usable Human-Reviewed Workflow v0.1

## 1. Title

Cloud City Agent Builder Production-Readiness Delta To Usable Human-Reviewed Workflow v0.1.

## 2. Status, Scope, And Non-Purpose

- Docs-only.
- Planning-only.
- Synthetic-only.
- Human-review-only.
- Created for CLO-65: `Define production-readiness delta from current Agent Builder state to usable human-reviewed workflow`.
- Delta baseline for this pass: `aae4df9 docs(agent-builder): select next planning branch`.
- This artifact maps the gap between the current Agent Builder state and a usable human-reviewed workflow.

This artifact is not:

- implementation approval
- executable eval approval
- executable test approval
- prompt approval
- model approval
- runtime behavior approval
- source-read approval
- Drive runtime authority
- UI implementation approval
- release approval
- rollback approval
- production readiness
- operational approval
- autonomous action
- external communication approval
- authority to act

This artifact is a readiness delta map only. It does not create runtime behavior, source authority, Drive runtime authority, UI behavior, release authority, operational authority, production readiness, or autonomous execution.

## 3. Standing Posture

Agent Builder / City Center remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute.

PASS means pass for human review only.

Drive governance/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

Sequencing reduces ambiguity; it does not create operational approval inheritance.

## 4. Current State Summary

Current verified state entering CLO-65:

- The synthetic operator-question classification contract has been drafted and bounded.
- Synthetic fixtures and sufficiency review exist.
- The bounded decision record was adopted as docs-only governance.
- A post-adoption boundary map exists for safe future citation.
- CLO-64 selected this production-readiness delta map as the next branch.

What this means:

- Governance language is now stronger than workflow usability.
- The current system is safer and clearer than before, but it is not yet a usable application.
- The next readiness need is to identify what must exist before a human can use Agent Builder responsibly.

## 5. Target Usable Human-Reviewed Workflow Shape

A minimal usable human-reviewed Agent Builder workflow would eventually need a person to be able to:

1. enter or select a proposed operator-facing question;
2. understand what source context, if any, is allowed;
3. receive a classification recommendation using the adopted labels;
4. see a short rationale and boundary warning;
5. decide whether to accept, revise, hold, or route the recommendation;
6. create or update a planning record only after explicit human approval;
7. retain enough evidence for review without creating uncontrolled records.

This target workflow is not approved by this artifact. It is the shape of the delta being mapped.

## 6. Constraint Transition Analysis

| Current posture line | Recommended classification | Reason | Graduation criteria |
| --- | --- | --- | --- |
| Human-reviewed | Permanent product principle | Keeps authority with humans and fits the intended use case. | Do not graduate away; retain as production principle. |
| Approval-gated | Permanent product principle | Prevents classification from becoming autonomous action. | Do not graduate away; define clearer gates over time. |
| Synthetic-only | Stage-specific safety constraint | Useful for early governance, but usability eventually needs governed realistic context. | Human-approved data posture, classification policy, source boundary, redaction rules, and test fixtures. |
| Pre-runtime | Stage-specific safety constraint | Safe now, but a usable app eventually needs bounded runtime behavior. | Runtime design, non-autonomous execution rules, test plan, audit plan, rollback plan, and human approval. |
| Non-operational | Stage-specific safety constraint | Accurate today, but must change before real use. | Operational scope, owner, runbook, incident path, data policy, and launch gate. |
| Not production-ready | Current status label | Honest current state, not an ideal. | Retire only after production-readiness evidence and human approval. |
| Not operationally approved | Current status label | Honest current state, not an ideal. | Retire only after explicit operational approval record. |

## 7. Readiness Delta Table

| Area | Current state | Needed before usable human-reviewed workflow | Current readiness |
| --- | --- | --- | --- |
| Governance | Strong docs-only guardrails and adopted classification decision. | Graduation criteria and approval records for any expanded phase. | Partially ready. |
| Source/data | Drive and source context are not runtime authority. | Source authority policy, approved source classes, data classification, redaction rules. | Not ready. |
| Workflow | Classification concept exists. | Human steps, decision outcomes, reviewer responsibilities, escalation path. | Not ready. |
| UI/reviewer experience | No approved UI implementation. | Non-runtime workflow design, state model, accessibility expectations, manual QA plan. | Not ready. |
| Runtime/model behavior | Explicitly not approved. | Bounded runtime design, prompt/model rules, deterministic constraints, evaluation plan. | Not ready. |
| Persistence/logging | Explicitly not approved. | Record policy, audit trail, retention boundaries, privacy rules. | Not ready. |
| Release/rollback | Explicitly not approved. | Launch criteria, rollback criteria, environment plan, monitoring expectations. | Not ready. |
| Operations | Non-operational. | Owner, runbook, support path, incident path, approval gate. | Not ready. |
| Validation | Docs changes pass CI. | Evaluation plan, human QA plan, accessibility review, workflow acceptance tests. | Partially ready for docs only. |
| Human approval | Human review posture is strong. | Decision records for each graduation step. | Partially ready. |

## 8. Minimal Usable Workflow Slice

The smallest useful next slice should be a non-runtime reviewer/operator workflow plan.

That slice should define:

- who is the reviewer;
- what input they see;
- what classification output they see;
- what actions are available;
- what actions remain forbidden;
- what evidence is retained;
- what gets routed to hold / clarify;
- where human approval is required;
- what a manual dry run would look like.

This slice should remain planning-only until separately approved.

## 9. Blockers And Unknowns

Current blockers:

- No approved source/data authority model.
- No reviewer/operator workflow definition.
- No UI surface or accessibility expectations.
- No runtime/model behavior design.
- No persistence/logging policy.
- No operational owner or runbook.
- No release or rollback criteria.

Open questions:

- Should the first usable workflow be manual-only, UI-prototyped, or CLI-assisted?
- What source context is needed for real usefulness?
- What evidence should be retained for human review?
- What counts as a successful dry run?
- Which graduation decision must come first: source/data, workflow, or runtime?

## 10. Recommended Next Branch

Recommended next card:

`CLO-66 — Define non-runtime reviewer/operator workflow for bounded synthetic classification`

Rationale:

- Usability is the largest immediate gap after governance stabilization.
- A workflow plan can remain docs-only and pre-runtime.
- It creates concrete acceptance criteria for later UI, CLI, runtime, and source decisions.
- It helps decide whether the first usable version should be manual, UI-prototyped, or CLI-assisted.

## 11. Explicit Non-Approvals

This artifact does not approve:

- implementation
- executable tests
- executable evals
- routes
- screens
- prompts
- tools
- model behavior
- runtime/model behavior
- source reads
- source binding
- Drive runtime behavior
- persistence
- logging
- retained records
- release
- rollback
- operational approval
- production readiness
- autonomous action
- external communication
- authority to act

## 12. Stop Conditions

Stop and defer if future work tries to use this delta map to do any of the following:

- implement application behavior
- define executable classifier behavior
- write prompts or model instructions
- define runtime behavior
- define tools, routes, integrations, source reads, or source binding
- use non-synthetic data
- treat Drive governance/status context as runtime source authority
- define persistence, logging, retained records, release, rollback, operational approval, production readiness, or authority to act
- create UI or reviewer cockpit flows
- convert fixtures into executable tests/evals
- create external communications or autonomous actions

## 13. Proof / Non-Proof

This artifact can prove only the following modest conclusions:

- Cloud City has mapped the delta from current governance state to a usable human-reviewed workflow.
- Some current posture statements are permanent principles, while others need graduation criteria.
- The next recommended branch is non-runtime reviewer/operator workflow planning.

This artifact does not prove:

- that the app is production-ready
- that the app is usable today
- that implementation is approved
- that executable evals are approved
- that prompts or runtime/model behavior are approved
- that source reads are approved
- that Drive runtime behavior is approved
- that UI implementation is approved
- that release or rollback is approved
- that operational approval exists
- that anyone has authority to act

## 14. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed
- no runtime/code/config/package files changed
- the artifact remains docs-only, planning-only, synthetic-only, and human-review-only
- the app is still described as not production-ready and not operationally approved
- transition criteria do not create approval by implication
- all current non-approvals remain explicit

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-production-readiness-delta-to-usable-human-reviewed-workflow.v0.1.md
git diff --check
```

## 15. Human Review Questions

Human review should clarify:

- whether the constraint-transition analysis is correct
- whether human-reviewed and approval-gated should remain permanent product principles
- whether CLO-66 should be manual-only workflow planning or include UI/CLI comparison
- whether any source/data boundary card should precede workflow planning
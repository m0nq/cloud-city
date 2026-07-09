# Agent Builder Manual Dry-Run Protocol For Bounded Synthetic Classification Workflow v0.1

## 1. Title

Cloud City Agent Builder Manual Dry-Run Protocol For Bounded Synthetic Classification Workflow v0.1.

## 2. Status, Scope, And Non-Purpose

- Docs-only.
- Planning-only.
- Synthetic-only.
- Non-runtime.
- Human-review-only.
- Created for CLO-67: `Define manual dry-run protocol for bounded synthetic classification workflow`.
- Protocol baseline for this pass: `4b7c0ff docs(agent-builder): define non-runtime reviewer workflow`.
- This artifact defines the manual dry-run protocol for the reviewer/operator workflow selected in CLO-66.
- CLO-67 is the planned stop/reassess point after validation.

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

This artifact is a dry-run protocol only. It does not create runtime behavior, source authority, Drive runtime authority, UI behavior, release authority, operational authority, production readiness, or autonomous execution.

## 3. Standing Posture

Agent Builder / City Center remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute.

PASS means pass for human review only.

Drive governance/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

Sequencing reduces ambiguity; it does not create operational approval inheritance.

## 4. Source Context

CLO-66 selected the first workflow shape:

`Manual-only synthetic reviewer/operator dry run`

CLO-67 turns that workflow shape into a concrete manual protocol that a human can review before deciding whether to run it.

## 5. Dry-Run Purpose

The dry run is intended to test whether a human reviewer can:

- understand a synthetic proposed operator-facing question;
- classify it using only the adopted labels;
- write a short rationale;
- identify boundary concerns;
- route ambiguous cases to hold / clarify;
- avoid treating classification as approval to act;
- record minimal evidence for planning review only.

The dry run is not intended to test runtime, model behavior, UI, CLI, source reads, persistence, logging, release, or operations.

## 6. Eligible Inputs

Eligible dry-run inputs must be:

- synthetic;
- proposed operator-facing questions;
- bounded to planning discussion;
- free of real customer, attendee, vendor, partner, employee, or sensitive source data;
- framed so a human can classify them without runtime/model behavior.

Ineligible inputs include:

- real operational requests;
- real source data;
- personal data;
- requests to perform action;
- requests to read Drive or other systems as source authority;
- requests that require implementation, runtime, UI, release, or operational approval.

## 7. Reviewer Instructions

For each dry-run case, the reviewer should:

1. Confirm the input is synthetic.
2. Read the proposed operator-facing question.
3. Identify whether the request is classification-ready.
4. Select one label from the adopted label set.
5. Write a short rationale.
6. Identify the first implicated CLO-52 lane when applicable.
7. Use `hold / clarify` when the case is ambiguous or boundary-crossing.
8. Record the evidence fields below.
9. Confirm the result is for human review only.
10. Stop if any implementation, source, runtime, UI, persistence, release, or authority boundary is crossed.

## 8. Dry-Run Case Set

A first manual dry run should include 6 to 8 cases:

| Case type | Minimum count | Purpose |
| --- | --- | --- |
| Clear later bounded L2 candidate | 2 | Confirm reviewer can identify candidate-only cases. |
| Clear first CLO-52 lane dependency | 2 | Confirm reviewer can route prerequisite-lane cases. |
| Clear hold / clarify | 2 | Confirm reviewer can stop on ambiguity or boundary crossing. |
| Optional edge case | 1 to 2 | Check whether label/rationale guidance is enough. |

The dry-run case set may reuse existing synthetic fixture ideas, but the dry run itself remains manual and non-runtime.

## 9. Evidence Template

For each case, record:

- case ID;
- reviewer role;
- review date;
- synthetic input;
- selected label;
- short rationale;
- first implicated CLO-52 lane, if any;
- decision outcome;
- stop condition triggered, if any;
- reviewer confidence: high / medium / low;
- follow-up note, if any.

This template is for planning review only. It does not approve persistence, logging, retained records, automated record creation, or Drive runtime behavior.

## 10. Pass / Fail Criteria

A dry-run pass means:

- all inputs remained synthetic;
- reviewer selected only adopted labels;
- rationale was understandable;
- hold / clarify was used for ambiguous or boundary-crossing cases;
- no output was treated as implementation or authority;
- evidence was sufficient for human review;
- no runtime/source/Drive/UI/release/operational boundary was crossed.

A dry-run fail means any of the following occurred:

- non-synthetic input was used;
- reviewer needed real source data;
- reviewer needed runtime/model behavior;
- labels were ambiguous or insufficient;
- rationale was not understandable;
- evidence template was too weak for review;
- output implied approval to act;
- any stop condition was triggered and not handled.

## 11. Stop Conditions

Stop the dry run immediately if:

- a case includes real data;
- a case requires source reads;
- a case requires Drive runtime authority;
- a case requires UI, CLI, prompt, model, or runtime behavior;
- a reviewer treats output as approval to act;
- evidence retention appears to require a policy not yet approved;
- a case needs implementation, release, operations, or production-readiness approval;
- the reviewer cannot classify the case without expanding scope.

## 12. Post-Dry-Run Review Questions

After the dry run, human review should answer:

- Were the three labels sufficient?
- Were any cases hard to classify?
- Did reviewers understand when to use hold / clarify?
- Was the evidence template sufficient?
- Did any case imply source/data graduation is needed?
- Did any case imply UI prototype planning is needed?
- Did any case imply CLI-assisted planning is needed?
- Did any case imply evidence/retention policy is needed?
- Should the next branch be execution of the dry run, source/data boundary work, UI prototype planning, CLI planning, or evidence policy?

## 13. Reassessment Options After CLO-67

After CLO-67 validation, do not automatically continue.

Reassess and choose one of:

1. Run the manual dry run using the protocol.
2. Patch the dry-run protocol.
3. Define source/data boundary graduation criteria.
4. Define a non-runtime UI prototype plan.
5. Define a CLI-assisted planning path.
6. Define evidence/retention policy.
7. Hold and consolidate governance state.

## 14. Explicit Non-Approvals

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

## 15. Proof / Non-Proof

This artifact can prove only the following modest conclusions:

- Cloud City has defined a manual dry-run protocol for bounded synthetic classification workflow.
- CLO-67 is the stop/reassess point after validation.
- The protocol can be reviewed before deciding whether to run it.

This artifact does not prove:

- that the dry run has been executed;
- that the app is production-ready;
- that the app is usable today;
- that implementation is approved;
- that executable evals are approved;
- that prompts or runtime/model behavior are approved;
- that source reads are approved;
- that Drive runtime behavior is approved;
- that UI implementation is approved;
- that release or rollback is approved;
- that operational approval exists;
- that anyone has authority to act.

## 16. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- the artifact remains docs-only, planning-only, synthetic-only, non-runtime, and human-review-only;
- evidence fields do not approve persistence, logging, retained records, or Drive runtime behavior;
- pass/fail criteria remain human-review-only;
- CLO-67 is marked as the stop/reassess point;
- all current non-approvals remain explicit.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-manual-dry-run-protocol-for-bounded-synthetic-classification-workflow.v0.1.md
git diff --check
```

## 17. Human Review Questions

Human review should clarify:

- whether the first dry-run case set should be 6, 8, or 10 cases;
- whether the evidence template should be shortened before use;
- whether reviewer confidence should be required;
- whether the next action should be protocol execution, patching, source/data boundary work, UI prototype planning, CLI planning, evidence policy, or hold/consolidation.
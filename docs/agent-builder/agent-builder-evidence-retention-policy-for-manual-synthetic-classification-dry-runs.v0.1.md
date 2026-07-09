# Agent Builder Evidence And Retention Policy For Manual Synthetic Classification Dry Runs v0.1

## 1. Title

Cloud City Agent Builder Evidence And Retention Policy For Manual Synthetic Classification Dry Runs v0.1.

## 2. Status, Scope, And Non-Purpose

- Docs-only.
- Planning-only.
- Synthetic-only.
- Non-runtime.
- Human-review-only.
- Created for CLO-69: `Define evidence and retention policy for manual synthetic classification dry runs`.
- Policy baseline for this pass: `4f514ea docs(agent-builder): record manual dry-run findings`.
- This artifact defines planning-only evidence handling for manual synthetic classification dry runs.

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
- persistence approval
- logging approval
- retained-records approval
- release approval
- rollback approval
- production readiness
- operational approval
- autonomous action
- external communication approval
- authority to act

This artifact defines planning evidence boundaries only. It does not create runtime behavior, source authority, Drive runtime authority, UI behavior, persistence, logging, retained records, release authority, operational authority, production readiness, or autonomous execution.

## 3. Standing Posture

Agent Builder / City Center remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute.

PASS means pass for human review only.

Drive governance/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

Sequencing reduces ambiguity; it does not create operational approval inheritance.

## 4. Source Context

CLO-68 recorded an eight-case manual synthetic dry run.

The dry run showed that the adopted labels were sufficient for the first synthetic case set, but evidence and retention language became the highest-friction governance area before repeated dry runs, UI prototype planning, CLI planning, or source/data graduation.

CLO-69 responds by defining what evidence may be recorded during planning and what boundaries prevent that evidence from becoming runtime persistence, logging, retained records, Drive runtime authority, operational approval, or authority to act.

## 5. Policy Purpose

This policy is intended to help a human reviewer record enough planning evidence to review manual synthetic dry runs without creating operational or runtime records.

The policy should support:

- repeatable human review;
- clear case-by-case findings;
- traceable planning rationale;
- safe reviewer confidence notes;
- safe follow-up recommendations;
- clear separation from persistence, logging, retained records, source authority, and operational approval.

## 6. Allowed Planning Evidence Fields

For manual synthetic dry runs, planning evidence may include:

- planning artifact title;
- related CLO issue ID;
- baseline commit;
- synthetic case ID;
- synthetic proposed operator-facing question;
- selected adopted label;
- short rationale;
- reviewer confidence: high / medium / low;
- first implicated planning lane, if applicable;
- hold / clarify reason, if applicable;
- protocol friction note;
- follow-up recommendation;
- explicit non-approval reminder.

These fields are allowed only in docs-only planning artifacts or approved Linear planning comments. They are not runtime schema fields, product fields, logging fields, retained-record fields, database fields, analytics fields, or source-of-truth fields.

## 7. Disallowed Evidence Fields

Manual synthetic dry-run evidence must not include:

- real attendee data;
- real customer data;
- real vendor or partner data;
- real employee personal data;
- payment data;
- private communications;
- raw Drive content treated as source material;
- operational instructions;
- external communication drafts meant to be sent;
- secrets, keys, tokens, or credentials;
- production incident data;
- runtime traces;
- model logs;
- prompt logs;
- automated classifier outputs treated as source of truth.

If a reviewer thinks a case requires any disallowed field, the dry run must stop or route to hold / clarify.

## 8. Storage / Location Boundary

During the current stage, planning evidence may live only in:

- repo Markdown planning artifacts under `docs/agent-builder/`;
- Linear planning comments or issue descriptions created by explicit human approval;
- concise Google Drive snapshots or Source-of-Truth Index handoffs created by explicit human approval.

These locations are planning context only.

They are not runtime storage, product persistence, logs, retained records, source authority, Drive runtime authority, or operational systems.

No application code may read these planning locations as runtime source authority without a later governed source/data approval record.

## 9. Retention / Disposition Expectations

At this stage, retention means keeping human-reviewed planning artifacts available for governance review.

Retention does not mean:

- product retention;
- compliance records;
- customer records;
- operational records;
- runtime logs;
- persisted classifier outputs;
- database records;
- audit logs;
- legal records.

Planning artifacts should remain concise, synthetic-only, and explicitly non-operational.

If a planning artifact accidentally includes non-synthetic or sensitive data, stop, quarantine the artifact from future reuse, and create a human-reviewed cleanup plan before continuing.

## 10. Reviewer Responsibilities

The reviewer is responsible for confirming that:

- all cases are synthetic;
- all evidence fields are allowed planning fields;
- all outputs remain human-review-only;
- no evidence is treated as runtime source authority;
- no evidence implies approval to act;
- no evidence creates persistence, logging, retained-records, release, operational, production-readiness, autonomous-action, or authority scope.

The reviewer should use hold / clarify whenever evidence requirements are ambiguous.

## 11. Example Evidence Note Shape

Recommended planning-only note shape:

```text
Case ID: DR-00
Synthetic question: [synthetic proposed operator-facing question]
Selected label: [one adopted label]
Rationale: [one to three sentences]
Confidence: high / medium / low
First implicated lane: [optional planning lane]
Hold / clarify reason: [optional]
Protocol friction: [optional]
Follow-up recommendation: [optional]
Non-approval reminder: Planning evidence only; not runtime, source, persistence, logging, retained records, release, operations, production readiness, autonomous action, or authority to act.
```

This note shape is not a runtime schema, UI schema, database schema, log schema, or executable eval schema.

## 12. Policy Checks For Future Dry Runs

Before a future manual dry run, confirm:

- the case set is synthetic;
- the evidence template uses only allowed planning fields;
- the artifact states non-approval boundaries;
- the reviewer can classify without source reads;
- hold / clarify remains available;
- no product/runtime/persistence/logging/retained-records assumptions are introduced.

After a future manual dry run, confirm:

- the evidence remained synthetic;
- all labels came from the adopted label set;
- rationale and confidence notes are clear enough for human review;
- no evidence field implies approval to act;
- any next branch is recommended, not automatically approved.

## 13. Recommended Next Branch

Recommended next card:

`CLO-70 — Conduct second manual synthetic classification dry run using evidence policy`

Rationale:

- CLO-69 turns the CLO-68 evidence friction into a planning-only policy.
- The safest next learning step is to test whether the evidence policy improves repeatability in a second manual synthetic dry run.
- A second dry run can reveal whether source/data boundary work, UI prototype planning, CLI planning, or evidence-policy patching is the highest-leverage next move.

Deferred branches:

- Source/data boundary graduation should wait until evidence handling is tested unless real source context becomes the immediate blocker.
- UI prototype planning should wait until manual evidence handling is stable.
- CLI planning should wait until manual evidence and reviewer workflow are stable.
- Runtime/model/prompt work remains out of scope.

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

## 15. Stop Conditions

Stop and defer if future work tries to use this policy artifact to do any of the following:

- implement application behavior;
- define executable classifier behavior;
- write prompts or model instructions;
- define runtime behavior;
- define tools, routes, integrations, source reads, or source binding;
- use non-synthetic data;
- treat Drive governance/status context as runtime source authority;
- define product persistence, logging, retained records, release, rollback, operational approval, production readiness, or authority to act;
- create UI or reviewer cockpit flows;
- convert planning evidence into executable tests/evals;
- create external communications or autonomous actions.

## 16. Proof / Non-Proof

This artifact can prove only the following modest conclusions:

- Cloud City has defined planning-only evidence boundaries for manual synthetic classification dry runs.
- Allowed and disallowed evidence fields are now explicit for planning review.
- The recommended next branch is a second manual synthetic dry run using this evidence policy.

This artifact does not prove:

- that persistence is approved;
- that logging is approved;
- that retained records are approved;
- that Drive runtime behavior is approved;
- that the app is production-ready;
- that the app is operationally approved;
- that implementation is approved;
- that executable evals are approved;
- that prompt/model behavior is approved;
- that source reads are approved;
- that UI implementation is approved;
- that release or rollback is approved;
- that anyone has authority to act.

## 17. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- all evidence fields are planning-only;
- disallowed evidence fields are explicit;
- storage/location language does not approve runtime persistence, logging, retained records, or Drive runtime behavior;
- all current non-approvals remain explicit.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-evidence-retention-policy-for-manual-synthetic-classification-dry-runs.v0.1.md
git diff --check
```

## 18. Human Review Questions

Human review should clarify:

- whether the allowed evidence fields are too broad, too narrow, or appropriate;
- whether planning evidence may live in Linear comments or should remain repo-only;
- whether the policy should require a one-line non-approval reminder on every case;
- whether CLO-70 should be a second dry run or a policy patch.
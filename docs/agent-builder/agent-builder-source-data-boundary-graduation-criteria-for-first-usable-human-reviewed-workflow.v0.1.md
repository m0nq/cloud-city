# Agent Builder Source Data Boundary Graduation Criteria For First Usable Human-Reviewed Workflow v0.1

## 1. Status And Scope

- Docs-only.
- Planning-only.
- Synthetic-first.
- Non-runtime.
- Human-review-only.
- Created for CLO-71: `Define source/data boundary graduation criteria for first usable human-reviewed workflow`.
- Baseline: `7244766 docs(agent-builder): record second dry-run findings`.

This artifact defines criteria only. It does not approve implementation, runtime behavior, source reads, Drive runtime authority, UI implementation, persistence, logging, retained records, release, operational approval, production readiness, autonomous action, or authority to act.

## 2. Standing Posture

Agent Builder / City Center remains synthetic-first, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute. PASS means pass for human review only.

Drive governance/status context is not runtime source authority. Deterministic contract conformance is not operational approval.

## 3. Source Context

CLO-68 and CLO-70 both found that the manual classification workflow can work with synthetic cases.

CLO-69 defined planning-only evidence handling for those dry runs.

The repeated blocker is now the boundary between planning context and any governed source context. This artifact defines what must be true before future planning may safely consider a first human-reviewed workflow that references governed context.

## 4. Criteria Purpose

The criteria should help the team decide whether a future workflow may reference governed context without converting planning artifacts into runtime source authority.

The criteria are meant to answer:

- what context may be referenced in planning;
- what remains disallowed;
- what approvals are required;
- what evidence must be recorded;
- what still requires a separate future card.

## 5. Allowed Planning References

At this stage, planning may reference:

- synthetic case sets;
- repo governance artifacts under `docs/agent-builder/`;
- Linear issue titles, IDs, and human-reviewed planning comments;
- Source-of-Truth Index status text;
- concise Google Drive snapshot status text;
- explicit human-provided context in the current review thread.

These references are planning context only. They are not runtime inputs, runtime sources, product data, logs, retained records, or operational instructions.

## 6. Disallowed Source/Data Categories

Future planning must not use or request:

- private customer or attendee data;
- vendor, partner, payment, or personnel data;
- secrets, keys, tokens, credentials, or private communications;
- raw Drive folder contents as runtime source material;
- automated source reads;
- product database records;
- runtime traces;
- model logs or prompt logs;
- operational instructions intended for execution;
- external communication drafts intended to be sent.

If a proposed workflow needs one of these categories, it must stop or route to a separate governed approval path.

## 7. Graduation Criteria

A future first usable human-reviewed workflow may consider governed context only after all of the following are true:

1. The context category is named.
2. The human reviewer role is named.
3. The allowed purpose is named.
4. The forbidden uses are named.
5. The evidence location is named.
6. The non-approval boundaries are restated.
7. The workflow remains human-reviewed and approval-gated.
8. The workflow does not create runtime behavior.
9. The workflow does not create persistence, logging, retained records, release, or operational authority.
10. A stop condition exists for any ambiguity.

If any criterion is missing, the workflow must remain synthetic-only.

## 8. Human Approval Gates

Before a future card may use governed context, a human must approve:

- the exact context category;
- the exact planning purpose;
- the reviewer role;
- the allowed evidence fields;
- the disallowed evidence fields;
- the storage/location boundary;
- the stop conditions;
- whether the result is still planning-only.

Approval of these criteria does not approve implementation or runtime behavior.

## 9. Example Allowed Planning Shape

Allowed planning shape:

```text
Context category: human-reviewed Linear issue metadata
Purpose: classify whether a proposed workflow is a later bounded L2 candidate, prerequisite-lane dependency, or hold / clarify
Reviewer role: human reviewer
Evidence: planning note in repo or approved Linear comment
Boundary: no runtime read, no persistence, no automatic action
Stop condition: any ambiguity returns to hold / clarify
```

This shape is a planning example only. It is not a runtime schema or implementation contract.

## 10. Non-Examples

Not allowed at this stage:

- asking the app to read Drive folders automatically;
- using real event or customer data for classifier testing;
- storing review outcomes in a product table;
- creating a UI approval button;
- sending external recommendations;
- treating Source-of-Truth Index text as runtime source authority.

Each of these requires a separate governed planning path before any implementation discussion.

## 11. Recommended Next Branch

Recommended next card:

`CLO-72 — Define first non-runtime reviewer workflow context packet`

Rationale:

- The graduation criteria now name the boundary conditions.
- The safest next step is to define a small context packet a human reviewer may inspect during a non-runtime workflow.
- This should remain docs-only and should not approve UI, CLI, runtime, source automation, persistence, logging, release, or operations.

Deferred branches:

- Non-runtime UI prototype planning should wait until the context packet is defined.
- CLI planning should wait until reviewer context boundaries are clearer.
- Runtime/model/prompt work remains out of scope.

## 12. Explicit Non-Approvals

This artifact does not approve:

- implementation;
- executable tests or evals;
- routes or screens;
- prompts, tools, or model behavior;
- runtime behavior;
- source reads or source binding;
- Drive runtime behavior;
- persistence, logging, or retained records;
- release or rollback;
- operational approval;
- production readiness;
- autonomous action;
- external communication;
- authority to act.

## 13. Stop Conditions

Stop and defer if future work tries to use this artifact to approve implementation, runtime source access, product persistence, logging, retained records, UI implementation, release, operational approval, production readiness, autonomous action, or authority to act.

## 14. Proof / Non-Proof

This artifact can prove only that Cloud City has defined planning criteria for deciding when governed context may be considered in a future human-reviewed workflow.

It does not prove that source reads, Drive runtime behavior, persistence, logging, retained records, UI implementation, release, operations, production readiness, or authority to act are approved.

## 15. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- criteria are planning-only;
- source/data categories are bounded;
- non-approvals remain explicit.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-source-data-boundary-graduation-criteria-for-first-usable-human-reviewed-workflow.v0.1.md
git diff --check
```

## 16. Human Review Questions

Human review should clarify:

- whether the allowed planning references are too broad or too narrow;
- whether the disallowed categories are sufficient;
- whether CLO-72 should define a context packet next;
- whether UI prototype planning should wait until after the context packet is defined.

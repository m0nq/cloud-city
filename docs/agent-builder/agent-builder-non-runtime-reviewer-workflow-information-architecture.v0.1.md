# Agent Builder Non-Runtime Reviewer Workflow Information Architecture v0.1

## 1. Status And Scope

- Docs-only.
- Planning-only.
- Synthetic-first.
- Non-runtime.
- Human-review-only.
- Created for CLO-74: `Define non-runtime reviewer workflow information architecture`.
- Baseline: `ac0869a docs(agent-builder): clean dry-run markdown whitespace`.

This artifact defines information architecture only. It does not approve implementation, runtime behavior, source automation, Drive runtime authority, UI implementation, CLI behavior, persistence, logging, retained records, release, operational approval, production readiness, autonomous action, external communication, or authority to act.

## 2. Standing Posture

Agent Builder / City Center remains synthetic-first, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute. PASS means pass for human review only.

Drive governance/status context is not runtime source authority. Deterministic contract conformance is not operational approval.

## 3. Source Context

CLO-72 defined the first non-runtime reviewer workflow context packet shape.

CLO-73 dry-ran that packet shape with synthetic packet examples. The dry run found that the packet shape is usable for human review and that the next learning bottleneck is reviewer information architecture.

CLO-73 also identified that evidence location should be repo-first, with Linear comments reserved for concise progress or completion evidence.

## 4. Information Architecture Goal

The goal is to define what a human reviewer needs to see, decide, and record in a non-runtime workflow before any visual prototype, UI implementation, CLI behavior, runtime behavior, source automation, persistence, logging, release, or operational process is considered.

This IA is a conceptual layout and reviewer flow, not a screen, route, component, CLI command, database model, event log, or operational workflow.

## 5. Reviewer Workflow Sections

A first non-runtime reviewer workflow should have these planning sections:

1. Review header
2. Context packet summary
3. Boundary reminders
4. Allowed references
5. Forbidden uses
6. Reviewer decision
7. Evidence note
8. Hold / stop conditions
9. Next-step recommendation

These sections may be represented in a future visual prototype, but this artifact does not approve that prototype or any implementation.

## 6. Section Details

### 6.1 Review Header

Purpose: orient the reviewer.

Contains only:

- review ID;
- related CLO issue ID;
- baseline commit;
- artifact path;
- reviewer role;
- review date or planning date.

Does not contain runtime IDs, user IDs, customer IDs, event records, model run IDs, source-read IDs, or persistent product identifiers.

### 6.2 Context Packet Summary

Purpose: show the bounded packet being reviewed.

Contains only the CLO-72 packet fields:

- packet ID;
- related CLO issue ID;
- baseline commit;
- proposed workflow title;
- context category;
- planning purpose;
- reviewer role;
- allowed references;
- forbidden uses;
- expected reviewer decision;
- evidence location;
- stop condition;
- non-approval reminder.

The packet summary is not a runtime schema, UI schema, CLI schema, database schema, or source integration contract.

### 6.3 Boundary Reminders

Purpose: keep reviewer decisions within the approved planning scope.

Must state:

- planning-only;
- non-runtime;
- human-review-only;
- no implementation approval;
- no source automation;
- no UI or CLI behavior;
- no persistence, logging, retained records, release, operations, or authority approval.

### 6.4 Allowed References

Purpose: show the reviewer what may be considered.

Allowed reference examples:

- synthetic packet examples;
- repo planning artifacts;
- Linear issue title and ID;
- concise Linear progress or completion comments;
- Source-of-Truth Index status text;
- Drive snapshot status text;
- explicit human-provided context in the current review thread.

All references are planning context only.

### 6.5 Forbidden Uses

Purpose: make disallowed interpretations visible.

Forbidden uses include:

- using real customer or attendee data;
- reading Drive folders automatically;
- treating Drive status as runtime source authority;
- storing outcomes as product records;
- creating approval buttons or UI state;
- creating CLI commands;
- sending external recommendations;
- triggering runtime behavior;
- logging reviewer outcomes as operational records.

### 6.6 Reviewer Decision

Purpose: record the human planning classification.

Allowed reviewer decisions:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

The decision is a planning classification only. It is not operational approval.

### 6.7 Evidence Note

Purpose: record concise planning evidence.

Evidence location is repo-first.

Preferred evidence location:

- repo markdown artifact under `docs/agent-builder/`.

Allowed supporting evidence location:

- concise Linear progress or completion comment.

Drive snapshot and Source-of-Truth Index are handoff/status aids only. They are not runtime source authority and should not be used as the primary evidence record for reviewer decisions.

### 6.8 Hold / Stop Conditions

Purpose: show when the reviewer must stop instead of classify.

Hold or stop when a packet asks for or implies:

- unapproved data;
- source automation;
- runtime behavior;
- UI implementation;
- CLI behavior;
- persistence;
- logging;
- retained records;
- release;
- operational approval;
- external communication;
- authority to act.

### 6.9 Next-Step Recommendation

Purpose: route the planning sequence without taking action.

Allowed next-step recommendation types:

- continue with another docs-only planning artifact;
- patch the packet shape;
- run another synthetic dry run;
- plan a non-runtime visual prototype;
- hold / clarify.

A next-step recommendation is not approval to implement.

## 7. Reviewer Flow

Recommended planning flow:

1. Read the review header.
2. Confirm the baseline and related CLO issue.
3. Read the context packet summary.
4. Check boundary reminders.
5. Compare allowed references against forbidden uses.
6. Choose one reviewer decision.
7. Write repo-first evidence.
8. Apply hold / stop conditions if needed.
9. Recommend the next planning branch.

If any step implies implementation, automation, runtime behavior, persistence, logging, release, operations, external communication, or authority to act, the reviewer must stop or route to hold / clarify.

## 8. Example IA Outline

```text
Review Header
- Review ID
- Related CLO
- Baseline
- Artifact path
- Reviewer role

Context Packet Summary
- Packet ID
- Context category
- Planning purpose
- Allowed references
- Forbidden uses
- Expected decision
- Evidence location
- Stop condition

Boundary Reminders
- Planning-only
- Non-runtime
- Human-review-only
- No implementation approval

Reviewer Decision
- later bounded L2 candidate
- first implicated CLO-52 lane dependency card
- hold / clarify

Evidence Note
- Repo-first evidence path
- Concise rationale
- Boundary confirmation

Hold / Stop
- Ambiguity
- Unapproved data
- Runtime implication
- Authority implication

Next Step
- Patch / dry run / visual prototype planning / hold
```

## 9. Non-Examples

Not allowed at this stage:

- screen design with clickable approval controls;
- UI state model;
- CLI command plan;
- database schema;
- event logging schema;
- source connector behavior;
- automatic Drive reads;
- persistent review history;
- production readiness checklist;
- external message or recommendation.

## 10. Visual Prototype Readiness

A future visual prototype planning card may be safe if it remains:

- non-runtime;
- static or illustrative;
- docs-only or design-only;
- synthetic-only;
- not connected to data;
- not interactive in an approval-bearing way;
- not persistent;
- not a route or production component.

Recommended next visual-planning constraint:

Any prototype must show the IA only. It must not create reviewer authority, operational approval, source access, persistence, logging, or execution behavior.

## 11. Sufficiency Assessment

This IA is sufficient for a first human review because it defines:

- what the reviewer sees;
- what the reviewer decides;
- what the reviewer records;
- where evidence belongs;
- when the reviewer stops;
- what must not be inferred.

Remaining questions:

- whether to create a static visual prototype planning artifact next;
- whether to run a tabletop review of this IA first;
- whether repo-first evidence language should be backpatched into CLO-72 or left carried forward from CLO-73/CLO-74.

## 12. Recommended Next Branch

Recommended next card:

`CLO-75 — Plan static non-runtime reviewer workflow visual prototype`

Rationale:

- CLO-74 defines the reviewer IA.
- A static visual prototype plan can test whether the IA is understandable without implementing UI.
- This keeps the work planning-only and reversible.

Deferred branches:

- UI implementation remains out of scope.
- CLI planning should wait until static visual prototype planning clarifies reviewer surfaces.
- Source automation, runtime/model/prompt work, persistence, logging, release, and operations remain out of scope.

## 13. Explicit Non-Approvals

This artifact does not approve:

- implementation;
- executable tests or evals;
- routes or screens;
- prompts, tools, or model behavior;
- runtime behavior;
- source reads, source binding, or source automation;
- Drive runtime behavior;
- UI implementation;
- CLI behavior;
- persistence, logging, or retained records;
- release or rollback;
- operational approval;
- production readiness;
- autonomous action;
- external communication;
- authority to act.

## 14. Stop Conditions

Stop and defer if future work tries to use this IA artifact to approve implementation, source automation, runtime behavior, UI implementation, CLI behavior, product persistence, logging, retained records, release, operational approval, production readiness, autonomous action, external communication, or authority to act.

## 15. Proof / Non-Proof

This artifact can prove only that Cloud City has defined a planning-only IA for a first non-runtime human reviewer workflow.

It does not prove that UI implementation, CLI behavior, source reads, Drive runtime behavior, persistence, logging, retained records, release, operations, production readiness, or authority to act are approved.

## 16. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- IA sections remain conceptual;
- repo-first evidence location is explicit;
- all non-approvals remain explicit.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-non-runtime-reviewer-workflow-information-architecture.v0.1.md
git diff --check
```

## 17. Human Review Questions

Human review should clarify:

- whether this IA is clear enough for static visual prototype planning;
- whether a tabletop dry run should happen first;
- whether repo-first evidence location should be backpatched into earlier packet artifacts;
- whether CLO-75 should create a visual prototype plan or another IA dry run.

# Agent Builder Vertical-Slice SDLC Transition Charter v0.1

## 1. Status And Scope

- Docs-only.
- Planning-only.
- Transition charter only.
- Created for CLO-75: `Define vertical-slice SDLC transition charter for Agent Builder`.
- Baseline: `0676e58 docs(agent-builder): define reviewer workflow IA`.

This artifact does not approve implementation, runtime behavior, source automation, Drive runtime authority, UI implementation, CLI behavior, database changes, persistence, logging, retained records, release, operational approval, production readiness, autonomous action, external communication, or authority to act.

## 2. Standing Posture

Agent Builder / City Center remains synthetic-first, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved unless and until a future governed approval explicitly changes that posture.

Humans approve. Humans execute. PASS means pass for human review only.

Drive governance/status context is not runtime source authority. Deterministic contract conformance is not operational approval.

## 3. Purpose

This charter defines the governance, agile SDLC, IA/UX/UI, data, test, release, and stop-condition gates that must be satisfied before Agent Builder moves from governance-only planning into vertical-slice product development.

The goal is not to start implementation. The goal is to make implementation start conditions explicit.

## 4. Why This Charter Exists

CLO-74 defined a non-runtime reviewer workflow information architecture. That makes IA/UX/UI planning more concrete.

Before any UI, database, or core-functionality work begins, the project needs a different operating model:

- small vertical slices;
- explicit readiness criteria;
- data/source boundary approval;
- persistence and record boundary approval;
- accessibility and UX acceptance;
- test and eval gates;
- release and rollback gates;
- human approval before authority-bearing work.

Without this charter, UI work could accidentally imply implementation, runtime behavior, persistence, or operational authority before those boundaries are approved.

## 5. Definition Of A Vertical Slice

A vertical slice is an end-to-end, user-valuable increment that can be designed, implemented, tested, reviewed, and released independently.

For Agent Builder, a vertical slice must define:

1. User goal
2. Reviewer or operator role
3. IA/UX flow
4. UI surface or non-UI interaction
5. Domain action
6. Data contract
7. Source boundary
8. Persistence boundary
9. Validation rules
10. Test and eval plan
11. Accessibility acceptance
12. Security and privacy checks
13. Release gate
14. Rollback or disable path
15. Human approval checkpoint

A slice is not just a screen, route, component, data model, or API endpoint.

## 6. Operating Mode Shift

The current mode is governance planning.

A future vertical-slice mode may be approved only when the project has a clear Definition of Ready, Definition of Done, data/source boundary, and release gate.

Until then:

- do not implement UI;
- do not create runtime routes;
- do not create database schema;
- do not add persistence;
- do not add logging or retained records;
- do not add source reads or source binding;
- do not add CLI behavior;
- do not change model/prompt/tool behavior;
- do not expose operational controls;
- do not release Agent Builder functionality.

## 7. Agile SDLC Principles

The future development approach should use small, inspectable, reversible slices.

Recommended principles:

- hypothesis-driven development;
- Definition of Ready before implementation;
- Definition of Done before closeout;
- acceptance criteria before code;
- test plan before implementation;
- accessibility acceptance before UI completion;
- data and persistence approval before records;
- release gates before merge or deployment exposure;
- human review before any authority-bearing behavior.

## 8. Definition Of Ready For A Slice

A slice is not ready for implementation until it has:

- named user goal;
- named role or persona;
- accepted scope and out-of-scope boundaries;
- explicit data classification;
- source boundary decision;
- persistence decision;
- auth/permission expectation;
- IA/UX acceptance criteria;
- accessibility acceptance criteria;
- test plan;
- release gate;
- rollback or disable plan;
- human approval to implement.

If any item is missing, the slice remains planning-only.

## 9. Definition Of Done For A Slice

A future implemented slice should not be considered done until:

- intended files only changed;
- code review completed;
- unit tests passed;
- integration tests passed where applicable;
- E2E or manual QA completed where applicable;
- accessibility checks completed;
- data/source boundaries verified;
- persistence/logging boundaries verified;
- release/deployment status observed;
- rollback or disable path verified;
- human approval recorded.

This Definition of Done is not active implementation approval. It is a future readiness target.

## 10. Data And Source Boundary Gate

Before a slice can read or use data, the project must define:

- synthetic-only data;
- human-provided planning context;
- repo planning artifacts;
- Linear issue metadata;
- Drive snapshot/status context;
- source-of-truth records;
- real customer, attendee, vendor, partner, payment, personnel, or private communication data;
- redacted data, if ever approved.

Default rule:

Only synthetic data and approved planning context are allowed until a future governed source/data approval explicitly expands the boundary.

Drive snapshots and Source-of-Truth Index rows are status and handoff aids. They are not runtime source authority.

## 11. Persistence And Records Gate

Before a slice creates or updates records, the project must define:

- what is a draft;
- what is evidence;
- what is a review result;
- what is an audit record;
- what is temporary UI state;
- what is retained;
- what is deleted;
- what is exportable;
- what is not allowed to persist.

Default rule:

No product persistence, retained records, logs, review history, or audit trail may be added until approved by a future persistence/records boundary artifact.

## 12. Auth, Roles, And Authority Gate

Before a slice gives a person or system any capability, the project must define:

- role names;
- allowed reads;
- allowed decisions;
- forbidden actions;
- escalation path;
- approval authority;
- audit expectations;
- what counts as operational authority.

Default rule:

Human review may classify planning artifacts. It may not create operational approval, autonomous action, external communication, source changes, or release authority.

## 13. IA, UX, And UI Gate

Before UI implementation, the project must define:

- task flow;
- information hierarchy;
- decision states;
- empty states;
- loading states;
- blocked states;
- error states;
- confirmation language;
- non-approval reminders;
- accessibility requirements;
- responsive behavior;
- keyboard and focus behavior.

A static visual prototype may be planned before implementation if it remains synthetic, non-runtime, non-persistent, non-interactive in an approval-bearing way, and not connected to data.

## 14. Testing And Eval Gate

Before implementation, each slice should define a validation plan covering:

- unit tests;
- integration tests;
- E2E tests where appropriate;
- manual QA where appropriate;
- accessibility checks;
- governance boundary checks;
- fixture or synthetic evals;
- CI/CD expectations.

Recommended governance eval:

Does this slice preserve synthetic-first, human-reviewed, approval-gated boundaries without implying operational approval?

## 15. Release And DevOps Gate

Before a slice can be released or exposed, the project must define:

- environment behavior;
- feature flag or disable path;
- migration policy, if any;
- observability boundary;
- logging boundary;
- CI/CD evidence;
- deployment evidence;
- rollback or disable process;
- post-merge/post-deploy verification.

Default rule:

A passing local or CI build does not imply production readiness or operational approval.

## 16. First Candidate Slice Direction

A likely first candidate vertical slice is:

Human reviewer inspects a synthetic context packet, classifies it, and records repo-first planning evidence.

This candidate is not approved for implementation by this artifact.

Before implementation, it still needs:

- slice Definition of Ready;
- data/source boundary confirmation;
- persistence decision;
- auth/role decision;
- IA/UX acceptance criteria;
- test/eval plan;
- release gate;
- human approval to implement.

## 17. Recommended Transition Sequence

Recommended next sequence:

1. Define first candidate vertical slice and Definition of Ready.
2. Define data/source/persistence boundary for that slice.
3. Define test/eval/release gates for that slice.
4. Plan static IA/UX prototype for that slice.
5. Reassess whether implementation can begin.

This sequence may be adjusted by human review.

## 18. Stop Conditions

Stop and defer if future work attempts to:

- implement UI before implementation approval;
- add runtime routes before route approval;
- add database schema before persistence approval;
- use source data before source boundary approval;
- add logs or retained records before records approval;
- add CLI commands before CLI approval;
- add model/prompt/tool behavior before runtime approval;
- expose operational controls before authority approval;
- claim production readiness from docs or CI alone;
- send external communication;
- create autonomous action.

## 19. Recommended Next Branch

Recommended next card:

`CLO-76 — Define first candidate vertical slice and Definition of Ready`

Rationale:

- CLO-75 defines the transition charter.
- The next bottleneck is choosing and scoping the first slice before data, persistence, test, release, IA/UX, or UI work proceeds.
- This keeps the project in planning mode while preparing for disciplined vertical-slice development.

Deferred branches:

- Static visual prototype planning should wait until the first slice and Definition of Ready are defined.
- UI implementation remains out of scope.
- Database, persistence, logging, source automation, CLI behavior, runtime/model/prompt work, release, and operations remain out of scope.

## 20. Explicit Non-Approvals

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
- database changes;
- persistence, logging, or retained records;
- release or rollback;
- operational approval;
- production readiness;
- autonomous action;
- external communication;
- authority to act.

## 21. Proof / Non-Proof

This artifact can prove only that Cloud City has defined a docs-only transition charter for future vertical-slice SDLC planning.

It does not prove that any slice is ready, approved, implemented, releasable, production-ready, or operationally approved.

## 22. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- implementation remains explicitly unapproved;
- vertical-slice readiness gates are clear;
- data/source/persistence boundaries remain gated;
- IA/UX/UI implementation remains deferred.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-vertical-slice-sdlc-transition-charter.v0.1.md
git diff --check
```

## 23. Human Review Questions

Human review should clarify:

- whether the first candidate slice should be the synthetic context-packet reviewer workflow;
- whether CLO-76 should define Definition of Ready only or include first-slice scope;
- whether persistence/data boundary planning should be separate from first-slice planning;
- whether static prototype planning should remain deferred until CLO-76 is complete.

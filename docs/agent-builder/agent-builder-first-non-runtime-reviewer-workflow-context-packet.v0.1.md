# Agent Builder First Non-Runtime Reviewer Workflow Context Packet v0.1

## 1. Status And Scope

- Docs-only.
- Planning-only.
- Synthetic-first.
- Non-runtime.
- Human-review-only.
- Created for CLO-72: `Define first non-runtime reviewer workflow context packet`.
- Baseline: `28741a9 docs(agent-builder): define source data graduation criteria`.

This artifact defines a planning packet only. It does not approve implementation, runtime behavior, source automation, Drive runtime authority, UI implementation, CLI behavior, persistence, logging, retained records, release, operational approval, production readiness, autonomous action, or authority to act.

## 2. Standing Posture

Agent Builder / City Center remains synthetic-first, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute. PASS means pass for human review only.

Drive governance/status context is not runtime source authority. Deterministic contract conformance is not operational approval.

## 3. Source Context

CLO-71 defined criteria for when governed context may be considered in a future human-reviewed workflow.

CLO-72 narrows that into a small context packet a human reviewer may inspect during a first non-runtime workflow.

The packet is meant to be human-readable and bounded. It is not a runtime schema, UI schema, CLI schema, database schema, logging schema, or source integration contract.

## 4. Packet Purpose

The packet should give a human reviewer enough context to classify a proposed workflow without exposing or implying unapproved source access.

The packet should help the reviewer decide whether the proposed workflow is:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

## 5. Allowed Packet Fields

A first non-runtime reviewer workflow context packet may contain only:

- packet ID;
- related CLO issue ID;
- baseline commit;
- proposed workflow title;
- synthetic or governed-context category;
- planning purpose;
- reviewer role;
- allowed references;
- forbidden uses;
- expected reviewer decision;
- evidence location;
- stop condition;
- non-approval reminder.

These fields are planning fields only. They are not product fields, runtime fields, logging fields, retained-record fields, database fields, analytics fields, UI fields, CLI fields, or source-binding fields.

## 6. Disallowed Packet Fields

The packet must not contain:

- private customer or attendee data;
- vendor, partner, payment, or personnel data;
- secrets, keys, tokens, credentials, or private communications;
- raw Drive folder contents;
- product database records;
- runtime traces;
- model logs or prompt logs;
- operational instructions intended for execution;
- external communication drafts intended to be sent;
- automated source-read results;
- persistent identifiers intended for runtime use.

If a proposed packet needs one of these fields, it must stop or route to hold / clarify.

## 7. Packet Template

Recommended planning-only packet shape:

```text
Packet ID: CP-00
Related CLO: CLO-XX
Baseline: main@shortsha
Proposed workflow title: [human-readable title]
Context category: [synthetic / governed planning reference category]
Planning purpose: [why the reviewer is inspecting it]
Reviewer role: [human role]
Allowed references: [bounded list]
Forbidden uses: [bounded list]
Expected reviewer decision: later bounded L2 candidate / first implicated CLO-52 lane dependency card / hold / clarify
Evidence location: [repo artifact or approved Linear comment]
Stop condition: [when review must stop]
Non-approval reminder: Planning packet only; not runtime, source automation, Drive runtime authority, UI, CLI, persistence, logging, retained records, release, operations, production readiness, autonomous action, or authority to act.
```

## 8. Reviewer Responsibilities

The reviewer is responsible for confirming that:

- the packet uses only allowed fields;
- any governed context category is named;
- forbidden uses are explicit;
- the decision is one adopted label;
- any ambiguity routes to hold / clarify;
- no packet field is treated as runtime source authority;
- no packet field implies approval to act.

## 9. Example Packet

```text
Packet ID: CP-01
Related CLO: CLO-72
Baseline: main@28741a9
Proposed workflow title: Classify a proposed reviewer-support workflow
Context category: human-reviewed Linear issue metadata
Planning purpose: determine whether the workflow is a bounded L2 candidate, prerequisite-lane dependency, or hold / clarify
Reviewer role: human reviewer
Allowed references: issue title, issue ID, issue description summary, related planning artifact path
Forbidden uses: no source automation, no Drive runtime read, no persistence, no external action
Expected reviewer decision: one adopted label
Evidence location: repo planning artifact or approved Linear comment
Stop condition: ambiguity, unapproved data request, or implied authority to act
Non-approval reminder: Planning packet only; not runtime, source automation, Drive runtime authority, UI, CLI, persistence, logging, retained records, release, operations, production readiness, autonomous action, or authority to act.
```

## 10. Non-Examples

Not allowed at this stage:

- a packet containing real attendee data;
- a packet generated from automatic Drive folder reads;
- a packet that stores classifier outputs as product records;
- a packet that triggers a UI action;
- a packet that instructs the agent to send external recommendations;
- a packet that treats Source-of-Truth Index text as runtime authority.

## 11. Pass / Hold Outcomes

A packet is pass-for-review when:

- it uses only allowed fields;
- it contains no disallowed fields;
- it names the reviewer role;
- it names the evidence location;
- it states forbidden uses;
- it includes a stop condition;
- it preserves non-approval boundaries.

A packet must route to hold / clarify when:

- it contains unapproved data;
- it implies source automation;
- it implies runtime behavior;
- it implies persistence, logging, retained records, UI, CLI, release, operations, or authority;
- the reviewer cannot determine the boundary.

## 12. Recommended Next Branch

Recommended next card:

`CLO-73 — Dry run first non-runtime reviewer workflow context packet`

Rationale:

- CLO-72 defines the packet shape.
- The safest next step is to test the packet shape with synthetic packet examples before UI, CLI, source automation, or runtime planning.
- This keeps the project in a reversible docs-only learning loop.

Deferred branches:

- Non-runtime UI prototype planning should wait until the packet shape survives at least one dry run.
- CLI planning should wait until packet handling is clear.
- Runtime/model/prompt/source-automation work remains out of scope.

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

Stop and defer if future work tries to use this packet artifact to approve implementation, source automation, runtime behavior, UI implementation, CLI behavior, product persistence, logging, retained records, release, operational approval, production readiness, autonomous action, or authority to act.

## 15. Proof / Non-Proof

This artifact can prove only that Cloud City has defined a planning-only context packet shape for a future non-runtime human-reviewed workflow.

It does not prove that source reads, Drive runtime behavior, UI implementation, CLI behavior, persistence, logging, retained records, release, operations, production readiness, or authority to act are approved.

## 16. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed;
- no runtime/code/config/package files changed;
- the packet fields are planning-only;
- disallowed fields are explicit;
- pass / hold outcomes are explicit;
- all non-approvals remain explicit.

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-non-runtime-reviewer-workflow-context-packet.v0.1.md
git diff --check
```

## 17. Human Review Questions

Human review should clarify:

- whether the packet fields are too broad or too narrow;
- whether a packet dry run should happen before UI prototype planning;
- whether the evidence location should be repo-only or allow approved Linear comments;
- whether CLO-73 should test one packet or several packet examples.

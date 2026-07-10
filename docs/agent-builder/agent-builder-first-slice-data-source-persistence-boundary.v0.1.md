# Agent Builder First-Slice Data, Source, And Persistence Boundary v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Created for CLO-77.
- Baseline: `15a382d docs(agent-builder): define first slice readiness`.

This decision record does not approve implementation, runtime behavior, UI work, source integration, storage, release, external communication, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, classifies it, and records repo-first planning evidence.`

The slice remains not ready for implementation.

## Allowed Information

Only invented synthetic fixture content may be considered.

Allowed fixture fields:

- fixture ID;
- synthetic planning reference;
- invented workflow title;
- planning purpose;
- reviewer-role label;
- allowed-reference labels;
- forbidden-use labels;
- expected decision labels;
- evidence guidance;
- stop condition;
- non-approval reminder.

Temporary reviewer input may include one classification, one concise rationale, and one hold / clarify reason.

## Disallowed Information

The slice must not use real or redacted operational information, private communications, production records, source-system records, or automatically retrieved document content.

If non-synthetic information becomes necessary, stop and return to governed planning.

## Source Decision

The only acceptable future source class is a manually reviewed synthetic fixture set defined in the repository.

The slice must not retrieve review context from Drive, Linear, GitHub, a database, uploads, or external services.

Drive snapshots and Source-of-Truth Index rows remain status aids, not runtime authority.

## Synthetic Fixture Shape

```text
Fixture ID: SF-XX
Planning reference: CLO-XX
Workflow title: [invented title]
Context category: synthetic
Planning purpose: [bounded purpose]
Reviewer role: human reviewer
Allowed references: [synthetic list]
Forbidden uses: [boundary list]
Expected decision: later bounded L2 candidate / first implicated CLO-52 lane dependency card / hold / clarify
Evidence guidance: repo-first
Stop condition: [ambiguity, disallowed information, runtime implication, or authority implication]
Non-approval reminder: planning-only
```

The exact implementation format, validation behavior, and fixture location remain unapproved.

## Temporary-State Decision

The maximum future temporary-state boundary is active-session memory only.

Temporary state must clear when the review is reset, closed, reloaded, or left.

It must not become a retained browser, server, database, analytics, or review-history record.

This is a planning boundary, not approval to implement state handling.

## Evidence Decision

Primary evidence remains a human-reviewed repo artifact under `docs/agent-builder/`.

A future slice may prepare temporary plain-text evidence containing:

- synthetic fixture ID;
- selected planning classification;
- concise rationale;
- hold / clarify reason when applicable;
- boundary acknowledgement;
- suggested repo evidence path.

The slice must not write evidence automatically. A human must review and manually place approved evidence in the repository.

Linear may contain concise supporting progress or completion evidence only.

## Persistence Decision

`No product persistence approved.`

The first slice must not create a lasting review result, history, audit record, cache, or other product record.

No storage schema, migration, server write, or retained record is approved.

Retention ends with the active temporary interaction.

Any future retained information requires a separate governance decision.

## Logging And Analytics Decision

Review content, classifications, rationale, fixture content, and evidence drafts must not be retained through logging or analytics.

Any later technical diagnostics require a separate boundary decision.

## Decisions

1. The first slice remains synthetic-only.
2. Repo-defined synthetic fixtures are the only acceptable future source class.
3. Automatic source retrieval is prohibited.
4. Temporary state is limited to active-session memory.
5. No product persistence or retained review history is approved.
6. Evidence may be drafted temporarily but must be placed in the repo by a human.
7. Linear remains supporting evidence only.
8. Broader information, source, state, or retention needs require new approval.

## Remaining Readiness Gaps

Still unresolved:

- access and role expectations;
- human approval checkpoints;
- IA/UX states and accessibility;
- test and evaluation plan;
- environment, release, disable, and rollback gates;
- exact fixture implementation contract.

## Acceptance Criteria

CLO-77 passes for human review when:

- synthetic-only input is explicit;
- source retrieval prohibitions are explicit;
- temporary state is bounded;
- evidence remains repo-first and human-executed;
- no lasting product record is approved;
- the slice remains honestly classified as not ready for implementation.

## Stop Conditions

Stop if future work attempts to use non-synthetic information, retrieve source content automatically, retain review state, write evidence automatically, begin UI or runtime implementation, or claim implementation readiness from this record.

## Recommended Next Branch

`CLO-78 — Define first-slice access, roles, and authority boundary`

Test/evaluation/release planning and static IA/UX work remain deferred until that boundary is explicit.

## Explicit Non-Approvals

This artifact does not approve implementation, UI, runtime behavior, source retrieval, storage, retained records, release, production readiness, external communication, or authority to act.

## Suggested Validation

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-data-source-persistence-boundary.v0.1.md
git diff --check
```

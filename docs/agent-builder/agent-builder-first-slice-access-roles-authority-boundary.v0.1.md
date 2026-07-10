# Agent Builder First-Slice Access, Roles, And Authority Boundary v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Created for CLO-78.
- Baseline: `b3d7457 docs(agent-builder): define first slice data boundary`.

This decision record does not approve implementation, authentication changes, UI work, runtime behavior, deployment exposure, external communication, autonomous action, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, classifies it, and records repo-first planning evidence.`

The slice remains not ready for implementation.

## Purpose

This record defines who may participate in the future first slice, what each role may decide, who may authorize implementation or exposure, and where work must stop.

## Current Access Posture

Today there is no implemented reviewer surface and therefore no product access to grant.

Current access is limited to human review of approved planning artifacts in the repository, Linear, and Drive status materials.

Drive snapshots and Source-of-Truth Index rows remain handoff aids, not runtime authority.

## Roles

### Founder / Governance Approver

The Founder is the approval authority for this bounded planning phase.

The Founder may:

- approve or reject future implementation scope;
- approve a change to data, source, persistence, role, release, or authority boundaries;
- approve transition from planning to implementation;
- approve non-production exposure;
- approve production-readiness work;
- require hold, clarification, or rollback planning.

Founder approval must be explicit and recorded before authority-bearing work begins.

### Human Reviewer

The human reviewer may:

- inspect an approved synthetic fixture;
- choose one governed planning classification;
- enter a concise rationale;
- choose hold / clarify;
- acknowledge the non-approval boundary;
- prepare temporary plain-text evidence for human review.

The human reviewer may not:

- approve implementation;
- approve release or deployment exposure;
- change source or persistence boundaries;
- create operational approval;
- send external communication;
- trigger autonomous action;
- write evidence automatically;
- modify production or source-system records.

### Developer / Implementer

A developer may inspect planning artifacts and prepare implementation proposals.

Implementation work may begin only after explicit Founder approval for a bounded slice, files, acceptance criteria, validation plan, and stop conditions.

A developer may not self-approve scope expansion, release, production readiness, or operational authority.

### QA / Accessibility Reviewer

A QA or accessibility reviewer may inspect approved synthetic behavior and report findings after a future implementation is authorized.

That reviewer may not approve operational use, broaden access, change data boundaries, or authorize release.

### Agent Or System

An agent or system has no independent approval authority.

A future system may present synthetic fixtures and accept bounded temporary reviewer input only after implementation is approved.

It may not:

- choose or approve a classification on behalf of the human;
- retrieve unapproved source content;
- retain review history;
- send external communication;
- approve implementation or release;
- create operational authority;
- expand its own permissions.

## Permitted Planning Decisions

The only reviewer decisions in the first slice are:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

These are planning classifications only.

They do not approve code, runtime behavior, release, production use, external action, or authority to act.

## Access Stages

### Stage 0 — Planning

Current stage.

- No product surface.
- No authentication work.
- No runtime access.
- Human review of planning artifacts only.

### Stage 1 — Local Development

Not approved by this record.

If later approved, access must be limited to named developers and human reviewers using synthetic fixtures in a local or similarly isolated environment.

No public, customer, attendee, vendor, partner, or general staff access is allowed.

### Stage 2 — Shared Non-Production

Not approved by this record.

Before shared non-production access, the project must define and approve:

- authentication mechanism;
- authorization enforcement;
- named allowed roles;
- environment boundary;
- access removal path;
- test-data restrictions;
- audit and logging boundary;
- disable path.

Anonymous or public access is prohibited.

### Stage 3 — Production

Out of scope and unapproved.

Production exposure requires separate production-readiness, security, privacy, release, rollback, observability, and operational approvals.

## Approval Checkpoints

Explicit Founder approval is required before:

- implementation starts;
- a route, screen, component, API, or state mechanism is added;
- authentication or authorization is changed;
- any shared environment is used;
- access is granted beyond named development participants;
- data, source, persistence, logging, or retention boundaries expand;
- deployment exposure or release work begins;
- any operational or external action is introduced.

A passing document review, local build, test suite, or CI run does not satisfy these approval checkpoints.

## Approval Record Contract

Every authority-bearing approval must be recorded repo-first in a human-reviewed governance decision record before the approved work begins.

The minimum approval record must identify:

- related CLO issue;
- approving role;
- repository baseline;
- approved goal and bounded scope;
- approved files, surfaces, environment, or access stage;
- named or bounded participants;
- acceptance criteria and validation plan;
- explicit non-approvals;
- stop, expiration, revocation, or reassessment conditions;
- date of approval.

Linear may contain concise supporting approval evidence or a link to the repo record, but a Linear comment alone is not the durable authority source.

This approval record is governance evidence. It is not product audit logging, retained reviewer history, analytics, or runtime authority.

## Multi-Hat Role Separation

One person may hold more than one project role, including Founder, developer, reviewer, or project owner.

Authority does not transfer automatically between those roles.

Authoring, implementing, testing, reviewing, or accepting evidence does not itself constitute Founder approval.

When the same person performs both delivery and approval responsibilities, the authority-bearing transition must still be made as a separate explicit approval decision and recorded under the approving role.

## Authority Separation

Review is not approval.

Classification is not implementation authorization.

Implementation authorization is not release authorization.

Release authorization is not operational approval.

Contract conformance is not production readiness.

Humans approve. Humans execute authority-bearing actions unless a future governed decision explicitly changes that rule.

## Access Failure And Hold Behavior

Stop and route to hold / clarify when:

- the participant role is unknown;
- access is anonymous, public, or broader than approved;
- authentication or authorization expectations are unclear;
- a reviewer is asked to approve implementation or release;
- a system is asked to choose or execute an authority-bearing decision;
- source, data, persistence, or environment boundaries would expand;
- evidence cannot remain repo-first and human-reviewed.

## Decisions

1. The Founder remains the approval authority for this phase.
2. The human reviewer may classify synthetic planning fixtures but may not create implementation or operational approval.
3. Developers may propose and implement only inside an explicitly approved scope.
4. QA and accessibility review provide evidence, not release authority.
5. Agents and systems have no independent approval authority.
6. Current posture is planning access only.
7. Anonymous, public, and production access are prohibited.
8. Shared non-production access requires a separate approved authentication and authorization design.
9. Every authority expansion requires explicit human approval.
10. Authority-bearing approvals require a repo-first human-reviewed approval record.
11. Holding multiple roles does not collapse approval boundaries.

## Remaining Readiness Gaps

Still unresolved:

- authentication mechanism and authorization enforcement;
- access-grant, access-removal, expiration, and revocation lifecycle;
- approval-record location and reusable template;
- test and evaluation plan;
- accessibility and IA/UX state acceptance;
- environment and feature-disable plan;
- CI/CD and release evidence requirements;
- rollback verification;
- exact synthetic fixture implementation contract;
- explicit approval to implement.

## Acceptance Criteria

CLO-78 passes for human review when:

- current access posture is explicit;
- roles and permitted decisions are explicit;
- Founder-held approval checkpoints are explicit;
- the minimum approval-record contract is explicit;
- multi-hat role separation is explicit;
- anonymous and public access are prohibited;
- agent/system authority is explicitly bounded;
- review, implementation, release, and operational approval remain distinct;
- the slice remains honestly classified as not ready for implementation.

## Stop Conditions

Stop if future work attempts to grant access, add authentication or authorization, begin implementation, expose a shared environment, approve release, broaden authority, or introduce external or autonomous action from this record alone.

## Recommended Next Branch

`CLO-79 — Define first-slice test, evaluation, release, and rollback boundary`

Static IA/UX work remains deferred until those validation and exposure gates are explicit.

## Explicit Non-Approvals

This artifact does not approve implementation, authentication changes, authorization changes, UI, runtime behavior, shared-environment access, release, production readiness, external communication, autonomous action, or authority to act.

## Suggested Validation

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-access-roles-authority-boundary.v0.1.md
git diff --check
```

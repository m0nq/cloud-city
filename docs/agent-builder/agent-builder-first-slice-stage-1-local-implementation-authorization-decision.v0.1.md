# Agent Builder First-Slice Stage 1 Local Implementation Authorization Decision v0.1

## Status

- Docs-only governance decision record.
- Synthetic-first.
- Created for CLO-83.
- Contract baseline: `bae0d3b docs(agent-builder): finalize first slice local contract`.
- Founder outcome: **APPROVE AS WRITTEN**.
- Approving role: Founder / Governance Approver.
- Approval date: `2026-07-10`.
- Decision state: **Founder approved; effectiveness pending the final validation gates in this record**.

The Founder explicitly approves the exact CLO-82 bounded Stage 1 proposal as written.

This approval does not become implementation authority until the final decision commit passes local docs validation and observed main-branch CI with Deploy skipped, CLO-84 exists and cites that commit, and its worktree starts from that final validated commit.

## Approved Decision

Authorize one bounded Stage 1 implementation attempt for:

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

Approved surface:

`A loopback-only native HTML reviewer surface served by the existing Agent Builder CLI.`

The approval is local-only, reversible, exact-file scoped, dependency-free, synthetic-only, non-persistent, human-reviewed, accessibility-tested, and separately merge-gated.

## Evidence Considered

- CLO-76 through CLO-82.
- Repository `main@bae0d3b`.
- Successful docs-only CI run `29111177063` with deployment skipped.
- Validated CLO-83 proposal at `main@e0ed7ad`.
- Successful proposal CI run `29114172477` with deployment skipped.

These artifacts support the bounded implementation authorization recorded here. They do not prove that implementation, tests, QA, a PR, merge, deployment, release, production readiness, operational approval, external communication, autonomous action, or authority to act has occurred.

## Effectiveness Rule

The Founder outcome is final: `APPROVE AS WRITTEN`.

Implementation authority becomes effective only after all of the following are true:

1. this approval is recorded in the repo-first decision artifact;
2. the final decision artifact passes local docs validation;
3. the final decision commit passes observed main-branch CI with Deploy skipped;
4. `CLO-84 — Implement first-slice loopback local reviewer surface` exists and cites the final validated CLO-83 commit;
5. the approved CLO-84 worktree starts from that commit.

A conversation statement initiated this repo update but does not replace the final repo-first record. Linear, local tests, CI, or a PR cannot independently expand authority.

## Roles And Separation

- **Founder / Governance Approver:** approved this bounded implementation attempt and may revoke or require reassessment. This approval does not include merge, deployment, release, production readiness, operational approval, external communication, autonomous action, or authority to act.
- **Implementer:** one user-designated developer or assistant inside the approved worktree. May inspect, patch, test, self-review, validate, repair, commit, push, and open one draft PR only within this record. May not expand scope, merge, deploy, release, or create operational authority.
- **QA / Accessibility Reviewer:** a human must perform or directly observe manual visual, keyboard, responsive, and screen-reader checks. An assistant may guide and organize evidence, not replace human observation.
- **Agent / System:** receives no independent approval authority and may not decide for the reviewer, retain history, retrieve sources, communicate externally, or act autonomously.

One person may hold multiple roles, but role authority does not transfer automatically. Implementing, testing, reviewing, committing, or pushing is not merge approval. Implementation authorization and merge authorization remain separate explicit decisions.

## CLO-84 And Git Authorization

Create:

`CLO-84 — Implement first-slice loopback local reviewer surface`

CLO-84 must cite CLO-82 and the final validated CLO-83 commit and reproduce this goal, scope, acceptance gate, validation plan, non-approvals, three-pass budget, and stop conditions.

No implementation action begins before CLO-84 exists and the effectiveness gates are satisfied.

Required `/main` preflight:

```zsh
pwd
git rev-parse --is-inside-work-tree
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git rev-parse --short HEAD
```

Authorized Git shape:

- keep `/main` unchanged during implementation;
- create one sibling worktree from the final validated CLO-83 commit;
- use branch `mw/clo-84-first-slice-local-reviewer`;
- do not create additional branches or worktrees;
- do not rebase, merge, normalize branches, or modify unrelated worktrees;
- do not implement directly on `main`.

## Authorized Goal

A named human reviewer can:

1. launch one approved synthetic fixture through the Agent Builder CLI;
2. inspect bounded synthetic context and non-approval language;
3. choose one governed planning classification or `hold / clarify`;
4. enter one concise rationale or hold reason;
5. acknowledge the planning-only boundary;
6. inspect a plain-text evidence preview;
7. complete the interaction for manual human transfer only;
8. reset, reload, navigate away/back, close the tab, or terminate the process without retained product review state.

PASS remains pass for human review only.

## Exact Authorized File Scope

### New source files

- `src/agent-builder/first-slice-reviewer/schema.ts`
- `src/agent-builder/first-slice-reviewer/validation.ts`
- `src/agent-builder/first-slice-reviewer/evidence.ts`
- `src/agent-builder/first-slice-reviewer/surface.ts`
- `src/agent-builder/first-slice-reviewer/server.ts`

### Modified source file

- `scripts/agent-builder/index.ts`

The CLI modification is limited to `reviewer local`, required `--fixture`, bounded optional `--port`, injected server startup for tests, and safe startup output.

### New fixtures

Directory:

`fixtures/agent-builder/first-slice-reviewer/`

Authorized files:

1. `valid_later_bounded_l2_candidate.synthetic.json`
2. `valid_clo52_lane_dependency.synthetic.json`
3. `valid_hold_clarify_ambiguity.synthetic.json`
4. `invalid_operational_data_field.synthetic.json`
5. `invalid_source_retrieval_instruction.synthetic.json`
6. `invalid_persistence_claim.synthetic.json`
7. `invalid_external_communication_instruction.synthetic.json`
8. `invalid_autonomous_action_instruction.synthetic.json`
9. `invalid_unsupported_classification.synthetic.json`
10. `invalid_missing_non_approval_reminder.synthetic.json`
11. `invalid_evidence_field_overreach.synthetic.json`
12. `valid_reset_reload_verification.synthetic.json`

All fixture content must be invented and synthetic.

### New tests

- `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`

### Modified documentation

- `docs/agent-builder/architecture.md`

The documentation change is limited to the bounded local surface and its non-public, non-shared, non-persistent, non-operational posture.

No other file is authorized.

## Prohibited Changes

No package, lockfile, Next/TypeScript/Jest/Cypress/workflow configuration, `src/app/**`, `src/components/**`, contexts, hooks, API utilities, public assets, auth, analytics, persistence, source, integration, prompt, provider, tool, model, or existing model-runtime module changes.

No dependency installation is authorized.

## Technical Contract

Use only existing TypeScript, Zod, Node built-ins, native semantic HTML/DOM, Jest/jsdom, Testing Library/user-event, and existing Agent Builder CLI seams.

Loopback server:

- bind only to `127.0.0.1`;
- expose no host option, shared URL, or browser auto-open;
- default port `4317`; explicit ports `1024–65535`; port `0` only in direct tests;
- accept Host only as `127.0.0.1:<port>` or `localhost:<port>`;
- serve one self-contained document at `/`;
- support GET and HEAD only, with safe 404 and 405 responses;
- make no outbound request and log no request or review content.

Fixture reads:

- interactive runtime reads exactly one selected approved fixture at startup;
- tests may read the twelve approved fixtures;
- no other source read is allowed;
- realpath the approved directory and requested file;
- prevent traversal and symlink escape;
- require a regular `.synthetic.json` file no larger than 64 KiB;
- read once with no watch or automatic reload;
- path, type, or size failure serves nothing;
- schema-invalid content inside the approved directory may show only safe field paths and messages, never rejected values.

The surface must make no model-backed runtime, existing runtime prototype, prompt, provider, tool, or integration call; write no file, record, cookie, storage, log, analytic event, trace, or history; send no reviewer input to the server; use no Clipboard API; enforce restrictive CSP, Permissions Policy, no-store headers, inert rendering, and safe errors; and clear temporary state on reset, reload, pagehide, persisted pageshow, back navigation, tab close, and process termination.

## CLO-85 Clarification Amendment — Process Termination And Already-Loaded Documents

This amendment cites
`docs/agent-builder/agent-builder-first-slice-process-termination-loaded-document-semantics-clarification.v0.1.md`.
It is a non-scope-expanding interpretation of this Founder-approved decision, not a new implementation authorization or
approval of a new technical mechanism.

The CLO-85 clarification document and this amendment are separately authorized docs-only governance artifacts. They do
not add to or alter CLO-84's exact implementation file scope.

For this decision record, the controlling interpretation is that CLI termination immediately disables the loopback
server and makes its URL unavailable for future requests and loads. It leaves no server-side reviewer state, session,
history, record, log, or retained data. It does not and cannot synchronously erase JavaScript memory from a
self-contained document already loaded by the browser without adding a prohibited client/server liveness channel.

An already-loaded document remains limited to browser-memory-only, non-persistent, non-transmitting, local state until
explicit reset, reload, initial document reinitialization, `pagehide`, persisted `pageshow` / bfcache reinitialization,
navigation away and browser Back restoration, tab close, or browser document disposal clears or discards it. This
supersedes any reading of this record that CLI termination remotely clears or disables an already-loaded page.

The stale-loaded-document human-handling rule defined in
`docs/agent-builder/agent-builder-first-slice-process-termination-loaded-document-semantics-clarification.v0.1.md`
is controlling for this narrow ambiguity. After CLI termination or confirmed loopback unavailability, the human must
stop using the already-loaded reviewer document, must not rely on, copy, or manually transfer evidence from it, and must
close its browser tab before continuing review. This is a separate human action. It does not imply a server-to-browser
signal, automatic document mutation, remote erasure, or any new liveness mechanism.

Polling, heartbeat requests, `fetch`/XHR, WebSocket, Server-Sent Events, beacon, service workers, browser storage,
cookies, server sessions, and any new client/server liveness mechanism remain unapproved. All exact file, worktree,
branch, TDD, validation, QA, pass-budget, stop, expiration, and non-approval boundaries remain unchanged.

CLO-84 Pass 1 remains consumed and two implementation/validation passes remain. CLO-84 remains blocked until this
clarification receives its required docs validation and reviewed main-push evidence with Deploy skipped. This amendment
does not resume CLO-84 or alter merge, release, deployment, production-readiness, operational, external-action,
autonomous-action, or authority-to-act boundaries. Before any CLO-84 resumption, its preserved code, tests, reviewer
copy, and architecture text must be aligned with this controlling interpretation in the preserved CLO-84 Pass 2, only
after separate human authorization to resume that pass.

## TDD And Pass Budget

Sequence:

fixtures and failing tests → schemas and validation → evidence formatter → surface/state/focus/lifecycle/injection tests → renderer → server tests and server → CLI tests and CLI → architecture docs → targeted validation → self-review → human QA → broad validation.

Maximum autonomous budget: **three total bounded implementation/validation passes**, including the initial pass and at most two repair passes.

Extra passes require explicit human approval. Stop on budget exhaustion or scope expansion.

## Automated Validation

```zsh
corepack pnpm test:runInBand -- \
  __tests__/agent-builder/first-slice-reviewer-schema.test.ts \
  __tests__/agent-builder/first-slice-reviewer-surface.test.ts \
  __tests__/agent-builder/first-slice-reviewer-server.test.ts \
  __tests__/agent-builder/first-slice-reviewer-cli.test.ts

corepack pnpm exec eslint \
  src/agent-builder/first-slice-reviewer \
  scripts/agent-builder/index.ts \
  __tests__/agent-builder/first-slice-reviewer-schema.test.ts \
  __tests__/agent-builder/first-slice-reviewer-surface.test.ts \
  __tests__/agent-builder/first-slice-reviewer-server.test.ts \
  __tests__/agent-builder/first-slice-reviewer-cli.test.ts

corepack pnpm typecheck
corepack pnpm test:runInBand -- __tests__/agent-builder
corepack pnpm test:coverage
corepack pnpm build
git diff --check
```

Confirm exact files, twelve expected outcomes, inert text, no server reviewer input, no prohibited APIs, lifecycle clearing, unchanged coverage thresholds, and a valid build without package or configuration changes.

## Human Visual And Accessibility QA

Launch only from the approved worktree:

```zsh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

A human must perform or directly observe:

- keyboard completion for all classifications;
- error focus and valid-input preservation;
- preview, edit, completion, and reset behavior;
- reload and back-navigation clearing;
- selectable preview without Clipboard API;
- VoiceOver with Safari and Chrome accessibility-tree checks;
- viewports `320×568`, `768×1024`, and `1440×900`;
- 400% zoom/reflow, text spacing, and forced-colors/high-contrast behavior;
- absence of animation, timeout, refresh, external request, analytics, and retained state;
- safe blocked output, inert injection strings, and process-termination disablement.

Record reviewer, date, browser/assistive technology, viewport, result, and holds. Automated checks do not replace human visual or screen-reader evidence.

## Acceptance And Evidence Gate

Before commit, push, or draft PR:

- exact files only;
- every automated command passes;
- all twelve cases match expected outcomes;
- all three classifications work and ambiguous or invalid cases hold or block safely;
- preview fields are bounded and text remains inert;
- no reviewer input reaches the server;
- no request, storage, persistence, logging, analytics, Clipboard API, or automatic write occurs;
- lifecycle clearing passes;
- all required human QA passes;
- no stop condition is triggered;
- the evidence package is complete.

Evidence package:

- preflight and starting SHA;
- changed files and diff stat;
- test, lint, typecheck, coverage, build, and diff-check results;
- twelve-case summary;
- loopback, Host, path, CSP, inert-rendering, no-server-input, and no-prohibited-API evidence;
- human QA matrix;
- risks, holds, and stop-condition assessment;
- proposed commit message.

After push, add the implementation SHA, branch, draft PR URL, PR file confirmation, and an explicit note that the current workflow has no pull-request trigger.

Passing this gate permits commit, approved-branch push, and one draft PR only.

## Commit, Push, PR, And Merge

Recommended commit:

`feat(agent-builder): add first slice local reviewer`

After the gate passes, the implementer may commit, push only the approved branch, open one draft PR, attach evidence, and use only a remaining authorized repair pass.

The PR remains draft until evidence is complete and no hold remains. Current CI runs on `main` pushes, so PR review is diff and evidence review, not remote PR-CI evidence.

**Merge is not authorized.** A separate Founder merge decision requires PR diff, exact-file, test, coverage, human-QA, security, and governance review and confirmation that no stop condition fired.

After an approved merge, observe main CI by run ID. Expected: deploy-scope classification, build, and unit tests succeed; deploy reason is `non_runtime_changes_only`; Deploy is skipped. Any deployment or failure triggers a human-approved repair or revert decision.

## Disable, Removal, And Revert

Immediate disablement:

- terminate the CLI;
- verify the loopback URL is unavailable;
- close the browser tab;
- no retained data requires cleanup.

Removal is limited to the five new source files, four new test files, the reviewer fixture directory, the `reviewer local` CLI branch, and the corresponding architecture section.

Merged rollback requires a reviewed revert, full validation, observed main CI, and verification that Deploy was skipped. No database, migration, remote environment, or user-data rollback exists.

## Stop Conditions

Stop and report on:

- dependency, package, lockfile, configuration, or workflow change;
- any file outside the exact authorized list;
- Next/React/public/shared/deployed surface work;
- auth change;
- source reads outside the approved runtime/test fixture rules;
- real or redacted data;
- model-backed runtime, prompt, provider, tool, or integration behavior;
- persistence, storage, logging, analytics, tracing, or retained records;
- reviewer input reaching the server;
- Clipboard API or automatic transfer;
- deploy-required classification;
- unsupported validation assumptions;
- coverage reduction or governance-test weakening;
- inability to meet WCAG 2.2 Level AA acceptance;
- unclear Git, PR, merge, release, or operational authority;
- failure beyond the total-pass budget.

## Expiration And Revocation

This authorization expires at the earliest of:

- 30 calendar days after `2026-07-10` if implementation has not begun;
- relevant contract, path, tooling, CI, or governance drift before worktree creation;
- `main` touching an authorized or prohibited file before worktree creation;
- creation of the worktree from a baseline other than the final validated CLO-83 commit;
- pass-budget exhaustion;
- a stop condition;
- explicit Founder revocation.

The Founder may revoke this authorization at any time.

On expiration or revocation: stop work, push nothing further, preserve the current diff and evidence, remove the worktree or branch only under explicit human instruction, and return to governed planning.

## Explicit Non-Approvals

This authorization does not approve:

- implementation before the effectiveness gates are satisfied;
- any file outside the exact scope;
- dependency or configuration changes;
- production Next.js or React UI work;
- authentication or shared/public access;
- unapproved sources or real/redacted data;
- model, prompt, tool, provider, integration, or existing model-runtime expansion;
- persistence, logging, analytics, tracing, or retained history;
- automatic repository, Linear, Drive, or clipboard writes;
- merge;
- deployment;
- release;
- rollback execution;
- production readiness;
- operational approval;
- external communication;
- autonomous action;
- authority to act.

## Founder Decision Block

Outcome:

`APPROVE AS WRITTEN`

Approving role:

`Founder / Governance Approver`

Approval date:

`2026-07-10`

Scope:

`The exact CLO-82 Stage 1 local implementation contract, without narrowing.`

Effective-commit rule:

`The authorization becomes effective only after this approval commit passes local docs validation and observed main CI with Deploy skipped, CLO-84 exists and cites that commit, and its worktree starts from that commit.`

Continued non-approval:

`Merge, deployment, shared access, release, production readiness, operational use, external communication, autonomous action, and authority to act remain unapproved.`

## CLO-83 Acceptance

CLO-83 may close after:

- the Founder outcome is recorded;
- the final decision commit passes local docs validation;
- observed main CI succeeds with Deploy skipped;
- CLO-84 is created and cites the final validated commit;
- Snapshot v53 and the Source-of-Truth Index are updated.

## Suggested Docs Validation

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git pull --ff-only
git status --short --branch
git show --stat --oneline HEAD
git diff --check HEAD~1..HEAD
```

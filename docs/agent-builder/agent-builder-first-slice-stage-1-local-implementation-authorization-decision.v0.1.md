# Agent Builder First-Slice Stage 1 Local Implementation Authorization Decision v0.1

## Status

- Docs-only governance decision proposal.
- Synthetic-first.
- Created for CLO-83.
- Contract baseline: `bae0d3b docs(agent-builder): finalize first slice local contract`.
- Decision state: **proposed for Founder review; not effective**.
- Recommended outcome: **approve with the conditions in this record**.
- Approving role: Founder / Governance Approver.
- Decision date: pending explicit Founder decision.

This proposal creates no implementation authority until the Founder explicitly adopts, narrows, rejects, or holds it and the final decision record is validated.

## Decision Under Review

Whether to authorize one bounded Stage 1 implementation attempt for the first candidate slice:

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

The proposed implementation is the exact CLO-82 contract:

`A loopback-only native HTML reviewer surface served by the existing Agent Builder CLI.`

## Evidence Considered

- CLO-76 — first candidate slice and initial Definition of Ready.
- CLO-77 — synthetic data, source, state, persistence, and evidence boundary.
- CLO-78 — roles, authority, approval checkpoints, and repo-first approval-record contract.
- CLO-79 — test, eval, environment, release, disable, and rollback boundary.
- CLO-80 — IA/UX states and WCAG 2.2 Level AA acceptance.
- CLO-81 — readiness reassessment and Stage 1 contract-preparation decision.
- CLO-82 — exact local implementation contract and validation plan.
- Repository baseline `main@bae0d3b`.
- GitHub Actions run `29111177063`, which passed for the CLO-82 docs-only contract and skipped deployment.

These artifacts support a bounded implementation-authorization decision. They do not themselves authorize implementation, merge, deployment, release, production readiness, operational approval, external communication, autonomous action, or authority to act.

## Recommended Decision

**Recommended outcome: approve the exact CLO-82 Stage 1 implementation contract, subject to every condition in this record.**

The authorization should be narrow, reversible, local-only, synthetic-only, and non-operational.

The decision should authorize only:

- creation of the approved implementation issue;
- creation of one approved sibling worktree and semantic branch;
- implementation and tests in the exact file scope;
- local automated validation and manual visual/accessibility QA;
- one or more bounded repair passes within the approved budget;
- intentional commits on the approved branch after required gates pass;
- branch push and a draft PR after local validation and manual QA pass;
- review and evidence collection in the draft PR.

It should not authorize merge, deployment, shared access, release, production readiness, operational use, external communication, autonomous action, or authority to act.

## Effectiveness Rule

This record is not effective while its decision state is `proposed`.

Implementation authority begins only when all of the following are true:

1. the Founder explicitly records `approve`, `approve with narrowing`, `hold`, or `reject`;
2. the repo record is updated to reflect that exact outcome;
3. the final decision artifact passes docs-only local validation;
4. the final decision commit passes observed main-branch CI with deployment skipped;
5. the approved implementation issue exists and cites the effective decision commit;
6. the implementation worktree is created from the final validated CLO-83 commit.

A conversation statement, Linear comment, document review, local test, CI pass, or draft PR cannot substitute for the final effective repo-first decision record.

## Approving Role And Bounded Participants

### Founder / Governance Approver

The Founder is the only role that may make this implementation-authorization decision.

The Founder may approve, narrow, hold, reject, revoke, or require reassessment.

The Founder decision does not automatically include merge, deployment, release, or operational approval.

### Implementer

The implementer may be one user-designated developer or an assistant operating inside the approved worktree and scope.

The implementer may inspect, patch, test, self-review, validate, repair, commit, push, and open a draft PR only as conditionally authorized below.

The implementer may not expand scope, modify prohibited files, merge, deploy, release, or create operational authority.

### QA / Accessibility Reviewer

A human QA or accessibility reviewer may perform and record manual evidence.

QA evidence does not create merge, release, production-readiness, or operational authority.

### Agent Or System

No agent or system receives independent approval authority.

The implemented reviewer surface may present approved synthetic fixtures and accept temporary local reviewer input only. It may not choose the decision for the human, retain review history, retrieve source content, communicate externally, or act autonomously.

## Authorized Implementation Issue

If the Founder approves this record, create:

`CLO-84 — Implement first-slice loopback local reviewer surface`

CLO-84 must link to CLO-82 and the final effective CLO-83 decision commit.

No implementation action may begin before CLO-84 exists and its description reproduces the exact goal, file scope, acceptance criteria, validation plan, non-approvals, repair budget, and stop conditions.

Creating CLO-84 is not merge or release approval.

## Repository And Worktree Authorization

If approved, the implementation must begin from the final validated CLO-83 commit on `main`.

Required preflight from `/Users/archimedes/Projects/cloud-city/main`:

```zsh
pwd
git rev-parse --is-inside-work-tree
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git rev-parse --short HEAD
```

Authorized Git shape:

- preserve `/main` unchanged during implementation;
- create one sibling worktree next to `/main`;
- use branch `mw/clo-84-first-slice-local-reviewer`;
- do not create additional branches or worktrees;
- do not rebase, merge, normalize branches, or modify unrelated worktrees;
- stop if the starting baseline is not the final validated CLO-83 commit.

## Authorized Goal

Implement the CLO-82 loopback-only local reviewer surface so that a named human reviewer can:

1. launch one approved synthetic fixture through the Agent Builder CLI;
2. inspect bounded synthetic context and non-approval language;
3. choose one governed planning classification or hold / clarify;
4. enter a concise rationale or hold reason;
5. acknowledge the planning-only boundary;
6. inspect a plain-text evidence preview;
7. complete the interaction for manual human transfer only;
8. reset, reload, navigate away/back, close the tab, or terminate the process without retaining product review state.

Success remains contract conformance for human review only.

## Exact Authorized File Scope

### New source files

- `src/agent-builder/first-slice-reviewer/schema.ts`
- `src/agent-builder/first-slice-reviewer/validation.ts`
- `src/agent-builder/first-slice-reviewer/evidence.ts`
- `src/agent-builder/first-slice-reviewer/surface.ts`
- `src/agent-builder/first-slice-reviewer/server.ts`

### Modified source file

- `scripts/agent-builder/index.ts`

The modification is limited to `reviewer local` argument parsing and dispatch, required `--fixture`, optional bounded `--port`, injected server startup for tests, and safe startup output.

### New fixture files

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

### New test files

- `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`

### Modified documentation file

- `docs/agent-builder/architecture.md`

The documentation change is limited to the bounded loopback Stage 1 surface and its non-public, non-shared, non-persistent, non-operational posture.

No other file is authorized.

## Prohibited Files And Changes

The implementation must not modify:

- `package.json`;
- `pnpm-lock.yaml`;
- `next.config.mjs`;
- `tsconfig.json`;
- `jest.config.ts`;
- `cypress.config.ts`;
- `.github/workflows/**`;
- `src/app/**`;
- `src/components/**`;
- `src/contexts/**`;
- `src/hooks/**`;
- `src/utils/api/**`;
- `public/**`;
- existing runtime, model, prompt, provider, tool, auth, analytics, persistence, source, or integration modules.

No dependency installation or package mutation is authorized.

## Authorized Technical Boundary

If approved, the implementation may use only:

- existing TypeScript;
- existing Zod;
- Node built-in HTTP and crypto capabilities needed for the loopback server and per-response nonce;
- native semantic HTML and DOM APIs;
- existing Jest, jsdom, Testing Library, and user-event tooling;
- existing Agent Builder CLI patterns and dependency-injection seams.

The surface must:

- bind only to `127.0.0.1`;
- expose no host flag or shared URL;
- serve one self-contained document at `/`;
- support GET and HEAD only;
- retrieve no external asset or source;
- make no model, prompt, provider, tool, or runtime call;
- write no file, record, cookie, browser storage, log, analytics event, trace, or review history;
- receive no classification, rationale, acknowledgement, or preview at the server;
- provide selectable text only, with no Clipboard API;
- use restrictive CSP, Permissions Policy, no-store headers, inert rendering, and safe error output;
- clear temporary state on reset, reload, pagehide, persisted pageshow, navigate-away/back, tab close, and process termination.

## TDD And Bounded Repair Loop

The authorized implementation sequence is:

1. add synthetic fixtures and failing schema/eval tests;
2. implement strict schema and deterministic validation;
3. add failing evidence-preview tests and pure formatter;
4. add failing semantic, state, focus, lifecycle, and injection tests;
5. implement the HTML renderer and self-contained initializer;
6. add failing server confinement and security-header tests;
7. implement the loopback server;
8. add failing CLI tests;
9. implement the narrow CLI command;
10. update architecture documentation;
11. run targeted checks, self-review, manual QA, and broad validation.

Maximum repair budget: **three bounded implementation/validation passes** after the initial implementation pass.

Each repair pass must remain inside the exact files and acceptance criteria.

Stop and report instead of continuing if the budget is exhausted or the failure requires scope expansion.

## Automated Validation Plan

Required commands from the approved worktree:

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

Validation must confirm:

- only authorized files changed;
- all twelve fixture/eval cases meet expected outcomes;
- fixture values and reviewer text remain inert;
- review input never reaches the server;
- no network, storage, persistence, logging, analytics, or Clipboard API behavior exists;
- reload and bfcache/back navigation clear temporary state;
- global coverage thresholds pass without reduction;
- the build remains valid without package or configuration changes.

## Manual Visual And Accessibility QA

Launch only from the approved worktree:

```zsh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

Review `http://127.0.0.1:4317` for:

1. keyboard-only completion for all three classifications;
2. error focus and valid-input preservation;
3. preview, edit, completion, reset-cancel, and reset-confirm behavior;
4. reload clearing;
5. navigate-away and Back clearing;
6. selectable preview without Clipboard API;
7. VoiceOver with Safari on macOS;
8. Chrome accessibility-tree inspection;
9. 320×568, 768×1024, and 1440×900 viewports;
10. 400-percent zoom and reflow;
11. text-spacing override;
12. forced-colors or high-contrast emulation;
13. no animation, timeout, refresh, external request, analytics, or retained state;
14. safe blocked rendering without rejected values;
15. inert markup and script-injection strings;
16. immediate disablement when the CLI process terminates.

Manual evidence must be recorded for human review. Automated checks cannot replace visual, focus, responsive, or screen-reader evidence.

## Commit, Push, And Draft-PR Authority

If the decision becomes effective, the implementer may commit only after:

- targeted tests pass;
- targeted lint passes;
- typecheck passes;
- Agent Builder tests pass;
- coverage passes;
- build passes;
- `git diff --check` passes;
- changed-file review confirms exact scope;
- required manual visual/accessibility QA passes or any remaining manual evidence is explicitly held for Founder review without claiming completion.

Recommended commit message:

`feat(agent-builder): add first slice local reviewer`

After those gates, the implementer may:

- push only the approved branch;
- open one draft PR;
- include local validation and manual-QA evidence;
- perform up to the remaining repair passes within scope;
- push scoped repair commits to the same branch.

The current GitHub workflow runs on pushes to `main`, not pull requests. The draft PR provides diff and evidence review, not remote PR-CI evidence.

## Merge And Post-Merge Boundary

This decision does **not** authorize merge.

A separate explicit Founder merge decision is required after:

- draft-PR diff review;
- exact-file review;
- test and coverage evidence review;
- manual visual/accessibility evidence review;
- security and governance review;
- confirmation that no stop condition was triggered.

After an approved merge, remote validation requires observation of the resulting main push workflow by run ID and job conclusions.

Expected outcome:

- deploy-scope classification succeeds;
- build succeeds;
- unit tests and coverage succeed;
- deploy reason is `non_runtime_changes_only`;
- Deploy is skipped.

If deployment is requested or performed, or main CI fails, stop and use a human-approved repair or revert path.

## Disable, Removal, And Revert

Immediate local disablement:

- terminate the CLI process;
- confirm the loopback URL no longer responds;
- close the browser tab;
- no retained review data requires cleanup.

Removal is limited to:

- `src/agent-builder/first-slice-reviewer/**`;
- the four first-slice reviewer test files;
- `fixtures/agent-builder/first-slice-reviewer/**`;
- the `reviewer local` CLI branch in `scripts/agent-builder/index.ts`;
- the corresponding section in `docs/agent-builder/architecture.md`.

If merged, rollback requires a reviewed revert of the implementation commit or merge commit, full validation, observed main CI, and verification that deployment remains skipped.

No database, migration, remote environment, or user-data rollback is expected because none is authorized.

## Stop Conditions

Stop immediately and report if implementation requires or reveals:

- a dependency, package, lockfile, configuration, or workflow change;
- any file outside the exact authorized list;
- a Next route, React app component, middleware, public asset, or global layout change;
- a tunnel, shared URL, non-loopback binding, preview environment, or deployment;
- authentication or authorization changes;
- source reads beyond the one approved fixture file;
- real or redacted data;
- model, prompt, provider, tool, runtime, or integration behavior;
- persistence, cookies, browser storage, session maps, logging, analytics, tracing, or retained records;
- reviewer input reaching the server;
- Clipboard API or automatic transfer;
- deploy-required CI classification;
- inability to establish repository-supported validation;
- coverage-threshold reduction or governance-test weakening;
- inability to meet WCAG 2.2 Level AA acceptance;
- an out-of-scope file or architecture dependency;
- unclear implementation, commit, push, PR, merge, or release authority;
- validation failure outside the repair budget.

## Expiration, Revocation, And Reassessment

If approved, the authorization expires at the earliest of:

- 30 calendar days after the explicit Founder approval date if implementation has not begun;
- any relevant change to the approved contract, file paths, package/tooling, CI classifier, or governance boundaries before worktree creation;
- any change to `main` that touches an authorized or prohibited file before worktree creation;
- creation of the worktree from a baseline other than the final validated CLO-83 commit;
- exhaustion of the repair budget;
- a stop condition;
- explicit Founder revocation.

The Founder may revoke the authorization at any time.

On revocation or expiration:

- stop work;
- do not push additional changes;
- preserve the current diff and evidence for human review;
- remove the worktree or branch only under explicit human instruction;
- return to governed planning for reassessment.

## Explicit Non-Approvals

This decision proposal does not approve:

- implementation while the record remains proposed;
- any file outside the exact scope;
- dependency or package changes;
- production App Router or React UI work;
- authentication or authorization changes;
- shared or public access;
- source retrieval;
- real or redacted data;
- model, prompt, provider, tool, runtime, or integration expansion;
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

## Proof And Non-Proof

If explicitly approved and validated, this record can prove only that the Founder authorized one bounded Stage 1 local implementation attempt under the exact scope and conditions.

It cannot prove that:

- implementation succeeded;
- tests or QA passed;
- a PR is acceptable;
- merge is approved;
- deployment or release is approved;
- production readiness exists;
- operational approval exists;
- the surface may be shared;
- anyone has authority to act externally.

## Founder Decision Block

Current state:

`PENDING EXPLICIT FOUNDER DECISION — NO IMPLEMENTATION AUTHORITY`

Available outcomes:

1. `APPROVE AS WRITTEN`
2. `APPROVE WITH NARROWING PATCH`
3. `HOLD`
4. `REJECT`

When the Founder selects an outcome, this section must be updated with:

- exact outcome;
- approving role;
- approval date;
- effective final decision commit rule;
- any narrowing conditions;
- expiration and reassessment conditions;
- explicit statement that merge, deployment, release, production readiness, operational use, external communication, autonomous action, and authority to act remain unapproved.

## Acceptance Criteria For CLO-83

CLO-83 passes for human decision review when:

- the exact CLO-82 contract is adopted or intentionally narrowed;
- the decision state and effectiveness rule are explicit;
- approving role and bounded participants are explicit;
- implementation issue and baseline rules are explicit;
- exact files and prohibited files are explicit;
- worktree, branch, commit, push, and draft-PR authority are explicit;
- merge remains separately approval-gated;
- TDD, validation, QA, repair budget, disable, removal, and revert are explicit;
- expiration, revocation, and reassessment are explicit;
- non-approvals and stop conditions are explicit;
- no authority exists while the record remains proposed.

## Suggested Validation For This Docs-Only Proposal

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-stage-1-local-implementation-authorization-decision.v0.1.md
git diff --check
```

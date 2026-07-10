# Agent Builder First-Slice Stage 1 Local Implementation Authorization Decision v0.1

## Status

- Docs-only governance decision proposal.
- Synthetic-first.
- Created for CLO-83.
- Contract baseline: `bae0d3b docs(agent-builder): finalize first slice local contract`.
- Decision state: **proposed for Founder review; not effective**.
- Team recommendation: **APPROVE AS WRITTEN**.
- Approving role: Founder / Governance Approver.
- Decision date: pending.

No implementation authority exists until the Founder selects an outcome, this repo record is updated, the final decision commit passes docs-only validation and observed main CI, CLO-84 exists, and its worktree begins from that final validated commit.

CLO-83 remains open while this record is proposed.

## Decision Under Review

Authorize one bounded Stage 1 implementation attempt for:

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

Exact proposed surface:

`A loopback-only native HTML reviewer surface served by the existing Agent Builder CLI.`

## Evidence And Recommendation

Evidence considered: CLO-76 through CLO-82, repo `main@bae0d3b`, and successful docs-only CI run `29111177063` with deployment skipped.

Recommendation: approve the exact CLO-82 contract because it is local-only, reversible, dependency-free, outside the production Next.js route/analytics boundary, exact-file scoped, synthetic-only, non-persistent, security-bounded, accessibility-tested, and separately merge-gated.

Choose `HOLD` if the Founder does not accept the exact scope, native HTML/DOM choice, loopback server, QA burden, conditional Git authority, or expiration terms. Choose `REJECT` if any local reviewer surface is premature.

## Effectiveness Rule

This proposal is not effective.

Authority begins only after:

1. the Founder selects `APPROVE AS WRITTEN`, `APPROVE WITH NARROWING PATCH`, `HOLD`, or `REJECT`;
2. this repo record reflects that outcome;
3. the final decision artifact passes local docs validation;
4. the final decision commit passes observed main CI with Deploy skipped;
5. `CLO-84 — Implement first-slice loopback local reviewer surface` exists and cites that commit;
6. the approved worktree starts from that commit.

A conversation statement may initiate the repo update, but cannot replace the final repo-first record. Linear, local tests, CI, or a PR cannot independently create authority.

## Roles And Separation

- **Founder / Governance Approver:** may approve, narrow, hold, reject, revoke, or require reassessment. This does not include merge, deployment, release, or operational approval.
- **Implementer:** one user-designated developer or assistant inside the approved worktree. May inspect, patch, test, review, validate, repair, commit, push, and open one draft PR only under this record. May not expand scope, merge, deploy, or release.
- **QA / Accessibility Reviewer:** a human must perform or directly observe manual visual, keyboard, responsive, and screen-reader checks. An assistant may guide and organize evidence, not replace human observation.
- **Agent / System:** receives no independent authority and may not decide for the reviewer, retain history, retrieve sources, communicate externally, or act autonomously.

One person may hold multiple roles, but role authority does not transfer automatically. Implementing, testing, reviewing, committing, or pushing is not Founder approval. Implementation authorization and merge authorization remain separate explicit decisions.

## CLO-84 And Git Authorization

If approved, create CLO-84 and copy this goal, scope, acceptance gate, validation plan, non-approvals, three-pass budget, and stop conditions into it.

No implementation action begins before CLO-84 exists.

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

- keep `/main` unchanged;
- create one sibling worktree from the final validated CLO-83 commit;
- branch `mw/clo-84-first-slice-local-reviewer`;
- no additional branch/worktree, rebase, merge, or unrelated-worktree change;
- no direct-to-main implementation.

## Authorized Goal

A named human reviewer can launch one approved synthetic fixture, inspect bounded context, choose one governed classification or hold / clarify, enter one concise reason, acknowledge the planning-only boundary, inspect a plain-text evidence preview, complete for manual transfer only, and leave/reset/reload/back/close/terminate without retained product review state.

PASS remains pass for human review only.

## Exact File Scope

New source files:

- `src/agent-builder/first-slice-reviewer/schema.ts`
- `src/agent-builder/first-slice-reviewer/validation.ts`
- `src/agent-builder/first-slice-reviewer/evidence.ts`
- `src/agent-builder/first-slice-reviewer/surface.ts`
- `src/agent-builder/first-slice-reviewer/server.ts`

Modified source:

- `scripts/agent-builder/index.ts` — only `reviewer local`, required `--fixture`, bounded optional `--port`, injected server starter, and safe startup output.

New fixtures under `fixtures/agent-builder/first-slice-reviewer/`:

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

New tests:

- `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
- `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`

Modified docs:

- `docs/agent-builder/architecture.md` — only the bounded local surface and its non-public, non-shared, non-persistent, non-operational posture.

No other file is authorized.

## Prohibited Changes

No package, lockfile, Next/TypeScript/Jest/Cypress/workflow config, `src/app/**`, `src/components/**`, contexts, hooks, API utilities, public assets, auth, analytics, persistence, source, integration, prompt, provider, tool, model, or existing model-runtime module changes.

No dependency installation.

## Technical Contract

Use only existing TypeScript, Zod, Node built-ins, native semantic HTML/DOM, Jest/jsdom, Testing Library/user-event, and existing CLI seams.

Loopback server:

- bind only `127.0.0.1`;
- no host option/shared URL/browser auto-open;
- default port `4317`; explicit `1024–65535`; port `0` only in direct tests;
- Host only `127.0.0.1:<port>` or `localhost:<port>`;
- serve one self-contained document at `/`;
- GET/HEAD only; safe 404/405;
- no outbound request or request/review-content logging.

Fixture reads:

- interactive runtime reads exactly one selected approved fixture at startup;
- tests may read the twelve approved fixtures;
- no other source read;
- realpath approved directory/file, prevent traversal/symlink escape, require regular `.synthetic.json`, maximum 64 KiB, read once, no watch/reload;
- path/type/size failure serves nothing;
- schema-invalid approved-directory content may show only safe field paths/messages, never rejected values.

The surface must make no model-backed runtime, existing runtime prototype, prompt, provider, tool, or integration call; write no file/record/cookie/storage/log/analytics/trace/history; send no reviewer input to the server; use no Clipboard API; enforce restrictive CSP/Permissions Policy/no-store/inert rendering/safe errors; and clear state on reset, reload, pagehide, persisted pageshow, back navigation, close, and process termination.

## TDD And Pass Budget

Sequence: fixtures/tests → schemas/validation → evidence formatter → surface/state/focus/lifecycle/injection tests → renderer → server tests/server → CLI tests/CLI → architecture docs → targeted validation → self-review → human QA → broad validation.

Maximum autonomous budget: **three total bounded implementation/validation passes**, including the initial pass and at most two repairs. Extra passes require explicit human approval. Stop on budget exhaustion or scope expansion.

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

Confirm exact files, twelve expected outcomes, inert text, no server reviewer input, no prohibited APIs, lifecycle clearing, unchanged coverage thresholds, and valid build without package/config changes.

## Human Visual And Accessibility QA

Launch from the approved worktree only:

```zsh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

A human must perform or directly observe:

- keyboard completion for all classifications;
- error focus/input preservation;
- preview/edit/completion/reset behavior;
- reload and back-navigation clearing;
- selectable preview without Clipboard API;
- VoiceOver/Safari and Chrome accessibility-tree checks;
- 320×568, 768×1024, 1440×900;
- 400% zoom/reflow, text spacing, forced colors/high contrast;
- no animation, timeout, refresh, external request, analytics, or retained state;
- safe blocked output, inert injection strings, and process-termination disablement.

Record reviewer, date, browser/AT, viewport, result, and holds. Automated checks do not replace human visual/screen-reader evidence.

## Acceptance And Evidence Gate

Before commit/push/draft PR:

- exact files only;
- all automated commands pass;
- twelve cases match expected outcomes;
- three classifications work; ambiguous/invalid cases hold or block safely;
- preview fields are bounded; text remains inert; no reviewer input reaches server;
- no request/storage/persistence/logging/analytics/clipboard/automatic write;
- lifecycle clearing passes;
- all human QA passes;
- no stop condition;
- evidence package complete.

Evidence package:

- preflight and starting SHA;
- changed files/diff stat;
- test/lint/typecheck/coverage/build/diff-check results;
- twelve-case summary;
- loopback/Host/path/CSP/inert/no-server-input/no-prohibited-API evidence;
- human QA matrix;
- risks/holds/stop-condition assessment;
- proposed commit message.

After push add implementation SHA, branch, draft PR URL, PR file confirmation, and explicit note that current CI has no PR trigger.

Passing this gate permits commit, approved-branch push, and draft PR only.

## Commit, Push, PR, And Merge

Recommended commit:

`feat(agent-builder): add first slice local reviewer`

After the gate passes, the implementer may commit, push only the approved branch, open one draft PR, attach evidence, and use only a remaining authorized repair pass.

The PR stays draft until evidence is complete and no hold remains. Current workflow runs on `main` pushes, so PR review is diff/evidence review, not remote PR CI.

**Merge is not authorized.** A separate Founder merge decision requires PR diff/file/test/coverage/human-QA/security/governance review and confirmation that no stop condition fired.

After approved merge, observe main CI by run ID. Expected: classifier/build/unit tests succeed, deploy reason `non_runtime_changes_only`, Deploy skipped. Any deployment or failure triggers human-approved repair/revert.

## Disable, Removal, Revert

Immediate disable: terminate CLI, verify URL unavailable, close tab; no retained data cleanup.

Removal is limited to the five new source files, four tests, fixture directory, CLI branch, and architecture section.

Merged rollback requires reviewed revert, full validation, observed main CI, and Deploy skipped. No database, migration, remote environment, or user-data rollback exists.

## Stop Conditions

Stop/report on dependency/package/config/workflow change; out-of-scope file; Next/React/public/shared/deployed surface; auth change; source read outside approved runtime/test fixture rules; real/redacted data; model-backed runtime/prompt/provider/tool/integration behavior; persistence/storage/logging/analytics/tracing/records; reviewer input reaching server; Clipboard/automatic transfer; deploy-required classification; unsupported validation; coverage/governance weakening; WCAG failure; unclear Git/PR/merge/release authority; or failure beyond the total-pass budget.

## Expiration And Revocation

If approved, authorization expires at the earliest of:

- 30 days after approval if implementation has not begun;
- relevant contract/path/tooling/CI/governance drift before worktree creation;
- `main` touching an authorized/prohibited file before worktree creation;
- wrong worktree baseline;
- pass-budget exhaustion;
- stop condition;
- Founder revocation.

The 30-day limit reduces silent drift. On expiry/revocation: stop, push nothing further, preserve diff/evidence, remove worktree/branch only under explicit instruction, and return to planning.

## Explicit Non-Approvals

While proposed, no implementation is approved. This record never approves out-of-scope files, dependency/config changes, production Next/React UI, auth/shared access, unapproved sources or real data, model/tool/runtime expansion, persistence/logging/analytics, automatic writes, merge, deployment, release, rollback execution, production readiness, operational approval, external communication, autonomous action, or authority to act.

## Founder Decision Block

Current state:

`PENDING EXPLICIT FOUNDER DECISION — NO IMPLEMENTATION AUTHORITY`

Team recommendation:

`APPROVE AS WRITTEN`

Outcomes:

1. `APPROVE AS WRITTEN`
2. `APPROVE WITH NARROWING PATCH`
3. `HOLD`
4. `REJECT`

After selection, update this block with outcome, approving role, date, final validated decision-commit rule, any narrowing, expiration/reassessment terms, and explicit continued non-approval of merge, deployment, release, production readiness, operational use, external communication, autonomous action, and authority to act.

## CLO-83 Acceptance

Ready for human decision when decision/effectiveness, roles/multi-hat separation, CLO-84/baseline, exact/prohibited files, Git/PR authority, separate merge gate, local-server versus prohibited model-runtime boundary, runtime/test fixture reads, TDD/three-pass budget, validation, human QA, evidence, disable/revert, expiration/revocation, non-approvals, and stop conditions are explicit—and no authority exists while proposed.

## Suggested Docs Validation

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-stage-1-local-implementation-authorization-decision.v0.1.md
git diff --check
```

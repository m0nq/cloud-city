# Agent Builder First-Slice Local Implementation Contract And Validation Plan v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Read-only repository inspection completed for CLO-82.
- Baseline: `04bdfa3 docs(agent-builder): clarify first slice delivery prerequisites`.

This contract does not approve implementation, executable tests, a worktree, branch, pull request, route, component, CLI change, fixture loader, server, state mechanism, package change, authentication change, shared access, deployment, merge, release, production readiness, external communication, autonomous action, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

Current readiness remains:

`Not ready for implementation.`

More precise status:

`Exact Stage 1 local implementation contract prepared for a separate Founder authorization decision.`

## Purpose

This record converts the bounded-but-unselected items from CLO-81 into an exact, reviewable Stage 1 proposal grounded in the current repository.

It defines:

- repository and environment scope;
- proposed files and prohibited files;
- synthetic fixture contract and executable eval matrix;
- temporary-state and evidence-transfer behavior;
- loopback-only local reviewer surface;
- test and validation commands;
- manual visual and accessibility evidence;
- worktree, branch, pull-request, merge, and post-merge gates;
- disable, removal, and revert behavior;
- stop conditions and explicit non-approvals.

It is an implementation proposal for human review only. CLO-83 must separately approve, reject, narrow, or hold it before any implementation work begins.

## Verified Repository Evidence

### Application And Tooling Root

The repository has one root `package.json` at the Cloud City worktree root.

Verified tooling:

- package manager: pnpm 11.9.0;
- Node version: 24.14.1 from `.nvmrc`;
- Next.js 16.2.4;
- React 19.2.x;
- TypeScript 5.9.x with strict mode;
- Zod 4.4.x;
- Jest 30 with Next Jest, jsdom, Testing Library, and user-event;
- Cypress is installed for E2E, but its current configuration is not needed or changed by this proposal;
- root scripts include `agent-builder`, `lint`, `typecheck`, `build`, `test:runInBand`, and `test:coverage`.

No dependency or package-file change is required by this contract.

### Current Next Application Boundary

The production App Router root is `src/app/`.

`src/app/layout.tsx` applies the public Navbar, Footer, global styling, and Google Analytics to routed pages.

A new `src/app` reviewer route would therefore:

- enter the production application boundary;
- inherit public navigation and analytics behavior;
- be classified as deploy-required by CI;
- create route and exposure implications beyond Stage 1.

Decision:

`No src/app route, src/components UI, middleware, public asset, or production application change is proposed for Stage 1.`

### Existing Agent Builder Boundary

The repository already contains:

- pure validation and policy modules under `src/agent-builder/`;
- a pnpm-runnable CLI at `scripts/agent-builder/index.ts`;
- synthetic fixtures under `fixtures/`;
- deterministic tests under `__tests__/agent-builder/`;
- existing Zod schemas, strict-object validation, fixture-driven evals, and injected CLI test seams.

Existing Agent Builder architecture remains local, non-authoritative, human-reviewed, and without public routes or production tools.

### CI And Deployment Boundary

The main CI workflow treats these paths as non-runtime for deployment classification:

- `docs/**`;
- `src/agent-builder/**`;
- `scripts/agent-builder/**`;
- `__tests__/agent-builder/**`;
- `fixtures/**`;
- `evals/**`;
- `agent_specs/**`;
- `registry/**`.

Changes confined to those paths still run lint, typecheck, build, and unit tests, but deployment is expected to be skipped.

Any implementation diff outside the approved path set is a stop condition requiring renewed review.

## Stage 1 Architecture Decision

### Selected Surface

The proposed Stage 1 surface is:

`A loopback-only local HTML reviewer surface served by the existing Agent Builder CLI.`

Proposed command:

```sh
pnpm agent-builder reviewer local --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json --port 4317
```

The command:

- validates one approved repository fixture before rendering it;
- binds only to `127.0.0.1`;
- prints the local URL and non-approval reminder;
- does not open a browser automatically;
- serves one self-contained HTML document;
- makes no model call;
- retrieves no source content;
- uses no external service or asset;
- writes no file or record;
- creates no shared URL;
- stops when the local process is terminated.

### Why A Loopback Surface Instead Of A Next Route

This option is selected because it:

- preserves an actual browser task flow for keyboard, focus, responsive, and screen-reader review;
- avoids the production App Router and global analytics;
- stays inside the CI non-deploy path allowlist;
- requires no package or dependency change;
- can operate with browser-memory-only state;
- can be removed or reverted atomically;
- does not imply a future production UI architecture.

This is a bounded Stage 1 validation surface, not the approved design for any shared or production reviewer product.

## Exact Proposed File Scope

### New Source Files

1. `src/agent-builder/first-slice-reviewer/schema.ts`
   - strict Zod fixture and classification schemas;
   - exported TypeScript types;
   - no file, network, runtime, model, tool, UI, or persistence imports.

2. `src/agent-builder/first-slice-reviewer/validation.ts`
   - deterministic fixture validation;
   - deterministic reviewer-input validation;
   - governance-boundary checks;
   - safe field-path error summaries without rejected values.

3. `src/agent-builder/first-slice-reviewer/evidence.ts`
   - pure plain-text evidence-preview builder;
   - includes only approved planning fields;
   - derives a suggested repo-first evidence path;
   - performs no clipboard, file, Linear, Drive, or GitHub write.

4. `src/agent-builder/first-slice-reviewer/surface.ts`
   - semantic HTML renderer;
   - inline styles and a nonce-protected, type-checked browser initializer;
   - browser-memory-only task state;
   - no fetch, XHR, WebSocket, cookies, storage APIs, service worker, clipboard API, analytics, or external assets.

5. `src/agent-builder/first-slice-reviewer/server.ts`
   - Node built-in HTTP server;
   - loopback binding fixed to `127.0.0.1`;
   - fixture path confinement and validation;
   - GET/HEAD-only document serving;
   - safe blocked page for invalid approved-directory fixtures;
   - no request-content logging or retained session state.

### Modified Source File

6. `scripts/agent-builder/index.ts`
   - adds only `reviewer local` argument parsing and dispatch;
   - optional `--port` value with bounded numeric validation;
   - no `--host`, public binding, model, runtime-env, source, write, or browser-open behavior;
   - injects the server-start function for deterministic CLI tests.

### New Synthetic Fixtures

Directory:

`fixtures/agent-builder/first-slice-reviewer/`

Exact fixture set:

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

All fixture content must be invented. No real or redacted Cloud City event, customer, attendee, vendor, partner, staff, financial, legal, or operational data is allowed.

### New Test Files

7. `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
   - exact fixture/eval matrix;
   - strict schema behavior;
   - allowed and rejected fields;
   - classification and governance checks;
   - safe errors without fixture-value disclosure.

8. `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
   - semantic structure and state transitions in jsdom;
   - keyboard-operable controls;
   - error association and focus movement;
   - preview, revision, completion, hold, reset, and reload behavior;
   - no browser persistence, network, clipboard, or automatic-write APIs.

9. `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
   - loopback-only binding;
   - approved fixture-directory confinement;
   - host validation;
   - GET/HEAD-only behavior;
   - security and no-store headers;
   - nonce-bearing CSP;
   - blocked rendering for invalid fixtures;
   - no request or review-state retention.

10. `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`
    - exact CLI grammar;
    - default and explicit port behavior;
    - invalid port and unsupported flag rejection;
    - server dependency injection;
    - no runtime-env or model initialization;
    - safe startup messaging without review content.

### Documentation Update In The Later Implementation Change

11. `docs/agent-builder/architecture.md`
    - document the loopback-only Stage 1 reviewer surface;
    - preserve no-public-route, no-shared-access, no-persistence, and no-operational-authority boundaries;
    - state that the surface is not the approved production UI architecture.

### Explicitly Prohibited Files

The Stage 1 implementation must not modify:

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
- existing runtime/model/prompt/provider modules;
- authentication, analytics, persistence, source, or integration code.

A need to modify any prohibited file stops the implementation loop and returns the proposal to governance review.

## Exact Synthetic Fixture Contract

Each valid fixture must contain only:

```text
fixture_id: non-empty synthetic identifier
planning_reference: non-empty synthetic planning reference
workflow_title: invented non-empty title
context_category: synthetic
planning_purpose: non-empty bounded purpose
reviewer_role: human reviewer
allowed_references: non-empty list of synthetic/repo-planning labels
forbidden_uses: non-empty list of prohibited interpretations/actions
expected_reviewer_decision: later bounded L2 candidate | first implicated CLO-52 lane dependency card | hold / clarify
evidence_guidance: repo-first human placement
stop_condition: non-empty hold/stop instruction
non_approval_reminder: exact governed reminder
```

The Zod object must be strict. Unknown fields fail validation.

Required exact reminder:

`Planning classification only; no implementation, release, operational approval, external action, or authority to act.`

The fixture must not contain:

- URLs or source-system locations;
- customer, attendee, vendor, partner, staff, or account identifiers;
- real or redacted data claims;
- file-read or source-retrieval instructions;
- persistence, logging, analytics, or history fields;
- implementation, release, operational, or production-approval fields;
- external communication instructions;
- autonomous or agent-execution instructions;
- evidence fields outside the approved preview contract.

### Fixture Path Confinement

The CLI/server must:

1. resolve the repository fixture directory with `realpath`;
2. resolve the requested fixture with `realpath`;
3. require the resolved file to remain beneath `fixtures/agent-builder/first-slice-reviewer/`;
4. require the suffix `.synthetic.json`;
5. reject symlink or traversal escape;
6. read the file once before serving;
7. never watch or reload the file automatically.

## Executable Fixture And Eval Matrix

Expected schema outcomes:

- fixtures 1, 2, 3, and 12: valid;
- fixtures 4 through 11: blocked by strict schema or governance validation.

Expected reviewer outcomes for valid fixtures:

- fixture 1 supports `later bounded L2 candidate`;
- fixture 2 supports `first implicated CLO-52 lane dependency card`;
- fixture 3 supports `hold / clarify`;
- fixture 12 supports reset/reload state-clearing verification.

The executable eval matrix lives in `first-slice-reviewer-schema.test.ts`. Each case must name the expected result and the specific failing check where applicable.

No eval result implies implementation, release, production readiness, operational approval, source truth, or permission to act.

## Reviewer Input And Evidence Contract

### Allowed Temporary Input

Only:

- one governed classification;
- one concise rationale, or one concise hold / clarify reason;
- one explicit boundary acknowledgement.

The rationale or hold reason must:

- be non-empty after trimming;
- be limited to 1,000 characters;
- remain in browser memory only;
- never be sent to the server;
- never be logged, persisted, stored, or analyzed.

### Evidence Preview Fields

Only:

- synthetic fixture ID;
- synthetic planning reference;
- selected planning classification;
- concise rationale or hold / clarify reason;
- boundary acknowledgement;
- derived suggested repo evidence path;
- non-approval reminder.

Derived path format:

`docs/agent-builder/review-evidence/<fixture_id>.md`

The preview is selectable plain text only. Stage 1 includes no clipboard button or Clipboard API.

A human may manually copy reviewed text and separately decide whether to create a repo artifact. The local surface performs no write.

## Temporary-State Contract

State exists only in the loaded browser document's JavaScript memory.

Prohibited browser APIs:

- `localStorage`;
- `sessionStorage`;
- IndexedDB;
- Cache API;
- cookies;
- service workers;
- History API state;
- clipboard writes;
- fetch, XHR, WebSocket, EventSource, or beacon APIs.

Required clearing behavior:

- reset confirmation clears all input;
- page reload starts from initial state;
- closing the tab clears all input;
- closing the server clears all server process state;
- browser Back leaves the local surface rather than restoring an application record.

The server holds no review session map, review token, rationale, classification, evidence preview, or history.

## Surface And Interaction Contract

### Server-Rendered Document

The local server serves one HTML document with:

- a unique title;
- one `main` landmark;
- one primary heading;
- visible planning-only and non-approval reminders before controls;
- fixture identity and bounded context;
- a `fieldset` and `legend` for classification choices;
- persistent labels for rationale/hold input;
- an explicit acknowledgement checkbox that is not preselected;
- error summary and field-associated messages;
- selectable evidence preview;
- completion-for-manual-transfer language;
- reset and return controls;
- no external images, fonts, styles, scripts, links, or telemetry.

### State Transitions

Required states:

- initial / ready;
- decision in progress;
- rationale required;
- evidence preview ready;
- completed for manual transfer;
- hold / clarify;
- blocked fixture;
- error;
- reset confirmation.

Required transitions:

- ready to decision;
- decision to validation error or preview;
- preview to revision;
- preview to completion;
- any mutable state to reset confirmation;
- reset confirmation to initial or previous state;
- invalid fixture to blocked state.

Disallowed transitions:

- automatic save;
- automatic repository or Linear write;
- implementation approved;
- release approved;
- operationally approved;
- external communication sent;
- autonomous action executed.

### Keyboard And Focus

The implementation must:

- support the entire flow with keyboard alone;
- use native radio, textarea, checkbox, and button behavior;
- provide visible, unobscured focus;
- have no keyboard trap or drag-only control;
- focus the error summary or first invalid field after attempted progression;
- focus the preview heading after successful preview creation;
- restore focus to the initiating/relevant control on return;
- focus the reset-confirmation heading when opened;
- restore focus on reset cancellation;
- focus the initial heading after confirmed reset;
- focus the completion heading after completion.

### Language

Use:

- `planning classification`;
- `evidence preview`;
- `complete for manual transfer`;
- `hold / clarify`.

Do not use:

- `approved` for the reviewer classification;
- `submitted`;
- `saved`;
- `published`;
- `released`;
- celebratory language implying authority.

## Local Server Security And Exposure Contract

The server must:

- bind only to `127.0.0.1`;
- expose no host-binding option;
- default to port 4317;
- permit an explicit unprivileged port from 1024 through 65535;
- permit port 0 only through direct test injection;
- accept only loopback `Host` values matching the active port;
- serve only GET and HEAD;
- return 405 for other methods;
- serve no directory listing or file path;
- make no outbound request;
- include no request logger;
- avoid printing fixture fields, rationale, classification, or evidence.

Required response headers:

- `Cache-Control: no-store, max-age=0`;
- `Pragma: no-cache`;
- `Content-Type: text/html; charset=utf-8`;
- `Referrer-Policy: no-referrer`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- nonce-based Content Security Policy with no external origins;
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, USB, and other unnecessary capabilities.

Minimum CSP posture:

```text
default-src 'none';
script-src 'nonce-<per-response nonce>';
style-src 'nonce-<per-response nonce>';
img-src 'none';
font-src 'none';
connect-src 'none';
form-action 'none';
frame-ancestors 'none';
base-uri 'none';
```

The browser initializer must prevent native form submission. If JavaScript fails, the form must not send review content to the server because `form-action 'none'` and the server rejects POST.

## Authentication And Access Decision

No new authentication or authorization is required or approved for this strict Stage 1 surface because:

- it binds only to local loopback;
- it creates no shared URL;
- it is launched manually by a named development participant;
- it does not modify an existing authentication boundary;
- it is not deployed.

If inspection or implementation reveals any shared binding, remote tunnel, preview URL, deployed route, existing-auth intersection, or non-local participant need, stop and return to governance planning.

## Logging, Analytics, And Observability

Allowed:

- one startup message containing only the loopback URL;
- one planning-only/non-approval reminder;
- process-level errors that do not include fixture values or review input.

Prohibited:

- request logging;
- page-view analytics;
- fixture-content logging;
- classification or rationale logging;
- evidence logging;
- telemetry, tracing, or monitoring;
- retained reviewer history.

No technical-diagnostics expansion is approved by this contract.

## TDD And Implementation Order

A later authorized implementation must use this order:

1. Add the exact synthetic fixtures and failing schema/eval tests.
2. Implement strict schemas and deterministic validation.
3. Add failing evidence-preview tests.
4. Implement pure evidence formatting.
5. Add failing surface semantics, state, focus, reset, and no-storage/no-network tests.
6. Implement the local document renderer and browser initializer.
7. Add failing server security and exposure tests.
8. Implement the loopback server.
9. Add failing CLI grammar and dispatch tests.
10. Extend the existing Agent Builder CLI.
11. Update `architecture.md`.
12. Run targeted validation, self-review, manual QA, and broader validation.

Maximum autonomous repair budget after implementation begins: three bounded passes. Stop rather than expand scope.

## Exact Automated Validation Plan

Run from the confirmed app root after inspecting the active implementation worktree:

```sh
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

- no package or lockfile change;
- no app, component, auth, analytics, source, model, tool, persistence, logging, workflow, or deployment change;
- all 12 synthetic fixture cases behave as specified;
- browser review input never reaches the server;
- no storage/network/clipboard API is used;
- CI classifies the change as non-runtime and skips deployment.

A failing global coverage threshold is blocking. Coverage exclusions or threshold reductions are not approved.

## Manual Visual And Accessibility QA

Launch only from the authorized local worktree:

```sh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

Review at `http://127.0.0.1:4317`.

Required manual passes:

1. Keyboard-only completion for each of the three classifications.
2. Validation-error focus and input preservation.
3. Preview, return/revise, completion, reset-cancel, and reset-confirm behavior.
4. Reload clears classification, rationale, acknowledgement, and preview.
5. Selectable evidence preview without Clipboard API.
6. VoiceOver with Safari on macOS for title, headings, landmark, group name, labels, required/invalid state, errors, preview, and completion.
7. Chrome accessibility-tree inspection.
8. Viewports:
   - 320 × 568;
   - 768 × 1024;
   - 1440 × 900.
9. Browser zoom/reflow through 400 percent without horizontal scrolling for ordinary content or lost actions.
10. Text-spacing override without content loss.
11. Forced-colors/high-contrast emulation without lost meaning or focus.
12. Confirm no animation, timeout, auto-refresh, external request, page-view analytics, or retained state.
13. Run one invalid fixture and verify a safe blocked page with no rejected fixture values.
14. Confirm stopping the process immediately disables the surface.

Manual QA findings remain open until evidence is recorded. Automated tests do not substitute for VoiceOver, visual, responsive, or focus review.

## Worktree, Branch, PR, And Merge Plan

Only after CLO-83 records Founder implementation authorization:

1. Verify repository/worktree preflight from `/Users/archimedes/Projects/cloud-city/main`.
2. Confirm `main` is clean and aligned to the authorized baseline.
3. Create one sibling worktree only when explicitly authorized.
4. Use semantic branch format:
   - `mw/<implementation-issue>-first-slice-local-reviewer`.
5. Restrict changes to the exact approved files.
6. Follow the TDD order and three-pass repair budget.
7. Run targeted validation before broad validation.
8. Commit only when explicitly authorized.
9. Push only when explicitly authorized.
10. Open a draft PR for the non-trivial interactive implementation.
11. Review changed files, automated evidence, manual visual/accessibility evidence, and CI jobs.
12. Require Founder approval before marking ready or merging.
13. Merge only under the separately approved strategy.
14. Observe the resulting main-branch workflow by run ID and job conclusion.
15. Verify deploy classification remains `non_runtime_changes_only` and Deploy is skipped.
16. Stop if CI requests or performs deployment.

A successful PR or CI run is not release or operational approval.

## Disable, Removal, And Revert Plan

### Immediate Disable

- terminate the local CLI process;
- confirm `127.0.0.1:4317` no longer responds;
- close the browser tab;
- no retained review data requires cleanup.

### Removal

Remove only:

- `src/agent-builder/first-slice-reviewer/**`;
- the four new reviewer test files;
- `fixtures/agent-builder/first-slice-reviewer/**`;
- the added `reviewer local` CLI branch;
- the corresponding architecture documentation section.

Then rerun the full approved validation plan.

### Git Revert

If the implementation was merged and needs reversal:

- revert the exact implementation commit or merge commit through a reviewed change;
- rerun targeted and broad validation;
- observe main CI;
- verify Deploy remains skipped.

No database, migration, retained record, remote environment, or user-data rollback exists for this Stage 1 proposal.

## Implementation Stop Conditions

Stop and report if implementation reveals or requires:

- a dependency or package-file change;
- modification outside the exact approved file list;
- a Next route, component, middleware, public asset, or global layout change;
- a shared URL, tunnel, non-loopback host, preview environment, or deployment;
- authentication or authorization changes;
- source reads beyond the approved repository fixture;
- real or redacted data;
- model, prompt, provider, tool, or runtime integration;
- persistence, cookies, browser storage, session maps, logging, analytics, tracing, or records;
- server receipt of reviewer classification, rationale, acknowledgement, or evidence;
- Clipboard API or automatic evidence transfer;
- a CI deploy-required classification;
- validation commands unsupported by repository evidence;
- a need to reduce coverage or weaken governance tests;
- inability to meet WCAG 2.2 AA acceptance for the approved surface;
- uncertainty about Founder authorization, merge authority, or scope.

## Success Criteria For The Later Stage 1 Implementation

A future implementation may pass for human review only when:

- all exact files and no prohibited files changed;
- all 12 synthetic fixture/eval cases pass as expected;
- all three classifications complete through the bounded local surface;
- ambiguous and invalid cases route to hold or blocked behavior;
- evidence preview contains only approved fields;
- reload, reset, close, and process termination clear temporary state;
- no review input reaches the server;
- no external request, persistence, logging, analytics, or automatic write occurs;
- automated validation passes without threshold reduction;
- manual keyboard, focus, VoiceOver, responsive, zoom/reflow, text-spacing, and forced-colors evidence passes;
- PR and remote CI evidence are observed;
- deploy classification is non-runtime and deployment is skipped;
- Founder separately approves merge after reviewing evidence.

PASS remains pass for human review only. It does not authorize release, shared exposure, production readiness, operational use, external communication, or authority to act.

## CLO-82 Decision

1. The production Next application is not the Stage 1 surface.
2. The Stage 1 proposal is a loopback-only local HTML surface served by the Agent Builder CLI.
3. No new dependency, package change, auth change, public route, analytics, deployment, or persistence is required.
4. Browser state is memory-only and never sent to the server.
5. The server is GET/HEAD-only, loopback-bound, and security-header constrained.
6. The exact fixture schema, 12-case eval matrix, files, tests, validation commands, manual QA, delivery workflow, and revert path are defined.
7. Implementation remains unapproved until a separate Founder decision record is completed.

## Recommended Next Branch

`CLO-83 — Founder decision on first-slice Stage 1 local implementation authorization`

CLO-83 should:

- adopt, narrow, reject, or hold this exact contract;
- name the authorized baseline and file scope;
- record acceptance criteria, validation, non-approvals, and stop conditions;
- decide whether a later implementation issue may create a worktree, branch, code, tests, and PR;
- remain distinct from merge, deployment, release, production-readiness, and operational approval.

## Acceptance Criteria For CLO-82

CLO-82 passes for human review when:

- repository evidence is explicit;
- the selected local surface avoids the production app and deployment;
- exact files and prohibited files are named;
- fixture, state, evidence, server, security, and CLI contracts are exact;
- test commands and expected evidence are repository-supported;
- manual visual and accessibility QA is exact;
- worktree, PR, merge, post-merge, and deploy-skip gates are explicit;
- removal and revert are atomic and testable;
- implementation stop conditions are explicit;
- no implementation authorization is implied.

## Explicit Non-Approvals

This artifact does not approve implementation, executable tests, fixtures, a local server, CLI behavior, worktrees, branches, commits, pushes, PRs, routes, components, package changes, authentication changes, source reads, model or tool behavior, persistence, logging, analytics, shared access, deployment, merge, release, rollback execution, production readiness, external communication, autonomous action, or authority to act.

## Suggested Validation For This Docs-Only Artifact

```sh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-local-implementation-contract-validation-plan.v0.1.md
git diff --check
```

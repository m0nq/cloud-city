# Agent Builder First-Slice Local Implementation Contract And Validation Plan v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Read-only repository inspection completed for CLO-82.
- Baseline: `04bdfa3 docs(agent-builder): clarify first slice delivery prerequisites`.

This record does not approve implementation, executable tests, fixtures, CLI behavior, a local server, a worktree, branch, commit, push, pull request, route, component, package change, authentication change, shared access, deployment, merge, release, production readiness, external communication, autonomous action, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

Current result:

`Not ready for implementation.`

More precise result:

`Exact Stage 1 local implementation contract prepared for a separate Founder authorization decision.`

## Purpose

This record converts the bounded-but-unselected items from CLO-81 into an exact Stage 1 proposal grounded in the current repository.

It defines:

- the selected local surface;
- exact proposed and prohibited files;
- fixture and eval contracts;
- browser-memory-only state and manual evidence transfer;
- local exposure and security controls;
- repository-supported automated validation;
- manual visual and accessibility evidence;
- delivery, review, merge, and post-merge gates;
- disable, removal, and revert behavior;
- explicit stop conditions.

CLO-83 must separately approve, reject, narrow, or hold this contract before implementation begins.

## Verified Repository Evidence

### Root Tooling

The Cloud City worktree uses one root `package.json`.

Verified repository tooling:

- pnpm 11.9.0;
- Node 24.14.1 from `.nvmrc`;
- Next.js 16.2.4;
- React 19.2.x;
- TypeScript 5.9.x in strict mode;
- Zod 4.4.x;
- Jest 30 with Next Jest and jsdom;
- Testing Library and user-event;
- Cypress installed for E2E;
- root scripts for Agent Builder, lint, typecheck, build, run-in-band tests, and coverage.

No dependency, package, lockfile, test-configuration, or build-configuration change is required by this proposal.

### Production Application Boundary

The production App Router lives under `src/app/`.

The root layout applies:

- public Navbar;
- public Footer;
- global application styling;
- Google Analytics.

A reviewer route under `src/app` would enter the public application boundary, inherit analytics behavior, and be classified as deploy-required.

Decision:

`Stage 1 must not add a Next route, React application component, middleware, public asset, or global layout change.`

### Existing Agent Builder Boundary

The repository already provides:

- pure deterministic modules under `src/agent-builder/`;
- a local CLI at `scripts/agent-builder/index.ts`;
- strict Zod schemas and validation patterns;
- synthetic fixtures under `fixtures/`;
- deterministic tests under `__tests__/agent-builder/`;
- dependency-injection seams in CLI tests.

The existing architecture remains local, non-authoritative, human-reviewed, and without public routes or production tools.

### CI And Deployment Boundary

The main GitHub Actions workflow runs on pushes to `main`, not on pull requests.

It classifies the following as non-deploy paths:

- `docs/**`;
- `src/agent-builder/**`;
- `scripts/agent-builder/**`;
- `__tests__/agent-builder/**`;
- `fixtures/**`;
- `evals/**`;
- `agent_specs/**`;
- `registry/**`.

Changes confined to those paths still run lint, typecheck, build, and unit tests on the main-branch push, while deployment is expected to be skipped.

Consequences:

- the future PR is a review surface, not a source of this workflow's remote CI evidence;
- pre-merge evidence must be local automated validation plus manual QA and diff review;
- remote CI evidence is observed after the approved merge to `main`;
- if the main workflow fails or requests deployment, stop and repair or revert under human direction.

## Stage 1 Architecture Decision

### Selected Surface

The selected proposal is:

`A loopback-only native HTML reviewer surface served by the existing Agent Builder CLI.`

Proposed command:

```sh
pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

The command:

- validates one approved repository fixture;
- binds only to `127.0.0.1`;
- prints only the local URL and non-approval reminder;
- does not open a browser;
- serves one self-contained HTML document;
- makes no model, tool, source, or external-service call;
- creates no shared URL;
- writes no file or record;
- stops when the local process terminates.

### Native HTML And DOM Decision

Stage 1 intentionally uses native semantic HTML and DOM APIs rather than React.

Rationale:

- React hydration outside the Next application would require an additional bundling or application boundary;
- a Next route would enter production routing, analytics, and deployment scope;
- a new standalone bundler would require package and configuration changes;
- native controls provide a small, testable browser surface for keyboard, focus, screen-reader, responsive, and state validation;
- this does not select the architecture for any future shared or production UI.

The browser initializer must be authored as a TypeScript-exported, self-contained function. The renderer may embed its transpiled function body in the nonce-protected document. It must not depend on unembedded closures or untyped handwritten script duplication.

## Exact Proposed File Scope

### New Source Files

1. `src/agent-builder/first-slice-reviewer/schema.ts`
   - strict Zod fixture, classification, and reviewer-input schemas;
   - safe synthetic identifier rules;
   - no file, network, runtime, model, tool, UI, or persistence imports.

2. `src/agent-builder/first-slice-reviewer/validation.ts`
   - deterministic fixture and reviewer-input validation;
   - governance-boundary checks;
   - safe field-path error summaries that exclude rejected values.

3. `src/agent-builder/first-slice-reviewer/evidence.ts`
   - pure plain-text evidence-preview builder;
   - approved planning fields only;
   - safe derived repo path;
   - no clipboard, file, Drive, Linear, GitHub, or other write.

4. `src/agent-builder/first-slice-reviewer/surface.ts`
   - semantic HTML renderer;
   - nonce-protected inline style and browser initializer;
   - browser-memory-only task state;
   - safe escaping and DOM text insertion;
   - no external asset, network, storage, clipboard, analytics, or telemetry API.

5. `src/agent-builder/first-slice-reviewer/server.ts`
   - Node built-in HTTP server;
   - fixed loopback binding;
   - fixture path and size confinement;
   - GET/HEAD-only behavior;
   - safe blocked and error documents;
   - no request logging or retained review state.

### Modified Source File

6. `scripts/agent-builder/index.ts`
   - adds only `reviewer local` parsing and dispatch;
   - supports required `--fixture` and optional `--port`;
   - exposes no host flag;
   - initializes no runtime env, model, prompt, provider, source, write, or browser-open behavior;
   - injects the server starter for deterministic CLI tests.

### New Fixture Directory

`fixtures/agent-builder/first-slice-reviewer/`

Exact fixtures:

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

All content must be invented. No real or redacted Cloud City data is allowed.

### New Test Files

7. `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
   - exact 12-case eval matrix;
   - strict schema and governance failures;
   - safe errors without rejected values.

8. `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
   - semantic structure;
   - browser state transitions;
   - keyboard and focus behavior;
   - error association;
   - preview, revision, completion, hold, reset, and reload behavior;
   - status announcements;
   - no persistence, network, clipboard, or automatic writes.

9. `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
   - loopback binding;
   - path, symlink, extension, and size confinement;
   - host and method validation;
   - security headers and CSP nonce;
   - safe blocked/error output;
   - no retained server state.

10. `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`
    - exact CLI grammar;
    - default and explicit port behavior;
    - invalid port and flag rejection;
    - dependency injection;
    - no runtime-env or model initialization;
    - safe startup output.

### Documentation Update In The Later Implementation

11. `docs/agent-builder/architecture.md`
    - document the bounded loopback-only surface;
    - preserve no-public-route, no-shared-access, no-persistence, and no-authority boundaries;
    - state that this is not the production UI architecture.

### Prohibited Files

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
- existing runtime, model, prompt, provider, auth, analytics, persistence, source, or integration modules.

A need to modify any prohibited file stops the implementation loop.

## Exact Fixture Contract

### Allowed Fields

A valid fixture contains only:

```text
fixture_id
planning_reference
workflow_title
context_category
planning_purpose
reviewer_role
allowed_references
forbidden_uses
permitted_decisions
evidence_guidance
stop_condition
non_approval_reminder
```

Required rules:

- `fixture_id`: `^SFR-[A-Z0-9]+(?:-[A-Z0-9]+)*$`;
- `planning_reference`: non-empty synthetic planning label without URL syntax;
- `workflow_title`: invented, non-empty, maximum 120 characters;
- `context_category`: exact literal `synthetic`;
- `planning_purpose`: invented, non-empty, maximum 500 characters;
- `reviewer_role`: exact literal `human reviewer`;
- `allowed_references`: 1–12 non-empty labels, each maximum 120 characters;
- `forbidden_uses`: 1–12 non-empty labels, each maximum 160 characters;
- `permitted_decisions`: exact unique tuple containing all three governed classifications;
- `evidence_guidance`: exact literal `repo-first human placement`;
- `stop_condition`: non-empty, maximum 500 characters;
- `non_approval_reminder`: exact governed reminder.

Governed classifications:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

Required reminder:

`Planning classification only; no implementation, release, operational approval, external action, or authority to act.`

The strict schema rejects unknown fields.

The fixture must not contain URL-like values, source locations, real/redacted-data claims, personal or operational identifiers, retrieval instructions, persistence/logging/history fields, approval fields, external communication instructions, autonomous-action instructions, or evidence fields beyond the contract.

### Eval Oracle Separation

The expected classification for a synthetic eval case belongs only in the executable test matrix.

It must not be included in the fixture rendered to the reviewer. The local surface shows permitted choices, not the test oracle.

### Fixture Path And Size Confinement

The loader must:

1. resolve the approved directory with `realpath`;
2. resolve the requested file with `realpath`;
3. require the resolved file to remain beneath the approved directory;
4. reject symlink or traversal escape;
5. require `.synthetic.json`;
6. require a regular file no larger than 64 KiB;
7. read it once before serving;
8. never watch or automatically reload it.

## Executable Fixture And Eval Matrix

Expected validation results:

- fixtures 1, 2, 3, and 12: valid;
- fixtures 4 through 11: blocked by a named schema or governance check.

Test-only expected reviewer outcomes:

- fixture 1: `later bounded L2 candidate`;
- fixture 2: `first implicated CLO-52 lane dependency card`;
- fixture 3: `hold / clarify`;
- fixture 12: reset/reload state-clearing verification.

The exact matrix lives in `first-slice-reviewer-schema.test.ts`. Each case names the expected result and failing check.

No eval result implies source truth, implementation approval, release, production readiness, operational approval, or permission to act.

## Reviewer Input And Evidence Contract

### Allowed Temporary Input

Only:

- one governed classification;
- one rationale or hold reason;
- one explicit boundary acknowledgement.

The rationale/hold reason must be trimmed, non-empty, and at most 1,000 characters.

It exists only in browser memory. It is never sent to the server, logged, stored, analyzed, or written.

### Evidence Preview Fields

Only:

- fixture ID;
- synthetic planning reference;
- selected planning classification;
- rationale or hold reason;
- boundary acknowledgement;
- derived suggested repo path;
- non-approval reminder.

Derived path:

`docs/agent-builder/review-evidence/<fixture_id>.md`

Because `fixture_id` is restricted to the safe pattern, it cannot introduce traversal or separators.

Stage 1 provides selectable plain text only. It includes no copy button or Clipboard API.

## Temporary-State Contract

State exists only in the loaded document's JavaScript memory.

Prohibited APIs:

- localStorage;
- sessionStorage;
- IndexedDB;
- Cache API;
- cookies;
- service workers;
- History state;
- Clipboard API;
- fetch, XHR, WebSocket, EventSource, or beacon.

Required clearing behavior:

- reset confirmation clears all input;
- reload returns to initial state;
- tab close clears all input;
- process termination disables the surface;
- the server holds no review session, token, classification, rationale, acknowledgement, preview, or history.

## Rendering And Injection Safety

The implementation must:

- serialize embedded fixture JSON with `<`, `>`, `&`, U+2028, and U+2029 safely escaped;
- escape all server-rendered text;
- use `textContent`, form values, and explicit DOM property assignment for fixture and reviewer text;
- never place fixture or reviewer text into `innerHTML`, `outerHTML`, `insertAdjacentHTML`, or executable code;
- never interpolate fixture or reviewer values into CSS, URLs, attributes with navigation meaning, or the CSP;
- render validation failures using field paths and safe messages only, never rejected values;
- render unexpected errors without stack traces, filesystem paths, or fixture contents.

Tests must include markup/script injection strings and prove they remain inert text.

## Surface And Interaction Contract

The document includes:

- unique document title;
- one `main` landmark and primary heading;
- visible posture/reminder before controls;
- fixture identity and bounded context;
- `fieldset` and `legend` for classifications;
- persistent rationale/hold label;
- unchecked acknowledgement checkbox;
- error summary and associated field errors;
- selectable evidence preview;
- completion-for-manual-transfer language;
- return and reset controls;
- no external asset or telemetry.

### Required States

- ready;
- decision in progress;
- rationale required;
- evidence preview ready;
- completed for manual transfer;
- hold / clarify;
- blocked fixture;
- safe technical error;
- reset confirmation.

### Required State Changes

- ready → decision;
- decision → validation error or preview;
- preview → revision;
- preview → completion;
- mutable state → reset confirmation;
- reset cancel → previous state;
- reset confirm → initial state;
- invalid fixture → blocked document.

Disallowed outcomes include automatic save/write, implementation approval, release approval, operational approval, external communication, or autonomous action.

### Keyboard, Focus, And Announcements

The implementation must:

- support the complete flow with keyboard alone;
- use native radio, textarea, checkbox, and button semantics;
- provide visible unobscured focus and no trap;
- use no drag-only control;
- focus the error summary or first invalid field after failed progression;
- focus the preview heading after preview creation;
- restore focus when returning to edit;
- focus the reset confirmation when opened and restore focus on cancel;
- focus the initial heading after reset;
- focus the completion heading after completion;
- expose concise `role="alert"` errors;
- expose meaningful preview, reset, hold, and completion updates through an appropriately scoped `role="status"` or `aria-live` region;
- avoid announcing the full packet repeatedly.

### Language

Use `planning classification`, `evidence preview`, `complete for manual transfer`, and `hold / clarify`.

Do not use `approved`, `submitted`, `saved`, `published`, or `released` for reviewer outcomes.

## Local Server Contract

### Binding And Requests

The server must:

- bind only to `127.0.0.1`;
- expose no host option;
- default to port 4317;
- accept explicit ports 1024–65535;
- accept port 0 only by direct test injection;
- accept only `127.0.0.1:<port>` or `localhost:<port>` Host values;
- serve the document only at `/`;
- support GET and HEAD;
- return 404 for other paths;
- return 405 for other methods;
- serve no files or directories;
- make no outbound request;
- log no request or review content.

### Required Headers

- `Cache-Control: no-store, max-age=0`;
- `Pragma: no-cache`;
- `Content-Type: text/html; charset=utf-8`;
- `Referrer-Policy: no-referrer`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Cross-Origin-Resource-Policy: same-origin`;
- `Cross-Origin-Opener-Policy: same-origin`;
- nonce-based Content Security Policy;
- explicit Permissions Policy disabling unused capabilities.

Minimum CSP:

```text
default-src 'none';
script-src 'nonce-<per-response-nonce>';
style-src 'nonce-<per-response-nonce>';
img-src 'none';
font-src 'none';
connect-src 'none';
form-action 'none';
frame-ancestors 'none';
base-uri 'none';
object-src 'none';
```

Minimum Permissions Policy disables:

```text
accelerometer, autoplay, camera, display-capture, encrypted-media,
fullscreen, geolocation, gyroscope, magnetometer, microphone, payment,
picture-in-picture, publickey-credentials-get, screen-wake-lock, usb
```

The initializer prevents native form submission. If JavaScript fails, CSP blocks form submission and the server rejects POST.

### No Server-Side Review Input

The page makes no POST or client network request.

Classification, rationale, acknowledgement, and preview never reach the server. Server tests must prove only document GET/HEAD requests occur.

## Authentication And Access

No authentication change is required or approved because this exact surface:

- binds only to local loopback;
- creates no shared URL;
- is launched manually by a named participant;
- does not touch existing auth;
- is not deployed.

Any remote tunnel, shared binding, preview URL, deployed route, auth intersection, or non-local participant need stops the proposal.

## Logging And Analytics

Allowed output:

- startup loopback URL;
- planning-only reminder;
- safe process errors without fixture/reviewer values.

Prohibited:

- request logs;
- analytics or page views;
- fixture, classification, rationale, acknowledgement, or preview logs;
- tracing, monitoring, or reviewer history.

## TDD Order

A later authorized implementation follows:

1. fixtures and failing schema/eval tests;
2. strict schemas and validation;
3. failing evidence tests and pure formatter;
4. failing surface semantics/state/focus/security tests;
5. renderer and self-contained initializer;
6. failing server confinement/header tests;
7. loopback server;
8. failing CLI tests;
9. CLI extension;
10. architecture documentation;
11. targeted validation, review, manual QA, then broad validation.

Maximum autonomous repair budget: three bounded passes.

## Automated Validation Plan

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

- exact files only;
- no package/config/app/auth/analytics/runtime/source/model/tool/persistence/logging/workflow change;
- all 12 eval cases match expectations;
- injected text remains inert;
- review input never reaches the server;
- no persistence/network/clipboard API is used;
- global coverage thresholds pass without reduction.

## Manual Visual And Accessibility QA

Launch from the authorized implementation worktree only:

```sh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

Review `http://127.0.0.1:4317`.

Required passes:

1. Keyboard-only completion for all three classifications.
2. Error focus and preservation of valid input.
3. Preview, edit, completion, reset-cancel, and reset-confirm behavior.
4. Reload clears all temporary state.
5. Selectable preview without Clipboard API.
6. VoiceOver with Safari on macOS.
7. Chrome accessibility-tree inspection.
8. Viewports 320×568, 768×1024, and 1440×900.
9. Zoom/reflow through 400 percent without lost actions or ordinary-content horizontal scrolling.
10. Text-spacing override.
11. Forced-colors/high-contrast emulation.
12. No animation, timeout, refresh, external request, analytics, or retained state.
13. Safe blocked document for an invalid fixture without rejected values.
14. Injection fixture text remains inert.
15. Process termination immediately disables the surface.

Automated tests do not substitute for manual visual, focus, responsive, or screen-reader evidence.

## Delivery And Review Plan

Only after CLO-83 grants exact implementation authorization:

1. Verify `/main` preflight and authorized baseline.
2. Create an explicitly approved sibling worktree.
3. Use `mw/<implementation-issue>-first-slice-local-reviewer`.
4. Restrict changes to the exact approved files.
5. Follow the TDD order and three-pass repair budget.
6. Run targeted then broad local validation.
7. Perform and record manual QA.
8. Commit and push only when authorized.
9. Open a draft PR for diff review and evidence review.
10. Do not claim PR CI from the current main-push-only workflow.
11. Require Founder approval before merge.
12. Merge only under the separately approved strategy.
13. Observe the resulting main push workflow by run ID and job conclusion.
14. Verify build, tests, and deploy-scope classification succeed.
15. Verify deploy reason is `non_runtime_changes_only` and Deploy is skipped.
16. If main CI fails or deployment is requested/performed, stop and repair or revert under human approval.

Implementation authorization is not merge authorization. Merge is not release or operational approval.

## Disable, Removal, And Revert

### Immediate Disable

- terminate the CLI process;
- confirm the loopback URL no longer responds;
- close the browser tab;
- no retained review data requires cleanup.

### Removal Scope

Remove only:

- `src/agent-builder/first-slice-reviewer/**`;
- the four reviewer test files;
- `fixtures/agent-builder/first-slice-reviewer/**`;
- the `reviewer local` CLI branch;
- the corresponding architecture section.

Rerun the full validation plan.

### Git Revert

If merged, use a reviewed revert of the implementation commit or merge commit, rerun validation, observe main CI, and verify deployment remains skipped.

No database, migration, remote environment, or user-data rollback exists.

## Stop Conditions

Stop and report if implementation requires or reveals:

- dependency, package, lockfile, config, or workflow changes;
- any file outside the exact approved list;
- Next route/component/middleware/public/global-layout work;
- shared URL, tunnel, non-loopback host, preview exposure, or deployment;
- authentication or authorization changes;
- source reads beyond the one approved fixture;
- real/redacted data;
- model, prompt, provider, tool, or runtime integration;
- persistence, cookie, browser storage, session map, logging, analytics, tracing, or record behavior;
- reviewer input reaching the server;
- Clipboard API or automatic transfer;
- deploy-required CI classification;
- unsupported validation assumptions;
- coverage reduction or governance-test weakening;
- inability to meet the WCAG 2.2 AA acceptance plan;
- unclear authorization, merge authority, or scope.

## Acceptance For The Later Implementation

### Before Merge

The implementation may be recommended for Founder merge review only when:

- exact files only changed;
- all automated local validation passes;
- all 12 eval cases pass as expected;
- all three reviewer outcomes work;
- invalid/ambiguous cases hold or block safely;
- preview contains approved fields only;
- reload/reset/close/process termination clear state;
- no reviewer input reaches the server;
- no external request, persistence, logging, analytics, or automatic write occurs;
- manual keyboard, focus, VoiceOver, responsive, zoom/reflow, text-spacing, forced-colors, and injection evidence passes;
- PR diff and evidence review are complete.

### After Approved Merge

The implementation is not remotely validated until:

- the main push workflow is observed by run ID;
- build and unit-test jobs succeed;
- deploy-scope classification succeeds;
- deployment is skipped for non-runtime-only paths;
- any failure is repaired or reverted under human direction.

PASS means pass for human review only. It does not authorize shared access, deployment, release, production readiness, operational use, external communication, or authority to act.

## CLO-82 Decisions

1. Stage 1 does not use the production Next application.
2. Stage 1 uses a native HTML, loopback-only local surface served by the Agent Builder CLI.
3. No dependency, package, auth, public route, analytics, deployment, or persistence change is required.
4. Browser state is memory-only and never sent to the server.
5. Fixture identifiers and paths are strictly constrained.
6. The eval oracle is test-only and not displayed to reviewers.
7. Rendering, CSP, headers, inert text, and safe-error behavior are explicit.
8. The current workflow provides remote evidence only after a main-branch push, not on PRs.
9. Exact files, tests, QA, delivery, removal, and revert paths are defined.
10. Implementation remains unapproved pending CLO-83.

## Recommended Next Branch

`CLO-83 — Founder decision on first-slice Stage 1 local implementation authorization`

CLO-83 should adopt, narrow, reject, or hold this exact contract; name the baseline and file scope; record acceptance, validation, non-approvals, and stop conditions; and decide whether a later implementation issue may create a worktree, branch, code, tests, and PR.

CLO-83 must remain distinct from merge, deployment, release, production-readiness, and operational approval.

## Acceptance Criteria For CLO-82

CLO-82 passes for human review when:

- repository evidence and workflow limitations are explicit;
- the selected surface avoids production routing, analytics, and deployment;
- native HTML/DOM is an explicit bounded Stage 1 choice;
- exact proposed and prohibited files are named;
- fixture, eval-oracle, state, evidence, injection-safety, server, header, and CLI contracts are exact;
- automated commands are repository-supported;
- manual visual/accessibility evidence is exact;
- PR review and post-merge remote CI are not conflated;
- removal and revert are atomic;
- stop conditions are explicit;
- no implementation authorization is implied.

## Explicit Non-Approvals

This artifact does not approve implementation, executable tests, fixtures, a local server, native DOM behavior, CLI behavior, worktrees, branches, commits, pushes, PRs, routes, components, package changes, authentication changes, source reads, model/tool/runtime behavior, persistence, logging, analytics, shared access, deployment, merge, release, rollback execution, production readiness, external communication, autonomous action, or authority to act.

## Suggested Validation For This Docs-Only Artifact

```sh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-local-implementation-contract-validation-plan.v0.1.md
git diff --check
```

# Agent Builder First-Slice Local Implementation Contract And Validation Plan v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Read-only repository inspection completed for CLO-82.
- Baseline: `04bdfa3 docs(agent-builder): clarify first slice delivery prerequisites`.

This record does not approve implementation, executable tests, fixtures, CLI behavior, a local server, worktrees, branches, commits, pushes, pull requests, routes, components, package changes, authentication changes, shared access, deployment, merge, release, production readiness, external communication, autonomous action, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, chooses one governed planning classification or hold / clarify, and prepares repo-first planning evidence for manual human placement.`

Current result:

`Not ready for implementation.`

More precise result:

`Exact Stage 1 local implementation contract prepared for a separate Founder authorization decision.`

## Purpose

This record resolves the bounded-but-unselected planning items from CLO-81 by defining an exact, reversible Stage 1 proposal.

It specifies:

- the local surface and exposure boundary;
- exact proposed and prohibited files;
- synthetic fixture and eval contracts;
- browser-memory-only state and evidence preview;
- security and injection controls;
- automated and manual validation;
- worktree, PR, merge, and post-merge gates;
- disable, removal, and revert behavior;
- stop conditions and non-approvals.

CLO-83 must separately approve, narrow, reject, or hold this contract before implementation begins.

## Verified Repository Facts

### Root Tooling

The repository uses one root `package.json` with:

- pnpm 11.9.0;
- Node 24.14.1;
- Next.js 16.2.4;
- React 19.2.x;
- strict TypeScript 5.9.x;
- Zod 4.4.x;
- Jest 30 with Next Jest and jsdom;
- Testing Library and user-event;
- Cypress installed for E2E;
- root scripts for Agent Builder, lint, typecheck, build, run-in-band tests, and coverage.

No dependency, package, lockfile, test-config, or build-config change is required.

### Production Application Boundary

The production App Router is under `src/app/`.

Its root layout applies public navigation, public footer, global application styling, and Google Analytics.

A reviewer route under `src/app` would enter production routing, inherit analytics, and be classified as deploy-required.

Decision:

`Stage 1 does not add a Next route, React app component, middleware, public asset, or global layout change.`

### Existing Agent Builder Boundary

The repository already provides:

- deterministic modules under `src/agent-builder/`;
- a local CLI at `scripts/agent-builder/index.ts`;
- strict Zod validation patterns;
- synthetic fixtures;
- deterministic Agent Builder tests;
- CLI dependency-injection seams.

The existing architecture remains local, non-authoritative, human-reviewed, and without public routes or production tools.

### CI And Deployment Boundary

The current GitHub Actions workflow runs on pushes to `main`, not on pull requests.

It classifies these paths as non-deploy:

- `docs/**`;
- `src/agent-builder/**`;
- `scripts/agent-builder/**`;
- `__tests__/agent-builder/**`;
- `fixtures/**`;
- `evals/**`;
- `agent_specs/**`;
- `registry/**`.

Therefore:

- the future PR is for diff and evidence review, not this workflow's remote CI;
- pre-merge evidence is local automated validation plus manual QA;
- remote CI is observed only after the approved merge to `main`;
- deployment must remain skipped;
- a deploy-required classification, deployment, or main-CI failure is a stop condition.

## Architecture Decision

### Selected Stage 1 Surface

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
- prints only the loopback URL and non-approval reminder;
- does not open a browser;
- serves one self-contained HTML document;
- makes no model, source, tool, or external-service call;
- creates no shared URL;
- writes no file or record;
- stops when the process terminates.

### Native HTML And DOM Choice

Stage 1 intentionally uses native semantic HTML and DOM APIs rather than React.

Reasons:

- React outside the Next app would require a new bundling boundary;
- a Next route would enter production routing, analytics, and deployment scope;
- a standalone bundler would require package/config changes;
- native controls provide a small surface for keyboard, focus, screen-reader, responsive, and state validation;
- this does not choose the architecture of a future shared or production UI.

The browser initializer must be an exported, self-contained TypeScript function whose transpiled function body is embedded with a nonce. It must not depend on missing closures or duplicate untyped script logic.

## Exact Proposed Files

### New Source Files

1. `src/agent-builder/first-slice-reviewer/schema.ts`
   - strict fixture, classification, and input schemas;
   - safe identifiers and bounded strings;
   - no file/network/runtime/model/tool/persistence imports.

2. `src/agent-builder/first-slice-reviewer/validation.ts`
   - deterministic fixture and reviewer-input checks;
   - governance checks;
   - safe field-path errors without rejected values.

3. `src/agent-builder/first-slice-reviewer/evidence.ts`
   - pure plain-text preview builder;
   - approved fields only;
   - safe derived repo path;
   - no write or Clipboard API.

4. `src/agent-builder/first-slice-reviewer/surface.ts`
   - semantic HTML renderer;
   - nonce-protected inline style and initializer;
   - browser-memory-only state;
   - safe escaping and DOM insertion;
   - no external asset, request, storage, clipboard, analytics, or telemetry API.

5. `src/agent-builder/first-slice-reviewer/server.ts`
   - Node built-in HTTP server;
   - loopback binding;
   - fixture path/size confinement;
   - GET/HEAD-only behavior;
   - safe blocked/error documents;
   - no request logs or retained review state.

### Modified Source File

6. `scripts/agent-builder/index.ts`
   - add only `reviewer local` parsing and dispatch;
   - required `--fixture`, optional `--port`;
   - no host flag, browser-open, runtime env, model, prompt, source, tool, or write behavior;
   - injected server starter for tests.

### New Fixtures

Directory:

`fixtures/agent-builder/first-slice-reviewer/`

Files:

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

All content is invented. Real or redacted Cloud City data is prohibited.

### New Test Files

7. `__tests__/agent-builder/first-slice-reviewer-schema.test.ts`
8. `__tests__/agent-builder/first-slice-reviewer-surface.test.ts`
9. `__tests__/agent-builder/first-slice-reviewer-server.test.ts`
10. `__tests__/agent-builder/first-slice-reviewer-cli.test.ts`

Together they cover the fixture/eval matrix, schemas, inert rendering, state/focus, bfcache/reset behavior, server confinement/headers, and CLI grammar/injection.

### Documentation Update In The Later Implementation

11. `docs/agent-builder/architecture.md`
   - describe the bounded loopback surface;
   - preserve no-public-route, no-shared-access, no-persistence, and no-authority boundaries;
   - state that this is not the production UI architecture.

### Prohibited Files

The implementation must not modify:

- `package.json` or `pnpm-lock.yaml`;
- Next, TypeScript, Jest, Cypress, or workflow configuration;
- `src/app/**`, `src/components/**`, `src/contexts/**`, `src/hooks/**`, or `public/**`;
- API, auth, analytics, persistence, source, integration, runtime, model, prompt, provider, or tool modules.

A need to modify any prohibited file stops the implementation loop.

## Fixture Contract

### Allowed Fields

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

Rules:

- `fixture_id`: `^SFR-[A-Z0-9]+(?:-[A-Z0-9]+)*$`;
- `planning_reference`: non-empty synthetic label without URL syntax;
- `workflow_title`: invented, 1–120 characters;
- `context_category`: exact `synthetic`;
- `planning_purpose`: invented, 1–500 characters;
- `reviewer_role`: exact `human reviewer`;
- `allowed_references`: 1–12 labels, each ≤120 characters;
- `forbidden_uses`: 1–12 labels, each ≤160 characters;
- `permitted_decisions`: exact unique set of all three governed classifications;
- `evidence_guidance`: exact `repo-first human placement`;
- `stop_condition`: 1–500 characters;
- `non_approval_reminder`: exact governed reminder.

Classifications:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

Reminder:

`Planning classification only; no implementation, release, operational approval, external action, or authority to act.`

The object is strict. It rejects unknown fields, URL-like values, source locations, real/redacted claims, identifiers, retrieval instructions, persistence/logging/history fields, approval claims, external communication, autonomous action, and extra evidence fields.

### Eval Oracle Separation

The expected answer belongs only in the executable test matrix. It is not rendered to the reviewer.

Expected fixture validation:

- fixtures 1, 2, 3, and 12: valid;
- fixtures 4–11: blocked by named schema/governance checks.

Test-only expected reviewer outcomes:

- fixture 1: `later bounded L2 candidate`;
- fixture 2: `first implicated CLO-52 lane dependency card`;
- fixture 3: `hold / clarify`;
- fixture 12: reset/reload/leave restoration checks.

No eval result implies source truth, implementation approval, release, production readiness, operational approval, or permission to act.

### Path And Size Confinement

The loader must:

1. `realpath` the approved directory and requested file;
2. require the resolved file beneath the approved directory;
3. reject traversal and symlink escape;
4. require a regular `.synthetic.json` file;
5. require size ≤64 KiB;
6. read once before serving;
7. never watch or reload automatically.

Path, symlink, extension, type, or size violations fail startup and serve nothing.

Schema/governance-invalid content inside the approved directory may start only a safe blocked document that displays field paths/messages, never rejected values.

## Reviewer Input And Evidence

Allowed temporary input:

- one governed classification;
- one rationale or hold reason;
- one explicit boundary acknowledgement.

The reason is trimmed, non-empty, and ≤1,000 characters.

It exists only in browser memory and is never sent, logged, stored, analyzed, or written.

Evidence preview fields:

- fixture ID;
- synthetic planning reference;
- classification;
- rationale/hold reason;
- boundary acknowledgement;
- derived repo path;
- non-approval reminder.

Derived path:

`docs/agent-builder/review-evidence/<fixture_id>.md`

The safe fixture-ID pattern prevents traversal. Stage 1 provides selectable text only—no copy button or Clipboard API.

## Temporary-State And Lifecycle Contract

Prohibited APIs:

- localStorage and sessionStorage;
- IndexedDB and Cache API;
- cookies and service workers;
- History API state;
- Clipboard API;
- fetch, XHR, WebSocket, EventSource, and beacon.

Required behavior:

- form and input autocomplete restoration is disabled where supported;
- initialization explicitly resets all form controls and internal state;
- reset confirmation clears input and preview;
- reload starts from initial state;
- `pagehide` clears form and internal state;
- `pageshow` with `event.persisted === true` resets state to defeat bfcache restoration;
- navigate-away then Back returns to initial state, not a prior review;
- tab close clears process-local browser state;
- process termination disables the surface;
- the server holds no session, token, classification, rationale, acknowledgement, preview, or history.

Automated and manual tests must cover reload and bfcache/back restoration.

## Rendering And Injection Safety

The implementation must:

- safely serialize embedded JSON, escaping `<`, `>`, `&`, U+2028, and U+2029;
- escape server-rendered text;
- use `textContent`, form values, and explicit DOM properties for fixture/reviewer text;
- never place fixture/reviewer text into `innerHTML`, `outerHTML`, `insertAdjacentHTML`, executable code, CSS, navigation URLs, or CSP values;
- show validation field paths and safe messages only;
- hide rejected values, stack traces, filesystem paths, and fixture contents from blocked/error output.

Tests include markup/script-injection strings and prove they remain inert.

## Surface And Accessibility Contract

The document includes:

- unique title;
- one `main` landmark and primary heading;
- visible planning-only reminder before controls;
- bounded fixture context;
- `fieldset`/`legend` classification group;
- persistent rationale/hold label;
- unchecked acknowledgement;
- associated errors and error summary;
- selectable evidence preview;
- completion-for-manual-transfer language;
- edit and reset controls;
- no external assets or telemetry.

States:

- ready;
- decision in progress;
- rationale required;
- evidence preview ready;
- complete for manual transfer;
- hold / clarify;
- blocked fixture;
- safe technical error;
- reset confirmation.

Required focus/announcement behavior:

- keyboard-only completion with native controls;
- visible unobscured focus, no trap, no drag-only interaction;
- error summary or first invalid field focused after failure;
- preview heading focused after preview creation;
- edit focus restored on return;
- reset confirmation focused and prior focus restored on cancel;
- initial heading focused after reset/bfcache restoration;
- completion heading focused after completion;
- concise `role="alert"` errors;
- concise `role="status"`/`aria-live` updates for preview, reset, hold, and completion;
- no repeated announcement of the full fixture.

Use `planning classification`, `evidence preview`, `complete for manual transfer`, and `hold / clarify`.

Do not describe the outcome as approved, submitted, saved, published, or released.

## Local Server Contract

### Binding And Requests

- bind only `127.0.0.1`;
- no host option;
- default port 4317;
- explicit ports 1024–65535;
- port 0 only through tests;
- accept Host only as `127.0.0.1:<port>` or `localhost:<port>`;
- serve only `/`;
- GET and HEAD only;
- 404 other paths;
- 405 other methods;
- no files/directories, outbound requests, or request logs;
- port/bind failures return safe messages without system details.

### Required Headers

- `Cache-Control: no-store, max-age=0`;
- `Pragma: no-cache`;
- `Content-Type: text/html; charset=utf-8`;
- `Referrer-Policy: no-referrer`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Cross-Origin-Resource-Policy: same-origin`;
- `Cross-Origin-Opener-Policy: same-origin`;
- nonce-based CSP;
- Permissions Policy disabling unnecessary capabilities.

Minimum CSP:

```text
default-src 'none';
script-src 'nonce-<nonce>';
style-src 'nonce-<nonce>';
img-src 'none';
font-src 'none';
connect-src 'none';
form-action 'none';
frame-ancestors 'none';
base-uri 'none';
object-src 'none';
```

Permissions Policy disables accelerometer, autoplay, camera, display-capture, encrypted-media, fullscreen, geolocation, gyroscope, magnetometer, microphone, payment, picture-in-picture, publickey credentials, screen wake lock, and USB.

The initializer prevents native submission. If JavaScript fails, CSP blocks form submission and POST is rejected.

### No Server-Side Review Input

The page makes no POST or client request.

Classification, rationale, acknowledgement, and preview never reach the server. Tests prove only GET/HEAD document requests occur.

## Authentication, Logging, And Access

No auth change is required or approved because the surface is manually launched, loopback-only, non-shared, non-deployed, and does not touch existing auth.

Stop on any tunnel, shared binding, preview URL, deployed route, auth intersection, or non-local participant need.

Allowed output:

- loopback URL;
- planning-only reminder;
- safe process errors without fixture/reviewer values.

Prohibited:

- request logs;
- page-view analytics;
- fixture or review-input logs;
- tracing, monitoring, or reviewer history.

## TDD Order

1. Add fixtures and failing schema/eval tests.
2. Implement strict schemas and validation.
3. Add failing evidence tests and formatter.
4. Add failing surface/state/focus/lifecycle/injection tests.
5. Implement renderer and self-contained initializer.
6. Add failing server confinement/header tests.
7. Implement loopback server.
8. Add failing CLI tests.
9. Extend CLI.
10. Update architecture documentation.
11. Run targeted validation, review, manual QA, then broad validation.

Maximum autonomous repair budget: three bounded passes.

## Automated Validation

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

Validation confirms exact files only, all 12 eval cases, inert injection text, reload/bfcache clearing, no server review input, no storage/network/clipboard, and unchanged coverage thresholds.

## Manual Visual And Accessibility QA

Launch only from the authorized worktree:

```sh
corepack pnpm agent-builder reviewer local \
  --fixture fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json \
  --port 4317
```

Review `http://127.0.0.1:4317` for:

1. keyboard-only completion for all classifications;
2. error focus and valid-input preservation;
3. preview, edit, completion, reset-cancel, and reset-confirm;
4. reload clears state;
5. navigate away then Back clears bfcache-restored state;
6. selectable preview without Clipboard API;
7. VoiceOver with Safari on macOS;
8. Chrome accessibility-tree inspection;
9. 320×568, 768×1024, and 1440×900 viewports;
10. 400-percent zoom/reflow;
11. text-spacing override;
12. forced-colors/high-contrast emulation;
13. no animation, timeout, refresh, request, analytics, or retained state;
14. safe blocked page without rejected values;
15. inert injection strings;
16. process termination disables the surface.

Automated tests do not substitute for manual visual, focus, responsive, or screen-reader evidence.

## Delivery And Review

Only after CLO-83 authorization:

1. verify `/main` preflight and baseline;
2. create an explicitly approved sibling worktree;
3. use `mw/<implementation-issue>-first-slice-local-reviewer`;
4. restrict changes to exact files;
5. follow TDD and three-pass repair budget;
6. run targeted then broad local validation;
7. record manual QA;
8. commit/push only when authorized;
9. open a draft PR for diff/evidence review;
10. do not claim PR CI from the current main-push-only workflow;
11. require Founder merge approval;
12. merge only under the approved strategy;
13. observe the main push workflow by run ID;
14. verify build, tests, and deploy-scope succeed;
15. verify `non_runtime_changes_only` and Deploy skipped;
16. stop and repair/revert if main CI fails or deployment occurs.

Implementation authorization is not merge authorization. Merge is not release or operational approval.

## Disable, Removal, And Revert

Immediate disable:

- terminate the CLI;
- verify the loopback URL is unavailable;
- close the tab;
- no retained review data needs cleanup.

Removal scope:

- `src/agent-builder/first-slice-reviewer/**`;
- four reviewer test files;
- reviewer fixture directory;
- `reviewer local` CLI branch;
- corresponding architecture section.

If merged, revert the exact implementation commit/merge through reviewed change, rerun validation, observe main CI, and verify deployment remains skipped.

No database, migration, remote environment, or user-data rollback exists.

## Stop Conditions

Stop if implementation needs or reveals:

- dependency/package/lockfile/config/workflow change;
- file outside the approved list;
- Next route/component/middleware/public/global-layout work;
- shared URL, tunnel, non-loopback host, preview exposure, or deployment;
- auth change;
- source read beyond the approved fixture;
- real/redacted data;
- model, prompt, provider, tool, or runtime integration;
- persistence, cookies, storage, session map, logging, analytics, tracing, or records;
- reviewer input reaching the server;
- Clipboard API or automatic transfer;
- deploy-required classification;
- unsupported validation assumptions;
- coverage reduction or governance-test weakening;
- failure to meet WCAG 2.2 AA acceptance;
- unclear authorization, merge authority, or scope.

## Later Implementation Acceptance

### Before Merge Review

Required:

- exact files only;
- all local automated validation passes;
- all 12 eval cases pass;
- all reviewer outcomes work;
- invalid/ambiguous cases hold or block safely;
- approved preview fields only;
- reset/reload/leave/back/process termination clear state;
- no review input reaches server;
- no request, persistence, logging, analytics, or automatic write;
- manual keyboard, focus, VoiceOver, responsive, zoom/reflow, text-spacing, forced-colors, bfcache, and injection evidence passes;
- PR diff/evidence review complete.

### After Approved Merge

Remote validation requires:

- observed main workflow run ID;
- successful build and unit-test jobs;
- successful deploy classification;
- skipped deployment for non-runtime-only paths;
- human-approved repair or revert for any failure.

PASS means pass for human review only. It does not authorize shared access, deployment, release, production readiness, operational use, external communication, or authority to act.

## CLO-82 Decisions

1. Stage 1 does not use the production Next application.
2. Stage 1 uses a native HTML loopback surface served by the Agent Builder CLI.
3. No dependency, auth, route, analytics, deployment, or persistence change is needed.
4. Browser state is memory-only, cleared across reset/reload/leave/bfcache, and never sent to the server.
5. Fixture identifiers, paths, size, and eval-oracle separation are explicit.
6. Rendering, CSP, headers, inert text, and safe errors are explicit.
7. Current remote CI is post-merge main-push evidence, not PR evidence.
8. Exact files, tests, QA, delivery, removal, and revert paths are defined.
9. Implementation remains unapproved pending CLO-83.

## Recommended Next Branch

`CLO-83 — Founder decision on first-slice Stage 1 local implementation authorization`

CLO-83 should adopt, narrow, reject, or hold this exact contract; name baseline/file scope; record acceptance, validation, non-approvals, and stop conditions; and decide whether a later implementation issue may create a worktree, branch, code, tests, and PR.

CLO-83 remains distinct from merge, deployment, release, production readiness, and operational approval.

## Acceptance Criteria For CLO-82

CLO-82 passes for human review when:

- repository facts and workflow limits are explicit;
- the selected surface avoids production routing, analytics, and deployment;
- native HTML/DOM is an explicit bounded choice;
- exact proposed/prohibited files are named;
- fixture, eval, state, lifecycle, injection, server, security, and CLI contracts are exact;
- validation and manual QA are executable;
- PR review and post-merge CI are distinct;
- removal/revert are atomic;
- stop conditions are explicit;
- no implementation authorization is implied.

## Explicit Non-Approvals

This artifact does not approve implementation, tests, fixtures, local server or DOM behavior, CLI behavior, worktrees, branches, commits, pushes, PRs, routes, components, package/auth/source/model/tool/runtime changes, persistence, logging, analytics, shared access, deployment, merge, release, rollback execution, production readiness, external communication, autonomous action, or authority to act.

## Suggested Validation For This Docs-Only Artifact

```sh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-local-implementation-contract-validation-plan.v0.1.md
git diff --check
```

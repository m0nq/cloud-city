# E2E Tooling Direction: Playwright Preferred For Future Repo-Level E2E

Decision record status: direction accepted for future implementation. Implementation remains separately proposed and is not approved by this record.

Date: 2026-06-27
Tracking issue: CLO-6 - Quality Gate Stabilization Before Agent Builder Implementation Readiness
Repo baseline: `bf82205` (`fix: use public path for footer logo image`)

This is a docs-only repo-level decision record. It records future E2E tooling direction for this repository. It does not approve installing `@playwright/test`, adding Playwright configuration, adding tests, changing CI, removing Cypress, changing dependencies, or implementing E2E coverage in this package.

Current City Center / Agent Builder posture remains:

- synthetic-only
- pre-runtime
- below L2
- human-reviewed
- approval-gated
- non-operational
- not production-ready
- not operationally approved

Humans approve. Humans execute.

## Context

This repository is a Next.js site with an existing Cypress dependency, an interactive `e2e:cypress` script, a `cypress.config.ts` file, and a `tsconfig.cypress.json` file.

The current GitHub Actions workflow runs lint, typecheck, build, unit tests, and deployed production route smoke checks. It does not run E2E tests and does not run Playwright.

Cloud City needs a repo-level tooling direction for future preview smoke checks, route-level E2E coverage, and later accessibility-check support without changing the current package, dependency graph, CI workflow, or approval posture.

This record is repo-wide tooling guidance only. It is not an Agent Builder runtime, model-call, source-boundary, release, rollback, or operational approval artifact.

## Decision

Playwright is the preferred future direction for:

- preview smoke checks
- route-level E2E coverage
- cross-browser confidence
- later accessibility checks

Cypress is present in this package today, but it is not active in the current repo quality-gate workflow. It should remain dormant until a separate approved cleanup or migration decision says otherwise.

This record further decides:

- do not install Playwright in this package
- do not remove Cypress in this package
- do not add E2E tests in this package
- do not modify CI in this package
- actual Playwright implementation requires a separate approved package and separate explicit approval

## Rationale

Playwright is the stronger future direction for this repo because it supports small preview smoke checks, route-level browser coverage, and multi-browser confidence from one test surface without requiring this package to change today.

For an early E2E slice, preview smoke and a narrow set of route-level checks are more maintainable and reversible than broad visual-regression programs or large end-to-end suites.

Playwright also leaves a cleaner path for later automated accessibility checks in browser-driven flows. Those checks can improve regression detection, but they do not replace manual QA or human interpretation for design quality, accessibility sufficiency, or production-readiness decisions.

Keeping Cypress dormant avoids unnecessary dependency churn, migration noise, and CI reliability risk before there is a separately approved package owner, scope, rollout plan, and rollback path.

## Alternatives Considered

### Playwright

Accepted as the preferred future direction because it best matches the desired future use cases: preview smoke checks first, route-level E2E second, cross-browser confidence, and later accessibility-check support.

### Cypress

Not selected as the preferred future direction. Cypress is already present, but the current repo evidence shows dormant posture rather than an active E2E quality gate. Keeping it in place is lower risk than removing it now, but using it as the forward direction would create migration ambiguity without solving the separate package and approval questions.

### No E2E Tooling Yet

Not selected as the decision outcome because CLO-6 needs a future direction recorded now. The current implementation state still remains no active E2E program in this package.

## Consequences

Future repo-level E2E discussions should assume Playwright as the default candidate unless a later decision record explicitly changes direction.

Any implementation work must begin in a separate approved package with narrow, reversible scope.

The current package, current dependency graph, current CI workflow, current source code, current test suites, and current deployment behavior remain unchanged.

Cypress remains present but dormant until a separate approved cleanup or migration decision is made.

## Non-Goals And Explicit Non-Approvals

This record does not approve:

- installing `@playwright/test`
- adding Playwright config, fixtures, helpers, scripts, reporters, or browsers in this package
- adding preview smoke checks, route-level E2E tests, or accessibility checks in this package
- removing Cypress or editing Cypress config in this package
- changing `package.json`, `pnpm-lock.yaml`, or any dependency set
- changing GitHub Actions, Vercel deployment flow, or other CI behavior
- changing source code, routes, runtime behavior, tests, assets, or Agent Builder runtime/model/source-boundary artifacts
- changing Linear, Drive, release posture, rollback posture, operational posture, production-readiness posture, or UI-3/UI-4/UI-5 status

## Future Implementation Gate

Any future Playwright implementation must be separately approved before work begins.

That future approval should require:

- a separate approved package target
- explicit approval for any dependency installation or mutation
- explicit approval for any CI changes
- a small, reversible first scope
- a defined rollback path
- a named human review gate before any broader rollout

The first approved scope should likely start with preview smoke checks and a narrow route-level surface, not broad visual regression and not a large E2E coverage program.

## Validation Expectations For A Future Playwright Package

If a future package is approved, its first validation slice should:

- focus on preview smoke checks for a small number of critical routes
- keep route coverage narrow and high-signal
- define the browser matrix explicitly
- keep failure output actionable for CI triage
- define flake controls, timeout budgets, and artifact capture before CI enforcement
- treat automated accessibility checks as supplemental signals, not as final accessibility authority
- preserve manual QA and human review for design interpretation, accessibility sufficiency, and production-readiness interpretation

## Governance Boundary Statement

Drive handoff/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

PASS means pass for human review only.

This record does not change the current synthetic-only, pre-runtime, below-L2, human-reviewed, approval-gated, non-operational, not-production-ready, and not-operationally-approved posture.

Humans approve. Humans execute.

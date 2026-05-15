# Code Review Checklist

Use this checklist for Codex reviews, human reviews, and self-review before committing or pushing changes.

## Review Priorities

1. Correctness and user-visible behavior.
2. Regression risk across routes, build modes, and data-loading paths.
3. Security, privacy, secrets handling, and data integrity.
4. Missing or weak tests for changed behavior.
5. Maintainability, simplicity, and fit with existing architecture.
6. Framework, language, accessibility, and performance conventions.

## Required Checks

- Confirm the change matches the user request and does not expand scope unnecessarily.
- Inspect the existing implementation before judging or editing it.
- Identify affected routes, components, utilities, API clients, scripts, fixtures, and workflows.
- Check whether `.env*`, credentials, tokens, private guest data, or provider-specific secrets could be exposed.
- Verify migrations or schema changes are represented as version-controlled artifacts rather than direct database mutations.
- Verify user-facing UI changes for accessibility, responsive layout, loading/error states, and readable copy.
- Verify external integrations are guarded by explicit approval when they can mutate production state or send outbound communications.

## Test Expectations

- For components and UI state: add or update Testing Library/Jest coverage where behavior changed.
- For parsing, fixture, event readiness, or agent-builder logic: add focused fixtures or schema assertions.
- For shared utilities and API adapters: cover success, failure, and boundary cases.
- For framework config, dependency, routing, or build behavior: run `pnpm lint`, `pnpm test:runInBand`, and `pnpm build` when feasible.
- For browser-visible changes: use a local dev server and browser checks when practical.

## Review Output Format

Lead with findings, ordered by severity.

For each finding include:

- Severity: `critical`, `high`, `medium`, or `low`.
- Location: file and line when possible.
- Evidence: the observed code, test, command, or behavior.
- Risk: the concrete failure mode.
- Recommendation: the smallest practical fix or follow-up.

Then include:

- Open questions.
- Test gaps or commands not run.
- Concise summary and residual risk.

## Approval Boundaries

- Local read-only inspection is allowed.
- Local code edits require the user to be asking for implementation, not only review or planning.
- Posting PR comments, approving/requesting changes, merging, pushing, destructive git operations, production data changes, payment actions, secret access, and outbound communications require explicit human approval.

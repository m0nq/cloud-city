# Agent Builder Implementation Plan

## Milestone 1: Local Foundation

- Store the Venue / Vendor Research Assistant v0.1b spec as YAML.
- Validate required schema fields with Zod.
- Enforce draft-only governance with deterministic checks.
- Provide local CLI commands for validation and fixture-based evals.
- Add Jest coverage for schema and policy regressions.

## Milestone 2: Broader Spec Coverage

- Add schemas for fixtures, eval suites, and registry entries.
- Validate local registry entries against existing spec files before adding any write-capable registration command.
- Add additional deterministic eval fixtures for common venue/vendor scenarios.
- Add a registry command after the spec format stabilizes.

## Milestone 3: SDK Spike

- Compare candidate SDKs using the same spec, fixture, and scoring rubric.
- Keep all SDK spike work isolated from production paths.
- Do not introduce production integrations until the schema, governance, and eval layer has proven stable.

## Acceptance Criteria

- `pnpm agent-builder validate agent_specs/venue_vendor_research.v0.1b.yaml` exits 0.
- `pnpm agent-builder test agent_specs/venue_vendor_research.v0.1b.yaml --fixture fixtures/venue_candidates/warehouse416.public.yaml` exits 0.
- `pnpm agent-builder registry validate registry/agent-registry.yaml` exits 0.
- Jest tests cover valid spec, required field failure, unsafe execution flags, restricted data, missing approval gates, and missing eval tests.

# Agent Builder Architecture

The Agent Builder foundation is a local, SDK-neutral validation layer for business-process agent specs. It does not run autonomous agents, expose public routes, connect to production tools, or require secrets.

## Current Shape

- `agent_specs/` stores canonical YAML specs.
- `src/agent-builder/` contains schema validation, deterministic policy checks, and fixture-based eval helpers.
- `scripts/agent-builder/` provides a pnpm-runnable CLI.
- `fixtures/` stores minimal redacted test inputs.
- `registry/agent-registry.yaml` stores local read-only registry metadata for validated specs.
- `docs/agent-builder/` records governance, implementation, and SDK spike planning.

## Boundaries

- Draft-only outputs.
- Human approval before external outreach, recommendations to act, rates, terms, contracts, payments, public messaging, or source-of-truth updates.
- No agent SDKs, MCP, OAuth, Gmail, Trello writes, payment tooling, contract tooling, or production integrations in this milestone.
- No autonomous tool execution.

## Validation Flow

1. Load YAML from disk.
2. Validate the spec shape with Zod.
3. Run deterministic policy checks.
4. Print a readable pass/fail report.
5. Exit nonzero on schema or policy failure.

## Registry Validation Flow

Run registry validation from the app root:

```sh
pnpm agent-builder registry validate registry/agent-registry.yaml
```

The command validates the registry schema, confirms each referenced spec file exists, validates each referenced spec, and cross-checks registry metadata against the spec for name, slug, version, business domain, owner hat, status, and evaluation status. It is read-only and does not register, write, or update entries.

## Eval Flow

The first eval command is deterministic. It loads a validated spec and a minimal fixture, then checks whether the spec contains required output fields, venue fit criteria, and evaluation tests relevant to that fixture.

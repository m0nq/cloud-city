# Agent Builder Architecture

The Agent Builder foundation is a local, governance-aware validation and runtime layer for business-process agent specs. It does not run autonomous agents, expose public routes, connect to production tools, or execute tools.

## Current Shape

- `agent_specs/` stores canonical YAML specs.
- `src/agent-builder/` contains schema validation, deterministic policy checks, and fixture-based eval helpers.
- `scripts/agent-builder/` provides a pnpm-runnable CLI.
- `fixtures/` stores minimal redacted test inputs.
- `evals/` stores deterministic eval-suite definitions that bind specs to fixtures and required checks.
- `registry/agent-registry.yaml` stores local read-only registry metadata for validated specs.
- `docs/agent-builder/` records governance, implementation, and SDK spike planning.
- `src/agent-builder/runtime/` contains the first local runtime prototype for structured draft packets.

## Runtime Status

The first implementation runtime is Vercel AI SDK, merged in `4d67104 feat(agent-builder): add Vercel runtime prototype`.

Run the current CLI-only runtime from the app root:

```sh
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

The runtime remains:

- CLI-only
- draft-only
- no tools
- no public routes
- no UI
- no production integrations
- stdout-only by default
- validated with the shared Venue / Vendor review packet Zod schema

The completed SDK spike found:

- Vercel AI SDK passed Warehouse416, Oakstop, and dry-bar vendor comparisons and is the first structured-output runtime.
- OpenAI Agents SDK JS also passed and remains a future governed-runtime candidate.
- Local models are deferred to a feasibility spike.
- Mastra and LangGraph JS are deferred unless orchestration needs grow.

## Boundaries

- Draft-only outputs.
- Human approval before external outreach, recommendations to act, rates, terms, contracts, payments, public messaging, or source-of-truth updates.
- No MCP, OAuth, Gmail, Trello writes, payment tooling, contract tooling, compliance tooling, or production integrations in this milestone.
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

## Eval Harness Flow

Run fixture and suite validation from the app root:

```sh
pnpm agent-builder fixture validate fixtures/venue_candidates/warehouse416.public.yaml
pnpm agent-builder eval validate evals/venue_vendor_research.eval-suite.yaml
pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml
```

The eval runner remains local-only and deterministic. It validates the suite, validates referenced fixtures, validates the referenced spec, then checks whether the spec contains each case's required output fields, venue criteria, approval gates, and eval tests. It does not call a model or execute tools.

## SDK Lifecycle & Re-Evaluation Policy

Re-evaluate SDK, runtime, and model choices:

- before UI depends on runtime outputs
- before OAuth or Drive sync
- before MCP
- before tool execution
- before long-running approval workflows
- before any write access to Drive, Gmail, Trello, payment, contract, or compliance systems
- after eval failures, hallucination patterns, approval-boundary misses, or safety incidents
- after major SDK or API changes
- when cost, latency, or reliability becomes unacceptable
- when local or open-weight models pass Cloud City eval gates
- quarterly or at major Agent Builder version milestones

## Next Architecture Step

Before adding a UI, create a reusable runtime-output validation command. It should validate generated review packets independently from the model call so local files, stdout captures, and future UI outputs can pass through the same safety checks.

# Agent Builder Architecture

The Agent Builder foundation is a local, governance-aware validation and runtime layer for business-process agent specs. It does not run autonomous agents, expose public routes, connect to production tools, or execute tools.

## Current Shape

- `agent_specs/` stores canonical YAML specs.
- `src/agent-builder/` contains schema validation, deterministic policy checks, and fixture-based eval helpers.
- `scripts/agent-builder/` provides a pnpm-runnable CLI.
- `fixtures/` stores minimal redacted test inputs.
- `evals/` stores deterministic eval-suite definitions that bind specs to fixtures and required checks.
- `registry/agent-registry.yaml` stores local read-only registry metadata for validated, governed-baseline specs.
- `docs/agent-builder/` records governance, implementation, and SDK spike planning.
- `src/agent-builder/runtime/` contains the first local runtime prototype for structured draft packets.

## Registry Status

The local registry currently includes:

- Venue / Vendor Research Assistant v0.1b.
- Event Readiness Assistant v0.1.

Registry entries are local metadata only. They do not approve runtime behavior, tools, routes, integrations, Drive
writes, or operational use without human approval.

## Runtime Status

The only implementation runtime prototype is the Venue / Vendor Vercel AI SDK draft-packet command, merged in
`4d67104 feat(agent-builder): add Vercel runtime prototype`.

Run the current CLI-only runtime from the app root:

```sh
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

The CLI loads local runtime env from `.env.local` and `.env` if present, without overriding already-exported shell values. Use `pnpm --silent` when piping runtime JSON into validation.

That Venue / Vendor runtime remains:

- CLI-only
- draft-only
- no tools
- no public routes
- no UI
- no production integrations
- stdout-only by default
- validated with the shared Venue / Vendor review packet Zod schema

Event Readiness has no runtime generation or model-call approval. Its current governed baseline is local spec,
registry, seven-case pre-runtime fixture/eval validation, deterministic pre-runtime runtime-output validation, and the
L1.6 deterministic in-memory synthetic-only review-record lifecycle validation slice merged in
`d67f493 test(agent-builder): add review record lifecycle validation`.

The Event Readiness validator is local and non-authoritative. The `declaredSourcePacketReferenceSummary` report field is
report-facing and declared-metadata-only. It is derived from already-parsed runtime-output metadata and existing
validation checks. It does not add new validation authority and does not prove source file existence, source truth,
source completeness, source freshness, semantic support, human approval, operational approval, or permission to act.

Stronger source-packet binding remains unimplemented and unapproved. Event Readiness remains pre-runtime and below L2:
no runtime generation, model calls, prompts, routes, tools, integrations, Drive sync, Drive writes, UI, real/redacted
data use, source reads, source file existence checks, YAML source-packet parsing, content hashing, semantic source
verification, operational approval, or autonomous action is approved.

The L1.6 review-record lifecycle validator is a separate deterministic validation surface for synthetic human-review
lifecycle records. It checks structure and boundary-safety posture only. It has no CLI/operator wiring in this slice and
does not validate event readiness, source truth, source file existence, source freshness, source completeness, semantic
source support, source-packet binding, real/redacted data safety, runtime/model behavior, prompt quality, Drive
authority, operational correctness, or whether a human should act. `PASS` remains pass for human review only,
`PARTIAL` remains human-review-needed, `FAIL` blocks promotion to usable human-review draft status, and
`approvedForOperationalUse` remains false unless separately approved.

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

The eval commands are deterministic and local-only. Venue / Vendor evals bind a validated spec to fixture-required
fields, venue criteria, approval gates, and eval tests. Event Readiness evals validate the fixture/eval design for
readiness labels, canonical source-label vocabulary, required source-material labels, domain-check sections, seeded
issues, approval gates, eval IDs, and prohibited output behavior.

## Eval Harness Flow

Run fixture and suite validation from the app root:

```sh
pnpm agent-builder fixture validate fixtures/venue_candidates/warehouse416.public.yaml
pnpm agent-builder eval validate evals/venue_vendor_research.eval-suite.yaml
pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/blocked_escalation.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/source_conflict.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/blocked_staffing_compliance.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/dry_bar_out_of_scope.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/insufficient_source_information.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml
pnpm agent-builder fixture validate fixtures/event_readiness/on_track_with_review_needed.synthetic.yaml
pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml
pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
```

The eval runner remains local-only and deterministic. Venue / Vendor suites validate the referenced spec before checking
fixture/case requirements. Event Readiness suites require an explicit `spec_path` and are explicitly bound to
`agent_specs/event_readiness.v0.1.yaml`. Deterministic `PASS` remains contract conformance for human review only, not
production readiness or operational approval. Neither path calls a model or executes tools.

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

Keep Event Readiness paused at the current deterministic pre-runtime validation and L1.6 review-record lifecycle
milestones before considering any expansion. Future planning may clarify CLI report presentation, lifecycle review
record operator ergonomics, or source-packet binding boundaries, but runtime expansion, model calls, read-only Drive
sync, UI, tools, routes, integrations, real/redacted data, source reads, file existence checks, content hashing,
semantic source verification, source-packet binding, operational approval, and autonomous action remain approval-gated
and out of scope for the current Event Readiness baseline.

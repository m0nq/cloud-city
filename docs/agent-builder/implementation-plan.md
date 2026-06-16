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

- Add deterministic fixture and eval-suite validation before any SDK spike.
- Run local eval suites that report `PASS`, `PARTIAL`, or `FAIL` without model calls.
- Compare candidate SDKs using the same spec, fixture, and scoring rubric.
- Keep all SDK spike work isolated from production paths.
- Do not introduce production integrations until the schema, governance, and eval layer has proven stable.

Status: complete.

- Vercel AI SDK passed Warehouse416, Oakstop, and dry-bar vendor comparisons.
- OpenAI Agents SDK JS also passed and remains a future governed-runtime candidate.
- Mastra and LangGraph JS remain deferred unless orchestration needs grow.

## Milestone 4: First Runtime Prototype

- Select Vercel AI SDK as the first structured-output implementation runtime.
- Add a local CLI-only command for draft Venue / Vendor review packets.
- Validate generated output with the shared Venue / Vendor review packet Zod schema.
- Keep the runtime no-tools, no-routes, no-UI, no-integrations, and stdout-only by default.

Status: complete in `4d67104 feat(agent-builder): add Vercel runtime prototype`.

Current command:

```sh
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

Use `pnpm --silent` when piping runtime JSON into another command:

```sh
pnpm --silent agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml \
  | pnpm --silent agent-builder runtime validate-output --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

## Milestone 5: Runtime Output Validation Command

- Add a reusable command that validates saved or piped runtime review packets.
- Check the shared Zod schema, required v0.1b fields, canonical approval gate IDs, structured confirmed fact sources, unknowns-over-assumptions discipline, cooperation notes, and no-implied-commitment language.
- Use this command before any UI depends on runtime outputs.

Status: complete for the Venue / Vendor runtime path.

This should still be local-only and should not add routes, tools, OAuth, MCP, Drive, Gmail, Trello, payment, contract, or compliance integrations.

## Milestone 6: Event Readiness Governed Baseline

- Add the Event Readiness Assistant spec.
- Add Event Readiness fixture validation and deterministic eval-suite support.
- Make spec policy validation domain-aware so Event Readiness does not depend on Venue / Vendor-era gate or eval IDs.
- Register Event Readiness in the local read-only registry without approving runtime generation, tools, routes,
  integrations, Drive writes, or operational use.

Status: complete.

Subsequent status after `be3b9e7 test(agent-builder): add declared source packet reference summary`:

- Event Readiness now has deterministic pre-runtime runtime-output validation for synthetic draft packets.
- `declaredSourcePacketReferenceSummary` is report-facing, non-authoritative, and declared-metadata-only.
- It is derived from already-parsed runtime-output metadata and existing validation checks.
- It does not add new validation authority and does not prove source file existence, source truth, completeness,
  freshness, semantic support, human approval, operational approval, or permission to act.
- Stronger source-packet binding remains unimplemented and unapproved.
- Event Readiness remains pre-runtime and below L2.

Current-state note after `db8c749` and `ad0dda3`:

- [Agent Builder current-state reconciliation v0.1](./agent-builder-current-state-reconciliation.v0.1.md) is the
  current repo-facing status anchor for this docs-only slice.
- `db8c749` remains the current governance baseline for roadmap/L1.9 reconciliation.
- `ad0dda3` clarifies deterministic Event Readiness report semantics only by separating contract conformance from
  bounded review classification in the local synthetic eval/reporting layer.
- Neither milestone approves Event Readiness runtime generation, model calls, Drive behavior, UI behavior, real/redacted
  data use, operational approval, or autonomous action.

Historical next safe governance area at the time of this plan:

- Reconcile repo and Drive governance records around the completed report-clarity milestone.
- Mature local registry/export/log drafting conventions for governed artifacts only after a separate approval gate.
- Keep runtime generation, model calls, prompts, read-only Drive sync, UI, tools, routes, integrations, real/redacted
  data, source reads, file existence checks, content hashing, semantic source verification, operational approval, and
  autonomous action out of scope until separately approved.

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

## Future Provider Strategy

- Vercel AI SDK: first structured-output runtime.
- OpenAI Agents SDK JS: future governed-runtime candidate.
- Local models: deferred feasibility spike only.
- Mastra and LangGraph JS: deferred unless orchestration needs grow.

## Acceptance Criteria

- `pnpm agent-builder validate agent_specs/venue_vendor_research.v0.1b.yaml` exits 0.
- `pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml` exits 0.
- `pnpm agent-builder test agent_specs/venue_vendor_research.v0.1b.yaml --fixture fixtures/venue_candidates/warehouse416.public.yaml` exits 0.
- `pnpm agent-builder registry validate registry/agent-registry.yaml` exits 0.
- `pnpm agent-builder fixture validate fixtures/venue_candidates/warehouse416.public.yaml` exits 0.
- `pnpm agent-builder fixture validate fixtures/event_readiness/blocked_escalation.synthetic.yaml` exits 0.
- `pnpm agent-builder eval validate evals/venue_vendor_research.eval-suite.yaml` exits 0.
- `pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml` exits 0.
- `pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml` exits 0.
- `pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml` exits 0.
- `pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml` produces a draft packet when required runtime env vars are available.
- Jest tests cover valid spec, required field failure, unsafe execution flags, restricted data, missing approval gates, and missing eval tests.

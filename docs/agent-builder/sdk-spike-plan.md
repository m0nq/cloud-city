# Agent Builder SDK Spike Plan

## Purpose

Compare Mastra, OpenAI Agents SDK JS, Vercel AI SDK, and LangGraph JS without installing them in the production app. The goal is to determine whether any SDK should be adopted after the schema, governance, and eval layer is stable.

## Candidate SDKs

- Mastra
- OpenAI Agents SDK JS
- Vercel AI SDK
- LangGraph JS

## Current Spike Round

Round 1 only installs and tests:

1. Vercel AI SDK
2. OpenAI Agents SDK JS

Mastra and LangGraph JS remain comparison notes and possible second-round candidates.

## Test Task

Use the Venue / Vendor Research Assistant v0.1b spec to produce a draft-only review packet for a venue fixture. The output must separate facts, assumptions, unknowns, risks, approval needs, and recommended next human action.

## Common Fixture

Use `fixtures/venue_candidates/warehouse416.public.yaml` as the common public fixture. Add an isolated redacted fixture only if a framework needs a second case for sensitive-data handling.

## Shared Expected Output Schema

Each SDK spike must produce output that validates against a local Zod schema with all required Venue / Vendor v0.1b fields:

- `candidate_name`
- `candidate_type`
- `review_date`
- `sources_used`
- `sensitivity_level`
- `existing_relationship_or_credit_context`
- `confirmed_facts`
- `assumptions`
- `unknowns_missing_information`
- `capacity_business_model_fit`
- `timeline_consistency_check`
- `ticketing_admissions_policy`
- `public_private_event_fit`
- `sound_cutoff_vs_event_end_time`
- `fit_notes`
- `risk_notes`
- `approval_needs`
- `cooperation_notes`
- `recommended_next_human_action`
- `human_review_required_before`

## Scoring Rubric

Score each candidate from 1 to 5 on:

- TypeScript / pnpm fit
- Next.js compatibility
- structured output reliability
- human approval support
- guardrail / policy hook support
- tool-control model
- eval / tracing support
- MCP support
- developer experience
- implementation complexity
- vendor lock-in risk
- compatibility with Cloud City's draft-only approval-gated model

## Install Footprint Comparison

- Vercel AI SDK: install in `spikes/agent-builder-sdk/vercel-ai/` only. Expected packages: `ai`, `@ai-sdk/openai`, plus local TypeScript runner dependencies.
- OpenAI Agents SDK JS: install in `spikes/agent-builder-sdk/openai-agents/` only. Expected packages: `@openai/agents`, plus local TypeScript runner dependencies.
- Mastra: do not install in Round 1. Metadata review shows `@mastra/core` brings broader agent/workflow/MCP-oriented surface, useful for a later platform comparison but too broad for the first runtime spike.
- LangGraph JS: do not install in Round 1. Keep as the explicit state/human-in-the-loop workflow benchmark for a later round.

## Implementation Sketches

### Vercel AI SDK

- Use `generateText` with structured output constrained by the shared Zod schema.
- Do not provide executable tools.
- Keep `stopWhen` at a single-step or no-tool flow for this draft-only task.
- Validate generated output with the local Zod schema.
- Feed the parsed output into the deterministic eval harness by checking required output fields and policy fields before any future qualitative scoring.

### OpenAI Agents SDK JS

- Use a single draft-only agent with structured output and no executable tools.
- Configure output validation through the shared Zod schema.
- Disable or avoid tool execution entirely for this first spike.
- Treat guardrails as a candidate mechanism for output policy checks.
- Feed the parsed output into the deterministic eval harness in the same shape as the Vercel spike.

### Mastra

- Defer installation.
- Later spike should test whether Mastra workflows and human-in-the-loop support improve governance without introducing too much platform surface.
- Special attention: MCP support exists and must remain disabled unless explicitly approved later.

### LangGraph JS

- Defer installation.
- Later spike should test explicit graph state, interrupts, and checkpointed human approval workflows.
- Special attention: stronger workflow control may justify added complexity only if the simpler SDKs cannot enforce Cloud City's approval model.

## Governance Fit Review

- All Round 1 spike code must stay under `spikes/agent-builder-sdk/`.
- No SDK code may mutate `agent_specs/`, `registry/`, `evals/`, or `fixtures/`.
- No public routes, OAuth, MCP clients/servers, Gmail, Trello, payments, contracts, or compliance integrations.
- No autonomous tool execution.
- Every generated result is a draft requiring human review.

## Implementation Boundaries

- Do not install SDKs in the main app during planning.
- Run spikes in isolated branches or disposable directories.
- Do not add production routes, OAuth, Gmail, Trello writes, payments, contract tools, or secrets.
- Do not allow autonomous external tool execution.
- Keep every output draft-only and human-approved.

## Risks / Lock-in Concerns

- Vercel AI SDK: strong Next.js and provider abstraction fit, but governance controls are mostly application-defined.
- OpenAI Agents SDK JS: strong guardrail/tracing fit, but higher OpenAI platform lock-in.
- Mastra: broad platform and MCP surface may increase governance scope too early.
- LangGraph JS: strong state and interrupt model, but higher implementation complexity.

## Decision Criteria

Prefer the option that preserves Cloud City's governance model with the least complexity. Structured output reliability, explicit approval gates, policy hooks, and low lock-in matter more than demo speed.

## Recommendation Format

For each SDK, report:

- setup footprint
- implementation sketch
- scoring table
- governance fit
- failure modes
- lock-in concerns
- recommendation: adopt, defer, or reject

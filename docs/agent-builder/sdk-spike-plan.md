# Agent Builder SDK Spike Plan

## Purpose

Compare Mastra, OpenAI Agents SDK JS, Vercel AI SDK, and LangGraph JS without installing them in the production app. The goal is to determine whether any SDK should be adopted after the schema, governance, and eval layer is stable.

## Test Task

Use the Venue / Vendor Research Assistant v0.1b spec to produce a draft-only review packet for a venue fixture. The output must separate facts, assumptions, unknowns, risks, approval needs, and recommended next human action.

## Common Fixture

Use `fixtures/venue_candidates/warehouse416.public.yaml` as the common public fixture. Add an isolated redacted fixture only if a framework needs a second case for sensitive-data handling.

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
- complexity
- vendor lock-in risk

## Implementation Boundaries

- Do not install SDKs in the main app during planning.
- Run spikes in isolated branches or disposable directories.
- Do not add production routes, OAuth, Gmail, Trello writes, payments, contract tools, or secrets.
- Do not allow autonomous external tool execution.
- Keep every output draft-only and human-approved.

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

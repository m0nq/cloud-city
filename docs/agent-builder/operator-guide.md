# Agent Builder Operator Guide

## Purpose

This guide explains how Cloud City operators should use the current Agent Builder safely. It is written for the Founder / Creative Director, Operations / Production Lead, Governance / Risk reviewer, and future developer/operator.

The Agent Builder is currently a local, CLI-driven system for designing, validating, testing, and reviewing draft business-process agent outputs. It is not an autonomous agent platform.

## Current Capability

The Agent Builder can:

- validate the Venue / Vendor Research Assistant spec
- validate the local agent registry
- run deterministic eval suites against approved fixtures
- generate a draft Venue / Vendor review packet with the Vercel AI SDK runtime
- validate saved or piped runtime output before a human relies on it
- enforce canonical approval gate IDs and structured confirmed fact sources
- flag missing fixture-required approval gates, schema failures, implied commitment language, prohibited action leakage, and weak unknowns-vs-assumptions discipline

Current status:

- Vercel runtime prototype merged
- runtime-output validator merged
- `main` at `48c357d feat(agent-builder): add runtime output validation`

## Current Limits

The Agent Builder is not allowed to:

- send outreach
- publish or post anything
- negotiate rates or terms
- commit Cloud City to any venue or vendor
- sign or accept contracts
- make payments
- submit permits, insurance, compliance, tax, or legal materials
- update source-of-truth records
- access Drive, Gmail, Trello, payment, contract, or compliance systems
- run tools on behalf of a model
- execute autonomous external actions

All generated packets are drafts. Humans approve. Humans execute.

## Primary Workflow

Run these from the app root.

1. Validate the spec:

```sh
pnpm agent-builder validate agent_specs/venue_vendor_research.v0.1b.yaml
```

2. Validate the registry:

```sh
pnpm agent-builder registry validate registry/agent-registry.yaml
```

3. Run the eval suite:

```sh
pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml
```

4. Generate a runtime packet:

```sh
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

5. Validate a saved runtime packet:

```sh
pnpm agent-builder runtime validate-output --output <path> --fixture <fixture>
```

Example:

```sh
pnpm agent-builder runtime validate-output \
  --output .tmp/agent-builder-runtime/warehouse416.public.json \
  --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

6. Or generate and validate through a pipe:

```sh
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml \
  | pnpm agent-builder runtime validate-output --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

7. Complete human review before any action.

## Interpreting Results

`PASS` means the local deterministic checks passed. It does not mean the packet is approved for action.

`PARTIAL` means the output is schema-valid enough to inspect, but one or more review flags need human attention. Treat this as not approved.

`FAIL` means the output should not be used as a basis for action. Fix the input, fixture, prompt, schema, or runtime behavior before relying on it.

The validator is a gate, not a substitute for human judgment.

## Creative Director Review

The Founder / Creative Director should review:

- brand fit and atmosphere
- guest experience implications
- whether outreach tone is respectful, exploratory, and non-pressuring
- whether the packet overstates readiness or desirability
- whether any recommendation conflicts with Cloud City's alcohol-free positioning
- whether public messaging, if mentioned, needs explicit approval

The Creative Director should not treat a generated packet as final venue/vendor selection.

## Operations Lead Review

The Operations / Production Lead should review:

- capacity and business-model fit
- access windows, load-in, event time, cleanup, load-out, and exit deadlines
- staffing, security, equipment, and setup/breakdown needs
- ticketing, admissions, public/private event constraints, and door-charge restrictions
- dry bar feasibility and outside vendor restrictions
- operational complexity and missing information
- whether the recommended next human action is practical and source-grounded

Operations should convert approved next steps into human-executed tasks only after review.

## Governance / Risk Review

The Governance / Risk reviewer should review:

- sensitivity level
- confirmed facts and their sources
- assumptions versus unknowns
- approval gate IDs
- human review requirements
- insurance, COI, permits, compliance, legal, tax, and contract boundaries
- prohibited action leakage
- implied commitment language
- whether source-of-truth updates are being suggested without approval

Governance should treat missing or unmapped approval gates as blocking.

## Approval Boundaries

Human approval is required before:

- external outreach
- rates or terms
- contracts
- payments
- public messaging
- source-of-truth updates
- recommendations to act
- walkthrough scheduling that implies commitment
- compliance, insurance, or permit issues

Canonical approval gate IDs used by runtime outputs:

- `external_outreach`
- `rates_or_terms`
- `contracts`
- `payments`
- `public_messaging`
- `source_of_truth_updates`
- `recommendations_to_act`
- `walkthrough_scheduling_that_implies_commitment`
- `compliance_insurance_permit_issues`

## Operating Rules

- Draft-only.
- Human approval required.
- No autonomous external action.
- No public posting.
- No payment, contract, or compliance execution.
- No source-of-truth writes.
- Use approved local fixtures and sources.
- Prefer unknowns over unsupported assumptions.
- Distinguish confirmed facts from assumptions.
- Include sources for confirmed facts.
- Stop when approval boundaries are unclear.

## Safe Next Actions

Safe examples:

- Draft a non-committal question list for human review.
- Prepare a walkthrough prep packet.
- Summarize missing information.
- Flag likely deal-breakers.
- Create Trello-ready text for a human to paste after review.
- Draft an AI log entry for human approval.
- Recommend that a human owner review a specific approval boundary.

Unsafe examples:

- Send the inquiry email.
- Tell a venue Cloud City wants to book.
- Accept quoted rates.
- Sign or approve terms.
- Submit COI, permit, or compliance forms.
- Update the canonical scouting matrix without approval.

## Common Failure Modes

Watch for:

- missing confirmed fact sources
- assumptions presented as facts
- too few unknowns when the fixture is sparse
- missing approval gate IDs
- unmapped fixture approval gates
- implied commitment language
- prohibited action language
- recommendations that outrun source support
- buried blockers
- stale, conflicting, or incomplete source information
- output that optimizes one domain while ignoring finance, safety, compliance, dry bar feasibility, brand, or guest experience

## Before Building Any New Agent

Before creating a new agent:

1. Write or update a local spec.
2. Define owner, accountable human owner, automation class, and implementation stage.
3. Define in-scope and out-of-scope actions.
4. Define approval gates with stable IDs where possible.
5. Define required output fields.
6. Create minimal redacted fixtures.
7. Add deterministic eval cases.
8. Validate the spec, registry, fixtures, and eval suite.
9. Run manual MVP tests.
10. Revise the spec before adding runtime behavior.

Do not add UI, integrations, tools, or write access until the schema and eval layer can catch unsafe output.

## Roadmap

Near-term:

- SDK decision-record template
- reusable decision records for provider/runtime changes
- generalized intake-to-spec flow
- additional redacted fixtures
- more business-domain agents

Later:

- internal UI after runtime-output validation is established
- approval workflow design
- governed runtime review for OpenAI Agents SDK JS
- local/open-weight model feasibility spike if those models pass Cloud City eval gates

Deferred unless explicitly approved:

- OAuth
- Drive sync
- MCP
- Gmail or Trello integration
- tool execution
- payment, contract, or compliance system access

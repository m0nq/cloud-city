# Agent Builder Operator Guide

## Purpose

This guide explains how Cloud City operators should use the current Agent Builder safely. It is written for the Founder / Creative Director, Operations / Production Lead, Governance / Risk reviewer, and future developer/operator.

The Agent Builder is currently a local, CLI-driven system for designing, validating, testing, and reviewing draft business-process agent outputs. It is not an autonomous agent platform.

## Current Capability

The Agent Builder can:

- validate the Venue / Vendor Research Assistant and Event Readiness Assistant specs
- validate the local agent registry
- run deterministic eval suites against approved Venue / Vendor and Event Readiness fixtures
- generate a draft Venue / Vendor review packet with the existing Vercel AI SDK runtime prototype
- validate saved or piped Venue / Vendor runtime output before a human relies on it
- validate synthetic Event Readiness review-record lifecycle examples through the direct deterministic L1.6 schema and
  validator artifacts, with no CLI/operator wiring yet
- enforce canonical approval gate IDs and structured confirmed fact sources
- flag missing fixture-required approval gates, schema failures, implied commitment language, prohibited action leakage, and weak unknowns-vs-assumptions discipline

Current status:

- Venue / Vendor spec, registry entry, fixture/eval suite, runtime prototype, and runtime-output validator merged
- Event Readiness spec, registry entry, seven-case pre-runtime fixture/eval ladder, deterministic pre-runtime
  runtime-output validation, explicit eval-to-spec binding against `agent_specs/event_readiness.v0.1.yaml`, L1.6
  synthetic review-record lifecycle validation, and domain-aware spec policy validation merged
- Vercel runtime prototype merged
- runtime-output validator merged
- Event Readiness has no runtime generation or model-call approval
- Event Readiness remains pre-runtime and below L2

Event Readiness report clarity:

- `declaredSourcePacketReferenceSummary` is report-facing, non-authoritative, and declared-metadata-only
- it is derived from already-parsed runtime-output metadata and existing validation checks
- it does not add new validation authority
- it does not prove source file existence, source truth, completeness, freshness, semantic support, human approval,
  operational approval, or permission to act
- stronger source-packet binding remains unimplemented and unapproved

Event Readiness L1.6 review-record lifecycle validation:

- exists as deterministic, in-memory, synthetic-only schema and validator artifacts
- validates structure and boundary-safety posture for synthetic human-review lifecycle records only
- has no CLI/operator wiring yet
- does not prove event readiness, source truth, source file existence, source freshness, source completeness, semantic
  source support, source-packet binding, runtime/model behavior, prompt quality, Drive authority, operational
  correctness, real/redacted data safety, operational approval, or whether a human should act
- preserves `PASS` as pass for human review only, `PARTIAL` as human-review-needed, and `FAIL` as blocking promotion to
  usable human-review draft status
- keeps `approvedForOperationalUse` false unless separately approved

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

Use the repo-pinned pnpm 11 baseline through Corepack for repo-facing commands.

Runtime generation requires local environment variables:

- `OPENAI_API_KEY`
- `CC_AGENT_BUILDER_MODEL`

The CLI loads `.env.local` and `.env` from the app root if present. Already-exported shell variables take precedence. Keep `.env`, `.env.local`, and `.tmp/` uncommitted.

1. Validate the spec:

```sh
corepack pnpm agent-builder validate agent_specs/venue_vendor_research.v0.1b.yaml
corepack pnpm agent-builder validate agent_specs/event_readiness.v0.1.yaml
```

2. Validate the registry:

```sh
corepack pnpm agent-builder registry validate registry/agent-registry.yaml
```

3. Validate the eval suites:

```sh
corepack pnpm agent-builder eval validate evals/venue_vendor_research.eval-suite.yaml
corepack pnpm agent-builder eval validate evals/event_readiness.eval-suite.yaml
```

4. Run the eval suites:

```sh
corepack pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml
corepack pnpm agent-builder eval run evals/event_readiness.eval-suite.yaml
```

5. For Event Readiness, use deterministic pre-runtime validation artifacts only.

Event Readiness has no approved runtime generation, model calls, prompts, tools, routes, integrations, Drive sync, UI,
source reads, file existence checks, content hashing, semantic source verification, real/redacted data use, operational
approval, or autonomous action. `PASS` means pass for human review only. `approvedForOperationalUse` remains false.
The L1.6 review-record lifecycle validator is available only as direct deterministic schema/validator/test artifacts in
this milestone; it is not an operator CLI command. The Event Readiness eval suite is explicitly bound to
`agent_specs/event_readiness.v0.1.yaml`; treat spec-path or spec-authority drift as blocking until human review resolves it.

6. For Venue / Vendor only, generate a runtime packet when local runtime env vars are configured:

```sh
corepack pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

7. For Venue / Vendor only, validate a saved runtime packet:

```sh
corepack pnpm agent-builder runtime validate-output --output <path> --fixture <fixture>
```

Example:

```sh
corepack pnpm agent-builder runtime validate-output \
  --output .tmp/agent-builder-runtime/warehouse416.public.json \
  --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

8. Or generate and validate a Venue / Vendor packet through a pipe:

```sh
corepack pnpm --silent agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml \
  | corepack pnpm --silent agent-builder runtime validate-output --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

9. Complete human review before any action.

## Interpreting Results

`PASS` means the local deterministic checks passed for human review only. It does not mean the packet is approved for
action.

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
- schedule commitments
- vendor/venue commitments
- accessibility/safety determinations
- budget-impacting commitments

Canonical Venue / Vendor approval gate IDs used by runtime outputs:

- `external_outreach`
- `rates_or_terms`
- `contracts`
- `payments`
- `public_messaging`
- `source_of_truth_updates`
- `recommendations_to_act`
- `walkthrough_scheduling_that_implies_commitment`
- `compliance_insurance_permit_issues`

Canonical Event Readiness approval gate IDs used by spec, fixture, and eval validation:

- `external_outreach`
- `schedule_commitments`
- `vendor_venue_commitments`
- `public_messaging`
- `payments_contracts`
- `source_of_truth_updates`
- `compliance_insurance_permit_issues`
- `accessibility_safety_determinations`
- `budget_impacting_commitment`

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

Use the [Agent Creation Lifecycle v0.1](./agent-creation-lifecycle.v0.1.md) and complete the
[Agent Intake Template v0.1](./templates/agent-intake.template.md) before creating a new agent spec.

Before creating a new agent:

1. Complete the intake template and lifecycle review.
2. Write or update a local spec.
3. Define owner, accountable human owner, automation class, and implementation stage.
4. Define in-scope and out-of-scope actions.
5. Define approval gates with stable IDs where possible.
6. Define required output fields.
7. Create minimal redacted fixtures.
8. Add deterministic eval cases.
9. Validate the spec, registry, fixtures, and eval suite.
10. Run manual MVP tests.
11. Revise the spec before adding runtime behavior.

Do not add UI, integrations, tools, or write access until the schema and eval layer can catch unsafe output.

## Roadmap

Near-term:

- registry/export/log drafting maturity for governed local artifacts
- additional Event Readiness and Venue / Vendor fixtures
- spec authoring ergonomics that preserve local-first, draft-only governance
- reusable decision records for provider/runtime changes before any runtime expansion

Later:

- internal UI after a separate UI planning and approval gate
- Event Readiness CLI report presentation after separate planning, without changing validation authority
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

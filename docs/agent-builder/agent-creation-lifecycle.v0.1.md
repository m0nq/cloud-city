# Agent Creation Lifecycle v0.1

## Purpose

Define the repeatable process Cloud City uses to move from a business-process need to a local, draft-only Agent Builder
candidate that can be validated, reviewed, and used safely by humans.

This lifecycle is the controlling artifact for new Agent Builder candidates. The companion intake template is subordinate
to this lifecycle.

## Scope

This lifecycle covers agent candidates for Cloud City business operations, including event production, venue and vendor
management, dry bar logistics, sponsorship and partnerships, marketing drafts, compliance preparation, finance review
support, customer communications, volunteer coordination, and post-event review.

This lifecycle does not approve autonomous actions, production integrations, external communications, or tool access.

## Non-Negotiable Operating Doctrine

AI prepares. Humans approve. Humans execute.

Every Agent Builder candidate must remain:

- local-first
- CLI-first
- draft-only
- human-reviewed
- approval-gated
- source-grounded
- no tools
- no routes
- no external integrations
- no autonomous external action

All generated packets are drafts. Completing an intake does not approve an agent.

A new agent is not approved until its spec, registry entry, fixtures/evals, runtime validation, and human review gates
pass. High-risk workflows may be documented, but they must not be scaffolded or implemented without additional approval.

Human approval is required before external communications, financial commitments, legal or compliance actions, public
brand statements, sponsor or vendor commitments, source-of-truth changes, and sensitive-data handling.

Runtime default remains the Vercel AI SDK structured-output runtime unless a future governed decision record changes
that. OpenAI Agents SDK JS remains a future governed-runtime candidate, not current adoption. OpenClaw remains watchlist
only. Mastra, LangGraph, local/open-weight model runtimes, tools, routes, and integrations remain out of scope for this
lifecycle version.

## Lifecycle Overview

Move in this order:

1. Business need
2. Process intake
3. Suitability screen
4. Risk classification
5. Boundary design
6. Source-grounding requirements
7. Draft-output schema
8. Fixture/eval design
9. YAML spec
10. Registry entry
11. Runtime selection checkpoint
12. Runtime validation
13. Human approval for local draft use
14. Re-evaluation triggers

Do not skip gates because a candidate seems simple.

## Phase 1: Business Process Candidate Identification

Start with a real Cloud City operating need, not a technology idea.

Good candidates usually have:

- repeated manual review or drafting work
- clear source materials
- known human owner
- low need for real-time action
- outputs that can be reviewed before use
- obvious approval boundaries

Avoid candidates that require the agent to act directly, make commitments, access private systems, or resolve legal,
financial, safety, or compliance questions without human judgment.

## Phase 2: Process Intake

Complete the Agent Intake Template before authoring a spec.

The intake must capture:

- process name and owner
- current manual workflow
- desired draft outputs
- source materials
- decisions the agent may support
- decisions the agent must not make
- approval points
- data sensitivity
- brand, financial, legal, compliance, and operational risks
- failure modes and escalation triggers

Completing the intake only creates a candidate record for review. It does not approve implementation, runtime use, tool
access, integration access, external communication, or operational deployment.

## Phase 3: Agent Suitability Screen

Screen the process before writing a YAML spec.

Proceed only when the candidate can satisfy all of these:

- The output can be a draft packet or draft text.
- A human can review the output before action.
- Source materials can be named and constrained.
- The agent does not need external tool execution.
- The agent does not need direct access to Gmail, Calendar, Drive, Trello, CRM, payment, contract, or compliance systems.
- The agent can refuse or escalate unclear boundaries.

Revise or defer when the workflow depends on live operational action, private-system writes, or unresolved governance.

Reject when the proposed agent would need to autonomously send, publish, negotiate, approve, pay, sign, submit, or update
records.

## Phase 4: Risk Classification

Classify risk before designing outputs.

Suggested tiers:

- Low: internal summarization or checklist drafting from approved non-sensitive sources.
- Medium: draft materials that could affect operations, partner relationships, public tone, or source-of-truth updates.
- High: legal, compliance, finance, safety, employment, sponsorship commitments, public statements, sensitive data, or
  external-party impact.

High-risk workflows may be documented for future review. They should not be scaffolded or implemented without explicit
additional approval.

## Phase 5: Boundary Design

Define what the candidate may do and must not do.

At minimum, each candidate needs:

- allowed actions
- prohibited actions
- human approval gates
- escalation triggers
- data handling limits
- non-goals

Required approval gates should cover external outreach, recommendations to act, rates or terms, contracts, payments,
public messaging, source-of-truth updates, sponsor or vendor commitments, and compliance/insurance/permit issues when
relevant.

Use the Venue / Vendor Research Assistant as the current reference pattern for explicit in-scope actions, out-of-scope
actions, approval gates, and source-grounded packet design.

## Phase 6: Source-Grounding Requirements

Every candidate must name the sources it may use and the hierarchy it should follow.

The candidate must:

- use approved source material first
- separate confirmed facts from assumptions
- state unknowns and missing information
- flag stale, incomplete, or conflicting information
- avoid treating public web information as verified unless source and date are clear
- use the least sensitive information that supports the task

If required sources do not exist, create source requirements and fixture ideas before writing the spec. Do not compensate
with broader model assumptions.

## Phase 7: Output Packet Design

Design the draft packet before writing prompts or runtime code.

Each output packet should include:

- candidate or process name
- review date
- sources used
- sensitivity level
- confirmed facts
- assumptions
- unknowns or missing information
- fit or decision-support notes
- risk notes
- approval gate IDs or approval needs
- recommended next human action, if appropriate
- human review required before any action

The packet must make draft status and approval boundaries visible. It must not imply that Cloud City has approved,
selected, committed to, published, paid, signed, submitted, or updated anything.

## Phase 8: Fixture Design

Create minimal local fixtures before runtime validation.

Fixtures should be:

- local files
- redacted where possible
- representative of real Cloud City work
- small enough to inspect manually
- explicit about required output fields and approval gates

Include at least one fixture for the happy path and one fixture that exercises missing information or risk escalation.

## Phase 9: Deterministic Eval Design

Define deterministic eval cases before relying on runtime output.

Each eval case should bind:

- one spec
- one fixture
- required output fields
- required domain criteria
- required approval gates
- required evaluation tests

Eval execution is a local gate. It does not call a model and does not approve operational action.

## Phase 10: YAML Spec Authoring

Author the YAML spec only after the intake, suitability screen, risk classification, boundaries, sources, output packet,
fixtures, and eval cases are clear.

The spec should include:

- identity and version
- business domain and owner
- operating mode
- scope and non-goals
- source hierarchy
- data sensitivity rules
- allowed actions
- prohibited actions
- approval gates
- interaction flow
- required output fields
- domain fit criteria
- ethical review requirements
- cooperation review requirements
- evaluation tests

The spec is a governed local artifact. It should not introduce runtime behavior, routes, tools, permissions, or external
integrations.

## Phase 11: Registry Update

Add a registry entry only after the spec is coherent enough to validate.

The registry entry must point to the spec and match key identity fields, including name, slug, version, business domain,
owner hat, status, and evaluation status.

Registry validation is local and read-only. A registry entry does not approve runtime use by itself.

## Phase 12: Runtime Selection Checkpoint

Default to the existing Vercel AI SDK structured-output runtime for approved runtime experiments.

Do not adopt OpenAI Agents SDK JS, Mastra, LangGraph, OpenClaw, local/open-weight runtimes, tools, routes, or integrations
without a future governed decision record and explicit approval.

Before a new runtime path is considered, confirm that:

- the spec validates
- the registry validates
- fixtures validate
- deterministic evals pass
- the output packet schema is clear
- the workflow remains CLI-only, local-only, draft-only, no-tools, no-routes, and no-integrations

## Phase 13: Runtime Validation

Runtime output must pass validation before a human relies on it.

Required checks include:

- structured output schema
- required fields
- canonical approval gates where available
- fixture-required approval gates
- source-grounding structure
- unknowns-over-assumptions discipline
- prohibited action leakage
- implied commitment language

`PASS` means deterministic checks passed. It does not mean the packet is approved for action. `PARTIAL` and `FAIL` are
not approved states.

## Phase 14: Human Review And Release For Local Draft Use

A human owner must review the candidate before local draft use.

Human review should confirm:

- the candidate solves a real business need
- sources are appropriate
- risk tier is accurate
- approval gates are visible and complete
- output packet is useful and reviewable
- failure modes are documented
- validation commands pass
- no runtime behavior exceeds approved boundaries

Only after this review may the candidate be used locally to prepare draft packets for further human review. Humans still
execute all external action.

## Phase 15: Re-Evaluation Triggers

Re-evaluate the candidate:

- before UI depends on runtime outputs
- before OAuth, Drive sync, MCP, tool execution, or any production integration
- before long-running approval workflows
- before any write access to Drive, Gmail, Trello, CRM, payment, contract, compliance, or source-of-truth systems
- before public messaging, sponsor commitments, vendor commitments, legal/compliance action, financial commitments, or
  sensitive-data handling changes
- after eval failures, hallucination patterns, approval-boundary misses, or safety incidents
- after major SDK, API, model, or dependency changes
- when cost, latency, or reliability becomes unacceptable
- quarterly or at major Agent Builder version milestones

## Required Gates And Checks

For the current Venue / Vendor reference workflow, run:

```sh
pnpm agent-builder validate agent_specs/venue_vendor_research.v0.1b.yaml
pnpm agent-builder registry validate registry/agent-registry.yaml
pnpm agent-builder eval run evals/venue_vendor_research.eval-suite.yaml
pnpm agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml
pnpm agent-builder runtime validate-output --output <path> --fixture <fixture>
pnpm test
pnpm lint
pnpm build
```

When piping runtime JSON into validation, use `pnpm --silent`:

```sh
pnpm --silent agent-builder runtime vercel review --fixture fixtures/venue_candidates/warehouse416.public.yaml \
  | pnpm --silent agent-builder runtime validate-output --fixture fixtures/venue_candidates/warehouse416.public.yaml
```

For future candidates, add equivalent spec, registry, fixture, eval, runtime-output validation, test, lint, and build
checks before release for local draft use.

## Relationship To The Intake Template

The intake template is the first structured artifact in this lifecycle. It records the business process, risks,
boundaries, and first test scenario.

The lifecycle controls what happens next. Intake completion does not approve an agent, generate a spec automatically, or
permit runtime use.

## Relationship To Future Scaffold CLI Work

A scaffold CLI command is intentionally deferred until this lifecycle and intake template have been tested against at
least one additional agent candidate beyond the Venue / Vendor Research Assistant.

Future scaffold work may help turn approved intake material into draft spec, fixture, eval, and registry starter files.
It must remain local, CLI-first, draft-only, human-reviewed, approval-gated, source-grounded, no-tools, no-routes, and
no-integrations unless a later governed decision explicitly changes that posture.

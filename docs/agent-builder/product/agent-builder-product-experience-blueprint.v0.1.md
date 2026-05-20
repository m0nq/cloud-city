# Agent Builder Product Experience Blueprint v0.1

Status: product and UX planning artifact only.

This document does not approve UI implementation, routes, runtime expansion, model calls, tools, integrations, Drive
sync, Drive writes, source-of-truth updates, or operational use.

## 1. Product Vision

Agent Builder should become Cloud City's governed system for turning repeated business workflows into reviewable agent
candidates.

The product should help Cloud City:

- analyze workflows in plain operational language
- draft agent candidate blueprints
- define source boundaries
- define allowed and prohibited actions
- surface risk, data sensitivity, and approval gates
- test candidates with synthetic and redacted fixtures
- approve boundaries before use
- eventually run approved draft-only agents
- monitor outputs, logs, eval results, and re-approval triggers

The product should feel like an operational design studio, not a developer console. Its job is to help a Creative
Director teach Cloud City how a workflow should be handled, then preserve those instructions as governed artifacts.

Near-term product posture remains pre-runtime for Event Readiness. Future UI thinking must inherit the current doctrine:

- local-first
- CLI-first
- human-reviewed
- approval-gated
- source-grounded
- no runtime expansion without approval
- no routes without approval
- no tools without approval
- no integrations without approval
- no Drive sync or Drive writes without approval
- all generated packets are drafts
- humans approve
- humans execute

## 2. Creative Director Mental Model

The primary mental model should be:

> Teach Cloud City how this workflow should be handled.

The product should not ask a founder to think in YAML, schemas, providers, eval harnesses, or runtime surfaces.

The interface should translate founder-friendly workflow thinking into governed artifacts:

- "What work keeps repeating?"
- "What good outcome should this produce?"
- "What source materials may it use?"
- "What should it never do?"
- "What must a human approve?"
- "How will we know it handled the workflow safely?"
- "What would make us stop or revise it?"

Technical artifacts remain visible for auditability, but not as the main interaction model. YAML, registry entries,
fixtures, eval suites, runtime outputs, and logs should appear as evidence and exportable records behind the product
language.

## 3. Primary User Flow

The intended future product flow:

1. Choose workflow.
   The user selects or names a repeated Cloud City workflow, such as Event Readiness, Venue / Vendor Research, dry bar
   planning, sponsor review, or post-event review.

2. Describe desired outcome.
   The product asks for the draft packet, checklist, summary, comparison, or review artifact the user wants a future
   agent to prepare.

3. Identify source materials.
   The user names approved internal and public sources, confirms source freshness expectations, and marks sensitive or
   restricted source categories.

4. Define allowed actions.
   The user confirms what the agent may do, such as summarize sources, separate facts from assumptions, surface unknowns,
   draft internal review packets, or recommend one next human review step.

5. Define prohibited actions.
   The user confirms what the agent must not do, such as send outreach, update source-of-truth records, commit spend,
   assign tasks, decide compliance, or imply approval.

6. Generate agent blueprint draft.
   The product creates a draft blueprint for human review. In current doctrine, this remains a planning artifact until
   separately implemented.

7. Review risks and approval gates.
   The user reviews risk tier, sensitive data handling, approval gate IDs, escalation triggers, and failure modes in
   plain language.

8. Run synthetic tests.
   The user runs or reviews synthetic fixtures and deterministic eval results. Tests should explain what they prove and
   what they do not prove.

9. Approve agent status.
   A human owner approves status changes, such as spec-only baseline, draft-only local use, or future higher autonomy
   gates. Approval should be visible, named, dated, and reversible.

10. Run draft-only agent.
    Only after explicit approval, the user may run an approved draft-only agent. Outputs remain drafts for human review.

11. Monitor outputs and logs.
    The user reviews generated packets, validation results, source references, approval decisions, failures, and
    re-evaluation triggers.

## 4. Autonomy Ladder

The product should use an autonomy ladder that is visible to non-engineers. The ladder should make the current allowed
state and future blocked states obvious.

| Level | Name | Meaning | Cloud City posture |
| --- | --- | --- | --- |
| L0 | Spec-only | The workflow has an intake, spec, registry entry, fixtures, or eval plan. It does not generate operational packets. | Safe planning and validation baseline. |
| L1 | Draft-only | The agent can generate local draft packets for human review. It cannot act externally or update records. | Humans approve. Humans execute. |
| L2 | Draft-to-integration | The agent can draft content intended for a connected system, but a human manually reviews and transfers it. | Future governed phase only. |
| L3 | Human-approved action | The agent can prepare an action and a human explicitly approves execution through a controlled gate. | Future exceptional phase requiring separate approval. |
| L4 | Bounded autonomous low-risk action | The agent may perform narrow low-risk actions within strict bounds and audit logs. | Not approved; requires future governance and proof. |
| L5 | Prohibited or exceptional autonomy | The agent could make commitments, send external communications, spend money, update source-of-truth systems, or decide compliance/safety. | Prohibited unless an exceptional future governance decision explicitly allows a narrow case. |

Event Readiness currently remains pre-runtime and below L2. It has deterministic pre-runtime runtime-output validation
for synthetic draft packets and deterministic in-memory synthetic-only L1.6 review-record lifecycle validation. The
L1.6 Operator-Readiness Review Charter defines operator-readiness as evidence-review readiness, not execution
readiness. Event Readiness has no approved CLI/operator wiring, runtime generation, model calls, prompts, routes, tools,
integrations, Drive sync, Drive writes, UI, source reads, file existence checks, content hashing, semantic source
verification, source-packet binding, real/redacted data use, operational approval, or autonomous action.

`declaredSourcePacketReferenceSummary` is report-facing, non-authoritative, and declared-metadata-only. It does not add
new validation authority and does not prove source file existence, source truth, completeness, freshness, semantic
support, human approval, operational approval, or permission to act.

## 5. Future UI Surfaces

These are conceptual surfaces only. They do not approve routes, components, UI implementation, data models, runtime
work, tools, integrations, or Drive behavior.

### Agent Dashboard

Purpose:
Show all agent candidates and their current approval state.

Founder-friendly questions:

- Which workflows exist?
- Which ones are only specs?
- Which ones can create draft packets?
- Which ones are blocked?
- What changed recently?

Must show:

- agent name
- business domain
- owner and accountable human
- autonomy level
- status
- last validation result
- open risks
- next required approval

### Workflow Intake Wizard

Purpose:
Guide a non-engineer through describing a workflow before any spec or agent behavior exists.

Founder-friendly questions:

- What workflow repeats often enough to teach?
- What does a good draft output look like?
- Who reviews it?
- What sources may it use?
- What should it never do?

Must show:

- progress through intake sections
- unresolved questions
- source and sensitivity prompts
- approval-boundary prompts
- suitability warnings when the workflow appears too autonomous or too risky

### Agent Blueprint Review

Purpose:
Let humans review the proposed agent candidate before approving it as a governed artifact.

Must show:

- plain-language purpose
- in-scope actions
- out-of-scope actions
- source hierarchy
- draft output fields
- risk tier
- approval gates
- escalation triggers
- generated artifact references

The blueprint should read like an operational agreement, not a configuration file.

### Source Boundary Screen

Purpose:
Make source-grounding visible and reviewable.

Must show:

- approved source categories
- prohibited source categories
- source labels
- source freshness rules
- redaction requirements
- missing-source behavior
- conflict-handling rules

Non-engineer framing:
"Here is what this agent is allowed to know, and what it must treat as unknown."

### Action Boundary Screen

Purpose:
Make action limits and approval gates visible before any agent can be used.

Must show:

- allowed actions
- prohibited actions
- approval gate IDs
- examples of safe language
- examples of unsafe language
- autonomy level
- blocked higher-autonomy actions

Non-engineer framing:
"Here is what this agent may prepare, what it must refuse, and when a human must decide."

### Test Lab

Purpose:
Let humans inspect synthetic and redacted test cases before trusting a candidate.

Must show:

- fixture name and scenario
- expected outcome
- readiness or decision label
- required fields
- seeded issues
- approval gates
- eval result
- failure explanation
- what the test does not prove

TDD posture:
The product should encourage defining expected outcomes before runtime behavior. A failed or missing test should block
promotion to a higher autonomy level.

### Run Console

Purpose:
Eventually let approved draft-only agents run locally and show output validation.

Must show:

- selected approved agent
- source packet used
- draft output status
- validation result
- source references
- approval warnings
- next human review step

Boundary:
For Event Readiness, this surface is conceptual only and not approved.

### Approval Queue

Purpose:
Collect human decisions required before status changes, external actions, source-of-truth updates, or higher autonomy.

Must show:

- requested decision
- accountable human owner
- reason approval is required
- affected sources or outputs
- risk tier
- approval gate IDs
- approve, reject, revise, or defer status

Approvals should never be implied by validation success.

### Audit Log

Purpose:
Make the governance trail inspectable.

Must show:

- artifact created or changed
- who approved or rejected
- validation commands and results
- source packet references
- output packet references
- autonomy level changes
- failures and retries
- re-evaluation triggers

Non-engineer framing:
"What happened, why it was allowed, and who remains accountable?"

### Agent Registry View

Purpose:
Show the local registry as a product surface without hiding its governance meaning.

Must show:

- registry entry
- spec path
- status
- evaluation status
- owner hat
- accountable owner
- approved and unapproved capabilities
- current autonomy level
- next safe gate

The registry view should make clear that registry presence does not approve runtime use.

## 6. Governance Visibility For Non-Engineers

Governance should be visible as everyday product language, not hidden in technical reports.

Approval gates should appear as named decisions:

- "Human approval required before public messaging"
- "Human approval required before source-of-truth updates"
- "Human approval required before budget-impacting commitments"

Source limits should appear as a boundary card:

- Allowed sources
- Missing sources
- Prohibited sources
- Redaction needed
- Source conflicts detected

Prohibited actions should appear as hard stops:

- "This agent must not assign tasks."
- "This agent must not send outreach."
- "This agent must not decide compliance."
- "This agent must not update Drive or operational records."

Test results should appear as evidence:

- what scenario was tested
- what was expected
- whether it passed
- what failure would mean
- what human review is still required

Autonomy level should be persistent and prominent:

- current level
- allowed at this level
- blocked at this level
- approval needed to move higher
- reason higher levels remain unavailable

The system should avoid green-light language that implies operational approval. Use terms like `validated`, `draft
ready for human review`, `blocked`, `needs revision`, and `not approved for action`.

## 7. Event Readiness Worked Example

Event Readiness is the first conceptual example for this product experience.

Current status:

- Agent candidate: Event Readiness Assistant v0.1
- Autonomy level: pre-runtime, below L2
- Current baseline: spec, registry entry, seven synthetic fixtures, deterministic eval suite, deterministic pre-runtime
  runtime-output validation, report-facing declared source packet reference summary, deterministic in-memory
  synthetic-only L1.6 review-record lifecycle validation, and the
  `675777f docs(agent-builder): add L1.6 operator-readiness review charter` milestone
- L1.6 operator-readiness: evidence-review readiness, not execution readiness
- Not approved: CLI/operator wiring, runtime generation, model calls, prompts, routes, tools, integrations, Drive sync,
  Drive writes, UI or reviewer cockpit implementation, source reads, file existence checks, content hashing, semantic
  source verification, source-packet binding, real/redacted data use, operational approval, or autonomous action

Creative Director mental model:
"Teach Cloud City how to review whether an event packet is ready for human decision-making."

Future product walkthrough:

1. Choose workflow:
   Event Readiness.

2. Describe desired outcome:
   One Event Readiness Review Packet with confirmed facts, assumptions, unknowns, source conflicts, domain gaps,
   approval needs, and one embedded internal action checklist for human review.

3. Identify source materials:
   Event brief, venue notes, walkthrough notes, draft run-of-show, staffing draft, dry bar notes, production notes,
   door-flow notes, budget notes, compliance notes, accessibility/safety notes, and open questions.

4. Define allowed actions:
   Summarize sources, identify gaps, classify readiness with allowed labels, surface approval needs, and recommend one
   next human review step.

5. Define prohibited actions:
   Do not declare the event ready, approved, cleared, compliant, launched, safe, or good to proceed. Do not assign tasks,
   update run-of-show docs, update Drive, send outreach, approve spend, or decide compliance/safety.

6. Generate blueprint draft:
   The product presents the Event Readiness Assistant purpose, source labels, approval gate IDs, output contract, and
   autonomy level.

7. Review risks and approval gates:
   The product highlights schedule commitments, vendor/venue commitments, public messaging, payments/contracts,
   source-of-truth updates, compliance/insurance/permit issues, accessibility/safety determinations, and
   budget-impacting commitments.

8. Run synthetic tests:
   The product shows positive, sparse, insufficient-source, dry-bar-out-of-scope, source-conflict, and blocked escalation
   scenarios as test oracles. Existing v0.1 fixtures now include the source-conflict pre-runtime slice.

9. Approve agent status:
   Event Readiness remains pre-runtime and below L2 until separate planning gates approve any future runtime/model
   experiment or source-binding work.

10. Run draft-only agent:
    Not approved for Event Readiness v0.1.

11. Monitor outputs and logs:
    Conceptual only for Event Readiness until runtime and product surfaces are separately approved.

## 8. Product Principles

Use founder-friendly language first.
The product should ask operational questions and translate them into governed artifacts.

Make status hard to misunderstand.
Every agent should clearly show whether it is spec-only, draft-only, blocked, or approved for a specific bounded use.

Show evidence beside conclusions.
Approval gates, source limits, and test results should be visible where decisions are made.

Prefer reviewable drafts over automation.
The product should strengthen human judgment, not replace it.

Design for consent and accountability.
Affected humans should be visible in reviewer roles, approval gates, and audit trails.

Keep risk legible.
The product should surface uncertainty, missing sources, source conflicts, and boundary violations before it celebrates
progress.

## 9. TDD And Governance Test Thinking

Future product planning should define tests before implementation.

For each workflow, product planning should define:

- happy or positive case
- sparse but reviewable case
- insufficient-source case
- source-conflict case
- prohibited-action request case
- boundary escalation case
- approval-gate omission case

Each case should define:

- source packet
- expected label or status
- required output fields
- prohibited language
- required approval gates
- reviewer signoff criteria
- failure handling

UI should not become available for a workflow until the underlying governance state is clear enough to explain in plain
language.

## 10. Explicit Exclusions

This artifact does not approve:

- UI implementation
- routes
- components
- CLI/operator wiring
- runtime expansion
- Event Readiness runtime generation
- model calls
- prompts
- tools
- integrations
- Drive sync
- Drive writes
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- real or redacted event data
- source-of-truth updates
- operational use
- autonomous action
- changes to validators, schemas, runtime files, or application code

Future implementation requires a separate approved plan, explicit scope, tests, governance review, and human approval.

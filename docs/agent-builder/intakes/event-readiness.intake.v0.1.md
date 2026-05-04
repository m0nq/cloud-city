# Event Readiness Assistant Intake v0.1

This intake is part of the Agent Creation Lifecycle. It is an intake-only artifact. Completing it does not approve an
agent for implementation, runtime use, tool access, integration access, external communication, or operational
deployment.

Core frozen decisions for this intake:

- Primary output is one `Event Readiness Review Packet`.
- `Internal Action Checklist / Run-of-Show Gap List` is embedded inside the packet, not created as a standalone
  artifact.
- Risk tier is Medium while draft-only and internal; it escalates to High before tool access, source-of-truth writes,
  external communications, compliance determinations, or budget-impacting commitments.

Decision-support boundary:

`The assistant may support a draft readiness assessment by identifying confirmed readiness signals, unresolved gaps,
blockers, contradictions, and approval needs. It must not declare the event approved, cleared, compliant, or ready to
proceed.`

Readiness labels to use instead of `ready / not ready`:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

Practical standard:

- The assistant is a source-grounded readiness reviewer, not a project manager.
- It can say: `Staffing coverage for door/check-in is not confirmed in the provided sources.`
- It cannot say: `Assign Alex to door and update the run-of-show.`

## 1. Process Name

- Name: Event Readiness Assistant
- Business domain: Event Production / Operations
- Proposed agent name, if known: Event Readiness Assistant

## 2. Business Owner / Human Approver

- Business owner: Operations / Production Lead
- Accountable human approver: Founder / Strategic Owner
- Reviewers needed: Operations, Governance / Risk, Finance when budget impacts exist, Dry Bar lead when bar program is
  in scope

## 3. Current Manual Workflow

- How the work happens today: Humans review the event brief, venue constraints, staffing needs, equipment needs, timing
  windows, dry bar needs, compliance items, and open dependencies across scattered notes and checklists.
- Current tools or source materials used by humans: Event brief, venue notes, walkthrough notes, staffing notes, draft
  run-of-show, checklist docs, budget notes, compliance / COI notes if applicable.
- Frequency: Every event, especially in the final 2-3 weeks before show day.
- Known bottlenecks: Missing information, timeline contradictions, scattered ownership, buried blockers, unclear
  approvals.

## 4. Pain Point / Opportunity

- Problem to reduce: Readiness issues are discovered late, and dependencies across timing, staffing, venue rules, dry
  bar, and compliance are easy to miss.
- Opportunity to improve: Produce a draft readiness review packet before event week so humans can resolve gaps earlier.
- What would stay human-owned: Final go/no-go decisions, vendor/venue communications, schedule commitments, compliance
  submissions, source-of-truth updates.

## 5. Desired Agent-Assisted Outcome

- Desired draft outcome: One `Event Readiness Review Packet` with an embedded
  `Internal Action Checklist / Run-of-Show Gap List` for human review.
- Who reviews it: Operations lead first, then Founder / Strategic Owner, then specialist reviewers as needed.
- How a human would use it after review: Humans turn approved findings into real tasks, outreach, timeline updates, or
  escalation items.

## 6. Inputs / Source Materials

- Approved internal sources: Founder/operator input needed on exact canonical document names. Working source packet:
  event brief, venue notes, walkthrough notes, staffing notes, draft run-of-show, checklist docs, budget notes,
  compliance / COI notes if applicable.
- Approved public sources, if any: None by default. Public sources may be used only if explicitly approved for internal
  readiness context and source/date are clear.
- Sources that must not be used: Unapproved external research, unsourced copied notes, restricted data, and unapproved
  inbox, calendar, task-system, or CRM data.
- Missing sources: Founder/operator input needed on which exact internal event docs should become the first standard
  source packet for this workflow.
- Source freshness requirements: Use the latest approved internal drafts available at review time and flag undated,
  stale, contradictory, or partial documents.

## 7. Expected Draft Outputs

- Draft packet fields: Draft status / human review warning, event reviewed, sources used, confirmed facts, assumptions,
  unknowns / missing information, readiness assessment, timeline consistency check, staffing and ownership gaps, venue /
  load-in / load-out gaps, dry bar readiness notes, equipment / sound / production gaps, ticketing / door / guest-flow
  gaps, accessibility / safety / compliance flags, budget or cost-impact flags, internal action checklist for human
  review, approval needs / escalation gates, recommended next human review step.
- Draft text, checklist, or table needs: One review packet only; the `Internal Action Checklist / Run-of-Show Gap List`
  stays embedded in the packet and is not a standalone artifact.
- Required source citations or source labels: Every confirmed fact should cite the source used. Founder/operator input
  needed on the preferred source labels once the first standard event packet is chosen.
- Output format notes: Keep the packet draft-only, clearly labeled for human review, and structured so that action-like
  content remains findings for review rather than executable tasks.

## 8. Decisions The Agent May Support

- Decisions the agent may help frame: The assistant may support a draft readiness assessment by identifying confirmed
  readiness signals, unresolved gaps, blockers, contradictions, and approval needs. It must not declare the event
  approved, cleared, compliant, or ready to proceed.
- Comparisons or classifications it may provide: Readiness labels such as `on_track_with_review_needed`,
  `needs_attention`, `blocked_pending_human_resolution`, and `insufficient_source_information`.
- Recommendations it may draft for human review: Suggested next human review steps and embedded internal action
  checklist items for review only.

## 9. Decisions The Agent Must Not Make

- Decisions reserved for humans: Whether the event is approved to proceed, whether the event is cleared, compliant, or
  ready, whether operational risk is acceptable, and whether compliance is good enough.
- Commitments it must not imply: Vendor or venue commitments, schedule commitments, staffing commitments, budget
  approvals, or any implication that Cloud City has finalized operational decisions.
- Actions it must refuse or escalate: Contacting vendors or venues, updating schedules or records, resolving compliance
  questions autonomously, or turning draft checklist items into live assignments.

## 10. Human Approval Points

- Approval required before: External outreach, schedule commitments, vendor/venue commitments, public messaging,
  payments, contracts, source-of-truth updates, compliance actions.
- Required approval roles: Operations / Production Lead, Founder / Strategic Owner, Governance / Risk reviewer when
  compliance or safety issues appear, Finance reviewer when cost or budget impact is material.
- Blocking approval gates: Recommendations to act, walkthrough scheduling that implies commitment, rates or terms if
  operational changes affect cost, compliance / insurance / permit issues, and budget-impacting commitments as a
  candidate gate to formalize during later spec work.

## 11. External Parties Affected

- Venues, vendors, sponsors, partners, guests, volunteers, contractors, or other parties affected: Venue, vendors,
  talent, contractors, volunteers, guests.
- Potential relationship impact: Moderate if readiness drafts overstate certainty or imply commitments.
- Any public-facing implications: Indirect but real if missed blockers affect guest experience or event quality.

## 12. Data Sensitivity

- Default sensitivity: Confidential.
- Sensitive data involved: Staff availability, internal budget notes, contact details, internal risk notes.
- Restricted data involved: Ideally none in the first version.
- Redaction requirements: Strip direct personal data and anything not needed for readiness review.
- Data that should never enter prompts, logs, drafts, or fixtures: Payment details, personal contact info, contracts,
  legal docs, and anything beyond minimum necessary summaries.

## 13. Brand / Reputation Risk

- Brand risks: Moderate if the packet overstates readiness or hides blockers that later affect event quality.
- Tone risks: Low if internal-only, higher if outputs are later reused for outreach.
- Alcohol-free positioning considerations: Must preserve dry bar feasibility and guest-experience standards.
- Public trust considerations: Avoid overstating readiness or burying blockers.

## 14. Financial Risk

- Rates, costs, payment, refund, revenue, sponsor, or budget issues: Moderate financial risk if readiness findings
  affect staffing, rentals, schedule changes, or late operational fixes.
- Financial commitments the agent must not make: Any approval of spend, staffing changes with cost impact, vendor
  commitments, refunds, or rate acceptance.
- Finance review needed: Yes when recommendations affect budget, staffing, rentals, or overtime.

## 15. Legal / Compliance Risk

- Contract, permit, insurance, tax, employment, accessibility, safety, or compliance issues: Medium legal/compliance
  risk because readiness review may surface permit, insurance, accessibility, or safety gaps but must not resolve them.
- Legal/compliance determinations the agent must not make: Permit sufficiency, insurance sufficiency, accessibility
  compliance, employment compliance, and safety compliance.
- Required escalation: Any unresolved compliance, insurance, permit, accessibility, or safety issue.

## 16. Operational Dependency Risk

- Event readiness dependencies: Venue access windows, load-in, sound check, event start/end, cleanup, load-out,
  staffing, equipment, dry bar setup, ticketing / door flow, accessibility, compliance.
- Timing or staffing dependencies: Operational dependency risk is high enough to matter, but still appropriate for
  draft-only support; readiness depends on consistent timing windows, clear staffing coverage, and explicit ownership of
  open gaps.
- Systems or records that humans must update manually: Canonical checklists, schedules, task boards, budgets, vendor
  notes.
- Failure impact if the draft is wrong: Late surprises, extra cost, staff stress, degraded guest experience, or
  event-risk escalation.

## 17. Suggested Risk Tier

Suggested tier:

- [ ] Low
- [x] Medium
- [ ] High

Reason: Internal draft support with meaningful operational consequences, but still below sponsor, public, or
vendor-commitment risk if kept draft-only. Escalates to High before tool access, source-of-truth writes, external
communications, compliance determinations, or budget-impacting commitments.

## 18. Source-Grounding Requirements

- Confirmed facts required: Event name, review date, venue access windows, load-in/load-out timing, event timing,
  staffing coverage, equipment requirements, dry bar requirements, ticketing / door flow details, accessibility notes,
  compliance / COI status, and known budget constraints when provided in sources.
- Assumptions allowed only when labeled: Assumptions may be used only when explicitly marked and tied to missing or
  incomplete source material.
- Unknowns that must be surfaced: Missing staffing assignments, unresolved timing dependencies, incomplete dry bar
  details, unclear accessibility details, unresolved compliance items, missing budget inputs, and any source gaps that
  prevent a grounded readiness view.
- Stale or conflicting source handling: Identify conflicting or stale sources explicitly and route them to human review
  rather than resolving them implicitly. Founder/operator input needed on which exact docs are treated as canonical when
  conflicts appear.

## 19. Output Schema Notes

- Required fields: `review_date`, `event_name`, `sources_used`, `confirmed_facts`, `assumptions`, `unknowns`,
  `readiness_label`, `timeline_consistency_check`, `staffing_and_ownership_gaps`,
  `venue_load_in_load_out_gaps`, `dry_bar_readiness_notes`, `equipment_sound_production_gaps`,
  `ticketing_door_guest_flow_gaps`, `accessibility_safety_compliance_flags`, `budget_or_cost_impact_flags`,
  `risk_notes`, `embedded_internal_action_checklist`, `approval_needs`, `recommended_next_human_review_step`,
  `human_review_required_before_action`.
- Approval gate fields: `approval_gate_ids`, `approval_needs`, `human_review_required_before`.
- Source fields: `sources_used`, `confirmed_facts`, `assumptions`, `unknowns`, `conflicting_or_stale_sources`.
- Risk fields: `readiness_label`, `risk_notes`, `escalation_triggers`, `budget_or_cost_impact_flags`,
  `accessibility_safety_compliance_flags`.
- Recommended next human action field: `recommended_next_human_review_step`.

## 20. Fixture Ideas

- Happy-path fixture: A mostly complete internal event packet with one or two minor unresolved dependencies.
- Missing-information fixture: Sparse event brief missing staffing, load-in, accessibility, and dry bar details.
- Risk/escalation fixture: Event with unresolved compliance, insurance, or timing contradiction.
- Redaction notes: Remove personal contacts, payment details, contract text, and unnecessary personal availability
  details.

## 21. Eval Ideas

- Required output-field checks: Validate required output fields for packet identity, source grounding, readiness label,
  readiness gaps, embedded internal checklist, approval needs, and next human review step.
- Required domain criteria: Load-in/load-out, staffing readiness, equipment readiness, dry bar readiness,
  ticketing/door flow, accessibility, compliance readiness.
- Required approval gates: Recommendations to act, public messaging when relevant, source-of-truth updates, walkthrough
  scheduling that implies commitment, compliance / insurance / permit issues, and budget-impacting commitments as a
  candidate gate to formalize during later spec work.
- Required refusal or escalation tests: Timing consistency checks, dependency detection, blocker surfacing,
  source-grounding, approval-boundary handling, prohibited-action refusal, must not declare an event approved, must not
  declare an event cleared/compliant/ready, must not send outreach, must not update schedules or records, must not
  resolve compliance questions autonomously.

## 22. Failure Modes

- Likely hallucination or overreach risks: Overconfident readiness language, generic advice not tied to the event
  packet, and implying that a checklist item is already assigned or approved.
- Missing information risks: Missing hidden dependencies and treating missing source information as low risk.
- Approval-boundary risks: Failing to escalate compliance, accessibility, safety, or budget-impacting issues and
  drifting into project-manager behavior.
- Source misuse risks: Weak distinction between confirmed facts and assumptions, unsourced conclusions, and stale or
  conflicting source material being treated as settled.
- Brand or relationship risks: Overstating certainty, burying dry bar feasibility issues, or implying commitments that
  affect venue, vendor, or guest expectations.

## 23. Escalation Triggers

Escalate to a human when:

- [x] Source information is missing, stale, conflicting, or unclear.
- [x] Sensitive or restricted data may be involved.
- [x] External communication is requested.
- [x] A rate, term, contract, payment, public statement, sponsor/vendor commitment, legal/compliance action, or
      source-of-truth update is involved.
- [x] The agent cannot stay within draft-only support.
- [x] Other: Staffing holes, timeline contradictions, major budget impact, any request to update a source-of-truth
      system, or any request to determine whether compliance, insurance, permits, accessibility, or safety are
      sufficient.

## 24. Non-Goals

- This agent will not: Act as a project manager, scheduler, vendor coordinator, compliance decision-maker,
  source-of-truth updater, budget approver, outreach tool, or autonomous task creator.
- This agent should defer: Live scheduling decisions, staffing assignments, external communications, budget approvals,
  source-of-truth updates, and compliance sufficiency judgments.
- This agent should never: Declare the event approved, cleared, compliant, or ready to proceed; convert draft checklist
  items into live assignments; or take autonomous external action.

## 25. First Manual Test Scenario

- Scenario name: Event Readiness source-packet review for a draft Cloud City event.
- Source materials: Use the planned source packet defined in
  `docs/agent-builder/source-packets/event-readiness.source-packet-plan.v0.1.md`. Minimum required sources are event
  brief, venue notes, draft run-of-show, staffing draft, dry bar notes, and open questions / unresolved dependency
  notes. Optional supporting sources include budget notes, compliance / COI / permit notes, accessibility / safety
  notes, walkthrough notes, equipment / sound / production notes, and ticketing / door / guest-flow notes.
- Expected draft output: One `Event Readiness Review Packet` with readiness label, confirmed facts, assumptions,
  unknowns, blockers, embedded internal action checklist, and approval needs.
- Expected approval gates: External outreach, schedule commitments, vendor/venue commitments, public messaging,
  payments/contracts, source-of-truth updates, compliance / insurance / permit issues, and budget-impacting
  commitments as a candidate gate to formalize during later spec work.
- Expected human reviewer: Operations / Production Lead, then Founder / Strategic Owner.
- Pass/fail criteria: Packet must surface blockers and unknowns, use only provided sources, preserve draft-only status,
  avoid autonomous action, avoid declaring the event ready/approved/compliant, include human approval needs, and
  surface source conflicts instead of resolving them implicitly.

## 26. Recommendation

- [x] Proceed to lifecycle review.
- [ ] Revise the intake.
- [ ] Defer until governance, sources, or boundaries are clearer.
- [ ] Reject as unsuitable for Agent Builder.

Reason: This is a strong second candidate for lifecycle validation because it is operationally meaningful, mostly
internal, dependency-heavy, approval-sensitive, and still governable as a draft-only source-grounded reviewer.

## 27. Notes For Future Scaffold / Spec Generation

- Suggested spec slug: `event_readiness`
- Suggested owner hat: `Operations / Production Lead`
- Suggested implementation stage: `draft_only_manual_mvp`
- Suggested eval suite name: `event_readiness.eval-suite.yaml`
- Suggested fixture paths: `fixtures/event_readiness/happy_path.public.yaml`,
  `fixtures/event_readiness/missing_information.public.yaml`,
  `fixtures/event_readiness/escalation.public.yaml`
- Open questions: Which exact internal event docs should become the first source packet? Which readiness gaps have
  occurred most often in the final 2-3 weeks before past events? Which source-of-truth docs must humans update after
  review? Should future versions include separate reviewer views for operations, dry bar, finance, and governance?
  Should budget-impacting commitments become a distinct canonical approval gate or be folded into existing cost-related
  gates during spec authoring?

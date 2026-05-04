# Event Readiness Source Packet Plan v0.1

## 1. Purpose

This plan defines the first source packet needed to test the Event Readiness Assistant intake. It is not a fixture,
spec, eval, runtime artifact, or approval to implement the agent.

## 2. Relationship To The Intake

The intake at [event-readiness.intake.v0.1.md](../intakes/event-readiness.intake.v0.1.md) defines the candidate,
boundaries, and intended draft output. This plan defines the source materials required to make the first manual test
scenario concrete before fixture, spec, or eval work begins.

## 3. Operating Doctrine

- local-first
- draft-only
- source-grounded
- human-reviewed
- no tools
- no routes
- no integrations
- no external action
- humans approve
- humans execute

## 4. First Manual Test Scenario

Scenario name:
Event Readiness source-packet review for a draft Cloud City event

Scenario goal:
Use a bounded source packet to produce one draft Event Readiness Review Packet with an embedded Internal Action
Checklist / Run-of-Show Gap List for human review.

Expected output:
One Event Readiness Review Packet using the readiness labels:

- `on_track_with_review_needed`
- `needs_attention`
- `blocked_pending_human_resolution`
- `insufficient_source_information`

The packet must not declare the event approved, cleared, compliant, or ready to proceed.

## 5. Required Source Packet Components

### Event Brief

Exact internal document name:
Founder/operator input needed.

Purpose:
Define the event concept, timing, goals, and primary operating assumptions.

Required or optional for first manual test:
Required.

Sensitivity notes:
May include internal planning notes and unpublished event details.

Redaction notes:
Remove private contact details and any unnecessary financial or legal detail.

What the assistant should extract from it:
Event name, target date, operating goals, expected guest format, timing anchors, and declared constraints.

### Venue Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Capture venue rules, access windows, restrictions, and operational context.

Required or optional for first manual test:
Required.

Sensitivity notes:
May include relationship notes, venue restrictions, and internal comments.

Redaction notes:
Remove unnecessary personal contact details and summarize relationship context if it is sensitive.

What the assistant should extract from it:
Access windows, load-in/load-out limits, venue rules, staffing or security constraints, and unresolved venue questions.

### Walkthrough Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Capture on-site observations and clarifications from venue walkthroughs.

Required or optional for first manual test:
Optional.

Sensitivity notes:
May include subjective notes about readiness risk, venue condition, or relationship context.

Redaction notes:
Remove unnecessary personal names and summarize sensitive comments.

What the assistant should extract from it:
Observed constraints, unresolved setup questions, accessibility or safety observations, and any contradictions with
other sources.

### Draft Run-Of-Show

Exact internal document name:
Founder/operator input needed.

Purpose:
Describe the draft timing sequence for setup, event flow, and breakdown.

Required or optional for first manual test:
Required.

Sensitivity notes:
Usually internal-only operational planning.

Redaction notes:
Use role labels where possible instead of personal names.

What the assistant should extract from it:
Timing blocks, dependency order, timing contradictions, ownership gaps, and whether the schedule aligns with venue
constraints.

### Staffing Draft

Exact internal document name:
Founder/operator input needed.

Purpose:
Describe planned staffing coverage and unresolved ownership.

Required or optional for first manual test:
Required.

Sensitivity notes:
May include private availability details and sensitive staffing constraints.

Redaction notes:
Remove unnecessary personal availability details and use role labels where possible instead of personal names.

What the assistant should extract from it:
Coverage status, unassigned roles, critical staffing gaps, and unresolved operational ownership.

### Dry Bar Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Capture dry bar setup needs, menu requirements, supplies, and timing dependencies.

Required or optional for first manual test:
Required.

Sensitivity notes:
Usually moderate internal sensitivity; may include budget or vendor assumptions.

Redaction notes:
Remove unnecessary vendor contact details and any payment detail.

What the assistant should extract from it:
Setup timing, menu or ingredient gaps, equipment needs, staffing needs, and operational blockers affecting guest
experience.

### Equipment / Sound / Production Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Describe sound, lighting, staging, power, or other production needs.

Required or optional for first manual test:
Optional but strongly useful.

Sensitivity notes:
May include technical limitations, staffing needs, and cost-sensitive requirements.

Redaction notes:
Remove unnecessary vendor contacts and summarize cost-sensitive detail where possible.

What the assistant should extract from it:
Equipment dependencies, sound-check needs, setup sequencing, power or space constraints, and unresolved production gaps.

### Ticketing / Door / Guest-Flow Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Describe guest entry assumptions, ticketing flow, check-in needs, and line-management concerns.

Required or optional for first manual test:
Optional but strongly useful.

Sensitivity notes:
May include admissions assumptions and staffing notes.

Redaction notes:
Remove personal identifiers and unnecessary platform-specific detail.

What the assistant should extract from it:
Door coverage needs, guest-flow assumptions, admissions risks, and unclear dependencies affecting check-in or entry.

### Budget Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Provide cost context for readiness issues that may affect staffing, rentals, or late changes.

Required or optional for first manual test:
Optional but strongly useful.

Sensitivity notes:
High internal sensitivity.

Redaction notes:
Remove payment details and reduce budget content to only the minimum needed for readiness review.

What the assistant should extract from it:
Cost-impact flags, budget-sensitive decisions, and unresolved financial constraints affecting readiness.

### Compliance / COI / Permit Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Capture known compliance, insurance, COI, or permit status without asking the assistant to determine sufficiency.

Required or optional for first manual test:
Optional but strongly useful.

Sensitivity notes:
High internal sensitivity with legal/compliance implications.

Redaction notes:
Summarize status instead of copying full legal or contract text.

What the assistant should extract from it:
Known status, missing documents, unresolved compliance blockers, and issues requiring human escalation.

### Accessibility / Safety Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Capture accessibility, safety, and guest-protection considerations relevant to readiness.

Required or optional for first manual test:
Optional but strongly useful.

Sensitivity notes:
May include sensitive risk observations or unresolved safety concerns.

Redaction notes:
Keep only the minimum source content needed for readiness review and avoid unnecessary personal details.

What the assistant should extract from it:
Known accessibility constraints, missing safety information, unresolved guest-risk issues, and escalation needs.

### Open Questions / Unresolved Dependency Notes

Exact internal document name:
Founder/operator input needed.

Purpose:
Collect unresolved questions and known blockers in one place so the packet can distinguish unknowns from settled facts.

Required or optional for first manual test:
Required.

Sensitivity notes:
Moderate internal sensitivity because it may expose gaps or uncertainty.

Redaction notes:
Use role labels where possible and remove unnecessary personal details.

What the assistant should extract from it:
Explicit unknowns, blockers, contradictory assumptions, missing owners, and next human review needs.

## 6. Source Labels

Provisional source labels for the eventual packet:

- `EVENT_BRIEF`
- `VENUE_NOTES`
- `WALKTHROUGH_NOTES`
- `RUN_OF_SHOW_DRAFT`
- `STAFFING_DRAFT`
- `DRY_BAR_NOTES`
- `PRODUCTION_NOTES`
- `DOOR_FLOW_NOTES`
- `BUDGET_NOTES`
- `COMPLIANCE_NOTES`
- `ACCESSIBILITY_SAFETY_NOTES`
- `OPEN_QUESTIONS`

These labels are provisional until founder/operator review.

## 7. Canonical Source Priority

Provisional conflict-resolution order:

1. Latest founder-approved event brief
2. Latest venue/walkthrough notes
3. Latest draft run-of-show
4. Latest staffing/dry bar/production notes
5. Latest budget/compliance/accessibility notes
6. Open questions document

This order is provisional, not final. If sources conflict, the assistant must surface the conflict rather than resolve
it.

## 8. Minimum Viable Source Packet For First Test

Required:

- Event brief
- Venue notes
- Draft run-of-show
- Staffing draft
- Dry bar notes
- Open questions / unresolved dependency notes

Optional but strongly useful:

- Budget notes
- Compliance / COI / permit notes
- Accessibility / safety notes
- Walkthrough notes
- Equipment / sound / production notes
- Ticketing / door / guest-flow notes

## 9. Redaction Rules

- remove personal phone numbers and private emails unless essential
- remove payment details
- summarize contract/legal text instead of copying full documents
- remove unnecessary personal availability details
- use role labels where possible instead of personal names
- include only the minimum source content needed for readiness review

## 10. Common Readiness Gaps To Check

This list is provisional and requires founder/operator review:

- load-in/load-out windows missing or contradictory
- sound check timing unclear
- door/check-in staffing not confirmed
- bar setup timing unclear
- dry bar menu/ingredients/equipment incomplete
- venue rules not captured
- COI/permit/compliance status unclear
- accessibility/safety information missing
- budget impact not reviewed
- task owner missing for unresolved blockers
- run-of-show does not match venue timing
- guest-flow or ticketing assumptions unclear

## 11. Human Review Questions

- Which exact internal documents should be used for the first source packet?
- Which past or upcoming event should be used as the first manual scenario?
- Which source labels should become canonical?
- Which docs win when sources conflict?
- Which readiness gaps have occurred most often in the final 2-3 weeks before events?
- Which source-of-truth docs must humans update after reviewing the readiness packet?
- Should budget-impacting commitments become a distinct canonical approval gate?

## 12. Next Step After This Plan

After founder/operator review, the next step is to create one redacted or synthetic source packet for manual testing. Do
not create fixtures, evals, specs, registry entries, runtime behavior, or scaffold commands until the source packet is
approved.

# Agent Builder First-Slice IA/UX States And Accessibility Acceptance v0.1

## Status

- Docs-only.
- Planning-only.
- Synthetic-first.
- Created for CLO-80.
- Baseline: `9177499 docs(agent-builder): define first slice validation boundary`.

This decision record does not approve implementation, a route, screen, component, prototype, executable interaction, authentication change, source retrieval, persistence, shared access, deployment, release, external communication, autonomous action, or authority to act.

## Candidate Slice

`Human reviewer inspects a synthetic context packet, classifies it, and prepares repo-first planning evidence for human placement.`

The slice remains not ready for implementation.

## Purpose

This record refines the CLO-74 conceptual reviewer information architecture into a first-slice planning model for task flow, information hierarchy, interaction states, language, keyboard and focus behavior, screen-reader semantics, responsive behavior, and accessibility acceptance.

It defines future acceptance boundaries only. It is not a UI specification or implementation authorization.

## Standing Boundaries

The following decisions remain controlling:

- repository-defined synthetic fixtures are the only acceptable future input source;
- automatic source retrieval is prohibited;
- temporary state is limited to the active session;
- no product persistence or retained review history is approved;
- evidence may be prepared temporarily but must be reviewed and placed by a human;
- the Founder remains the approval authority for implementation and exposure;
- agents and systems have no independent approval authority;
- governance failures are release-blocking;
- anonymous, public, shared non-production, and production access remain unapproved.

## Relationship To CLO-74

CLO-74 remains the conceptual information architecture source for what a reviewer sees, decides, records, and escalates.

CLO-80 narrows that IA to the current candidate slice and adds planning-only state and accessibility acceptance criteria.

CLO-74's earlier prohibition on a UI state model prevented premature UI design at that phase. This record does not backpatch or invalidate CLO-74. It permits only a non-executable planning model now that data, authority, validation, release, and rollback boundaries are explicit.

## Primary Reviewer Goal

The reviewer must be able to:

1. identify the synthetic packet and related planning baseline;
2. understand the purpose and non-approval boundary;
3. review allowed references and forbidden uses;
4. choose one permitted planning classification or hold / clarify;
5. enter a concise rationale when required;
6. verify the temporary evidence summary;
7. copy or otherwise manually transfer approved evidence to the repo-first human workflow;
8. leave the review without creating retained product state or operational approval.

## Information Hierarchy

A future bounded surface should present information in this order:

1. **Review identity**
   - synthetic fixture ID;
   - related CLO issue;
   - repository baseline;
   - reviewer role.
2. **Planning posture**
   - synthetic-only;
   - planning-only;
   - no implementation or operational approval;
   - temporary session state only.
3. **Packet purpose and summary**
   - invented workflow title;
   - planning purpose;
   - expected reviewer decision.
4. **Boundaries**
   - allowed references;
   - forbidden uses;
   - stop conditions.
5. **Reviewer decision**
   - `later bounded L2 candidate`;
   - `first implicated CLO-52 lane dependency card`;
   - `hold / clarify`.
6. **Rationale and evidence preview**
   - concise rationale;
   - hold / clarify reason when applicable;
   - boundary acknowledgement;
   - suggested repo evidence path.
7. **Completion and next step**
   - manual-copy guidance;
   - no automatic write reminder;
   - next planning recommendation.

Boundary and non-approval information must not be visually or semantically hidden behind optional disclosure.

## Task Flow

### Step 1 — Orient

The reviewer confirms the fixture ID, related CLO issue, baseline, role, and planning-only posture.

If identity or posture information is missing or contradictory, the flow enters `blocked`.

### Step 2 — Understand The Packet

The reviewer reads the planning purpose, allowed references, forbidden uses, expected decision, and stop conditions.

The reviewer must not be required to infer boundaries from surrounding documentation.

### Step 3 — Choose A Planning Outcome

The reviewer chooses exactly one:

- `later bounded L2 candidate`;
- `first implicated CLO-52 lane dependency card`;
- `hold / clarify`.

No option may imply implementation, release, production use, external action, or operational approval.

### Step 4 — Supply Required Rationale

A concise rationale is required for either candidate classification.

A hold / clarify reason is required for `hold / clarify`.

Validation must explain what is missing without erasing valid input.

### Step 5 — Acknowledge The Boundary

Before evidence preview, the reviewer confirms that the result is planning-only and will not be written automatically.

The acknowledgement must not be preselected.

### Step 6 — Review Evidence Preview

The reviewer verifies the temporary plain-text evidence preview.

The preview must contain only approved planning fields and must clearly identify its suggested repo-first destination.

### Step 7 — Complete Or Return

Completion may make the evidence available for manual human transfer only.

The reviewer may return to revise the classification or rationale before leaving the active session.

No completion state may claim that evidence was saved, approved, released, or operationalized.

## Interaction States

### Initial

Required behavior:

- show review identity and posture before decision controls;
- no classification is preselected;
- rationale and evidence preview are not presented as complete;
- primary next action is understandable without relying on color.

### Ready For Review

Required behavior:

- synthetic packet content is available;
- allowed references, forbidden uses, and stop conditions are visible;
- the reviewer can begin the decision step;
- non-approval language remains present.

### Decision In Progress

Required behavior:

- exactly one classification may be selected;
- changing the classification preserves compatible rationale where safe;
- incompatible fields are cleared only with explicit notice;
- the current selection is programmatically determinable.

### Rationale Required

Required behavior:

- explain why rationale or hold reasoning is required;
- associate the message with the relevant field;
- move focus to or announce the first invalid field only after attempted progression;
- preserve all other valid input.

### Evidence Preview Ready

Required behavior:

- present the evidence as a preview, not a saved record;
- identify included fields and suggested repo path;
- state that a human must review and place it manually;
- provide a way to return and revise without losing session input.

### Completed For Manual Transfer

Required behavior:

- state that the planning review is complete for manual evidence transfer only;
- do not use success language that implies implementation, release, or operational approval;
- do not claim that a repository or Linear write occurred;
- provide the next planning recommendation and an explicit exit/reset path.

### Hold / Clarify

Required behavior:

- prioritize the reason for hold;
- identify the missing, contradictory, or boundary-expanding condition;
- suppress candidate-completion language;
- preserve a temporary evidence preview for manual escalation when allowed;
- provide no automatic escalation or external communication.

### Blocked

Use when the role, fixture, baseline, allowed scope, or required boundary information is missing or invalid.

Required behavior:

- state why review cannot proceed;
- identify the human planning action needed;
- disable or omit classification completion;
- retain no state after exit or reload.

### Error

Use only for a future approved technical failure.

Required behavior:

- distinguish a technical failure from a governance hold;
- provide recovery guidance;
- avoid exposing sensitive diagnostics;
- avoid claiming that partial evidence was saved;
- retain no review content in logs or analytics.

### Reset / Exit

Required behavior:

- explain that temporary input will be cleared;
- require confirmation when meaningful input exists;
- return focus to a predictable location after reset;
- clear all active-session review content on reset, reload, close, or exit.

### Loading

No source or network loading is approved for the first slice.

If a later approved implementation has an internal loading transition, it must:

- identify what is loading in text;
- avoid indefinite or misleading progress;
- preserve the planning-only posture;
- provide a bounded failure path.

## Language And Non-Approval Acceptance

Required language principles:

- use `planning classification`, not `approval`;
- use `evidence preview`, not `saved result`;
- use `complete for manual transfer`, not `submitted`, `published`, or `released`;
- distinguish `hold / clarify` from technical error;
- state that contract conformance or a passing review does not imply implementation readiness;
- state that a human must place repo-first evidence;
- avoid celebratory success language for authority-bearing outcomes.

The primary non-approval reminder must appear before decision controls and again in the evidence/completion region.

## Keyboard Acceptance

A future approved surface must support completion with a keyboard alone.

Acceptance expectations:

- logical tab order follows the task flow;
- all controls are reachable and operable without pointer input;
- radio-group or equivalent classification behavior follows the adopted semantic pattern;
- focus indicators are visible and not obscured;
- no keyboard trap exists;
- reset, return, hold, preview, and completion actions are keyboard operable;
- escape behavior is defined only when a modal or equivalent pattern is separately approved;
- keyboard shortcuts are not required for the first slice.

## Focus Management Acceptance

Expected focus behavior:

- initial focus remains at the page or surface start unless a documented reason requires otherwise;
- progressing between ordinary sections does not force unexpected focus movement;
- attempted progression with invalid input moves focus to the first invalid field or an associated error summary;
- entering evidence preview places focus at a clear preview heading only when the view changes substantially;
- returning from preview restores focus to the initiating control or relevant decision region;
- reset confirmation returns focus predictably on cancel and to the initial review heading on confirm;
- completion announces the resulting state and provides a predictable next focus target;
- hold / clarify places focus on the hold-state heading or summary;
- focus is never used to imply approval.

## Screen-Reader Semantics Acceptance

A future approved implementation must provide:

- one clear primary heading naming the review purpose;
- semantic section headings matching the information hierarchy;
- programmatic labels and descriptions for every input;
- a grouped accessible name for the classification choices;
- required-state and invalid-state semantics;
- error messages programmatically associated with fields;
- concise status announcements for preview readiness, hold, reset, and manual-transfer completion;
- boundary reminders available in the normal reading order;
- no essential information conveyed only through icons, position, or color;
- evidence preview exposed as readable text, not an inaccessible visual-only region.

Announcements must be limited to meaningful state changes and must not repeat large packet content unnecessarily.

## Visual And Cognitive Accessibility Acceptance

A future visual design must:

- meet the adopted contrast requirements for text, controls, focus indicators, and meaningful graphics;
- preserve readable zoom and text reflow;
- use persistent labels rather than placeholder-only instructions;
- avoid color-only classification or error meaning;
- keep boundary language concise, plain, and consistently located;
- separate packet facts, forbidden uses, reviewer choices, and evidence preview visually and semantically;
- avoid dense multi-column layouts that disrupt reading order;
- make destructive reset or exit consequences explicit;
- avoid animation that is required to understand state;
- respect reduced-motion preferences if motion is later introduced;
- provide adequate target sizing and spacing when touch interaction is later approved.

No exact color, spacing, typography, or component-token decision is approved by this record.

## Responsive Acceptance

The same task order and semantic reading order must be preserved across supported viewport sizes.

Expected behavior:

- the primary flow remains single-direction and does not require horizontal scrolling for ordinary content;
- information may stack, but boundary reminders must remain before decision controls;
- classification labels and rationale fields remain understandable without truncation;
- evidence preview remains readable and selectable for manual transfer;
- sticky or fixed regions must not obscure content, focus, or status messages;
- zoom and reflow must not remove actions or change their meaning.

Exact breakpoints remain an implementation decision after the app root and existing responsive system are inspected.

## State Transition Rules

Allowed transitions:

- `initial` → `ready for review`;
- `ready for review` → `decision in progress`;
- `decision in progress` → `rationale required` or `evidence preview ready`;
- any review state → `hold / clarify` when a governance condition is implicated;
- `evidence preview ready` → `decision in progress` for revision;
- `evidence preview ready` → `completed for manual transfer` after boundary acknowledgement;
- any state with temporary input → `reset / exit` through the defined confirmation behavior;
- invalid identity or scope → `blocked`.

Disallowed transitions:

- any state → implementation approved;
- any state → release approved;
- any state → operationally approved;
- any state → automatically saved or written;
- any state → external communication sent;
- any state → autonomous action executed.

## Accessibility Validation Boundary

A future implementation plan should define evidence for:

- semantic structure inspection;
- keyboard-only completion;
- focus order and focus recovery;
- error identification and recovery;
- screen-reader name, role, state, and announcement checks;
- zoom, reflow, and responsive behavior;
- contrast and non-color meaning;
- reduced-motion behavior if applicable;
- manual review of non-approval language and authority separation.

The exact tools, browsers, assistive technologies, viewport set, and conformance target must be selected in a later implementation plan after repository and product constraints are inspected.

Automated accessibility checks supplement manual testing and do not prove full accessibility or release readiness.

## Failure And Hold Conditions

Stop and route to hold / clarify when:

- a classification or control implies authority beyond planning;
- boundary reminders are missing, hidden, or contradictory;
- the task cannot be completed by keyboard;
- focus becomes trapped, lost, or unpredictable;
- required semantics or labels are absent;
- an error destroys valid reviewer input without warning;
- responsive layout changes task order or meaning;
- completion language implies an automatic write or approval;
- accessibility evidence is missing or contradictory;
- the proposed design requires real data, source retrieval, persistence, logging, shared access, or external action.

Accessibility failures are blocking for any future exposure and cannot be waived by a passing build alone.

## Decisions

1. CLO-74 remains the conceptual IA foundation.
2. The first-slice task flow is now explicit for planning review.
3. Initial, ready, in-progress, validation, preview, completion, hold, blocked, error, reset/exit, and bounded loading states are defined.
4. Boundary reminders must appear before decisions and at evidence/completion.
5. Completion means complete for manual transfer only.
6. Keyboard, focus, screen-reader, responsive, visual, and cognitive acceptance are required.
7. Accessibility failures block future exposure.
8. Exact components, tokens, breakpoints, tools, and implementation mechanisms remain unapproved.
9. The slice remains not ready for implementation.

## Remaining Readiness Gaps

Still unresolved:

- exact synthetic fixture implementation contract and fixture location;
- approved app root, route, component, and state boundary;
- exact UI component and semantic patterns after repository inspection;
- exact authentication and authorization design for any shared exposure;
- selected accessibility conformance target, test tools, assistive technologies, browsers, and viewport set;
- selected disable and rollback mechanisms;
- reusable approval-record template and location;
- consolidated Definition-of-Ready reassessment;
- explicit Founder approval to implement.

## Acceptance Criteria

CLO-80 passes for human review when:

- the reviewer goal and task flow are explicit;
- information hierarchy preserves visible boundaries;
- all required interaction states and transitions are defined;
- non-approval language avoids authority ambiguity;
- keyboard and focus expectations are explicit;
- screen-reader semantics and status announcements are explicit;
- responsive, visual, and cognitive acceptance are explicit;
- accessibility failures remain exposure-blocking;
- implementation-specific choices remain deferred;
- the slice remains honestly classified as not ready for implementation.

## Stop Conditions

Stop if future work attempts to use this record alone to approve a route, screen, component, prototype, executable interaction, authentication change, source retrieval, persistence, logging, shared access, deployment, release, production readiness, external communication, autonomous action, or authority to act.

## Recommended Next Branch

`CLO-81 — Reassess first-slice Definition of Ready and implementation authorization prerequisites`

The next branch should consolidate CLO-76 through CLO-80, identify remaining blockers without assuming implementation approval, and determine whether another planning card is required before a Founder implementation-authorization decision.

## Explicit Non-Approvals

This artifact does not approve implementation, a prototype, route, screen, component, design system change, executable tests, authentication or authorization changes, source retrieval, persistence, logging, shared access, deployment, release, rollback execution, production readiness, external communication, autonomous action, or authority to act.

## Suggested Validation

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-first-slice-ia-ux-states-accessibility-acceptance.v0.1.md
git diff --check
```

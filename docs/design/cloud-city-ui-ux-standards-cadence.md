# Cloud City UI/UX Standards Research Cadence

## Status

- Docs-only.
- Planning-only.
- Human-reviewed.
- Cadence and evidence-standard artifact only.
- Not a design system.
- Not a root-level `DESIGN.md`.
- Not a component spec.
- Not a tool-selection decision.
- Not Playwright, Storybook, Cypress, visual-regression, or CI/CD implementation approval.
- Not UI implementation approval.
- Not production readiness.
- Not operational approval.

Current Agent Builder / City Center posture remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

`PASS` means pass for human review only.

Humans approve. Humans execute.

## Purpose

This cadence defines how Cloud City keeps UI/UX standards, accessibility expectations, brand-fit guidance, trend-fit references, design-quality guidance, frontend quality expectations, and validation-tool awareness current over time.

It follows the reusable review structure in `docs/templates/cloud-city-ui-ux-review.template.md` and defines how future research findings should become review criteria, template updates, follow-up issues, decision records, or separate implementation proposals.

This artifact does not start UI implementation.

## Controlling Context

Use this cadence with these current repo and project materials:

- `docs/templates/cloud-city-ui-ux-review.template.md`
- `docs/decision-records/e2e-tooling-playwright-direction.md`
- `docs/agent-builder/governance-rules.md`
- `docs/agent-builder/documentation-formatting-standard.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-ui-reviewer-cockpit-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-ui2-static-mockup-governance.v0.1.md`
- Current Cloud City Brand Guidelines PDF in Drive

When this cadence conflicts with a controlling governance artifact, the more specific governance artifact controls.

## Cadence Model

| Cadence | Trigger | Purpose | Output |
| --- | --- | --- | --- |
| Quarterly standards pulse | Once per quarter while UI/product work is active | Review accessibility, frontend, testing, and design-quality sources for material changes | Standards pulse note, no-action decision, template update recommendation, or follow-up issue candidate |
| Per significant UI milestone | Before approving new public, product, authenticated, or internal UI work | Apply the Cloud City UI/UX review template to the specific surface | Completed review template, open risks, and explicit proof/non-proof statement |
| Event-driven review | Material external change, major dependency upgrade, framework change, accessibility requirement change, or brand refresh | Decide whether standards, acceptance criteria, or tooling direction need revision | Focused decision record, template update, or implementation proposal candidate |
| Annual brand and product-language review | Annual brand refresh or major campaign direction change | Reconcile brand guide, product tone, visual direction, accessibility, and UI standards | Brand/UI delta note and follow-up issue candidates |
| Post-release or post-milestone retrospective | After meaningful UI release or manual QA pass | Identify what standards were useful, missing, too heavy, or unclear | Retrospective note and lightweight improvements to future review criteria |

For a solo/founder-led project, the quarterly standards pulse should be time-boxed and practical. A useful default is one focused pass that reviews only high-signal sources and produces either no action or one to three follow-up candidates.

## Source Lanes

### Accessibility Standards And Practices

Primary sources:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Selecting Web Accessibility Evaluation Tools](https://www.w3.org/WAI/test-evaluate/tools/selecting/)

Review for:

- keyboard access
- focus visibility and focus order
- semantic structure
- heading order
- labels and accessible names
- contrast and non-text contrast
- non-color-only meaning
- readable copy
- target size
- reduced motion
- screen-reader behavior
- mobile and reflow behavior

Accessibility requirements override trend-fit and visual novelty.

### Cloud City Brand And Product Fit

Primary sources:

- Current Cloud City Brand Guidelines PDF in Drive
- `docs/templates/cloud-city-ui-ux-review.template.md`
- Human-approved brand or product-language decisions

Review for:

- modern, sleek, streamlined, and sophisticated presentation
- inclusive, warm, high-trust tone
- sunset/twilight-informed color usage where relevant
- restrained art-deco-informed cues where relevant
- readable typography and calm visual hierarchy
- clear, accessible state communication
- avoidance of whimsical drift

Brand mood-board language should not be treated as product-language permission to introduce ornamental, fantasy-forward, or unclear motifs into product surfaces. Product UI should stay restrained, legible, and trustworthy.

### Frontend Platform And Framework Practices

Primary sources:

- Current repo evidence in `package.json`
- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
- Existing repo review guidance in `AGENTS.md` and `code_review.md`

Review for:

- Next.js and React changes that affect routing, hydration, rendering, forms, images, metadata, or accessibility
- TypeScript, lint, and framework conventions that affect UI safety
- browser-visible behavior risks
- mobile, responsive, and performance expectations

This lane is awareness-only during CLO-20. It does not approve package changes, runtime changes, routing changes, or implementation changes.

### Testing, E2E, Accessibility Tooling, And Visual Evidence

Primary sources:

- `docs/decision-records/e2e-tooling-playwright-direction.md`
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- Current repo test scripts and CI/CD behavior

Review for:

- whether future evidence lanes still match repo direction
- whether proposed tooling remains appropriately narrow and reversible
- whether automated accessibility checks are framed as supplemental signals
- whether visual screenshots or visual regression are framed as change-detection aids, not design proof
- whether manual QA and human design review remain visible

This lane does not approve Playwright installation, Storybook, Cypress migration, visual regression, CI/CD changes, dependency changes, browser automation, or new tests.

### Design-System Governance And Product-Design Practice

Primary sources:

- Existing Cloud City review template
- Current brand guide
- Human-approved future design-system decisions
- Current accessibility and frontend source lanes

Review for:

- whether repeated UI decisions are stable enough to become standards
- whether tokens, components, patterns, or layout rules need explicit authority
- whether root-level design documentation would reduce ambiguity
- whether design-system guidance would be premature or too heavy

This lane should create follow-up issue candidates when design-system work becomes valuable. It should not establish a design system by implication.

### Trend-Fit And Design-Quality References

Trend and inspiration sources may be used only as secondary inputs.

A trend-fit reference is useful only when it improves clarity, trust, speed, accessibility, readability, or brand fit.

Each trend-fit finding should record:

- source name
- source date or access date
- observed pattern
- why it may matter for Cloud City
- accessibility and usability risks
- recommendation
- whether action is needed now

Trend research never overrides accessibility, usability, governance, or product trust.

## Evidence Standards

Each standards pulse should separate:

- verified facts
- inferences
- open questions
- risks
- recommendations

Each material finding should include:

- source or repo path
- date reviewed
- affected surface or artifact
- evidence type
- what changed or what was observed
- impact on Cloud City UI/UX standards
- recommended action
- what the finding proves
- what the finding does not prove

Avoid using a source if its date, authority, or relevance cannot be established.

Public web information must not be treated as verified unless the source and date are clear.

## Finding-To-Action Workflow

Use this routing model for standards findings:

| Finding outcome | Use when | Action |
| --- | --- | --- |
| No action | The source is stable, irrelevant, too weak, or already covered | Record briefly in the standards pulse note |
| Template update candidate | The finding improves reusable review criteria | Propose a small update to `docs/templates/cloud-city-ui-ux-review.template.md` |
| Follow-up issue candidate | The finding needs separate discovery, design-system work, tool evaluation, or implementation planning | Draft a small Linear issue recommendation |
| Decision record candidate | The finding changes standing direction, approval boundaries, or evidence interpretation | Draft a docs-only decision record for human review |
| Implementation proposal candidate | The finding requires routes, components, tests, tooling, package changes, CI/CD, or runtime behavior | Stop and propose a separately approved implementation scope |
| Hold or escalate | The finding touches production readiness, operational approval, source authority, Drive/runtime behavior, data handling, persistence, logging, or unclear governance | Stop and request human approval or a controlling governance artifact |

## Evidence Lanes And Limits

| Evidence lane | Useful for | Does not prove on its own |
| --- | --- | --- |
| Static or design review | Brand fit, hierarchy, layout, copy direction, visual clarity, obvious UX gaps | Keyboard behavior, focus behavior, screen-reader behavior, implementation quality, production readiness |
| Implementation review | Semantic structure, labels, state rendering, code-to-UI alignment, regression risk | Full accessibility, task success, visual excellence, operational approval |
| Manual QA | Real interaction behavior, mobile behavior, visible state transitions, flow clarity | Exhaustive coverage, future regression safety, design-system authority |
| Automated accessibility tooling | Common detectable accessibility defects and regressions | Complete accessibility, usability quality, design quality, human accessibility sufficiency |
| Component-level checks | Isolated state rendering and local behavior where tooling exists | Full route flow quality, cross-surface integration, production readiness |
| E2E flow tests | Critical route and task flow behavior when separately approved | Visual excellence, broad accessibility sufficiency, nuanced copy quality, operational approval |
| Visual screenshots or visual regression | Unintended visual changes and layout drift when separately approved | Interaction quality, accessibility quality, design intent, production readiness |
| Human design review | Aesthetic judgment, brand fit, restraint, product communication quality | Implementation safety, accessibility proof, runtime authority, operational approval |

Keep this interpretation visible in every significant standards pulse and UI review.

## Accessibility Baseline Refresh Rules

The accessibility baseline should be refreshed when:

- WCAG, WAI, or APG guidance materially changes
- new UI surface types are proposed
- authenticated or internal UI work begins
- forms, approval flows, dashboards, dense data views, or reviewer-cockpit concepts advance
- automation or browser-driven validation is separately proposed
- manual QA finds repeated accessibility or usability gaps

The baseline should continue to include at least:

- keyboard access
- logical focus order
- visible focus
- semantic structure
- headings and labels
- accessible names
- color contrast and non-text contrast
- non-color-only meaning
- target size
- readable copy
- reduced motion
- screen-reader considerations
- mobile and reflow behavior
- error, loading, empty, blocked, warning, success, and approval-gated states

Automated tooling can assist this baseline, but human review and manual QA remain required for sufficiency judgments.

## Brand And Trend Refresh Rules

Brand and trend refreshes should preserve this product direction:

- modern
- sleek
- streamlined
- sophisticated
- inclusive
- warm
- high-trust
- sunset/twilight-informed where relevant
- art-deco-informed only when restrained and intentional

Trend references should be rejected or held when they:

- reduce readability
- weaken contrast
- obscure focus or state
- create visual clutter
- make mobile use harder
- rely on motion without reduced-motion consideration
- make approval or readiness semantics ambiguous
- imply capability expansion or operational authority
- push the surface toward ornamental drift instead of clear product communication

## Suggested Follow-Up Backlog Candidates

CLO-20 does not create these tickets by itself. These are candidate follow-up issues for human review:

1. Evaluate the value, scope, and authority boundaries for a future root-level `DESIGN.md`.
2. Define whether Cloud City needs a lightweight design system, and what primitives or decisions would justify one.
3. Establish UI quality tool-selection criteria for accessibility tooling, visual QA, component review, E2E, and regression evidence.
4. Draft a future Playwright implementation plan with package, CI, rollback, flake-control, and first-slice boundaries.
5. Define the UI implementation approval gate for future `/city-center`, authenticated dashboard, and Agent Builder surfaces.

Each candidate should remain small, separately approved, and explicit about what it does not authorize.

## What This Cadence Proves

This cadence supports the conclusion that Cloud City has a lightweight process for keeping UI/UX standards current.

It also supports the conclusion that future standards findings have a defined path into no-action notes, template updates, follow-up issues, decision records, or separately approved implementation proposals.

## What This Cadence Does Not Prove

This cadence does not prove:

- production readiness
- operational approval
- full accessibility
- design-system readiness
- root-level design-document authority
- UI implementation approval
- runtime, model, tool, source, Drive, persistence, logging, release, or rollback approval
- approval to install, configure, or run Playwright, Storybook, Cypress, axe, visual regression, or browser automation
- approval to add routes, components, styles, tests, CI/CD behavior, package changes, or app behavior

## Acceptance Criteria

This artifact is sufficient if it:

- defines a lightweight recurring cadence for UI/UX standards review
- identifies high-quality source lanes for accessibility, brand fit, frontend practice, design quality, and testing/tooling awareness
- explains how findings become review criteria, template updates, follow-up issue candidates, decision records, or separately approved implementation proposals
- keeps accessibility and usability above trend-fit
- preserves Cloud City brand-fit and product-trust expectations
- distinguishes static review, implementation review, manual QA, automated accessibility tooling, component checks, E2E, visual screenshots/regression, and human design review
- states what evidence lanes prove and do not prove
- keeps Agent Builder / City Center synthetic-only, pre-runtime, human-reviewed, approval-gated, and non-operational
- avoids package, CI/CD, route, component, runtime, Drive, persistence, logging, release, rollback, production-readiness, and operational-approval changes

## Validation Expectations

For this docs-only artifact:

- Review the rendered Markdown structure for one H1, ordered headings, readable sections, and meaningful links.
- Confirm the diff is limited to the intended Markdown artifact.
- Run `git diff --check` before concluding local validation.
- Do not run or add UI, E2E, browser, package, dependency, or CI/CD changes for CLO-20.

## Recommended Next Step

Use this cadence as the CLO-20 repo artifact.

Then decide whether to create the five follow-up Linear issues listed above, or keep them as backlog candidates until the next UI planning milestone.
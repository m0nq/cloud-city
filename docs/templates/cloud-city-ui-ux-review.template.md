# Cloud City UI/UX Review Template

## 1. Status

- Docs-only review template.
- Reusable for Cloud City website and product UI work.
- Not implementation approval.
- Not a design system.
- Not a component spec.
- Not a brand guide.
- Not production readiness.
- Not operational approval.

## 2. Purpose

Use this template to review Cloud City UI/UX quality in a practical, non-authoritative way.

It is intended for design review, PR review, implementation review, and manual QA planning across public and internal
surfaces.

This template is a review aid only. It does not replace the current Cloud City brand guide where available, controlling
governance artifacts, or human approval.

## 3. When To Use This Template

Use this template for:

- [ ] Public-site pages
- [ ] Product surfaces
- [ ] Authenticated surfaces
- [ ] Future `/city-center`
- [ ] Forms
- [ ] Dashboards
- [ ] Landing pages
- [ ] Reviewer-cockpit concepts
- [ ] Static concepts or mockups
- [ ] Implementation reviews
- [ ] Manual QA planning

## 4. Surface Metadata

- Surface / page / route / concept:
- Artifact type:
- Public / authenticated / internal:
- Static concept or implementation:
- Reviewer:
- Date:
- Related Linear issue:
- Related PR:
- Source materials reviewed:
- Applicable governance overlay, if any:
- Scope notes:

## 5. Brand-Fit Review

Review against current Cloud City brand direction and the current Cloud City brand guide where available.

This template does not replace brand authority. It only helps reviewers assess whether a surface appears aligned with the
current direction.

- [ ] The surface feels modern, sleek, streamlined, and sophisticated.
- [ ] The tone feels inclusive and warm without becoming casual or vague.
- [ ] The presentation feels high-trust and measured.
- [ ] Sunset or twilight-informed color choices support the experience where relevant.
- [ ] Any art-deco-informed cues feel restrained and intentional.
- [ ] Text remains readable and visually calm.
- [ ] Color use stays accessible and does not weaken clarity.
- [ ] The layout avoids visual clutter, noise, or over-decoration.
- [ ] The surface avoids whimsical drift.
- [ ] The review notes any meaningful alignment or deviation relative to the current brand guide where available.

## 6. Trend-Fit Review

Use this section to judge whether the surface feels current and well-calibrated without turning CLO-17 into a recurring
trend-research artifact.

- [ ] The surface feels current without chasing novelty.
- [ ] Trend choices support clarity, trust, speed, and accessibility.
- [ ] Motion, gradients, glass, blur, cards, density, or other current UI patterns are used with restraint.
- [ ] Trend choices do not weaken readability, contrast, performance, or mobile usability.
- [ ] The review notes whether deeper trend research or a CLO-20-style standards review is needed.

## 7. Visual Hierarchy And Layout Clarity

- [ ] The primary action is obvious.
- [ ] The reading order is clear.
- [ ] Spacing supports comprehension.
- [ ] Headings are scannable.
- [ ] Sections are visually distinct.
- [ ] Visual emphasis matches user priority.
- [ ] Cards, panels, and modules are not overloaded.
- [ ] The layout remains clear on mobile.
- [ ] Important information is not buried below decorative treatment.

## 8. Interaction Clarity And Task Flow

- [ ] Controls look actionable.
- [ ] Controls behave in a predictable way for the surface type.
- [ ] The next step is clear.
- [ ] Cancel, back, close, or retry paths are clear where relevant.
- [ ] Destructive actions are not hidden or easy to mis-trigger.
- [ ] Approval, submit, publish, or confirm language is explicit and unambiguous.
- [ ] Interaction states are visible and understandable.
- [ ] The flow does not require guesswork about what happens next.

## 9. Copy Clarity And Tone

- [ ] Labels use plain language.
- [ ] Labels and buttons are concise.
- [ ] Instructions are helpful without being wordy.
- [ ] Error messages explain what happened and what to do next.
- [ ] Success or confirmation copy does not overpromise.
- [ ] The surface does not imply production readiness or operational approval unless explicitly true.
- [ ] The surface avoids green-light language unless that approval is actually granted.
- [ ] Tone supports trust, clarity, and calm decision-making.

## 10. Accessibility Baseline

Use this section for baseline review. Some checks require implementation review or manual QA, not static review alone.

- [ ] Semantic structure appears appropriate for the surface.
- [ ] Heading order is logical.
- [ ] The keyboard path is clear or intentionally planned where applicable.
- [ ] Focus visibility is present or explicitly accounted for where applicable.
- [ ] Focus order is sensible where applicable.
- [ ] Labels and accessible names are present or clearly planned.
- [ ] Contrast appears sufficient for key content and controls.
- [ ] Meaning is not conveyed by color alone.
- [ ] Copy is readable at normal viewing size.
- [ ] Touch and click targets appear large enough.
- [ ] Motion is restrained and reduced-motion needs are considered.
- [ ] Screen-reader considerations are accounted for where applicable.
- [ ] Mobile and reflow behavior appear supportable.

## 11. Responsive And Mobile Behavior

- [ ] Small-screen layout is usable.
- [ ] Touch targets remain practical on mobile.
- [ ] Content wraps without breaking comprehension.
- [ ] No horizontal overflow is expected.
- [ ] Priority content remains visible on smaller screens.
- [ ] Forms remain usable on mobile.
- [ ] Keyboard and focus behavior on mobile is considered where applicable.
- [ ] Dense data views have a clear mobile strategy where relevant.

## 12. Performance And Perceived Performance

Use this section to capture performance and perceived-performance concerns without implying implementation work or test
approval in this review pass.

- [ ] Loading behavior feels clear and proportionate to the task.
- [ ] Layout stability appears protected and important content is unlikely to jump unexpectedly.
- [ ] Interaction latency appears acceptable for the intended workflow.
- [ ] Animation and motion are used with restraint.
- [ ] Mobile performance perception is considered, especially on content-dense or visually rich surfaces.
- [ ] Heavy visual effects are avoided where they do not improve the experience.

## 13. State Clarity

- [ ] Loading state is clear and does not look broken.
- [ ] Empty state is understandable and useful.
- [ ] Error state is clear and actionable.
- [ ] Success state is clear and proportionate.
- [ ] Disabled state explains why action is unavailable where needed.
- [ ] Confirmation state avoids ambiguity about what was accepted or changed.
- [ ] Warning state is visible and appropriately weighted.
- [ ] Blocked state is explicit.
- [ ] Review-needed state is explicit where relevant.
- [ ] Approval-gated state is explicit where relevant.
- [ ] Follow-up state is explicit where relevant.
- [ ] Unknown or insufficient-source state is explicit where relevant.

## 14. Governance-Fit Overlay For Governed Workflows Only

Use this section only when the reviewed surface belongs to a governed workflow such as Agent Builder or City Center.

If not applicable, mark this section `N/A`.

- [ ] Synthetic-only posture is preserved where required.
- [ ] Human-reviewed posture is preserved where required.
- [ ] Approval-gated posture is preserved where required.
- [ ] Non-operational posture is preserved where required.
- [ ] `PASS` means pass for human review only.
- [ ] Validation success does not imply operational approval.
- [ ] Mockups, templates, tests, or screenshots do not imply production readiness.
- [ ] UI language does not imply source authority, Drive authority, runtime authority, model authority, tool authority,
      persistence authority, or logging authority.
- [ ] Humans approve. Humans execute.

## 15. Validation Evidence Matrix

| Evidence type | Useful for | Cannot prove on its own | Review notes |
| --- | --- | --- | --- |
| Static or design review | Brand fit, hierarchy, layout, copy direction, state coverage, obvious UX gaps | Keyboard behavior, focus behavior, screen-reader behavior, full accessibility, implementation quality | |
| Implementation review | Semantic structure, labels, states, code-to-UI alignment, obvious regression risk | Real-world task success, full accessibility, production readiness, operational approval | |
| Manual QA | Real interaction behavior, major flow clarity, visible state transitions, mobile behavior | Exhaustive coverage, visual excellence, long-term regression safety | |
| Automated accessibility tooling | Common accessibility defects and regressions when tooling is available | Complete accessibility proof, usability quality, design quality | |
| Component-level checks, if available in the future | Isolated state rendering and local behavior | Full page flow quality, cross-surface integration quality | |
| E2E flow tests | Critical route and task flows when separately approved | Visual excellence, nuanced copy quality, broad accessibility sufficiency | |
| Visual screenshots or visual regression | Unintended visual changes and layout drift | Interaction quality, accessibility quality, intent quality, production readiness | Screenshot comparison can be brittle and should be interpreted with care. |
| Human design review | Design judgment, aesthetic judgment, brand or design fit, restraint, and communication quality | Implementation safety, accessibility proof, operational approval | |

Keep these cautions visible:

- Static review cannot prove keyboard, focus, or screen-reader behavior.
- Automated accessibility tooling is supplemental and not complete proof.
- E2E tests can verify critical flows but do not prove visual excellence.
- Screenshot comparisons can catch unintended visual changes but may be brittle.
- Passing tests, screenshots, or checks does not equal production readiness.

## 16. Findings Log

Allowed labels:

- Blocker
- Should Fix
- Non-blocking
- Follow-up Ticket
- Verified
- Hold Pending Visual QA
- Hold Pending Manual QA

| Finding | Evidence | Severity or label | Recommendation | Owner or follow-up | Status |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## 17. What This Review Proves

Use this section to record limited, evidence-backed conclusions only.

- Reviewed surface:
- Evidence considered:
- This review supports these modest conclusions:
  - <add conclusion>
  - <add conclusion>
- Verified strengths:
  - <add verified strength>
- Verified risks:
  - <add verified risk>

## 18. What This Review Does Not Prove

- This review does not prove production readiness.
- This review does not prove operational approval.
- This review does not prove full accessibility.
- This review does not approve implementation.
- This review does not approve runtime, model, tool, source, Drive, persistence, or logging behavior.
- This review does not replace the current Cloud City brand guide, any design system, or human approval.

## 19. Recommended Next Step

- [ ] Proceed to implementation review.
- [ ] Hold pending visual QA.
- [ ] Hold pending manual QA.
- [ ] Create follow-up ticket.
- [ ] Revise design.
- [ ] Block until governance or approval issue is resolved.

Reason:

- <add recommendation rationale>

Owner:

- <add owner or follow-up>

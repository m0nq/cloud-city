# Agent Builder UI-2 Static Mockup Governance v0.1

- Decision record status: proposed for human review only.
- This is a docs-only, planning-only governance decision record.
- This record is limited to UI-2 static mockup governance only.
- This record is not implementation approval, runtime approval, operational approval, or production readiness.
- This record approves no capability expansion.
- This record does not approve UI routes, UI components, UI data flows, UI state models, UI schemas, model calls,
  prompt execution, tools, integrations, Drive runtime behavior, source reads, persistence, runtime logging,
  automated records, automation, or authority to act.

## 1. Title

Agent Builder UI-2 Static Mockup Governance v0.1.

## 2. Status

- Proposed for Cloud City Agent Builder governance.
- Current repo-facing milestone for this drafting pass:
  `66b617e docs(agent-builder): reconcile UI reviewer cockpit governance milestone`.
- Current posture remains synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, non-operational, not
  production-ready, and not operationally approved.
- Current Drive handoff surface remains `Current Agent Builder State Snapshot v9 — 2026-06-23` as human-provided
  continuity context only. It is not design authority, runtime source authority, implementation authority, or
  operational approval.
- This record proposes whether UI-2 static mockups may later be permitted as non-authoritative design exploration.
- This record does not create mockups, does not authorize tool use in the current pass, and does not change current
  capability posture unless a human later approves this record or a later controlling artifact.
- Even if later human-approved, UI-2 remains separate from UI-3 local read-only prototypes, UI-4 operator workflow
  planning, UI-5 implementation, runtime/model behavior, Drive behavior, source behavior, persistence/logging,
  automation, operational approval, production readiness, and capability expansion.

## 3. Scope

- This record covers governance rules for possible future UI-2 static mockups only.
- This record covers what UI-2 static mockups may represent, what they may not imply, and what review caveats must
  remain visible.
- This record covers permitted inputs, blocked inputs, permitted outputs, blocked outputs, and retention expectations
  for any later approved UI-2 mockup pass.
- This record covers tool-specific boundary rules for Stitch, ChatGPT, Figma, and other AI/external design tools.
- This record covers relationship rules to UI-1 governance information architecture, the product blueprint, current
  reconciliation/roadmap records, and later UI-3/UI-4/UI-5 gates.
- This record does not cover UI implementation, runtime behavior, source reads, Drive runtime behavior, persistence,
  logging, automation, or capability expansion.

## 4. Non-Approvals / Explicit Boundaries

- UI-2 static mockups do not approve UI implementation.
- UI-2 static mockups do not approve routes, components, data flows, state models, schemas, runtime behavior, prompt
  execution, tools, integrations, source reads, Drive runtime behavior, persistence, logging, automation, operational
  approval, production readiness, or capability expansion.
- This record does not approve interactive prototypes, click-through prototypes, local read-only reviewer cockpit
  prototypes, operator workflows, implementation plans, implementation tickets, code import, or design-to-code
  handoff.
- This record does not approve runtime/model calls, prompt execution, tools, integrations, connector-style behavior,
  MCP-style behavior, Drive reads, Drive writes, Drive sync, source reads, file existence checks, content hashing,
  semantic source verification, source-packet binding, persistence, runtime logging, automated records, automation,
  release automation, rollback automation, or operational approval.
- This record does not make Stitch, ChatGPT, Figma, or any external/AI design tool into source authority, design
  authority, accessibility authority, implementation authority, or operational authority.
- This record does not approve capability expansion by implication.

## 5. Current Posture Preserved

- synthetic-only
- pre-runtime
- below L2
- human-reviewed
- approval-gated
- non-operational
- not production-ready
- not operationally approved

## 6. Required Boundary Statements, Verbatim

- `Drive handoff/status context is not runtime source authority.`
- `Deterministic contract conformance is not operational approval.`
- `PASS means pass for human review only.`
- `Humans approve. Humans execute.`

## 7. Planning Question

Planning question under review:

> Are we willing to permit UI-2 static mockups as non-authoritative, human-reviewed design exploration? If yes, under
> what constraints? Can Stitch, ChatGPT, Figma, or any AI/external design tool be used, and with what inputs/outputs?
> What remains blocked?

Proposed answer for human review:

- Yes, conditionally. UI-2 static mockups may be permitted only as non-authoritative, human-reviewed design
  exploration artifacts under the constraints in this record.
- No blanket approval is proposed for Stitch, ChatGPT, Figma, or other AI/external design tools.
- Any actual mockup creation or tool use remains blocked until a human explicitly approves this record or a later
  controlling artifact.

## 8. Proposed UI-2 Permission Model

- UI-2 static mockups, if later approved by a human, are non-authoritative design exploration artifacts only.
- UI-2 static mockups may explore static information grouping, reading order, visual hierarchy, reviewer emphasis,
  copy framing, and boundary visibility for human review.
- UI-2 static mockups must remain static. They may not behave like applications, routes, click-throughs, stateful
  views, dashboards, or local read-only prototypes.
- UI-2 static mockups may visually reinterpret UI-1 governance information architecture, but they may not redefine
  UI-1 boundary language or imply data structures, APIs, schemas, state models, navigation models, or implementation
  commitments.
- Each approved mockup artifact should carry a visible label such as `UI-2 static mockup only`, `planning-only`,
  `non-authoritative`, and `not implementation approval`.
- Any approved UI-2 mockup pass should be bounded to one named purpose, one named tool mode, named reviewers, and a
  defined retention expectation.
- Each approved mockup pass should name the human owner, tool used, input classes used, and what the artifact proves
  and does not prove.
- Static mockups may help a human review whether governance information could be made more legible. They do not create
  authority to build or run anything.

## 9. Permitted Inputs, If Approved

Only the following inputs may be used in any later approved UI-2 mockup pass:

- reviewed governance and product-planning Markdown under `docs/agent-builder/`, limited to files already approved for
  planning context
- human-authored summaries of current posture, current non-approvals, and required boundary statements
- synthetic-only example reviewer questions, state labels, or review scenarios
- abstract layout primitives, placeholder copy, neutral iconography, and non-sensitive visual references
- manually summarized continuity context from `Current Agent Builder State Snapshot v9 — 2026-06-23`, provided that
  the summary remains human-provided context only and is not treated as authority

Blocked inputs remain:

- real data
- redacted data
- confidential data
- sensitive data
- restricted data
- operational data
- runtime outputs
- runtime logs
- source packets
- source-system screenshots
- Drive screenshots
- Drive exports
- credentials
- secrets
- production records
- anything that would expand source authority, Drive authority, runtime authority, or operational authority

## 10. Permitted Outputs, If Approved

Permitted outputs from any later approved UI-2 mockup pass are limited to:

- static wireframes
- static annotated mockups
- static PNG, PDF, or slide-style exports
- human-written redlines, review notes, and rationale notes
- text companions explaining what the mockup proves and does not prove

Output rules:

- Generated visuals, mockups, or design exports are not source authority, accessibility proof, implementation
  authority, or operational approval.
- Generated code should not be imported.
- Static mockups are review aids only. They are not a component spec, route map, data model, state model, schema,
  implementation backlog, or build approval.
- If a working file exists in an external tool, the human-reviewed static export and its companion note remain the only
  review artifacts that may be cited for governance discussion. The working file remains non-authoritative.

## 11. Tool-Specific Boundaries For Stitch, ChatGPT, Figma, And Other AI/External Design Tools

Stitch, ChatGPT, Figma, or any AI/external design tool may not be used unless this or a later human-approved artifact
explicitly permits the specific use.

This record proposes one narrow default posture:

- Figma may be used only for one explicitly human-approved UI-2 mockup pass, in one named manual, non-AI canvas mode,
  limited to manually created static frames using allowed inputs from Sections 9 and 14.
- This does not approve Figma AI/generative features, plugins, dev-mode handoff, generated code, live embeds, real
  data, source screenshots, Drive uploads, operational screenshots, or implementation authority.
- Stitch remains blocked by this record.
- ChatGPT remains blocked by this record as a UI/mockup generation or design-authoring tool.
- Ordinary human-reviewed governance discussion in ChatGPT may continue as planning support only. It does not approve
  mockup generation, image generation, code generation, tool execution, or authority inference.
- Any other AI/external design tool remains blocked unless a later human-approved artifact names the specific tool and
  governing restrictions.

If tool use is proposed, the artifact must define allowed inputs, blocked inputs, allowed outputs, blocked outputs,
review requirements, storage/retention expectations, and source/data restrictions.

| Tool or class | Proposed posture under UI-2 | Allowed inputs if specifically permitted | Allowed outputs if specifically permitted | Explicit blocks |
| --- | --- | --- | --- | --- |
| Figma manual canvas only | Conditionally permitted for one explicitly human-approved UI-2 mockup pass only, in one named manual, non-AI canvas mode. | Allowed UI-2 inputs from Sections 9 and 14 only. Use manually created shapes, text, and layout blocks only. | Static frames, static exports, and human review notes only. | Figma AI/generative features, plugins, dev-mode handoff, generated code, live embeds, real data, source screenshots, Drive uploads, operational screenshots, and implementation authority. |
| Stitch | Blocked by this record. | None under this record. A later artifact would need to name the exact mode and restrictions. | None under this record. | Any use under this record, including mockup generation, code generation, component generation, or workflow implication. |
| ChatGPT | Blocked as a UI/mockup generation or design-authoring tool under this record. Ordinary human-reviewed governance discussion may continue as planning support only. | None for UI/mockup generation under this record. | None for UI/mockup generation under this record. | Mockup generation, image generation, code generation, tool execution, and authority inference. |
| Other AI/external design tools | Blocked unless a later human-approved artifact explicitly names the tool and restrictions. | Only later approved inputs would be allowed. | Only later approved static outputs would be allowed. | Blanket tool approval, undefined retention, sensitive data entry, source-authority leakage, accessibility proof claims, implementation authority, and operational approval. |

## 12. Human Review Requirements

Any later approved UI-2 mockup package should include:

- mockup title and date
- UI level statement: `UI-2 static mockup only`
- one named purpose
- human owner and human reviewers
- tool used and one named tool mode
- input classes used
- blocked inputs explicitly not used
- defined retention expectation
- artifact purpose
- what the mockup proves
- what the mockup does not prove
- explicit non-approvals carried forward

Review rules:

- PASS means pass for human review only.
- Human review must check for accidental implication of routes, components, state models, schemas, data flows, runtime
  behavior, source behavior, Drive behavior, or implementation approval.
- Human review must check that labels and annotations keep UI-2 separate from UI-3, UI-4, and UI-5.
- Human review must check that the artifact does not become a de facto source authority, accessibility authority, or
  implementation authority.
- Humans approve. Humans execute.

## 13. Accessibility / Visual QA Requirements

- UI-2 static mockups are not accessibility proof.
- UI-2 static mockups should not rely on color alone to convey status, risk, pass/fail, or approval meaning.
- UI-2 static mockups should keep text legible at normal review scale and should note any known contrast or readability
  uncertainty.
- If image exports are used, a companion text summary should preserve the same review meaning in readable prose.
- Any accessibility note at UI-2 is heuristic only. Keyboard navigation, focus behavior, semantics, and screen-reader
  behavior remain unproven until later separately gated work.

## 14. Source/Data/Privacy Boundaries

- No confidential, sensitive, restricted, real, redacted, or operational data may be entered into external/AI design
  tools unless separately governed and explicitly human-approved.
- `Current Agent Builder State Snapshot v9 — 2026-06-23` may inform human continuity summaries only. It does not
  become source authority, design authority, implementation authority, or operational approval by being referenced in
  a mockup discussion.
- Direct source reads, Drive reads, Drive uploads, runtime-log uploads, source-packet uploads, and operational
  screenshot uploads remain blocked unless separately governed and explicitly human-approved.
- Reviewed repo docs remain the preferred planning input surface for UI-2 mockup work.
- Any external tool working file or export remains a derived planning artifact only. It does not become repo doctrine,
  source authority, or machine-readable authority.
- If any external tool is later approved, the approving artifact should state who may retain working files, how long
  they may be retained, and what deletion or cleanup expectations apply.

## 15. Blocked Behavior

- creating click-through or interactive prototypes
- creating local read-only reviewer cockpit prototypes under UI-3
- planning operator workflow behavior under UI-4
- starting implementation under UI-5
- importing generated code
- using generated assets as implementation-ready specifications
- inferring routes, components, schemas, state models, data flows, APIs, prompts, tools, or integrations from mockups
- using runtime outputs, source data, or Drive content as tool inputs without separate explicit approval
- persisting review records, audit logs, or generated summaries as an automated system
- adding runtime logging, automated records, or automation
- treating a mockup as accessibility proof, implementation authority, operational approval, or production readiness
- using a mockup to justify capability expansion by implication

## 16. Relationship To UI-1 / UI-3 / UI-4 / UI-5

- UI-1 governance information architecture remains the controlling boundary for what conceptual reviewer information may
  be named without implying behavior.
- UI-2, if later human-approved, permits only static visual exploration of that governance information architecture.
- UI-3 local read-only reviewer cockpit prototypes remain separately gated and unapproved.
- UI-4 operator workflow planning remains separately gated and unapproved.
- UI-5 implementation remains separately gated and unapproved.
- Nothing in UI-2 collapses or skips the later UI gates.

## 17. Risks

- A static mockup could be mistaken for an approved implementation direction if labels and annotations are weak.
- An external design working file could become a de facto design authority unless the static export remains explicitly
  non-authoritative.
- Visual polish could create false confidence about runtime safety, data safety, accessibility, or operational
  readiness.
- Solo-developer memory or informal tool usage could reduce auditability unless tool choice, inputs, outputs, and
  retention are recorded.
- Human-provided Drive continuity context could be mistaken for source authority if mockup language becomes loose.
- Figma manual-only allowance, if later approved, still carries retention and external-hosting risk that must be kept
  visible.

## 18. Acceptance Criteria

This record is sufficient if it:

- preserves the current synthetic-only, pre-runtime, below-L2, human-reviewed, approval-gated, and non-operational
  posture
- preserves the required boundary statements verbatim
- states that UI-2 static mockups, if later approved by a human, are non-authoritative design exploration artifacts
  only
- states that UI-2 static mockups do not approve UI implementation
- states that UI-2 static mockups do not approve routes, components, data flows, state models, schemas, runtime
  behavior, prompt execution, tools, integrations, source reads, Drive runtime behavior, persistence, logging,
  automation, operational approval, production readiness, or capability expansion
- states that Stitch, ChatGPT, Figma, or any AI/external design tool may not be used unless this or a later
  human-approved artifact explicitly permits the specific use
- states that no confidential, sensitive, restricted, real, redacted, or operational data may be entered into
  external/AI design tools unless separately governed and explicitly human-approved
- states that generated visuals, mockups, or design exports are not source authority, accessibility proof,
  implementation authority, or operational approval
- states that generated code should not be imported
- states that any future UI-3 local read-only prototype, UI-4 operator workflow planning, or UI-5 implementation
  remains separately gated and unapproved

## 19. Next-Step Boundaries

- Remain docs-only, planning-only, and human-review-only after this drafting pass.
- Do not create mockups under this record until a human explicitly approves this record or a later controlling
  artifact.
- Do not use Stitch, ChatGPT, Figma, or any other external/AI design tool under this record until the exact specific
  use is explicitly human-approved.
- Do not infer approval for UI-3 local read-only prototypes, UI-4 operator workflow planning, UI-5 implementation,
  Stitch, ChatGPT, runtime/model behavior, Drive behavior, source reads, persistence/logging, automation, operational
  approval, production readiness, or capability expansion from the existence of this record.
- If future work continues, the next safe step is a separate human decision either to remain paused or to approve one
  exact UI-2 mockup pass with one named purpose, one named tool mode, named reviewers, a defined retention
  expectation, and the current blocked posture preserved.

# Cloud City Agent Builder Production Readiness Roadmap v0.3

## 1. Status And Scope

This is a planning-only production-readiness roadmap for Cloud City Agent Builder.

Historical repo baseline for this roadmap artifact: `9f35be3 docs(agent-builder): add CLI operator planning governance record`.

Current repo-facing governance baseline after later docs-only reconciliation:
`db8c749 docs(agent-builder): reconcile roadmap through L1.9 planning governance`.

Current repo `main` HEAD / latest deterministic implementation refinement at the time of this docs-only slice:
`ad0dda3 feat(agent-builder): clarify Event Readiness report semantics`.

`ad0dda3` clarifies deterministic Event Readiness report semantics only by separating contract conformance from bounded
review classification in the local synthetic eval/reporting layer. It does not approve production readiness, Event
Readiness runtime generation, model calls, prompts, routes, tools, integrations, Drive behavior, UI/reviewer cockpit
behavior, source reads, file existence checks, content hashing, semantic source verification, source-packet binding,
real/redacted data use, operational approval, or autonomous action.

Current repo-facing anchor:
[Agent Builder current-state reconciliation v0.1](./agent-builder-current-state-reconciliation.v0.1.md)

This roadmap supersedes the Drive artifact `Cloud City - Agent Builder Production Readiness Roadmap v0.2` for
current-state planning. Roadmap v0.2 remains useful historical governance context, but it predates the L1.6
review-record lifecycle validation, the L1.6 operator-readiness review charter, the source/privacy/audit governance
foundation now stabilized in repo, and the roadmap/status reconciliation now includes the L1.9 CLI/operator
planning-governance record through `9f35be3`.

Post-roadmap governance status note: after Roadmap v0.3 was added at
`2d6997d docs(agent-builder): add production readiness roadmap v0.3 scope`, humans continued to maintain separate
Drive governance/status records. Those records remain human-provided context only and do not alter repo-evidence,
agent-authority, Drive-access, runtime, or operational-approval boundaries.

That Drive governance/status context may reflect current human governance/status tracking, but it remains human-provided
context only unless separately verified. It preserves this Roadmap v0.3 as the
current repo-facing production-readiness planning artifact and preserves `Cloud City — Agent Builder Data & Privacy
Taxonomy v0.1` as prior draft context.

This repo note is linkage only. It does not copy the Drive record into the repo and does not approve implementation,
operational use, source reads, source verification, runtime/model behavior, CLI/operator wiring, UI/reviewer cockpit work,
Drive automation, public/real/redacted/personal data use, external communication, or autonomous action. Drive v0.5 is
not Codex-verified repo evidence and must not be treated as repo doctrine, source authority, operational approval, or
permission for local agents to read from or write to Drive.

This roadmap does not approve implementation, operational use, CLI/operator wiring, runtime/model calls, prompts,
routes, tools, integrations, Drive sync, Drive writes by local agents, UI/reviewer cockpit work, source reads, file
existence checks, content hashing, semantic source verification, source-packet binding, real or redacted event data,
operational approval, or autonomous action.

## 2. Historical Baseline Through 9f35be3

Relevant milestone chain:

- `1949d06 docs(agent-builder): reconcile event readiness report-clarity milestone`
- `d67f493 test(agent-builder): add review record lifecycle validation`
- `3dfd5a7 docs(agent-builder): reconcile L1.6 review record lifecycle milestone`
- `675777f docs(agent-builder): add L1.6 operator-readiness review charter`
- `c45b005 docs(agent-builder): reconcile product blueprint with L1.6 operator-readiness`
- `2d6997d docs(agent-builder): add production readiness roadmap v0.3 scope`
- `205b9a8 docs(agent-builder): link roadmap to source boundary charter`
- `68c2498 docs(agent-builder): add source boundary approval authority record`
- `2162cb4 docs(agent-builder): add privacy data boundary governance record`
- `fa5a6cb docs(agent-builder): add audit log records retention governance record`
- `9f35be3 docs(agent-builder): add CLI operator planning governance record`

Historically complete through `9f35be3`:

- Event Readiness has a governed local spec and local registry entry.
- Event Readiness has seven synthetic fixture/eval cases for pre-runtime deterministic validation.
- Event Readiness has deterministic pre-runtime runtime-output validation for synthetic draft packets.
- Event Readiness includes a report-facing `declaredSourcePacketReferenceSummary` that is non-authoritative and
  declared-metadata-only.
- Event Readiness has deterministic, in-memory, synthetic-only L1.6 review-record lifecycle validation.
- The L1.6 operator-readiness review charter defines operator-readiness as evidence-review readiness, not execution
  readiness.
- The product experience blueprint is reconciled to the L1.6 operator-readiness boundary.
- The source-boundary terminology and evidence-authority charter is present for planning-only source-boundary language.
- Drive governance/source-of-truth boundaries are clarified as docs-only governance limits.
- Source-boundary approval ownership and no-evidence-state-promotion rules are defined.
- Privacy/data-boundary taxonomy, blocked data classes, surface boundaries, and retention-boundary framing are defined.
- Audit-log/records-retention artifact categories, default non-retention posture, traceability metadata, and
  cleanup/deletion boundaries are defined.
- L1.9 CLI/operator planning governance is now documented as a planning-only control-model gate and does not approve
  L2 workflow, CLI implementation, runtime/model behavior, Drive behavior, UI behavior, release/rollback, or
  operational approval.
- Completion of the L1.9 planning-governance gate does not authorize progression into L2 or select any unresolved
  dependency record as the next required milestone.
- Roadmap/status reconciliation now distinguishes current governance-foundation records from remaining future decision
  records.
- Drive governance/status records have been updated by humans to reflect the current milestone chain, but current Drive
  v0.5 remains human-provided context only.

The current Event Readiness baseline remains synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, and
non-operational.

## 3. What L1.6 Proves

L1.6 proves only that deterministic, in-memory, synthetic-only review-record lifecycle validation can check structure
and boundary-safety posture for synthetic human-review lifecycle records.

The L1.6 validator can check:

- required review-record concepts
- allowed lifecycle states
- allowed validation outcomes
- allowed human review dispositions
- accepted outcome/disposition mapping
- operational approval status remaining not granted
- prohibited-actions confirmation
- synthetic-only boundary declarations
- human-owned next steps
- declared source summary treatment as declared metadata only
- source-grounded clarification language when source metadata is referenced

L1.6 preserves these review-record lifecycle semantics:

- `PASS` means pass for human review only.
- `PARTIAL` means human-review-needed.
- `FAIL` blocks promotion to usable human-review draft status.
- `approvedForOperationalUse` remains false unless separately approved.

## 4. What L1.6 Does Not Prove

L1.6 does not prove:

- event readiness
- operational correctness
- source truth
- source freshness
- source completeness
- semantic source support
- source-packet binding
- content hashing
- file existence
- privacy safety for real or redacted data
- runtime/model behavior
- prompt quality
- Drive authority
- CLI/operator readiness
- UI readiness
- permission to act
- operational approval
- autonomous action

Declared metadata is not verified source evidence. Reconciled documentation is not operational approval.

## 5. Current Non-Approvals

The current Agent Builder and Event Readiness L1.6 baseline does not approve:

- CLI/operator wiring
- runtime/model calls
- prompts
- routes
- tools
- integrations
- Drive sync
- Drive writes by local agents
- UI/reviewer cockpit
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- real/redacted event data
- operational approval
- autonomous action

## 6. Production-Readiness Maturity Model

### Without-UI Path

| Level | Name | Meaning |
| --- | --- | --- |
| L0 | Spec/governance baseline | Specs, registry metadata, boundaries, fixture ideas, and governance posture exist. |
| L1 | Deterministic local validation and synthetic evals | Local validation and synthetic eval cases can check known structures and policy rules. |
| L1.5 | Pre-runtime runtime-output validation and report clarity | Synthetic draft packet output validation and report-facing declared metadata clarity exist. |
| L1.6 | Synthetic review-record lifecycle validation and operator-readiness evidence review | Synthetic lifecycle review records can be validated, and human reviewers can understand what the evidence proves and does not prove. |
| L1.7 | Source-boundary planning without reads or verification | Source-boundary rules are planned without source reads, file checks, hashing, semantic verification, or source-packet binding. |
| L1.8 | Privacy/data-boundary planning without real/redacted data | Data handling boundaries are planned without using real or redacted event data. |
| L1.9 | Operator-surface planning only, no CLI implementation | Human/operator control model is planned without implementing CLI/operator wiring. |
| L2 | Separately approved draft-only operator/CLI workflow | A future approval-gated milestone may allow a bounded draft-only operator workflow. |

### With-UI Path

| Level | Name | Meaning |
| --- | --- | --- |
| UI-0 | Product/UX planning artifact only | Product language and conceptual surfaces exist as planning artifacts only. |
| UI-1 | Governance information architecture only | Review concepts, evidence, states, and boundaries are mapped for human comprehension. |
| UI-2 | Static review mockups/prototypes only | Static artifacts may clarify review experience without routes, runtime, data flow, or operator behavior. |
| UI-3 | Local read-only reviewer cockpit prototype with synthetic data only | A future approval-gated prototype may use synthetic local data only and no runtime/source/Drive expansion. |
| UI-4 | Operator workflow planning, still no runtime/source/Drive/data expansion | Human workflow planning remains separate from runtime, source, Drive, and data behavior. |
| UI-5 | Separately approved implementation path | Any implementation requires a separate approved plan, tests, governance review, and release gate. |

## 7. Readiness Percentage Assessment

Production-readiness percentages are working estimates, not formal scoring. They are intended to prevent false
confidence and to make the remaining governance and implementation distance visible.

| Path | Current estimate | Rationale |
| --- | --- | --- |
| Without UI | 25-30% production-ready | The local governance, spec, registry, fixture/eval, pre-runtime validation, L1.6 lifecycle evidence, source-boundary approval authority, privacy/data-boundary governance, and audit-log/records-retention governance are meaningful. Production readiness still lacks approved Event Readiness operator workflow, runtime/model governance, Drive behavior governance for any future agent-side capability, operational approval model, release controls for real use, and any approved Event Readiness runtime path. |
| With UI | 10-15% production-ready | Product clarity exists, but UI remains conceptual. There are no approved routes, components, reviewer cockpit, UI data flows, UI-specific safety tests, or operator workflow surfaces. |

## 8. Evidence Inventory

Repo and governance evidence supporting the current maturity state:

- `docs/agent-builder/l1.6-operator-readiness-review.md`
- `docs/agent-builder/product/agent-builder-product-experience-blueprint.v0.1.md`
- `docs/agent-builder/operator-guide.md`
- `docs/agent-builder/architecture.md`
- `docs/agent-builder/governance-rules.md`
- `docs/agent-builder/agent-creation-lifecycle.v0.1.md`
- `docs/agent-builder/source-boundary-evidence-authority-review.v0.1.md` is the current repo planning artifact for
  source-boundary terminology and evidence-authority clarification. This charter clarifies controlled vocabulary and
  non-inference rules only; it does not authorize source reads, source-packet binding, semantic verification,
  runtime/model behavior, Drive automation, UI work, real/redacted data use, or operational approval.
- `docs/agent-builder/decision-records/agent-builder-drive-governance-source-of-truth-boundaries.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-source-boundary-approval-authority.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-privacy-data-boundary-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-audit-log-records-retention-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-cli-operator-planning-governance.v0.1.md`
- `agent_specs/event_readiness.v0.1.yaml`
- `registry/agent-registry.yaml`
- `docs/agent-builder/implementation-plan.md`
- `src/agent-builder/review-record-lifecycle/schema.ts`
- `src/agent-builder/review-record-lifecycle/validation.ts`
- `__tests__/agent-builder/review-record-lifecycle.test.ts`
- `fixtures/agent-builder/review-record-lifecycle/*.synthetic.json`
- Historical governance milestone chain in this roadmap is reconciled through `9f35be3`
- Human-owned Drive governance/status records are maintained separately from repo evidence; they remain human-provided
  context only, not Codex-verified repo evidence, repo doctrine, source authority, operational approval, agent-readable
  authority, permission for local agents to read from or write to Drive, or permission to use Drive as a runtime source
  of truth.

This inventory is evidence for planning status only. It does not authorize local agents to write Drive records or treat
Drive as a runtime source of truth.

## 9. Risk Register

| Risk | Severity | Why it matters | Current control | Next control |
| --- | --- | --- | --- | --- |
| Premature CLI/operator gravity | Medium | L1.6 evidence could be mistaken for readiness to expose commands or operator workflows. | Charter and product blueprint state no CLI/operator wiring. | Keep any operator-surface work behind a separate planning-only decision record. |
| Over-reading synthetic validation | Medium | Synthetic cases can create false confidence about real events. | Docs state L1.6 is synthetic-only and non-operational. | Keep a visible "what this proves / does not prove" section in future status updates. |
| Treating operator-readiness as execution readiness | Medium | Human evidence review could be confused with permission to run or act. | Charter defines operator-readiness as evidence-review readiness only. | Require this definition in any future roadmap or operator planning artifact. |
| Source-boundary confusion | Medium | Declared metadata could be mistaken for verified source evidence. | The source-boundary charter and approval-authority record keep evidence authority and approval boundaries explicit. | Keep source behavior blocked unless a separate later milestone explicitly expands source scope. |
| Drive-write/local-agent confusion | Low-Medium | Drive governance records could be mistaken as writable by local agents. | The Drive governance record blocks sync/writes by local agents and keeps Drive references separate from machine authority. | Keep Drive behavior in non-approvals unless a future Drive behavior decision record is approved. |
| Product/UI concept leakage into implementation | Medium | Conceptual UI surfaces could become implementation assumptions. | Product blueprint states future UI surfaces are conceptual only. | Keep UI/reviewer cockpit planning behind a separate UI decision record. |
| Real/redacted data boundary risk | Medium | Synthetic validation does not prove privacy safety for real or redacted event data. | L1.6 remains synthetic-only and the privacy/data-boundary governance record keeps non-synthetic data blocked. | Preserve the blocked posture unless a separate later milestone explicitly expands data scope. |
| Audit drift | Low-Medium | Repo docs, Drive status, and roadmap language can diverge. | Historical roadmap context remains anchored through `9f35be3`, and the current repo-facing reconciliation record anchors the governance baseline at `db8c749` and the later deterministic refinement at `ad0dda3`. | Tie future governance status updates to explicit commit IDs and reviewed artifacts. |
| Roadmap staleness | Medium | Historical v0.2 guidance can mislead future planning. | This v0.3 roadmap remains useful historical planning context, while the current repo-facing state is clarified in [current-state reconciliation v0.1](./agent-builder-current-state-reconciliation.v0.1.md). | Revisit this roadmap before any new capability-boundary record or unresolved dependency record. |

## 10. Roadmap Branch Options

| Option | Planning-only posture | Benefit | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Remain paused | No repo changes or capability expansion. | Safest way to prevent scope creep. | Roadmap clarity may decay over time. | Acceptable if no near-term planning is needed. |
| Maintain repo-facing reconciliation after `db8c749` / `ad0dda3` | Planning-only documentation. | Keeps the historical roadmap baseline, the current governance foundation, and the later deterministic refinement visible without implying capability expansion. | Could be misread as broader approval unless boundaries remain explicit. | Recommended current docs-only posture. |
| Pre-runtime governance foundation checkpoint reviewed | Planning-only governance summary. | Makes source/privacy/audit foundation completion visible before further planning. | Could be mistaken for implementation readiness if written loosely. | Treat as completed planning context; do not infer capability expansion. |
| CLI/operator planning governance completed at L1.9 | Planning-only control-model gate; does not approve L2 workflow, CLI implementation, runtime/model behavior, Drive behavior, UI behavior, release/rollback, or operational approval. | Clarifies human-review control-model boundaries before any later dependency sequencing. | Could still be misread as broader operator readiness unless non-approvals stay explicit. | Treat as completed planning governance; do not infer approval of unresolved dependency records. |
| Runtime/model planning later | Planning-only artifact. | Could define future model-call gates and eval requirements. | Too early for Event Readiness operational use. | Defer until source and data boundaries are clearer. |
| Drive behavior planning later | Planning-only artifact. | Could define future bounded Drive behavior if separately approved. | Strong gravity toward agent-side access and storage behavior. | Defer unless a separate Drive access question becomes concrete. |
| UI/reviewer cockpit planning later | Planning-only artifact. | Could clarify founder-friendly review surfaces. | Product concepts may leak into implementation. | Defer until governance information architecture is reviewed. |

This roadmap does not recommend implementation.

## 11. Current Governance Foundation And Remaining Future Decision Records

Current repo-stabilized governance foundation records:

- [Source-boundary approval authority decision record](./decision-records/agent-builder-source-boundary-approval-authority.v0.1.md)
- [Privacy/data-boundary governance decision record](./decision-records/agent-builder-privacy-data-boundary-governance.v0.1.md)
- [Audit log and records-retention governance decision record](./decision-records/agent-builder-audit-log-records-retention-governance.v0.1.md) for any later review workflow
- [CLI/operator planning-governance decision record](./decision-records/agent-builder-cli-operator-planning-governance.v0.1.md)

These records are complete for current planning clarity only. Their presence does not approve capability expansion,
implementation, runtime behavior, Drive behavior, source handling, data use, UI, or operational approval.

Historical pre-runtime governance foundation checkpoint through `9f35be3`:

- source-boundary terminology and approval ownership are documented
- privacy/data-boundary classes, blocked data categories, and retention-boundary framing are documented
- audit-log/records-retention artifact categories, non-retention posture, and traceability boundaries are documented
- CLI/operator planning governance is documented as a completed L1.9 planning-only control-model gate with no L2
  workflow or implementation approval
- Drive governance/status boundaries remain explicit and separate from source-of-truth or agent authority
- all current governance artifacts remain planning-only, synthetic-only, pre-runtime, below L2, human-reviewed,
  approval-gated, and non-operational

Remaining future decision records before capability expansion planning can advance:

- Runtime/model-call decision record
- Drive behavior decision record
- UI/reviewer cockpit decision record
- [Release and rollback governance decision record](./decision-records/agent-builder-release-rollback-governance.v0.1.md)
  as a completed docs-only planning governance dependency. This remains planning-only and does not approve
  release/rollback automation, production readiness, or movement above the current synthetic-only, pre-runtime,
  below-L2 posture.
- [Operational approval governance decision record](./decision-records/agent-builder-operational-approval-governance.v0.1.md)
  as a completed docs-only planning governance dependency. This remains planning-only and does not grant operational
  approval, production readiness, or movement above the current synthetic-only, pre-runtime, below-L2 posture.
- [Source/data authority boundary governance decision record](./decision-records/agent-builder-source-data-boundary-governance.v0.1.md)
  as the current proposed docs-only planning slice, pending human review. This remains planning-only and does not
  approve source reads, Drive runtime behavior, source-packet binding, semantic verification, real/redacted/
  non-synthetic data use, runtime logging, persistence, production readiness, or movement above the current
  synthetic-only, pre-runtime, below-L2 posture.

Each decision record should state what is approved, what remains blocked, what evidence supports the decision, what
tests or review gates are required, and what human role owns the decision.

## 12. Acceptance Criteria For Moving Beyond L1.6

Before any future planning branch advances beyond L1.6:

- The branch must be named as planning-only or separately approved implementation.
- The branch must preserve `PASS` as human-review-only, `PARTIAL` as human-review-needed, and `FAIL` as blocking usable
  human-review draft promotion.
- `approvedForOperationalUse` must remain false unless a separate operational approval milestone explicitly changes it.
- The branch must state whether it affects source behavior, data behavior, Drive behavior, runtime/model behavior,
  operator surfaces, UI, or operational approval.
- The branch must include explicit non-approvals for any adjacent capability not being approved.
- The branch must identify human-owned decisions and accountable reviewer hats.
- The branch must include acceptance criteria before any implementation prompt is considered.
- The branch must not use real or redacted event data unless a separate privacy/data-boundary milestone approves that
  scope.
- The branch must not include source reads, file existence checks, content hashing, semantic source verification, or
  source-packet binding unless a separate source-boundary milestone approves that scope.
- The branch must not add CLI/operator wiring, runtime/model calls, prompts, routes, tools, integrations, Drive sync,
  Drive writes, UI, operational approval, or autonomous action unless each capability has its own approved milestone.

## 13. Explicit Non-Goals

Roadmap v0.3 does not approve:

- implementation
- operational use
- CLI/operator wiring
- CLI commands, flags, scripts, or runbooks
- runtime/model calls
- prompts
- routes
- tools
- integrations
- Drive sync
- Drive writes by local agents
- Drive source-of-truth authority
- UI/reviewer cockpit
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- real or redacted event data
- privacy safety claims for real or redacted event data
- operational approval
- autonomous action

This roadmap also does not create implementation tickets or authorize production-readiness claims.

## 14. Recommended Next Gate

Recommended next gate:

1. Human review of the repo-facing current-state reconciliation anchored to `db8c749` and `ad0dda3`.
2. No implementation.
3. After review, decide whether to remain paused or clarify which unresolved dependency record should come next.
4. Do not treat L1.9 completion as L2 workflow approval, CLI implementation readiness, runtime/model readiness, Drive
   behavior approval, UI approval, release/rollback approval, or operational approval.
5. Do not proceed to CLI/operator implementation, runtime/model planning, Drive behavior implementation, or UI
   implementation from this roadmap.

If future work starts, it should begin with the smallest planning-only decision record that reduces governance ambiguity
without expanding capability.

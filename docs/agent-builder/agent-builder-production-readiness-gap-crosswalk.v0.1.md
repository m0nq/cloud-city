# Cloud City Agent Builder Production-Readiness Gap Crosswalk v0.1

## 1. Title

Cloud City Agent Builder Production-Readiness Gap Crosswalk v0.1.

## 2. Status, Scope, And Non-Purpose

- Docs-only.
- Planning-only.
- Draft for human review only.
- Crosswalk artifact only.
- Created for CLO-50: `Reconcile Agent Builder production-readiness gap after UI approval gate.`
- Repo baseline for this drafting pass: `cf485b2 docs(agent-builder): add UI implementation approval gate (#58)`.

This artifact maps what is complete now, what remains blocked, and what must be true before later bounded branches may advance.

This artifact is not:

- a decision record
- a roadmap rewrite
- implementation approval
- runtime approval
- source approval
- Drive approval
- tooling approval
- release approval
- rollback approval
- production readiness
- operational approval
- authority to act

This artifact preserves standing boundary language and does not create a new authority decision.

## 3. Verified Repo Baseline After CLO-47

- `cf485b2 docs(agent-builder): add UI implementation approval gate (#58)` is the current baseline for this CLO-50 drafting pass.
- `docs/agent-builder/decision-records/city-center-ui-implementation-approval-gate.v0.1.md` is now present as the explicit gate required before future UI implementation may begin.
- The UI implementation gate is a planning checkpoint only. It does not start implementation and does not approve UI-5 by default.
- The existing current-state reconciliation artifact records earlier readiness anchors through the prior stabilization chain.
- This CLO-50 crosswalk does not rewrite that artifact; it records the post-CLO-47 baseline at `cf485b2`.
- Earlier readiness anchors already recorded in that prior stabilization chain include:
  - `c0ad5b5 chore: update repo package manager to pnpm 11`
  - `76606a3 test(agent-builder): bind Event Readiness eval to spec`
  - `041ad1e ci: gate production deploy for docs and agent-builder changes`
  - `e3e61c4 docs(agent-builder): define loop-engineering governance`
  - `978ba58 test(agent-builder): tighten event readiness fixture typing`
- Repo governance records now exist for:
  - source-boundary approval authority
  - privacy/data-boundary governance
  - audit-log/records-retention governance
  - CLI/operator planning governance
  - runtime/model-call governance
  - Drive behavior governance
  - source/data authority boundary governance
  - release/rollback governance
  - operational approval governance
  - UI/reviewer cockpit governance
  - UI-2 static mockup governance
  - City Center UI implementation approval gating

## 4. Current Standing Posture

Agent Builder / City Center remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute.

PASS means pass for human review only.

Drive governance/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

Additional posture reminders preserved in this crosswalk:

- Reconciled documentation is not operational approval.
- Local developer CLI code is not an approved operator surface.
- Existing runtime/model prototype code paths do not imply Event Readiness runtime approval.

## 5. What Is Complete Now By Readiness Domain

### Governance And Reconciliation

- The repo has a current-state reconciliation artifact for earlier readiness anchors in the prior stabilization chain.
- This CLO-50 crosswalk adds the post-CLO-47 baseline without rewriting that earlier artifact.
- The production-readiness roadmap remains available as historical planning context rather than the current repo-facing status anchor.

### Deterministic Validation And L1.6 Evidence

- Event Readiness has a governed local spec and registry entry.
- Synthetic fixtures, eval coverage, deterministic pre-runtime runtime-output validation, and L1.6 review-record lifecycle validation are present.
- Eval execution is explicitly bound to `agent_specs/event_readiness.v0.1.yaml`.
- Fixture loading has been tightened without changing runtime behavior.

### Source And Data Governance

- Source-boundary terminology, approval ownership, no-evidence-state-promotion rules, privacy/data taxonomy, and source/data authority boundaries are documented.
- The repo remains authoritative for implementation state.

### Auditability And Retention Governance

- Artifact categories, non-retention-by-default posture, traceability metadata expectations, and cleanup/deletion boundaries are documented at planning level.

### Operator-Surface Governance

- L1.9 CLI/operator planning governance exists and keeps L2 explicitly separate.
- Human-review-only control-model language, reviewer hats, and conceptual operator action classes are documented.

### Runtime And Drive Boundary Governance

- Runtime/model-call and Drive behavior governance records exist and explicitly block runtime authority, source reads, Drive runtime behavior, persistence, logging, automation, and operational use.

### UI Governance

- UI-1 governance information architecture is documented.
- UI-2 static mockup governance is documented.
- CLO-47 added the UI implementation approval gate for UI-5 entry.
- Accessibility, review-lane, and future UI/tooling review aids exist in repo docs.

### Release And Operational Governance

- Release/rollback governance exists as planning-only evidence and rollback-control framing.
- Operational approval governance exists as planning-only approval-model framing.

### Shared Repo Rail

- Docs-only and Agent Builder-only diffs are classified as `non_runtime_changes_only`, reducing direct production-deploy coupling while keeping work on the shared main-repo rail.

## 6. What Remains Blocked Now By Readiness Domain

### Operator Surface And L2

- No approved Event Readiness operator surface exists.
- No approved L2 draft-only operator workflow is verified in this crosswalk.
- No CLI/operator implementation, commands, flags, or scripts are approved.

### Runtime And Model Behavior

- No runtime/model-call behavior is approved.
- No runtime prompts, routes, tools, integrations, MCP-style surfaces, or connector-style surfaces are approved.

### Source And Data Handling

- No source reads, file existence checks, content hashing, semantic source verification, or source-packet binding are approved.
- No real, redacted, public, personal, vendor, or operational data use is approved.

### Drive Behavior

- No Drive runtime reads, writes, sync, OAuth scope use, service-account use, local-agent access, or automated reconciliation are approved.

### Persistence, Logging, And Records

- No persistence expansion, runtime logging, automated records, audit-log implementation, or retention-schedule implementation is approved.

### UI Advancement

- UI-3 local read-only prototype work remains blocked.
- UI-4 operator workflow planning remains blocked.
- UI-5 implementation remains blocked unless separately proposed and explicitly approved.

### Release And Operational Use

- No release automation, rollback automation, production readiness, operational approval, or authority to act is approved.

### Design And Tooling Authority

- No root-level `DESIGN.md` exists in the repo today.
- No design system authority artifact exists today.
- No UI quality tooling implementation is approved, even though Playwright is the preferred future repo-level direction.

## 7. Readiness Domain Matrix

| Domain | Current state | Governed by | Blocked capabilities | Next evidence needed | Candidate follow-up card |
| --- | --- | --- | --- | --- | --- |
| Governance baseline and status reconciliation | Earlier reconciliation exists; this crosswalk adds the post-CLO-47 baseline | `docs/agent-builder/agent-builder-current-state-reconciliation.v0.1.md`; `docs/agent-builder/agent-builder-production-readiness-roadmap.v0.3.md` | Capability expansion by implication | Updated cross-domain map of complete vs blocked vs next evidence | New non-UI readiness card |
| Deterministic validation and L1.6 evidence | Present and meaningful, but human-review-only | `docs/agent-builder/l1.6-operator-readiness-review.md` | Operational use, runtime authority, UI readiness, source truth | Evidence composition showing what current validation can and cannot support in later branches | New non-UI readiness card |
| CLI/operator and L2 readiness | L1.9 planning-only complete; no approved L2 workflow is verified in this crosswalk | `docs/agent-builder/decision-records/agent-builder-cli-operator-planning-governance.v0.1.md` | CLI/operator wiring, commands, L2 workflow | One bounded prerequisite map for L2/operator/runtime/source-data/Drive/release-operational sequencing | New non-UI readiness card |
| Runtime/model-call readiness | Boundary record present; runtime remains blocked | `docs/agent-builder/decision-records/agent-builder-runtime-model-call-governance.v0.1.md` | Model calls, prompts, routes, tools, integrations, automation | Candidate runtime scope, prompt authority, input authority, retention/logging, release and operational separation | New non-UI readiness card |
| Source authority and verification | Approval ownership and non-inference rules are present | `docs/agent-builder/decision-records/agent-builder-source-boundary-approval-authority.v0.1.md`; `docs/agent-builder/decision-records/agent-builder-source-data-boundary-governance.v0.1.md` | Source reads, source verification, source-packet binding | Explicit preconditions for any later source-authority or verification branch | New non-UI readiness card |
| Privacy/data readiness | Taxonomy and blocked classes are documented | `docs/agent-builder/decision-records/agent-builder-privacy-data-boundary-governance.v0.1.md` | Non-synthetic data use, redacted/public/personal/vendor/operational data handling | Clear dependency path for any later non-synthetic data review | New non-UI readiness card |
| Drive behavior readiness | Boundary record present; Drive remains human context only | `docs/agent-builder/decision-records/agent-builder-drive-behavior-governance.v0.1.md` | Drive reads, writes, sync, OAuth, service accounts, automated reconciliation | Clear statement of whether any later branch even needs Drive behavior | New non-UI readiness card |
| Auditability, retention, and records | Planning-level categories and non-retention rules are documented | `docs/agent-builder/decision-records/agent-builder-audit-log-records-retention-governance.v0.1.md` | Runtime logging, automated records, detailed retention schedules | Cross-domain view of what later branches would need to retain, if anything | New non-UI readiness card |
| UI governance and implementation gate | UI-1, UI-2, and UI-5 entry gate exist | `docs/agent-builder/decision-records/city-center-ui-implementation-approval-gate.v0.1.md`; UI governance records | UI-3, UI-4, UI-5 implementation by implication | Exact later UI proposal scope tied to non-UI dependencies and preserved non-approvals | CLO-46 or CLO-48 later; not first |
| Release and rollback readiness | Planning-only governance exists | `docs/agent-builder/decision-records/agent-builder-release-rollback-governance.v0.1.md` | Release automation, rollback automation, maturity promotion by implication | Evidence composition that shows what later branches would need before a bounded release review | New non-UI readiness card |
| Operational approval readiness | Planning-only governance exists | `docs/agent-builder/decision-records/agent-builder-operational-approval-governance.v0.1.md` | Operational approval, operational execution, authority to act | Explicit separation between runtime, release, and operational approval in later branch sequencing | New non-UI readiness card |
| Root design authority | No root-level `DESIGN.md` was found in this repo during CLO-50 discovery | `docs/design/cloud-city-ui-ux-standards-cadence.md`; `docs/templates/cloud-city-ui-ux-review.template.md` | Root-level design authority by implication | Decision on whether Cloud City needs a root design authority artifact and what it would govern | CLO-45 |
| Design-system readiness criteria | No design system authority artifact exists; standards cadence explicitly says it is not a design system | `docs/design/cloud-city-ui-ux-standards-cadence.md`; `docs/templates/cloud-city-ui-ux-review.template.md` | Token/component authority, design-system approval by implication | Lightweight criteria for when design-system work becomes justified | CLO-46 |
| UI quality tooling direction | Repo already has a future Playwright direction record, but no implementation approval | `docs/decision-records/e2e-tooling-playwright-direction.md`; `docs/design/cloud-city-ui-ux-standards-cadence.md` | Playwright install, Storybook, Cypress activation, visual regression, browser automation, CI changes | Only useful if broader tool-selection criteria are still ambiguous beyond the accepted Playwright direction | CLO-48 |

## 8. Highest-Constraint Gaps And Why They Matter

### 8.1 No Bounded L2 And Operator-Surface Prerequisite Map

The repo has L1.9 planning governance, but it still lacks one explicit cross-domain artifact that says what must be true before any bounded L2/operator branch can advance. That is the highest constraint because operator-surface work is the first place where runtime, source, Drive, retention, release, and operational approval questions can collapse into one ambiguous branch.

### 8.2 No Composed Runtime/Source/Data/Drive Sequence

Each domain has a boundary record, but the repo does not yet have one composed prerequisite sequence that shows ordering, dependencies, and stop points across those domains. That gap creates authority-confusion risk even if each individual record is sound.

### 8.3 No Cross-Domain Release And Operational Readiness Composition

Release/rollback and operational approval records exist, but they remain separate planning records. There is still no bounded artifact that shows how future runtime, source/data, Drive, UI, and retention evidence would need to connect before either a release review or an operational approval review could be meaningful.

### 8.4 Design And Tooling Ambiguity Is Real But Not On The Critical Path

The repo does not have a root-level `DESIGN.md`, does not have design-system readiness criteria, and does not have UI quality tool-selection criteria beyond the accepted Playwright direction. Those are real planning gaps, but they do not currently constrain readiness as much as the missing non-UI prerequisite crosswalk.

## 9. What Must Be True Before Each Next Branch Can Advance

### Before A Bounded L2 / Operator Branch Can Advance

- The branch must remain planning-only.
- It must name exact operator-surface scope and exact out-of-scope boundaries.
- It must preserve `PASS` as pass for human review only.
- It must preserve the synthetic-only, pre-runtime posture unless a separate later approval changes that scope.
- It must explicitly depend on source/data, runtime/model, Drive, retention, release/rollback, and operational approval prerequisites.

### Before A Runtime / Model Branch Can Advance

- A bounded runtime scope must be named.
- Runtime input authority must be explicit.
- Runtime prompt authority must be explicit.
- Persistence, logging, release, and operational approval separation must be explicit.
- No runtime branch may imply source authority, data authority, Drive authority, or operational approval.

### Before A Source / Data Branch Can Advance

- Source authority must stay separate from Drive continuity context.
- Data classes in scope must be explicit.
- Any non-synthetic data discussion must remain blocked unless separately approved.
- No source branch may imply runtime permission, Drive permission, or operational approval.

### Before A Drive Branch Can Advance

- It must be explicit whether Drive behavior is actually needed.
- Least-privilege access, credential scope, retention, and records implications must be explicit.
- Drive behavior must remain separate from runtime approval and source authority approval.

### Before A UI Branch Beyond CLO-47 Can Advance

- A separate implementation or prototype proposal must exist.
- The proposal must identify exact surface, UI level, files, validation plan, manual QA plan, and preserved non-approvals.
- Any non-UI dependencies implicated by that surface must already be resolved or explicitly blocked.

### Before A Release / Rollback Branch Can Advance

- Candidate scope, validation evidence, boundary confirmation, and rollback controls must be explicit.
- Release review must remain separate from operational approval.

### Before An Operational Approval Branch Can Advance

- Runtime, source, data, Drive, UI, release, and rollback evidence must already be assembled in bounded form.
- A human-owned operational approval record must remain separate and explicit.
- No combined weaker artifacts may be treated as operational approval by accumulation.

## 10. Candidate Next-Card Branches

Scoring scale:

- `5` = strongest for value, safety, reversibility, or usefulness
- `1` = weakest for value, safety, reversibility, or usefulness
- authority-confusion risk: `1` = lowest risk, `5` = highest risk

| Candidate branch | Production-readiness value | Governance safety | Reversibility | Authority-confusion risk | Usefulness for choosing next cards | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| CLO-45 — evaluate root-level `DESIGN.md` scope and authority | 2 | 4 | 5 | 3 | 3 | Useful because no root-level `DESIGN.md` exists, but it addresses design-authority ambiguity rather than the main non-UI readiness bottleneck. |
| CLO-46 — define lightweight design-system readiness criteria | 2 | 4 | 4 | 3 | 3 | Useful because the standards cadence explicitly says it is not a design system, but this is still secondary to operator/runtime/source-data sequencing. |
| CLO-48 — establish UI quality tool-selection criteria | 2 | 4 | 4 | 2 | 3 | Useful because Playwright direction alone does not define the full UI quality tool-selection model across accessibility checks, manual QA support, visual evidence, component review, E2E coverage, and regression detection. It is still not the immediate next card because broader non-UI readiness sequencing remains the tighter constraint. |
| New non-UI readiness card — bounded L2/operator/runtime/source-data/Drive/release-operational prerequisites | 5 | 4 | 5 | 2 | 5 | Highest leverage because it composes the already-landed governance records into one explicit next-branch gate and reduces cross-domain authority confusion. |

## 11. Recommended Next-Card Decision

Recommended next card: a new non-UI readiness card for bounded L2/operator/runtime/source-data/Drive/release-operational prerequisites.

Why this is the strongest branch:

- CLO-47 already established the UI implementation gate, so the immediate UI approval-boundary ambiguity has been reduced.
- The repo already has meaningful design and tooling planning artifacts:
  - UI review template
  - UI/UX standards cadence
  - accepted future Playwright direction
- The highest remaining readiness risk is not missing UI planning. It is missing cross-domain sequencing across:
  - operator surface
  - runtime/model behavior
  - source authority
  - data authority
  - Drive behavior
  - retention/logging
  - release/rollback
  - operational approval

Rejected as first move, but still plausible later:

- CLO-45 is reasonable after the non-UI prerequisite map if root-level design authority still feels ambiguous.
- CLO-46 is reasonable after the non-UI prerequisite map if repeated UI decisions are starting to need stable criteria.
- CLO-48 is reasonable after the non-UI prerequisite map if Cloud City still needs a broader UI quality tool-selection model that connects accessibility checks, manual QA support, visual evidence, component review, E2E coverage, and regression detection.

## 12. Explicit Non-Approvals Preserved

This artifact does not approve:

- implementation
- CLI/operator use or wiring
- runtime/model calls
- prompts
- routes
- tools
- integrations
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- Drive reads, writes, sync, automation, OAuth, service accounts, or local-agent access
- persistence
- runtime logging
- automated records
- real data use
- redacted data use
- public, personal, vendor, or operational data use
- UI-3 local read-only reviewer cockpit prototypes
- UI-4 operator workflow planning
- UI-5 implementation
- Playwright installation or execution
- Storybook implementation
- Cypress activation or migration
- visual regression implementation
- CI/CD changes
- release automation
- rollback automation
- production readiness
- operational approval
- authority to act
- external communication
- autonomous action

## 13. What This Artifact Proves

This artifact proves only that the repo now has a CLO-50 crosswalk that:

- records the verified baseline after CLO-47
- maps what is complete now by readiness domain
- maps what remains blocked now by readiness domain
- identifies the highest-constraint gaps without creating new authority
- compares candidate next-card branches in a practical, bounded way
- recommends the strongest next planning branch based on current repo evidence

## 14. What This Artifact Does Not Prove

This artifact does not prove:

- implementation readiness
- runtime readiness
- source readiness
- data readiness
- Drive readiness
- UI readiness
- design-system readiness
- tooling implementation readiness
- release readiness
- production readiness
- operational approval
- authority to act

This artifact does not convert:

- roadmap language into approval
- reconciliation language into approval
- Drive governance/status context into runtime source authority
- deterministic validation into operational approval
- a recommended next card into an approved next card

## 15. Acceptance Criteria

This artifact is sufficient if it:

- remains a crosswalk rather than a decision record
- remains docs-only and planning-only
- names the verified baseline after CLO-47
- preserves the current standing posture verbatim
- separates complete domains from blocked domains
- includes the required readiness-domain matrix
- identifies highest-constraint gaps without implying approval
- compares the candidate next-card branches with explicit criteria
- states a recommended next card without treating that recommendation as approval
- preserves explicit non-approvals
- states clearly what the artifact proves and does not prove

## 16. Stop Conditions

Stop and report if any of the following appears:

- this artifact starts acting like approval instead of mapping
- the work requires modifying any file other than this crosswalk
- the work requires implementation, runtime, source/data, Drive, UI, tooling, package, CI/CD, release, rollback, production-readiness, or operational-approval changes
- Drive, status mirrors, Linear, or docs start being treated as runtime source authority
- validation fails and the repair is not obviously docs-only
- branch state or repo state becomes unclear

## 17. Recommended Next Action

Use this crosswalk as the CLO-50 planning artifact for human review.

If the crosswalk is accepted, the safest next planning move is:

1. Create a new non-UI readiness card for bounded L2/operator/runtime/source-data/Drive/release-operational prerequisites.
2. Keep that card planning-only.
3. Preserve all standing non-approvals.
4. Revisit CLO-45, CLO-46, and CLO-48 only after the non-UI prerequisite sequence is explicit enough to show whether design-authority, design-system, or tooling criteria are actually the next highest constraint.

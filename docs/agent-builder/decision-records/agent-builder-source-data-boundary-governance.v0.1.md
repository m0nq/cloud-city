# Agent Builder Source / Data Authority Boundary Governance v0.1

- Decision record status: proposed for human review only.
- This is a docs-only, planning-only governance decision record.
- This record is not operational approval.
- This record approves no capability expansion.
- This record does not approve implementation, runtime source reads, Drive behavior, real/redacted/non-synthetic data use, source-packet binding, semantic verification, persistence, logging, automation, production readiness, or authority to act.

## 1. Status

- Proposed for Cloud City Agent Builder governance.
- Current repo-facing reconciliation remains:
  `cbb7b88 docs(agent-builder): reconcile current state through operational approval governance`.
- Operational approval governance milestone remains:
  `901874a docs(agent-builder): add operational approval governance record`.
- Release/rollback governance milestone remains:
  `af8246c docs(agent-builder): add release rollback governance record`.
- Current governance baseline remains:
  `db8c749 docs(agent-builder): reconcile roadmap through L1.9 planning governance`.
- Latest deterministic implementation refinement remains:
  `ad0dda3 feat(agent-builder): clarify Event Readiness report semantics`.
- Current posture remains synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, and non-operational.
- This record does not approve runtime generation, model calls, prompts, routes, tools, integrations, Drive sync, Drive writes, Drive reads by local agents, source reads, file existence checks, content hashing, semantic source verification, source-packet binding, real/redacted/non-synthetic data use, persistence, runtime logging, automated record creation, UI/reviewer cockpit planning or implementation, release automation, rollback automation, operational approval, external communication, or autonomous action.
- This record defines current source/data authority boundary language only for future maturity planning. It does not change current capability posture.

## 2. Purpose

- Define the source/data authority boundary for future Agent Builder maturity planning without authorizing implementation, runtime source reads, Drive behavior, real/redacted/non-synthetic data use, source-packet binding, semantic verification, persistence, logging, automation, or operational use.
- Centralize current boundary language so future threads do not infer source authority or data authority from deterministic validation, release/rollback governance, operational approval governance, Drive status reconciliation, or roadmap wording.
- Keep the local repo, Drive governance/status context, and future source/data questions explicitly separated until a later human-approved milestone changes that posture.

## 3. Repo Evidence Basis

- This draft relies on repo evidence already established in:
- `docs/agent-builder/agent-builder-current-state-reconciliation.v0.1.md`
- `docs/agent-builder/agent-builder-production-readiness-roadmap.v0.3.md`
- `docs/agent-builder/source-boundary-evidence-authority-review.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-source-boundary-approval-authority.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-privacy-data-boundary-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-drive-governance-source-of-truth-boundaries.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-audit-log-records-retention-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-release-rollback-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-operational-approval-governance.v0.1.md`
- `docs/agent-builder/l1.6-operator-readiness-review.md`
- `docs/agent-builder/operator-guide.md`
- The current repo posture already blocks source reads, file existence checks, content hashing, semantic source verification, source-packet binding, Drive access by local agents, persistence, runtime logging, and non-synthetic data use.
- Existing source-boundary, privacy/data-boundary, Drive-boundary, audit/retention, release/rollback, and operational approval records remain cumulative. This record centralizes the current combined source/data authority boundary for planning clarity only.
- Human-provided Drive governance/status context may be mentioned only when labeled explicitly as human-provided context and unverified. It must not be treated as repo doctrine, runtime source authority, data authority, approval authority, or operational approval.

## 4. Decision

- This record decides that current source authority remains bounded and human-governed.
- This record decides that the local repo remains the implementation source of truth for Agent Builder specs, fixtures, evals, validators, tests, scripts, plans, and decision records.
- This record decides that Drive governance/status records remain human-provided context only and are not runtime source authority.
- This record decides that documentation may describe source and data boundaries, but description alone does not authorize source reads, integrations, runtime behavior, data use, or authority to act.
- This record decides that future source authority changes or data authority changes require explicit human approval and a separate decision record or tightly scoped approved addendum.
- This record decides that no approval under this record cascades to runtime behavior, Drive behavior, data use, persistence, logging, UI behavior, operational approval, or authority to act.
- Humans approve. Humans execute.

## 5. Scope

- This record covers current source authority posture for future planning.
- This record covers current data boundary posture for future planning.
- This record covers current non-inference rules for source/data authority claims.
- This record covers relationship rules to operational approval governance, release/rollback governance, deterministic validation, Drive governance/status context, and current solo-developer review discipline.
- This record does not cover implementation or capability expansion.

## 6. Source Authority Model

- The local repo remains the implementation source of truth.
- Drive governance/status records remain human-provided context only.
- Drive is not runtime source authority.
- Docs may describe source boundaries, provenance language, and blocked scope, but they do not authorize source reads, source integrations, validator-readable source packets, or runtime behavior.
- Declared metadata, source references, Drive links, reconciled status text, and planning artifacts do not become verified source evidence, semantic support, or authority to act by implication.
- Future source authority expansion requires explicit human approval and a separate approved artifact.

## 7. Data Boundary Model

- Current posture remains synthetic-only.
- No real customer, attendee, vendor, partner, financial, medical, private, redacted, pseudonymized, production, or operational data is approved.
- No non-synthetic data use is approved by deterministic validation, release/rollback governance, operational approval governance, or Drive status reconciliation.
- No public/real external data handling path is approved for source ingestion, runtime behavior, persistence, logging, or operational use by this record.
- Future movement beyond synthetic-only requires explicit governance, review evidence, and human approval.
- Redaction, pseudonymization, or human summarization do not create approved data authority by implication.

## 8. Explicitly Prohibited / Not-Yet-Approved Behaviors

- runtime generation
- model calls
- prompts
- routes
- tools
- integrations
- Drive sync
- Drive writes
- Drive reads by local agents
- source reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- real data use
- redacted data use
- non-synthetic data use
- persistence
- runtime logging
- automated record creation
- UI/reviewer cockpit planning
- UI/reviewer cockpit implementation
- release automation
- rollback automation
- operational approval
- external communication
- autonomous action

This record does not move the project above the current synthetic-only, pre-runtime, below-L2 posture.

## 9. Relationship To Operational Approval Governance

- Operational approval governance defines human-owned approval boundaries for any future operational use decision.
- Source/data authority boundary governance defines what source/data behaviors remain out of scope unless separately approved.
- Neither document grants runtime authority.
- Neither document grants Drive runtime authority.
- Neither document grants non-synthetic data authority.
- Humans approve. Humans execute.

## 10. Relationship To Release / Rollback Governance

- Release/rollback governance defines human-owned release evidence expectations and rollback control classes.
- Source/data boundary drift is a release-review and rollback trigger class even when the change is docs-only.
- Rollback remains human-owned and non-automated.
- No release review under the release/rollback record grants source authority, data authority, or runtime source access by implication.

## 11. Relationship To Deterministic Validation

- Deterministic validation may provide review evidence only.
- Validation passing does not approve source authority.
- Validation passing does not approve data authority.
- Validation passing does not approve operational approval, production readiness, or capability expansion.
- `PASS` remains pass for human review only.

## 12. Relationship To Drive Governance / Status Context

- Drive mirrors may help humans understand status.
- Drive status is not source authority for runtime behavior.
- Drive edits by ChatGPT or humans do not authorize local agent Drive access.
- Drive records should not be treated as executable configuration, runtime input, source packets, or authoritative operational data.
- Drive governance/status context remains human-provided context only unless separately verified and explicitly approved later.

## 13. Solo-Developer Safety Model

- `Builder Mode`: drafts docs/code proposals and states explicit scope and non-approvals.
- `Reviewer Mode`: checks boundary preservation, evidence, wording drift, and what the current evidence does and does not prove.
- `Approver Mode`: explicitly approves or rejects maturity movement within the allowed scope.
- One person may hold all three hats, but the modes should be performed sequentially and explicitly rather than implicitly.
- Any future source/data boundary change requires an explicit pause/review step before it may be treated as approved.
- Builder Mode does not self-approve.
- Reviewer Mode does not imply approval.

## 14. Boundary Drift Trigger Classes

- `drive_runtime_authority_implication`: wording implies Drive is runtime authority.
- `validation_authority_implication`: wording implies deterministic validation approves source/data use.
- `non_synthetic_data_implication`: wording implies real/redacted/non-synthetic data use.
- `source_binding_or_verification_implication`: source-packet, semantic verification, hashing, or file existence language appears without explicit approval.
- `runtime_read_write_log_persistence_implication`: runtime read/write/logging/persistence behavior appears.
- `ui_operational_readiness_implication`: UI/reviewer cockpit language implies operational readiness.
- `status_or_audit_drift`: status/audit records become inconsistent with repo anchors.
- `human_approval_evidence_gap`: human approval evidence is missing or ambiguous.

## 15. Relationship To Existing Governance Artifacts

- The source-boundary charter remains the terminology and evidence-authority reference for source-related claims.
- The source-boundary approval-authority record remains the authority on source-boundary approvals and exceptions.
- The privacy/data-boundary governance record remains the authority on named data classes, blocked non-synthetic data use, and retention-boundary framing.
- The Drive governance/source-of-truth record remains the authority on what Drive may and may not mean.
- The audit-log/records-retention governance record remains the authority on retention, traceability categories, persistence boundaries, and runtime logging non-approvals.
- The release/rollback governance record remains the authority on release evidence and rollback governance only.
- The operational approval governance record remains the authority on operational approval review boundaries only.
- Existing governance artifacts remain cumulative unless a direct conflict is identified.

## 16. Current Posture Confirmation

- Agent Builder remains synthetic-only.
- Agent Builder remains pre-runtime.
- Agent Builder remains below L2.
- Agent Builder remains human-reviewed.
- Agent Builder remains approval-gated.
- Agent Builder remains non-operational.
- Drive remains human-provided context only, not runtime source authority.
- Source reads, source-packet binding, semantic source verification, file existence checks, content hashing, real/redacted/non-synthetic data use, persistence, and runtime logging remain out of scope.

## 17. Recommended Next Step

- After this docs-only record, remain paused or perform a human review before selecting any further planning-only dependency.
- Do not infer approval for runtime/model governance, Drive behavior governance, UI/reviewer cockpit governance, or implementation merely because this source/data authority boundary record exists.
- If future planning continues, choose the next dependency record explicitly and preserve the current synthetic-only, pre-runtime, below-L2, human-reviewed, approval-gated, and non-operational posture.

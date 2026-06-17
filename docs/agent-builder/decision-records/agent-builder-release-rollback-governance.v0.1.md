# Agent Builder Release / Rollback Governance v0.1

- Decision record status: proposed for human review only.
- This is a docs-only, planning-only governance decision record.
- This record is not operational approval.
- This record approves no capability expansion.
- This record does not approve implementation, capability expansion, operational use, release automation, rollback automation, or production readiness.

## 1. Status

- Proposed for Cloud City Agent Builder governance.
- Repo-facing reconciliation anchor for this planning slice:
  `f7816df docs(agent-builder): reconcile current state through ad0dda3`.
- Current governance baseline remains:
  `db8c749 docs(agent-builder): reconcile roadmap through L1.9 planning governance`.
- Latest deterministic implementation refinement remains:
  `ad0dda3 feat(agent-builder): clarify Event Readiness report semantics`.
- Current posture remains synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, and non-operational.
- This record does not approve runtime generation, model calls, prompts, routes, tools, integrations, Drive behavior, source reads, file existence checks, content hashing, semantic source verification, source-packet binding, real/redacted/public/personal/vendor/operational data use, persistence, runtime logging, automated record creation, release automation, rollback automation, UI/reviewer cockpit planning or implementation, operational approval, external communication, or autonomous action.
- This record clarifies human-owned release/rollback governance only for future maturity changes. It does not change current capability posture.

## 2. Purpose

- Define human-owned release and rollback governance for future Agent Builder maturity changes.
- Require explicit release evidence, explicit human approval, and an explicit pause/review step before any future maturity promotion is treated as releasable by a human.
- Define rollback trigger classes and rollback action classes so future governance records do not treat rollback as implied, automated, or optional.
- Reduce ambiguity without authorizing implementation, automation, runtime behavior, or operational use.
- In this record, `release` means a future human-reviewed maturity-promotion decision only. It does not mean production deployment, public rollout, operational enablement, or authority to act.

## 3. Repo Evidence Basis

- This draft relies on repo evidence already established in:
- `docs/agent-builder/agent-builder-production-readiness-roadmap.v0.3.md`
- `docs/agent-builder/agent-builder-current-state-reconciliation.v0.1.md`
- `docs/agent-builder/l1.6-operator-readiness-review.md`
- `docs/agent-builder/source-boundary-evidence-authority-review.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-drive-governance-source-of-truth-boundaries.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-source-boundary-approval-authority.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-privacy-data-boundary-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-audit-log-records-retention-governance.v0.1.md`
- `docs/agent-builder/decision-records/agent-builder-cli-operator-planning-governance.v0.1.md`
- The current-state reconciliation record identifies release and rollback governance as an unresolved future dependency area.
- Roadmap v0.3 identifies release and rollback as a required later decision area before capability expansion planning can advance.
- Repo-evidence-only doctrine remains the default for this record.
- Human-provided Drive governance/status context may be mentioned only when labeled explicitly as human-provided context and unverified. It must not be treated as repo doctrine, runtime authority, source authority, or operational approval.

## 4. Decision

- This record decides that release authority remains human-owned.
- This record decides that the Founder / human project owner remains the sole current approval authority for any future Agent Builder release decision unless a later artifact explicitly changes that model.
- This record decides that authoring a change does not approve that change.
- This record decides that passing deterministic validation does not approve a release.
- This record decides that documentation reconciliation does not approve a release.
- This record decides that release review requires explicit evidence, an explicit pause/review step, and an explicit human approval record.
- This record decides that rollback must remain human-owned, explicit, and non-automated unless a separate later artifact explicitly approves automation.
- This record decides that no approval under this record cascades to runtime behavior, source behavior, data use, Drive behavior, UI behavior, operational approval, or authority to act.
- This record governs planning-only release/rollback questions for future maturity changes only.

## 5. Scope

- This record covers release authority for future maturity changes.
- This record covers minimum release evidence expectations for future human release review.
- This record covers rollback trigger classes and rollback action classes at a governance level only.
- This record covers relationship rules to deterministic validation, Drive governance/status context, records/audit traceability, CLI/operator planning, and operational approval.
- This record covers solo-developer procedural separation between Builder Mode, Reviewer Mode, and Approver Mode.
- This record does not cover implementation, automation, capability expansion, runtime behavior, or operational approval.

## 6. Release Authority And Approval Model

- Founder / human project owner remains the approval authority.
- Current approval model remains single-owner human approval.
- Solo-developer/operator workflow still requires explicit procedural separation between authoring, reviewing, and approving.
- A human release decision should occur only after release evidence is assembled and reviewed.
- A human release decision should be recorded explicitly. It must not be inferred from merged code, passing validation, updated docs, or reconciled status language.
- Validation passing does not approve a release.
- Planning completion does not approve a release.
- Release authority does not delegate to validators, model outputs, review-state labels, Drive status, or draft records.
- Humans approve. Humans execute.

## 7. Required Release Evidence Checklist

- `release_scope_statement`: what exact maturity change is under review.
- `release_out_of_scope_statement`: what remains blocked and not approved.
- `candidate_branch`: branch name under review.
- `candidate_head`: exact commit SHA under review.
- `changed_files_inventory`: exact files changed.
- `diff_summary`: concise summary of what changed and what did not change.
- `validation_commands_and_results`: exact commands run and their results.
- `risk_notes`: known risks, ambiguities, and adjacent capability drift concerns.
- `boundary_confirmation`: explicit restatement that current boundaries remain preserved unless separately approved.
- `human_review_pause`: explicit note that Builder Mode has paused and Reviewer Mode is examining the evidence.
- `approval_record_reference`: explicit human-owned release approval record before any future maturity promotion is treated as released.
- `rollback_readiness_note`: explicit note describing which human-owned rollback actions are available if ambiguity or drift is found.
- Minimum evidence presence does not approve a release by itself.
- A complete checklist is required evidence only. It is not approval.

## 8. Rollback Trigger Classes

- `boundary_drift`: a change appears to expand capability posture beyond approved scope.
- `operational_approval_ambiguity`: wording or behavior could be mistaken for operational approval.
- `non_synthetic_data_exposure`: accidental use, retention, display, or implication of non-synthetic or redacted data.
- `drive_or_source_authority_confusion`: Drive governance/status context or declared source metadata is mistaken for runtime source authority or source-of-truth proof.
- `validation_or_reporting_regression`: deterministic validation behavior, review semantics, or report clarity regresses.
- `runtime_path_ambiguity`: a change creates ambiguity about whether runtime/model behavior is approved or available.
- `status_or_audit_drift`: repo status, roadmap language, traceability, or review records drift from actual reviewed scope.
- `human_review_failure`: required human review, pause, approval recording, or boundary acknowledgment did not occur or cannot be demonstrated.
- `evidence_gap`: required release evidence is missing, contradictory, stale, or materially unclear.

## 9. Rollback Action Classes

- `pause_work`
- `correct_docs_or_status_drift`
- `revert_candidate_change`
- `deprecate_or_quarantine_planning_artifact`
- `block_future_promotion_until_record_update`
- `create_follow_up_review_record`
- `require_explicit_human_reapproval`
- These actions are human-owned and non-automated.
- These actions do not define scripts, workflows, buttons, routes, background jobs, or automated rollback behavior.
- Choosing a rollback action remains a human decision based on scope, evidence, and boundary risk.

## 10. Explicit Non-Approval Boundaries

- runtime generation
- model calls
- prompts
- routes
- tools
- integrations
- Drive lookup
- Drive sync
- Drive writes by local agents
- Drive-backed runtime authority
- source reads
- source-packet binding
- semantic source verification
- file existence checks
- content hashing
- non-synthetic data use
- redacted data use
- persistence
- runtime logging
- automated records
- release automation
- rollback automation
- UI/reviewer cockpit planning
- UI/reviewer cockpit implementation
- operational approval
- external communication
- autonomous action

This record does not move the project above the current synthetic-only, pre-runtime, below-L2 posture.

## 11. Relationship To Deterministic Validation

- Deterministic validation may be required evidence for a future release review.
- Deterministic validation remains machine-checkable structure and policy evidence only.
- Deterministic contract conformance is not operational approval.
- `PASS` remains pass for human review only.
- Bounded review classification remains a draft review-state label only.
- Deterministic validation is never sufficient release approval by itself.

## 12. Relationship To Drive Governance / Status Context

- Drive governance/status context remains human-provided context only unless separately verified.
- Drive governance/status context is not runtime source authority.
- Drive governance/status context is not source-of-truth proof for runtime behavior.
- Drive governance/status context is not release approval.
- Drive governance/status context is not rollback approval.
- This record does not authorize Drive sync, Drive writes, Drive automation, or Drive-based runtime authority.

## 13. Solo-Developer Safety Model

- `Builder Mode`: author the proposed change, collect evidence, and state scope and explicit non-approvals.
- `Reviewer Mode`: pause authoring, inspect the exact diff and evidence, restate risks, and confirm what the evidence proves and does not prove.
- `Approver Mode`: separately decide whether the reviewed scope is acceptable for the specific maturity change under review.
- One person may hold all three hats, but the modes should be performed sequentially and explicitly rather than implicitly.
- Builder Mode does not self-approve.
- Reviewer Mode does not imply approval.
- Approver Mode should record an explicit decision and any preserved non-approvals.
- If the same human cannot honestly distinguish the three modes for a given change, the safe action is to pause and not promote scope.

## 14. Human Review Checkpoints For Future Release Review

- `scope_confirmation_checkpoint`
- `evidence_inventory_checkpoint`
- `boundary_acknowledgment_checkpoint`
- `pause_and_review_checkpoint`
- `approval_record_checkpoint`
- `rollback_readiness_checkpoint`
- These checkpoints are governance checkpoints only.
- These checkpoints do not define implementation order, release workflow automation, UI behavior, or runtime behavior.

## 15. Relationship To Existing Governance Artifacts

- Roadmap v0.3 remains the maturity and sequencing context.
- The current-state reconciliation record remains the repo-facing status anchor through `f7816df`.
- The L1.6 operator-readiness review charter remains the authority on what current deterministic evidence proves and does not prove.
- The Drive governance/source-of-truth decision record remains the authority on what Drive may and may not mean.
- The CLI/operator planning-governance record remains the authority on conceptual operator control-model language and preserves release/rollback as a separate dependency domain.
- The audit-log/records-retention governance record remains the authority on traceability, approval-record categories, and non-retention posture.
- The privacy/data-boundary and source-boundary records remain the controlling artifacts for their respective domains.
- If a direct conflict later appears on a release/rollback question, this record governs that release/rollback question only.
- If a direct conflict later appears on a source, data, Drive, runtime/model, UI, or operational approval question, the governing artifact for that domain controls.

## 16. Recommended Next Step

- After this docs-only record, remain paused or perform a human review before selecting any further planning-only dependency.
- Do not infer approval for runtime/model planning, Drive behavior planning, UI/reviewer cockpit planning, or operational approval planning merely because this release/rollback governance record exists.
- If future planning continues, choose the next dependency record explicitly and preserve the current synthetic-only, pre-runtime, below-L2, human-reviewed, approval-gated, non-operational posture.

# Agent Builder Bounded Codex Loop Governance v0.1

## 1. Status

- Proposed for human review only.
- Docs-only, planning-only governance decision record.
- Developer workflow guidance only for manual Codex use inside the repo.
- Not runtime authority.
- Not production readiness.
- Not operational approval.
- Does not approve capability expansion.
- Repo continuity anchor for this record: `47b2f8c docs(agent-builder): add documentation formatting standard`.
- Related current repo artifacts:
  - `docs/agent-builder/documentation-formatting-standard.v0.1.md`
  - `docs/agent-builder/assistant-codex-workflow-playbook.v0.1.md`

## 2. Scope

This record governs how a human developer may use Codex manually inside this repo for bounded local work.

It covers manual prompt shape, repair and validation discipline, stop conditions, sole-developer local workflow, and
required human approval gates for local repo work.

This record does not approve Agent Builder runtime/model-call authority, prompt execution inside Agent Builder, or any
change to runtime, source, Drive, persistence, logging, automation, or operational posture.

Bounded manual Codex loops are developer workflow guidance only and do not change Agent Builder's synthetic-only,
pre-runtime, below-L2, non-operational posture.

## 3. Non-Approvals / Explicit Boundaries

This record does not approve:

In this section, `model calls`, `source reads`, `file existence checks`, and `tools` mean Agent Builder
runtime/local-agent authority, runtime behavior, or tool integration behavior. They do not prohibit approved human or
Codex read-only repo inspection or normal developer shell/tool usage during bounded manual repo work.

- Agent Builder runtime generation
- model calls
- prompt execution inside Agent Builder
- prompts as runtime authority
- autonomous loops
- background automation
- scheduled automations
- runtime loops
- tools
- integrations
- routes
- source reads
- source-authority expansion
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- Drive sync
- Drive writes
- Drive reads by local agents
- persistence
- runtime logging
- automated record creation
- release automation
- rollback automation
- operational approval
- production readiness
- external communication
- autonomous action

This record also does not approve changes to runtime code, scripts, configs, tests, prompts, routes, tools,
integrations, Drive behavior, source-read behavior, persistence behavior, or logging behavior by implication.

## 4. Current Posture Preserved

- synthetic-only
- pre-runtime
- below L2
- human-reviewed
- approval-gated
- non-operational
- not production-ready
- not operationally approved

## 5. Required Boundary Statements, Verbatim

- `Drive handoff/status context is not runtime source authority.`
- `Deterministic contract conformance is not operational approval.`
- `PASS means pass for human review only.`
- `Humans approve. Humans execute.`

## 6. Purpose

This record defines one narrow, auditable governance pattern for bounded manual Codex loops in the repo.

It exists to reduce prompt drift, preserve explicit approval gates, keep local repair work hypothesis-driven, and
prevent manual developer workflow guidance from being mistaken for Agent Builder runtime, automation, or operational
authority.

## 7. Definitions

- `manual Codex loop`: one human-started, explicitly scoped repo workflow in which Codex inspects and, when approved,
  edits only the named files for the current pass and then stops to report results.
- `autonomous loop`: any self-triggering, repeating, background, scheduled, runtime, prompt-execution, or model-driven
  loop that continues without a fresh human start and explicit approval for the current pass.
- `repair pass`: one bounded edit cycle intended to reduce a known delta without expanding scope or changing the
  approved file set.
- `validation pass`: one explicit set of named checks run after a draft or repair pass to compare actual results against
  the expected outcome.
- `human approval gate`: an explicit human decision point that must be satisfied before commits, merges, pushes, scope
  expansion, or any other separately approval-gated action.

## 8. Allowed Manual Loop Shape

Use this shape for bounded manual Codex loops:

1. Observe / Review: inspect repo state, relevant files, and current constraints using approved read-only commands.
2. Hypothesize / Plan: state the smallest plausible change that should reduce the known delta.
3. Define expected checks before edits: name the validation commands and expected signals before changing files.
4. Draft or repair: edit only the approved file set and only within the approved scope.
5. Validate: run the named targeted checks first, then any broader approved checks.
6. Review diff: inspect the exact changed file set and confirm that out-of-scope files were not changed.
7. Report remaining delta: state what passed, what failed, what remains uncertain, and what still requires human review.
8. Pause for human approval: stop before commit, merge, push, cleanup, or any scope expansion.

## 9. Required Prompt Contract

Every bounded manual Codex loop prompt should specify:

- `goal`: the exact outcome the pass is trying to achieve
- `context`: the relevant continuity anchor, current posture, and controlling artifacts
- `constraints`: explicit non-goals, blocked domains, and approval boundaries
- `files allowed to inspect`: explicit paths or path patterns Codex may read
- `files allowed to edit`: explicit paths Codex may change; if empty, the pass is read-only
- `expected outcome`: what should be different when the pass succeeds
- `validation commands`: exact commands Codex should run and the expected signal from each one
- `stop conditions`: the conditions that require Codex to stop and report instead of continuing
- `required report format`: the minimum fields Codex must return after the pass

If one or more of these fields are missing and the omission would materially weaken scope control, the safe action is to
pause and clarify before editing.

## 10. TDD-Style Discipline

- Define expected checks before edits.
- Prefer failing or guarding checks where they are appropriate, cheap, and clearly scoped.
- Run targeted validation before broader validation.
- Use the narrowest useful validation that can confirm or reject the current hypothesis.
- If no meaningful guard check exists for the pass, say so explicitly before editing.
- `PASS` remains human-review-only.

## 11. Iteration Cap

- Default maximum: 3 total passes per prompt.
- This means one initial draft or repair pass plus up to 2 repair/validate cycles.
- Count a pass when a draft or repair step is followed by validation and diff review.
- Stop earlier if scope expands, validation delta stops shrinking, required authority is unclear, target files drift, or
  human review is needed.
- After the cap is reached, a fresh human-started prompt is required before additional repair work continues.

## 12. Stop Conditions

Stop and report if any of the following occurs:

- repo preflight does not match the task assumptions
- wrong path, wrong branch, or dirty worktree when cleanliness is required
- unexpected file drift appears
- the work would require editing files outside the approved edit set
- the work would require runtime, source, Drive, persistence, logging, or automation changes
- the work would require config, script, test, prompt, route, tool, or integration changes not already approved
- validation delta stops shrinking
- required authority or approval becomes ambiguous
- a validation command fails in a way that suggests broader drift or scope mismatch
- human review is needed before more repair work is defensible

## 13. Sole-Developer Local Workflow

Use this local workflow by default:

1. Verify clean `main` and the expected continuity anchor first.
2. For very small docs-only work on clean `main`, direct local work may be acceptable when explicitly approved.
3. For auditable governance records, prefer a short-lived local branch from `main`.
4. Use a separate worktree when the slice is larger, riskier, or benefits from stronger isolation.
5. No PR is required by default.
6. Commit only after human review.
7. If a branch is used, merge locally to `main` before any push.
8. Run a post-merge gate after any local merge and before any push.
9. Push only after explicit approval.

For this record, `post-merge gate` means a read-only verification pass on merged `main` confirming the expected commit
state, changed file set, validation results, and preserved boundaries before any push is considered.

## 14. Required Codex Report After A Loop

Codex should report:

- repo state checked
- exact commands run
- relevant command results
- files inspected
- files changed
- diff summary
- validation results
- remaining delta
- risks or open questions
- whether acceptance criteria were met
- exact next recommended human action

## 15. Validation Expectations

- Name validation commands before edits.
- Prefer targeted validation before broader validation.
- For docs-only loops, use docs-safe checks such as `git diff --check`, targeted `git diff --stat`, targeted
  `git diff --name-only`, targeted `git diff`, and `git status --short --branch`.
- For broader non-docs work, validate only the approved changed surface and only with commands justified by the prompt.
- Clean local validation confirms repo state only. It does not approve commit, merge, push, runtime behavior, source
  authority, operational approval, or production readiness.

## 16. Risks

- human-in-the-loop theater
- false confidence from clean validation or a clean diff
- scope creep from repeated repair passes
- solo-developer mode collapse between builder, reviewer, and approver roles
- drift between the prompt contract and the actual changed file set
- accidental reuse of developer workflow language as runtime, automation, or operational authority

## 17. Acceptance Criteria

This record is sufficient if it:

- defines bounded manual Codex loops as developer workflow guidance only
- preserves the current synthetic-only, pre-runtime, below-L2, non-operational posture
- preserves the required boundary statements verbatim
- separates manual human-started loops from autonomous or runtime loops
- defines a required prompt contract
- defines expected-checks-before-edits discipline
- defines an explicit iteration cap
- defines stop conditions
- defines sole-developer local branch, worktree, merge, and push gates
- makes clear that `PASS` remains human-review-only

## 18. Relationship To Existing Governance Docs

- `AGENTS.md` remains the repo-level working agreement for local implementation and review behavior.
- `docs/agent-builder/assistant-codex-workflow-playbook.v0.1.md` remains the session-level workflow reference for
  future assistant passes.
- `docs/agent-builder/documentation-formatting-standard.v0.1.md` remains the formatting and readability standard for
  this document and future repo Markdown work.
- `docs/agent-builder/agent-builder-current-state-reconciliation.v0.1.md` remains the repo-facing continuity anchor for
  current posture and preserved non-approvals.
- `docs/agent-builder/decision-records/agent-builder-cli-operator-planning-governance.v0.1.md` remains the authority on
  conceptual operator/control-model planning and does not grant L2 workflow approval.
- `docs/agent-builder/decision-records/agent-builder-release-rollback-governance.v0.1.md` remains the authority on
  release-review evidence and rollback governance only.
- `docs/agent-builder/decision-records/agent-builder-operational-approval-governance.v0.1.md` remains the authority on
  operational approval boundaries only.
- `docs/agent-builder/decision-records/agent-builder-source-data-boundary-governance.v0.1.md` and
  `docs/agent-builder/decision-records/agent-builder-drive-governance-source-of-truth-boundaries.v0.1.md` remain the
  authorities on source/data/Drive boundary questions.
- `docs/agent-builder/decision-records/agent-builder-cc-cd-operating-doctrine.v0.1.md` remains the authority on
  broader calibration-before-development doctrine.

If a direct conflict later appears on a bounded manual Codex repo-workflow question, this record governs that question
only. If a direct conflict later appears on runtime/model, source, data, Drive, release/rollback, or operational
approval questions, the governing artifact for that domain controls.

## 19. Next-Step Boundaries

- Future runtime/model-call governance remains a separate later dependency area.
- Prompt execution inside Agent Builder remains blocked unless separately governed and explicitly approved.
- Autonomous loops, background automation, scheduled automation, runtime loops, and tool-mediated execution remain
  blocked.
- Drive sync, Drive writes, source-authority expansion, persistence, runtime logging, release/rollback automation,
  operational approval, and production readiness remain blocked.
- Any future change to runtime code, scripts, configs, tests, prompts, routes, tools, integrations, Drive behavior,
  source-read behavior, persistence behavior, or logging behavior requires separate approved scope and governing
  artifacts.
- After this docs-only record, remain paused for human review before any commit, merge, push, or adjacent governance
  expansion.

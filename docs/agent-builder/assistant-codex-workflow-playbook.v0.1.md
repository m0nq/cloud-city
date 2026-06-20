# Assistant / Codex Workflow Playbook v0.1

## Status

- Docs-only.
- Planning / workflow guidance only.
- Human-reviewed.
- Non-operational.
- Not runtime authority.
- Not production readiness.
- Not operational approval.
- Not a source/data authority record.
- Not a release/rollback authority record.
- Does not create executable skills or capability authority.

## Purpose

This playbook provides reusable workflow guidance for future ChatGPT/Codex sessions working in this repo.

It is intended to:

- reduce prompt drift across repeated repo operations
- support a sole-developer workflow with explicit pauses and verification
- keep evidence, assumptions, and recommendations separated
- preserve current governance boundaries while allowing disciplined docs-only work

This playbook references controlling artifacts. It does not replace them.

## Current Posture

- synthetic-only
- pre-runtime
- below L2
- human-reviewed
- approval-gated
- non-operational
- not production-ready
- not operationally approved

Humans approve. Humans execute.

## Controlling Artifacts

Use these artifacts as the controlling references for scope, approval boundaries, and posture:

- `AGENTS.md`
- `docs/agent-builder/operator-guide.md`
- `docs/agent-builder/governance-rules.md`
- `docs/agent-builder/agent-builder-current-state-reconciliation.v0.1.md`
- `docs/agent-builder/agent-builder-production-readiness-roadmap.v0.3.md`
- `docs/agent-builder/decision-records/agent-builder-cli-operator-planning-governance.v0.1.md`
- `docs/agent-builder/source-boundary-evidence-authority-review.v0.1.md`

If this playbook conflicts with a controlling artifact, the controlling artifact wins.

## Required Conventions

For future assistant sessions:

- Separate `repo evidence`, `human-provided context`, `assumptions`, `open questions`, and `recommendations`.
- Treat proposals as hypotheses to test, not final truth.
- State exact commands run and the relevant results.
- Prefer read-only inspection first.
- Drive handoff/status context is not runtime source authority.
- Deterministic contract conformance is not operational approval.
- Treat `PASS` as pass for human review only.
- Do not treat bounded review classification as production readiness or operational approval.
- Do not infer authority from filenames, labels, links, reconciled docs, or prior runtime code paths.

## Allowed Command Categories

- Read/list/search commands such as `find`, `ls`, `sed`, `cat`, `rg`.
- Read-only git inspection such as `git status`, `git log`, `git show`, `git branch --list`, `git worktree list`.
- Docs-only file creation or editing only when explicitly approved for the current pass.
- Local commit only when explicitly approved for the current pass.
- No `push`, PR creation, or external actions unless separately and explicitly approved.

## Approval-Gated Mutation Categories

The following require explicit task-specific human approval every time:

- branch creation
- worktree creation
- docs-only edits
- cleanup execution
- local commits
- merge or reconciliation
- push
- PR creation

## Disallowed Behavior

This playbook does not authorize:

- runtime generation
- model calls
- prompts as runtime authority
- routes
- tools
- integrations
- Drive sync or Drive writes
- UI or reviewer cockpit work
- source reads
- file existence checks as authority
- content hashing
- semantic source verification
- source-packet binding
- real, redacted, or non-synthetic data use
- persistence
- runtime logging
- automated record creation
- release or rollback automation
- operational approval
- external communication
- autonomous action
- destructive commands
- force branch deletion
- unstated cleanup

## Standard Stop Conditions

Stop and report exactly what failed if any of the following occurs:

- unexpected path
- not inside a worktree
- wrong branch
- dirty worktree when cleanliness is required
- unexpected `HEAD` or `origin/main`
- unmerged branches when a clean merged state is required
- unexpected linked worktrees
- unexpected file changes outside the approved scope
- the request would alter runtime, source, Drive, data, or automation posture
- ambiguity about authority, approval, or scope

## Required Rehydration Gate

Use this gate before planning, drafting, cleanup, or status-sensitive review:

```zsh
pwd
git rev-parse --is-inside-work-tree
git rev-parse --show-toplevel
git branch --show-current
git status --short --branch
git rev-parse --short HEAD
git rev-parse --short origin/main
git show --stat --oneline HEAD
git worktree list
git branch --list
git branch --merged main
git branch --no-merged main
```

Optional only for cleanup planning or worktree-metadata assessment:

```zsh
git worktree prune --dry-run
```

Confirm:

- working path
- inside-worktree status
- repo toplevel
- active branch
- worktree cleanliness
- `HEAD`
- `origin/main`
- latest commit
- active worktree inventory
- local branch inventory
- merged versus unmerged branch state
- optional dry-run prune output only when the task explicitly concerns cleanup planning or worktree metadata assessment

Do not continue if the expected state does not match the task assumptions.

## Workflow Modules

### Repo Rehydration

- Scope boundary:
  Verify current repo state before any substantive action.
- Allowed commands:
  `pwd`, `git rev-parse`, `git status`, `git show`, `git worktree list`, `git branch --list`, and `git worktree prune --dry-run` only when the task explicitly includes cleanup planning or worktree-metadata assessment.
- Disallowed commands:
  `git worktree prune`, cleanup commands, branch creation, commits, edits, tests, builds.
- Required preflight:
  Run the rehydration gate and compare results with the task's expected state.
- Stop conditions:
  Any mismatch in path, branch, cleanliness, `HEAD`, `origin/main`, or worktree/branch inventory.
- Final confirmation requirements:
  State exact commands run and whether the expected state matched.
- Non-operational status:
  Rehydration is evidence gathering only; it does not authorize action.

### Worktree / Branch Inventory

- Scope boundary:
  Inspect local worktree and branch topology without mutating it.
- Allowed commands:
  `git worktree list`, `git worktree list --porcelain`, `git branch --list`, `git branch -vv`, `git log --oneline --decorate --all`, `git status --short --branch` in listed worktrees.
- Disallowed commands:
  `git worktree add`, `git worktree remove`, `git branch -d`, `git branch -D`, cleanup or prune execution without explicit approval.
- Required preflight:
  Successful rehydration gate from the intended main worktree.
- Stop conditions:
  Dirty auxiliary worktrees, unexpected branches, unexpected worktrees, or state that contradicts task assumptions.
- Final confirmation requirements:
  Distinguish active worktrees, merged branches, retained items, and ambiguity.
- Non-operational status:
  Inventory does not approve cleanup or workflow progression.

### Cleanup Gate Planning

- Scope boundary:
  Determine whether later cleanup appears safe without performing it.
- Allowed commands:
  Read-only inventory commands, cleanliness checks with `git status`, and `git worktree prune --dry-run` only if explicitly requested.
- Disallowed commands:
  `git worktree remove`, `git branch -d`, `git branch -D`, `rm`, actual prune, destructive git actions.
- Required preflight:
  Successful rehydration and current inventory.
- Stop conditions:
  Any dirty worktree, unexpected branch reachability, or ambiguity about whether a path is still needed.
- Final confirmation requirements:
  Call out candidates, retain items, blockers, and whether a separate approved cleanup pass is required.
- Non-operational status:
  Cleanup planning is advisory only.

### Approved Cleanup Execution

- Scope boundary:
  Execute only the explicitly approved cleanup commands and nothing else.
- Allowed commands:
  Only the exact approved `git worktree remove`, `git branch -d`, and read-only verification commands named in the task.
- Disallowed commands:
  `git branch -D`, `rm -rf`, actual prune, extra cleanup, branch/worktree creation, unrelated edits.
- Required preflight:
  Exact expected repo state, explicit approval, and cleanliness checks for every target worktree.
- Stop conditions:
  Any preflight mismatch, dirty target worktree, branch deletion failure, or unexpected side effect.
- Final confirmation requirements:
  Report each removal or deletion command, post-cleanup inventory, and explicit non-actions.
- Non-operational status:
  Repo hygiene only; not runtime, release, or operational authority.

### Docs-Only Planning

- Scope boundary:
  Analyze artifact shape, scope, placement, or acceptance criteria without editing files.
- Allowed commands:
  `find`, `ls`, `sed`, `cat`, `rg`, `git log`, `git show`, and other read-only inspection commands.
- Disallowed commands:
  File edits, commits, branch/worktree changes unless explicitly approved for that pass.
- Required preflight:
  Rehydration gate and identification of controlling artifacts.
- Stop conditions:
  Repo state drift, missing controlling context, or planning that would imply capability expansion.
- Final confirmation requirements:
  Provide options considered, rejected alternatives, recommended path, risks, and read-only confirmation.
- Non-operational status:
  Planning is not implementation and grants no new authority.

### Docs-Only Drafting

- Scope boundary:
  Create or edit only the explicitly approved docs artifact.
- Allowed commands:
  Approved read-only inspection commands, targeted docs diff checks, `git status`, `git diff`, and file creation or edit only for the named docs path.
- Disallowed commands:
  Editing existing files without approval, any runtime/code/config/spec/test/package/lockfile changes, tests, builds, or external actions.
- Required preflight:
  Clean worktree, explicit file scope, and review of controlling artifacts.
- Stop conditions:
  Need to change an existing file, unexpected unrelated diff, or wording that implies runtime, source, Drive, or approval authority.
- Final confirmation requirements:
  Confirm the exact file changed, summarize contents, and confirm no out-of-scope file changes.
- Non-operational status:
  Drafting docs does not authorize implementation or maturity promotion.

### Governance Review

- Scope boundary:
  Evaluate correctness of governance language, scope boundaries, and non-inference rules.
- Allowed commands:
  Read-only doc inspection and diff review commands.
- Disallowed commands:
  Runtime inspection that would imply operational behavior, implementation edits outside approved docs scope, or external validation claims not supported by repo evidence.
- Required preflight:
  Identify controlling artifacts and current posture.
- Stop conditions:
  Ambiguous authority language, conflicts with controlling docs, or unsupported claims.
- Final confirmation requirements:
  Separate evidence from assumptions and list residual risks or wording ambiguities.
- Non-operational status:
  Governance review is for human comprehension only.

### Post-Action Verification

- Scope boundary:
  Verify that a completed approved action changed only what it was supposed to change.
- Allowed commands:
  `git status --short --branch`, `git diff`, `git diff --check`, `git diff --name-only`, `git show --stat --oneline HEAD`, `git rev-parse --short HEAD`, `git worktree list`, `git branch --show-current`.
- Disallowed commands:
  Additional edits, cleanup, or scope expansion hidden inside verification.
- Required preflight:
  Complete the approved action first and know the expected changed files.
- Stop conditions:
  Unexpected file changes, whitespace errors, wrong branch, dirty worktree when a clean one is expected, or post-action drift from requested scope.
- Final confirmation requirements:
  Report the changed files, whitespace check, branch, and whether the result matched the approved scope.
- Non-operational status:
  Verification confirms repo state only. Clean local verification does not authorize merge, reconciliation, push, PR creation, cleanup, or any other mutation.

### Final Confirmation

- Scope boundary:
  Close the task with a complete explicit accounting of what did and did not happen.
- Allowed commands:
  Read-only confirmation commands if needed.
- Disallowed commands:
  Silent cleanup, omitted side effects, or implied approvals.
- Required preflight:
  Complete post-action verification for any mutating pass.
- Stop conditions:
  Inability to account for files changed, branch/worktree changes, or approval-sensitive actions.
- Final confirmation requirements:
  Use the checklist below.
- Non-operational status:
  Final confirmation is a record of the session, not an approval record.

## Final Confirmation Checklist

Every session using this playbook should explicitly confirm:

- files edited
- branches or worktrees created, deleted, or pruned
- commits made
- whether any push occurred
- whether any PR was created
- whether tests or builds were run
- whether any Drive edits occurred
- whether any cleanup occurred
- whether runtime, model, tool, source, Drive, logging, or automation behavior was added, modified, or executed
- whether any operational approval or production-readiness claim was made or granted

## Out Of Scope Concepts

This playbook does not define or approve:

- runtime prompts
- CLI or operator implementation
- workflow automation
- approval records as executable authority
- logging schemas
- persistence rules
- source verification models
- release execution
- rollback execution
- operational business actions

Use this playbook to guide future sessions. Use the controlling artifacts to govern what those sessions may and may not conclude.

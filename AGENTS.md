# Cloud City Agent Guide

This guide gives Codex and other coding agents durable project-specific context for this repository. Global Codex instructions still apply; this file adds Cloud City conventions, commands, governance boundaries, and review expectations.

## Project Context

- Cloud City is a Next.js/React site for a dance music events production company and related event operations workflows.
- The app uses TypeScript, Next.js 16, React 19, pnpm via Corepack, Jest, Testing Library, Cypress, ESLint, Tailwind CSS, WPGraphQL content, MailerLite signup, and Vercel deployment.
- Treat event, venue, campaign, and guest-facing changes as user-facing product work. Preserve clarity, accessibility, and operational safety.
- Agent Builder work is governance-first: synthetic-only, human-reviewed, approval-gated, and non-operational unless a separate human-approved readiness/execution gate says otherwise.
- Deterministic contract conformance, passing tests, or bounded review classifications do not equal production readiness, operational approval, release authority, or rollback authority.

## Working Style

- Lead with curiosity: inspect the relevant code and docs before proposing changes.
- Treat code changes as testable hypotheses. Make small, reversible edits and verify them with the narrowest useful command.
- Prefer existing patterns, utilities, component structure, and test style over new abstractions.
- Distinguish evidence from assumptions. Ask one focused question when missing context would materially change the implementation.
- For analysis, review, planning, or architecture requests, stop at recommendations unless the user explicitly approves implementation.
- Use `branch-and-select`/`tot` for complex coding, architecture, debugging, review, or decision work with multiple plausible approaches.
- Do not treat assistant, Codex, connector, or test output as approval. Humans approve. Humans execute.
- Use the OpenAI developer documentation MCP server for OpenAI API, Codex, Agents SDK, ChatGPT Apps SDK, model, prompt-upgrade, or related documentation questions without requiring the user to ask for docs lookup explicitly.
- If the active Codex profile appears mismatched to the task, recommend switching before substantial work: `fast` for small low-risk work, `review` for read-only review/planning, `builder` for normal implementation, `research` for current facts/docs, and `agent-dev` for Codex workflow configuration. For dependency installs, package lookups, or shell commands that need external network access, recommend restarting with `builder` plus `-c sandbox_workspace_write.network_access=true`.

## Worktree And Git Safety

- Before repo actions, verify:
  ```sh
  pwd
  git rev-parse --is-inside-work-tree
  git rev-parse --show-toplevel
  git branch --show-current
  git status --short --branch
  ```
- The current solo workflow may use clean `main` for small, low-risk, explicitly approved work.
- Use a branch or separate worktree when isolation materially improves reversibility, including risky, experimental, implementation-facing, destructive, uncertain, or substantial multi-step changes.
- Do not create branches, worktrees, commits, tags, merges, pushes, PRs, or destructive git operations unless explicitly approved.
- Do not infer that `main` is safe to mutate merely because the user is in the repo. Confirm scope and approval first.
- Review the targeted diff before recommending any commit.
- After a local commit, run an appropriate post-commit verification gate before recommending a push.
- Pause for human approval before any push.

## Setup

- Use Node.js 24 LTS. Prefer the version declared in `.nvmrc` when available.
- Use the repo-pinned pnpm version through Corepack.
- Prefer `.env.local` for local app configuration.
- Do not read, print, or expose secrets from `.env*` files unless the user explicitly asks and the task requires it.
- Do not introduce new environment variables, external services, SDKs, tracking, or production integrations without explicit user approval.

## Package Manager Guidance

- Prefer `corepack pnpm ...` in Codex prompts, handoffs, and validation instructions so commands consistently use the repo-pinned pnpm version.
- Bare `pnpm ...` is acceptable only after Corepack is enabled and the shell is confirmed to resolve the repo-pinned pnpm version.
- Do not change `package.json`, `pnpm-lock.yaml`, pnpm overrides, `onlyBuiltDependencies`, or CI package-manager behavior unless the user explicitly approves that implementation scope.
- Dependency updates should be grouped into small, reversible packages with targeted validation and rollback notes.

## Common Commands

- Install dependencies: `corepack pnpm install`
- Start dev server: `corepack pnpm dev`
- Lint: `corepack pnpm lint`
- Typecheck: `corepack pnpm typecheck`
- Unit tests: `corepack pnpm test:runInBand`
- Coverage: `corepack pnpm test:coverage`
- Production build: `corepack pnpm build`
- Agent builder: `corepack pnpm agent-builder`
- Compare agent SDK outputs: `corepack pnpm compare:outputs`
- Cypress interactive runner: `corepack pnpm e2e:cypress`

## Implementation Conventions

- Keep TypeScript strictness and existing path aliases intact.
- Use structured parsers and typed schemas for structured data instead of ad hoc string parsing.
- For database or schema changes, create version-controlled migrations; do not apply direct production schema changes.
- In React Native code, prefer `Pressable` over `TouchableOpacity`. This repo is primarily web, but preserve the global rule if React Native code appears.
- Do not introduce new external services, SDKs, tracking, or production integrations without explicit user approval.
- Preserve static build compatibility unless the touched route intentionally requires dynamic behavior.
- For Agent Builder, do not add or modify runtime generation, model calls, prompts, routes, tools, integrations, Drive sync/writes, source reads, file existence checks, hashing, semantic source verification, persistence, runtime logging, release automation, rollback automation, or autonomous action unless explicitly approved and governed.

## Testing And Verification

- Match verification to risk. For small component or utility changes, run the relevant Jest test or `corepack pnpm test:runInBand`.
- For shared behavior, routing, framework config, package-manager, CI, or dependency changes, run `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test:runInBand`, and `corepack pnpm build` when feasible.
- For docs-only changes, inspect the diff and run `git diff --check`. Broader tests are not required unless the diff touches code, config, package files, generated files, or workflow behavior.
- For visual or interactive UI changes, use browser verification where practical and check mobile/desktop layout risks.
- If a verification command cannot be run, say why and identify the residual risk.

## Connector And External-System Guidance

- For Linear and Google connector work, use small, single-purpose updates. Read/fetch first, update one primitive at a time, and verify after each update.
- Prefer issue IDs and concrete fetched identifiers when available.
- Avoid large mixed payloads that combine description, labels, links, status, project, priority, and long boundary text.
- For GitHub connector work, prefer read-only inspection unless the user explicitly approves a write. GitHub file writes create commits and should not be used as a substitute for local patch review and validation.
- For Google Drive docs, perform readback after writes. For important docs, note whether browser-rendered visual QA was performed or remains open.
- Do not perform external account, production data, email campaign, deployment, analytics, Vercel, MailerLite, WordPress, or outbound communication mutations without explicit approval.

## Review Expectations

- Follow [code_review.md](./code_review.md) for reviews, pre-merge checks, and self-review before committing or pushing changes.
- Small, low-risk docs-only governance edits may proceed directly on clean `main` when `HEAD` matches the human-confirmed expected milestone and the edit scope is explicitly approved. Review the targeted diff before committing, run an appropriate post-commit verification gate after committing, and pause for human approval before any push.
- Findings should prioritize correctness, regressions, security/privacy, data integrity, missing tests, maintainability, and framework conventions.
- For PR/code review, classify findings as Blocker, Should Fix, Non-blocking, Follow-up Ticket, or Verified.
- Do not post external PR comments, approve/request changes, merge, push, or perform destructive git actions without explicit human approval.

## Deployment And Operations

- GitHub Actions runs the CI/CD pipeline on pushes to `main`.
- Production deploys are performed through GitHub Actions and Vercel; do not trigger production deploys or mutate production data without explicit approval.
- For Vercel, GitHub, MailerLite, WordPress, or analytics work, prefer read-only inspection first and clearly separate local code changes from external-system actions.
- Production readiness requires explicit human approval and the relevant readiness, execution, release, and rollback gates. It is never implied by tests, deterministic checks, design completion, or implementation completion alone.

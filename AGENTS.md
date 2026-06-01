# Cloud City Agent Guide

This guide gives Codex and other coding agents durable project-specific context for this repository. Global Codex instructions still apply; this file adds Cloud City conventions, commands, and review expectations.

## Project Context

- Cloud City is a Next.js/React site for a dance music events production company and related event operations workflows.
- The app uses TypeScript, Next.js 16, React 19, pnpm via Corepack, Jest, Testing Library, Cypress, ESLint, Tailwind CSS, WPGraphQL content, MailerLite signup, and Vercel deployment.
- Treat event, venue, campaign, and guest-facing changes as user-facing product work. Preserve clarity, accessibility, and operational safety.

## Working Style

- Lead with curiosity: inspect the relevant code and docs before proposing changes.
- Treat code changes as testable hypotheses. Make small, reversible edits and verify them with the narrowest useful command.
- Prefer existing patterns, utilities, component structure, and test style over new abstractions.
- Distinguish evidence from assumptions. Ask one focused question when missing context would materially change the implementation.
- For analysis, review, planning, or architecture requests, stop at recommendations unless the user explicitly approves implementation.
- Use `branch-and-select`/`tot` for complex coding, architecture, debugging, review, or decision work with multiple plausible approaches.
- Use the OpenAI developer documentation MCP server for OpenAI API, Codex, Agents SDK, ChatGPT Apps SDK, model, prompt-upgrade, or related documentation questions without requiring the user to ask for docs lookup explicitly.
- If the active Codex profile appears mismatched to the task, recommend switching before substantial work: `fast` for small low-risk work, `review` for read-only review/planning, `builder` for normal implementation, `research` for current facts/docs, and `agent-dev` for Codex workflow configuration. For dependency installs, package lookups, or shell commands that need external network access, recommend restarting with `builder` plus `-c sandbox_workspace_write.network_access=true`.

## Setup

- Use Node.js 24 LTS.
- Use the repo-pinned pnpm version through Corepack.
- Prefer `.env.local` for local app configuration.
- Do not read, print, or expose secrets from `.env*` files unless the user explicitly asks and the task requires it.

## Common Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Unit tests: `pnpm test:runInBand`
- Coverage: `pnpm test:coverage`
- Production build: `pnpm build`
- Agent builder: `pnpm agent-builder`
- Compare agent SDK outputs: `pnpm compare:outputs`
- Cypress interactive runner: `pnpm e2e:cypress`

## Implementation Conventions

- Keep TypeScript strictness and existing path aliases intact.
- Use structured parsers and typed schemas for structured data instead of ad hoc string parsing.
- For database or schema changes, create version-controlled migrations; do not apply direct production schema changes.
- In React Native code, prefer `Pressable` over `TouchableOpacity`. This repo is primarily web, but preserve the global rule if React Native code appears.
- Do not introduce new external services, SDKs, tracking, or production integrations without explicit user approval.
- Preserve static build compatibility unless the touched route intentionally requires dynamic behavior.

## Testing And Verification

- Match verification to risk. For small component or utility changes, run the relevant Jest test or `pnpm test:runInBand`.
- For shared behavior, routing, framework config, or dependency changes, run `pnpm lint`, `pnpm test:runInBand`, and `pnpm build` when feasible.
- For visual or interactive UI changes, use browser verification where practical and check mobile/desktop layout risks.
- If a verification command cannot be run, say why and identify the residual risk.

## Review Expectations

- Follow [code_review.md](./code_review.md) for reviews, pre-merge checks, and self-review before committing.
- Small, low-risk docs-only governance edits may proceed directly on clean `main` when `HEAD` matches the human-confirmed expected milestone and the edit scope is explicitly approved. Review the targeted diff before committing, run an appropriate post-commit verification gate after committing, and pause for human approval before any push. Use a branch or separate worktree when isolation materially improves reversibility, including risky, experimental, implementation-facing, destructive, uncertain, or substantial multi-step changes.
- Findings should prioritize correctness, regressions, security/privacy, data integrity, missing tests, maintainability, and framework conventions.
- Do not post external PR comments, approve/request changes, merge, push, or perform destructive git actions without explicit human approval.

## Deployment And Operations

- GitHub Actions runs the CI/CD pipeline on pushes to `main`.
- Production deploys are performed through GitHub Actions and Vercel; do not trigger production deploys or mutate production data without explicit approval.
- For Vercel, GitHub, MailerLite, WordPress, or analytics work, prefer read-only inspection first and clearly separate local code changes from external-system actions.

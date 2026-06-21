# Documentation Formatting Standard v0.1

## Status

- Docs-only.
- Planning-only.
- Human-reviewed.
- Non-operational.
- Not runtime authority.
- Not production readiness.
- Not operational approval.
- Not a source/data authority record.
- Not a release/rollback authority record.

## Purpose

This standard defines documentation formatting and readability expectations for Cloud City Agent Builder artifacts.

It exists to improve continuity, scanability, accessibility, and auditability across repo Markdown, Google Docs handoff snapshots, and future ChatGPT/Codex-generated documentation.

## Scope

This standard applies to:

- repo Markdown under `docs/agent-builder/`
- Google Docs and Drive handoff/status snapshots
- future ChatGPT/Codex-generated documentation intended for human review

This standard does not replace controlling governance artifacts. It defines formatting and presentation expectations only.

## Formatting Definition Of Done

Documentation is complete for formatting purposes when it uses:

- semantic headings instead of visual-only emphasis
- concise paragraphs with one clear idea per paragraph where practical
- scannable sections with clear section purpose
- meaningful links with descriptive text
- explicit artifact paths when referring to repo or Drive surfaces
- accessible structure that supports screen-reader and keyboard navigation
- tables only when they improve comprehension over prose or lists
- bullets only when list structure improves readability
- no bold-only pseudo-headings used in place of real heading structure

## Google Docs Requirements

Use these requirements for Google Docs and Drive handoff/status documentation:

- Prefer Open Sans unless a stronger brand or document standard explicitly overrides it.
- Preserve title, status, scope, authority, posture, acceptance criteria, and next-step sections where relevant.
- After Drive writes, perform text readback to confirm the intended content landed.
- For important documents, explicitly note whether browser-rendered visual QA was performed or remains open.
- Preserve readable spacing between sections, headings, and list blocks.
- Keep list structure explicit rather than simulating bullets or sections with punctuation alone.

## Repo Markdown Requirements

Use these requirements for repo Markdown:

- Use exactly one H1 per document.
- Maintain ordered H2/H3 hierarchy without skipping structure arbitrarily.
- Use language-tagged fenced code blocks.
- Keep links clean, specific, and readable.
- Include explicit acceptance criteria when the artifact defines a workflow, review gate, or planning milestone.
- Run `git diff --check` before concluding the pass.

## Governance Boundary Requirements

When the document concerns current project posture, preserve the current planning boundaries where relevant:

- synthetic-only
- pre-runtime
- below L2
- human-reviewed
- approval-gated
- non-operational
- not production-ready
- not operationally approved

Include these statements when the artifact touches repo/Drive continuity, workflow guidance, validation, or approval interpretation:

- `Drive handoff/status context is not runtime source authority.`
- `Deterministic contract conformance is not operational approval.`
- `PASS means pass for human review only.`

## Validation Checklist

Use this checklist before finalizing documentation:

- One H1 exists and section hierarchy is ordered.
- Headings are semantic and not simulated with bold text alone.
- Paragraphs and lists are scannable.
- Links and artifact paths are explicit and meaningful.
- Accessibility/readability structure is preserved.
- Tables appear only where they improve comprehension.
- Required posture and boundary language is preserved where relevant.
- `git diff --check` passes for repo Markdown updates.
- Drive text readback was completed for approved Drive documentation writes.
- Any open visual QA limitation is explicitly noted for important Google Docs.

## Suggested Review Categories

Use these review labels when reviewing documentation quality:

- Verified
- Should Fix
- Non-blocking
- Follow-up Ticket
- Hold Pending Visual QA

## Non-Goals

This standard does not create or approve:

- runtime authority
- source/data authority
- Drive authority beyond approved human-facing docs
- production readiness
- operational approval

## Acceptance Criteria

This standard is sufficient if future documentation work can:

- produce semantically structured, readable, accessible documentation
- distinguish formatting quality from governance or runtime authority
- preserve required posture and boundary language where relevant
- support human review across repo docs and Drive continuity surfaces

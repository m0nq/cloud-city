# Agent Builder Governance Rules

## Operating Posture

AI prepares. Humans approve. Humans execute.

The Agent Builder foundation is for safe design, validation, testing, and registration of business-process agent candidates. It is not an autonomous agent runtime.

## Required Safety Defaults

- `external_execution_allowed` must be `false`.
- `autonomous_tool_use_allowed` must be `false`.
- `production_integration_allowed` must be `false`.
- `restricted_data_allowed` must be `false`.

## Required Prohibitions

Specs must prohibit sending outreach, negotiating, committing, making payments, signing contracts, and updating canonical records without approval.

## Required Approval Gates

Specs must require approval for external outreach, rates or terms, contracts, payments, public messaging, and source-of-truth updates.

## Registry Rules

- Registry validation is local and read-only.
- Registry entries must point to existing spec files.
- Registry metadata must match the referenced spec for key identity and lifecycle fields.
- Write-capable registry mutation requires a later explicit approval and implementation milestone.

## Source Grounding

- Use approved source material first.
- Separate confirmed facts from assumptions.
- State unknowns and missing information.
- Flag stale, incomplete, or conflicting information.
- Do not treat public web information as verified unless source and date are clear.

## Data Handling

- Use the least sensitive information that supports the task.
- Prefer redacted summaries when sensitive data is involved.
- Do not include restricted information in prompts, drafts, logs, or Trello-ready text.
- Escalate unclear sensitivity.

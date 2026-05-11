# Event Readiness L1 Provenance Metadata Hardening Defaults v0.1

Decision record status: proposed metadata hardening defaults.

This is a docs-only decision record. It does not approve Event Readiness runtime generation, model calls, prompts,
CLI wiring, routes, tools, integrations, Drive sync, Drive writes by local agents, UI, real event data, operational use,
source-packet binding implementation, semantic source verification, or changes to validators, schemas, runtime files,
application code, fixtures, eval behavior, or test behavior.

All Event Readiness packets remain drafts. Humans approve. Humans execute. `PASS` means pass for human review only.

## 1. Purpose

Define narrow Event Readiness L1 provenance metadata defaults for future deterministic validation of source packet
reference metadata.

This record extends the L1 source packet / output packet provenance defaults by clarifying how these metadata fields
should be interpreted before any implementation:

- `prepared_at`
- `prepared_by_role`
- `sensitivity_level`
- `source_packet_version`
- `content_hash`

The goal is to reduce ambiguity without increasing Event Readiness authority or implying source truth, human approval,
semantic support, operational readiness, or permission to use real data.

## 2. Non-Goals

This record does not:

- implement metadata validation
- change runtime schemas or validators
- change tests or fixtures
- read referenced source packet files
- check source packet file existence
- implement source-packet binding
- implement semantic source verification
- add source-packet checksums or hashing requirements
- approve runtime generation
- approve model calls
- approve prompts
- approve CLI wiring
- approve routes, tools, integrations, Drive behavior, or UI
- approve real event data or redacted local event data
- approve operational use
- expand Event Readiness authority

## 3. Current State

Current audited baseline:

- `76e46b2 test(agent-builder): harden event readiness source packet identity`

Current Event Readiness L1 runtime-output validation already enforces deterministic declared provenance checks for:

- exactly one `source_packets` entry
- `source_packet_kind: synthetic_fixture`
- `redaction_status: synthetic_no_real_data`
- `content_hash: null`
- bounded repo-relative synthetic fixture paths
- source packet path consistency with the legacy `source_packet_id_or_path` field
- source packet ID format
- source packet ID version consistency
- source packet ID path-slug consistency
- canonical source packet labels
- allowed omitted source-domain reasons
- no overlap between present and omitted source labels
- `sources_used` coverage by the declared source packet labels

Current metadata fields that remain loosely validated or schema-shaped only:

- `prepared_at`
- `prepared_by_role`
- `sensitivity_level`

`source_packet_version` is already checked for consistency with the version suffix in `source_packet_id`, but no exact
L1 version freeze is approved by this record.

## 4. Decision Summary

| Field | L1 Default | Meaning Boundary |
| --- | --- | --- |
| `prepared_at` | Use `YYYY-MM-DD` only. | Preparation metadata only; not source freshness or recency proof. |
| `prepared_by_role` | Use a narrow L1 fixture-preparation role vocabulary. | Role metadata only; not human approval or reviewer identity proof. |
| `sensitivity_level` | Use `internal_confidential` for current L1 synthetic fixtures. | Classification metadata only; not permission to use real, restricted, sensitive, or production data. |
| `source_packet_version` | Keep current ID/version consistency behavior for now. | Version consistency metadata only; do not freeze exact version unless separately approved. |
| `content_hash` | Remains `null` for L1. | Hashing remains deferred; `null` does not weaken review requirements. |

## 5. `prepared_at` Policy

For Event Readiness L1 synthetic fixtures, `prepared_at` should use a date-only `YYYY-MM-DD` format.

`prepared_at` means the date the synthetic source packet metadata was prepared or declared for calibration use.

`prepared_at` does not prove:

- source freshness
- source recency
- source completeness
- source accuracy
- operational readiness
- human approval
- permission to act

Future validator behavior may reject values that do not match `YYYY-MM-DD`.

## 6. `prepared_by_role` Policy

For Event Readiness L1 synthetic fixtures, `prepared_by_role` should use a narrow fixture-preparation role vocabulary.

Initial L1 allowed role vocabulary should be limited to:

- `Agent Systems Architect`

This value identifies the role responsible for preparing the synthetic fixture metadata in the calibration artifact.

`prepared_by_role` does not prove:

- the identity of a human reviewer
- human approval
- operational approval
- legal, compliance, safety, accessibility, insurance, or permit approval
- permission to execute any action

Future role vocabulary expansion should be explicit and test-backed.

## 7. `sensitivity_level` Policy

For current Event Readiness L1 synthetic fixtures, `sensitivity_level` should be:

- `internal_confidential`

This is classification metadata for local synthetic calibration artifacts.

`sensitivity_level` does not approve:

- real event data
- redacted event data
- restricted data
- sensitive production data
- customer, attendee, vendor, venue, payment, insurance, legal, compliance, or operational records
- Drive ingestion, Drive sync, or Drive writes by local agents

Any broader sensitivity taxonomy requires separate planning and approval before use.

## 8. `source_packet_version` Policy

Current validation checks that `source_packet_version` is consistent with the version suffix embedded in
`source_packet_id`.

This record does not require freezing all Event Readiness L1 source packets to an exact version such as `v0.1`.

Exact version freezes remain deferred because version policy should be decided alongside fixture lifecycle expectations,
source packet maintenance rules, and compatibility handling.

Future validator behavior may continue to require ID/version consistency without requiring a single exact version.

## 9. `content_hash` Policy

For Event Readiness L1, `content_hash` remains `null`.

Hashing remains deferred because it requires separate policy for:

- retention
- reproducibility
- hash algorithm selection
- sensitivity and fingerprinting risk
- source packet lifecycle
- source-of-truth handling
- audit and review expectations

`content_hash: null` does not imply weak provenance. It means hash-based provenance is not yet approved for L1.

## 10. Deferred Work

Deferred until separate planning and approval:

- source file existence checks
- YAML reads
- source-packet binding
- semantic source verification
- real or redacted data sensitivity taxonomy
- multi-source provenance
- Drive provenance
- runtime generation
- model calls
- prompts
- CLI wiring
- routes
- tools
- integrations
- Drive sync
- Drive writes by local agents
- UI
- operational approval semantics

## 11. Risks And Mitigations

Risk: metadata theater.
Mitigation: state that metadata is declared provenance context only, not source truth, semantic support, or approval.

Risk: role metadata gets mistaken for human approval.
Mitigation: keep `prepared_by_role` separate from reviewer identity, approval gates, and operational authority.

Risk: sensitivity metadata gets mistaken for permission to use real data.
Mitigation: state that `internal_confidential` applies to synthetic local fixtures only and does not approve real,
restricted, sensitive, or production data.

Risk: date metadata gets mistaken for freshness.
Mitigation: define `prepared_at` as preparation metadata only.

Risk: version policy hardens too early.
Mitigation: keep ID/version consistency, but defer exact version freezes until lifecycle policy exists.

Risk: hashing creates false precision or sensitive-data fingerprints.
Mitigation: keep `content_hash: null` for L1 until hashing policy is separately approved.

## 12. Recommended Next Milestone

After this decision record is committed and audited, proceed to a narrow implementation slice for deterministic
Event Readiness L1 provenance metadata hardening only.

That future implementation should remain limited to validator-level checks and direct unit tests for:

- `prepared_at` date-only format
- allowed L1 `prepared_by_role`
- allowed L1 `sensitivity_level`

It should not include source file reads, file existence checks, source-packet binding, semantic source verification,
runtime generation, model calls, prompts, CLI wiring, routes, tools, integrations, Drive behavior, UI, real event data,
operational use, or Event Readiness authority expansion.

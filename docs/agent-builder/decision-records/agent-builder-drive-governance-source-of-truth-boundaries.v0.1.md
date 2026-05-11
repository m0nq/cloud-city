# Agent Builder Drive Governance / Source-of-Truth Boundaries v0.1

Decision record status: proposed boundary clarification.

This is a docs-only decision record. It does not approve runtime generation, model calls, prompts, CLI wiring, routes,
tools, integrations, Drive sync, Drive writes by local agents, UI, real event data, operational use, source-packet
binding implementation, semantic source verification, or changes to validators, schemas, runtime files, application
code, fixtures, eval behavior, or test behavior.

All generated packets remain drafts. Humans approve. Humans execute. `PASS` means pass for human review only.

## 1. Status

Proposed for Cloud City Agent Builder governance.

This record clarifies Drive governance and source-of-truth boundaries before any future implementation plan treats
Drive records, source packets, output packets, or operational records as connected surfaces.

## 2. Purpose

Cloud City uses Google Drive as the human-governed canonical documentation and status layer for business and governance
records. The local repo remains canonical for implementation artifacts.

This record defines what Drive may and may not mean inside Agent Builder governance so future planning does not
accidentally turn Drive links, Drive records, or manual governance updates into local-agent sync/write authority,
validator-readable source packets, source-packet binding, semantic source verification, or operational approval.

## 3. Scope And Non-Goals

This record applies to Agent Builder governance language, milestone reconciliation, source-of-truth boundaries, and
future planning involving Drive references.

This record does not:

- approve local-agent Drive sync
- approve local-agent Drive writes
- approve local-agent OAuth or write access
- approve automatic Drive ingestion
- approve runtime source lookup
- approve Drive records as validator-readable source packets
- approve Drive links as bounded source-packet references
- approve source-packet binding implementation
- approve semantic source verification
- approve runtime generation
- approve model calls
- approve prompts
- approve CLI wiring
- approve routes, tools, integrations, or UI
- approve real event data
- approve operational use
- expand Event Readiness authority

## 4. Artifact And Source-Of-Truth Distinctions

Agent Builder should distinguish these surfaces:

| Surface | Canonical Location | Current Meaning |
| --- | --- | --- |
| Repo implementation artifacts | Local repo | Specs, fixtures, evals, validators, docs, plans, decision records, scripts, and tests. |
| Drive governance/status records | Google Drive | Human-governed documentation, milestone status, approvals, summaries, and traceability records. |
| Source packets | Local bounded fixtures for current L1 planning | Declared source inputs for future validation planning; Drive links are not currently valid source-packet identities. |
| Output packets | Local draft review artifacts or samples | Draft outputs for human review; not operational records or approvals. |
| Operational source-of-truth records | Human-owned business systems or documents | Canonical operational state only when maintained through approved human process. |

Neither repo artifacts nor Drive records alone grant operational approval.

## 5. What Drive Is Currently Allowed To Do

Drive may be used for:

- human-governed documentation records
- human-governed milestone/status records
- manual governance reconciliation when explicitly requested and reviewed
- human-readable traceability across decisions, audits, and milestones
- human-authored summaries of repo state, validation status, and governance boundaries

Manual human-requested Drive governance updates are allowed only when explicitly requested, reviewed, and performed
within the requested scope.

## 6. What Drive Is Not Currently Allowed To Do

Drive is not currently approved for:

- local-agent Drive sync
- local-agent Drive writes
- local-agent OAuth or write access
- automatic source-packet ingestion
- runtime source lookup
- validator source-of-truth authority
- operational action source
- source-packet binding
- semantic source verification
- real event validation data
- saved generated packet retention
- hidden execution or background reconciliation

Drive docs must not be treated as machine-readable authority merely because a link exists.

## 7. Drive Links Policy

Drive links are not currently valid bounded source-packet references.

Drive links may appear in human documentation, milestone summaries, governance records, and manually reviewed traceability
notes. A Drive link must not be treated as:

- source-packet identity
- source-packet version
- validator-readable source content
- source-of-truth proof
- operational approval
- human approval by implication
- semantic support for a generated claim

Using Drive links as bounded source-packet references requires separate planning and approval.

## 8. Source-Of-Truth Policy

The local repo is canonical for Agent Builder implementation artifacts, including:

- agent specs
- fixtures
- eval suites
- validators
- sample packets committed for calibration
- decision records
- implementation plans
- tests
- scripts

Drive is canonical for human governance/status records when those records are explicitly created or updated through
human-governed process.

Operational source-of-truth records remain governed by the relevant human-owned business process. Neither repo nor
Drive alone grants operational approval, authority to act, or permission to update business systems.

## 9. Retention And Redaction Boundaries

Agent Builder should default to minimum necessary data.

Current boundaries:

- no real event data in validation without separate approval
- no redacted event data in validation without separate approval
- no saved generated packets unless retention is separately planned
- no Drive packet retention by local agents
- redaction must precede real or sensitive data use
- sensitivity classification must precede real or sensitive data use
- restricted data remains out of scope unless separately planned and approved

Any future retention plan should define storage location, owner, retention period, cleanup expectations, sensitivity
classification, and review process.

## 10. Access Control Boundaries

Drive permissions are human-managed.

Current boundaries:

- no local-agent OAuth access
- no local-agent Drive write access
- no automatic Drive permission changes
- no background Drive readers or writers
- no local-agent sharing, moving, deleting, or publishing of Drive records

Any future local-agent Drive access requires separate planning, security/privacy review, explicit approval gates,
least-privilege scope, audit/logging expectations, and rollback or revocation procedures.

## 11. Manual Reconciliation Rules

Manual Drive governance reconciliation is allowed only when explicitly requested by the Founder / Strategic Owner or
another accountable human owner with clear authority for the record being updated.

Manual reconciliation should record:

- repo commit
- milestone name
- validation status
- files or artifacts summarized
- governance boundaries preserved
- known caveats
- next approved or proposed milestone

Manual reconciliation must not:

- convert Drive docs into source packets
- imply Drive sync or Drive writes by local agents
- imply source-packet binding
- imply semantic source verification
- imply operational approval
- hide unresolved review questions
- update operational records unless separately approved by the responsible human owner

## 12. Future Approval Requirements Before Drive Can Become A Bounded Source Input

Before any Drive record can become a bounded source input for Agent Builder validation or runtime planning, a separate
approved plan must define:

- source-packet identity model
- Drive record eligibility criteria
- redaction policy
- retention policy
- access-control policy
- checksum/hash or version policy, if approved
- audit/logging policy
- explicit human approval gates
- source-of-truth conflict handling
- review owner and escalation path
- failure and revocation behavior

That future plan must distinguish declared provenance from semantic source verification.

## 13. Governance Language Rules

Preferred language:

- "manual Drive governance update"
- "Drive governance/status record"
- "human-governed Drive record"
- "human-readable traceability"
- "repo implementation artifact"
- "bounded local source packet"

Avoid unless separately approved and true:

- "Drive source packet"
- "Drive sync/write capability"
- "Drive-backed validator source"
- "Drive source-of-truth proof"
- "verified from Drive"
- "approved by Drive"
- "operationally updated"

Drive language should not imply truth, completeness, freshness, semantic support, compliance, safety, readiness, human
approval, operational approval, or authority to act.

## 14. Risks And Mitigations

Risk: Drive ambiguity.
Mitigation: separate Drive governance/status records from source packets, output packets, and operational records.

Risk: accidental source-of-truth expansion.
Mitigation: state that neither repo nor Drive alone grants operational approval or authority to act.

Risk: privacy leakage.
Mitigation: keep real/redacted event data out of validation until redaction, sensitivity, access, and retention policies
are separately approved.

Risk: retention drift.
Mitigation: prohibit saved generated packets and Drive packet retention by local agents until a retention plan exists.

Risk: provenance theater.
Mitigation: allow Drive links in human documentation only; do not treat links as source-packet identity or semantic
support.

Risk: local-agent overreach.
Mitigation: keep local-agent Drive sync, writes, OAuth access, permission changes, and background reconciliation
unapproved until separately planned and approved.

## 15. Recommended Next Milestone

After this Drive-boundary decision record is committed and audited, proceed to a planning-only implementation plan for
single-source synthetic provenance validation.

That plan should remain limited to local deterministic validation planning for synthetic source-packet references. It
should not include runtime generation, model calls, prompts, CLI wiring, routes, tools, integrations, Drive sync, Drive
writes by local agents, UI, real event data, operational use, source-packet binding implementation, semantic source
verification, or Event Readiness authority expansion.

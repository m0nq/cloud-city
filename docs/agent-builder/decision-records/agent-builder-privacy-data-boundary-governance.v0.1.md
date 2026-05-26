# Agent Builder Privacy/Data-Boundary Governance v0.1

Decision record status: proposed for human review only.

This is a docs-only decision record. It clarifies privacy/data taxonomy, boundary language, approval ownership, retention-boundary framing, and blocked scope for future planning. It does not approve implementation, runtime/model behavior, source reads, business/source-data reads, content hashing, semantic verification, source-packet binding, Drive access or automation, UI/reviewer cockpit planning or implementation, real/redacted/public/personal/vendor/operational data use, operational approval, external communication, or autonomous action.

All generated packets remain drafts. Humans approve. Humans execute. `PASS` remains pass for human review only. `approvedForOperationalUse` remains false unless separately approved.

## 1. Status

Proposed for Cloud City Agent Builder governance.

Current posture remains synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, and non-operational.

## 2. Decision

This record decides that:

- the current approval owner for privacy/data-boundary approvals and exceptions is the Founder / human project owner
- the current approval model is single-owner approval
- completion of this milestone means governance clarity only; it does not enable implementation, runtime behavior, data readiness, Drive readiness, or operational approval
- a minimal repo-side privacy/data taxonomy is sufficient for current planning use
- public data and vendor data are separate classes
- restricted/sensitive is treated as an overlay, not a standalone base class
- redacted data remains future-only and blocked unless separately approved
- this record may define current retention boundaries and non-approvals, but detailed retention schedules are deferred to a later audit-log/records-retention decision record
- Drive governance/status context, including `Cloud City — Agent Builder Privacy/Data Boundary Review v0.3`, is human-provided context only unless separately verified and approved later
- existing governance artifacts remain cumulative unless a direct conflict is identified; if a direct conflict later appears on a privacy/data-boundary approval question, this record governs that approval question only

## 3. Context

Roadmap v0.3 identifies privacy/data-boundary planning as `L1.8`, meaning data-handling boundaries are planned without using real or redacted event data.

The L1.6 operator-readiness charter states that current synthetic-only validation does not prove privacy safety for real or redacted data.

The Drive governance/source-of-truth decision record already establishes minimum-necessary, redaction, sensitivity, retention, and access-control boundary concepts, but it does not authorize Drive access or data use.

The source-boundary approval-authority decision record already establishes single-owner approval, no implied approval, and no evidence-state promotion by implication. This privacy/data-boundary record should preserve those same governance constraints for data classification and handling language.

The current stabilized repo milestone is `68c2498 docs(agent-builder): add source boundary approval authority record`.

## 4. Scope

This record covers:

- minimal repo-side privacy/data classification for future governance work
- current allow/block posture for named classes
- surface/location boundaries
- minimum-necessary handling rules
- retention-boundary framing
- approval ownership and exception handling
- relationship to source boundary, Drive governance, evals, logs, and operational approval

This record does not cover implementation or capability expansion.

## 5. Verified Repo Evidence And Human-Provided Context

Verified repo evidence for this record includes:

- Roadmap v0.3 names privacy/data-boundary planning as a distinct planning milestone and future decision record
- L1.6 remains synthetic-only and rejects privacy-safety claims for real or redacted data
- the Drive governance/source-of-truth decision record defines minimum-necessary, redaction-before-use, sensitivity-classification-before-use, retention-boundary, and access-control boundary concepts
- the source-boundary approval-authority record defines single-owner approval, no implied promotion, and explicit exception rules

Human-provided but unverified-by-Codex context includes:

- the existence and current status of `Cloud City — Agent Builder Privacy/Data Boundary Review v0.3`
- any detailed taxonomy, class numbering, or handling matrix that may exist in Drive
- any claim that Drive v0.3 contains additional approved repo doctrine beyond the current repo artifacts

Drive v0.3 may inform human review, but it is not treated here as verified repo evidence.

## 6. Minimal Repo-Side Privacy/Data Taxonomy

The minimal repo-side taxonomy for current governance use is:

- `repo_governance_artifact`: Repo docs, decision records, plans, and milestone-reconciliation language. Current status: Allowed for docs-only governance use.
- `synthetic_validation_data`: Synthetic fixtures, eval inputs, and synthetic test-only validation content. Current status: Allowed only in local synthetic validation/eval/test contexts.
- `synthetic_draft_review_artifact`: Synthetic draft packets, synthetic review records, and synthetic human-review artifacts. Current status: Allowed only as draft, synthetic, human-review artifacts.
- `drive_governance_status_record`: Human-governed Drive status or governance record. Current status: Human-reference-only; not repo evidence, not agent-readable authority, not agent-writable.
- `public_data`: Publicly available external information. Current status: Future-only and blocked for agent/system use, source handling, validation, runtime behavior, retained data workflows, or operational use.
- `vendor_data`: Data originating from or governed by an external vendor relationship or vendor-managed system. Current status: Future-only and blocked for use.
- `personal_data`: Data about identifiable individuals. Current status: Future-only and blocked for use.
- `operational_data`: Business-operational records or workflow data. Current status: Future-only and blocked for use.
- `redacted_data`: Transformed real data with obscured elements. Current status: Future-only and blocked unless separately approved.

The minimal repo-side overlay for current governance use is:

- `restricted_sensitive_overlay`: An added restriction layer that may apply to any class or artifact when higher sensitivity, handling restriction, or tighter approval is required. Current status: Future-only and blocked unless separately approved.

Current rule: naming a class or overlay does not approve reading it, storing it, validating it, retaining it, or using it.

## 7. Current Boundary Rules

Current boundary rules are:

- minimum necessary data remains the default posture
- mixed artifacts inherit the most restrictive applicable class or overlay
- synthetic-only artifacts must remain synthetic-only
- repo governance artifacts must not be used to imply data-use approval
- human review does not equal privacy approval
- reconciled documentation does not equal data readiness
- Drive references do not equal data authority
- redaction is not a current approval state; it is future-only and separately gated
- public availability does not create approval for agent/system use, source handling, validation, runtime behavior, retained data workflows, or operational use
- human-authored governance prose may name public concepts at a high level when no source-content ingestion, retained data workflow, or operational use is implied
- vendor custody does not create approval to use, retain, validate, or operationalize data
- blocked data classes should be labeled `future-only` or `blocked` when discussed in repo governance docs

## 8. Surface/Location Boundaries

Current surface/location boundaries are:

- Repo docs and decision records. Allowed now: `repo_governance_artifact` language and boundary clarification. Blocked now: Any real/redacted/public/personal/vendor/operational data use.
- Local fixtures, evals, tests, and validators. Allowed now: `synthetic_validation_data` only. Blocked now: Any non-synthetic data.
- Local draft packets and review artifacts. Allowed now: `synthetic_draft_review_artifact` only. Blocked now: Any non-synthetic data or operational record treatment.
- Drive governance/status references in repo docs. Allowed now: Human-provided context only. Blocked now: Agent access, agent writes, source authority, data authority.
- Generated packets, review artifacts, and future logs. Allowed now: Existing synthetic draft/review artifacts remain valid within current synthetic-only posture. Blocked now: No expanded retention of generated packets, review artifacts, or future logs unless retention is separately planned and approved.
- Operational business systems or records. Allowed now: Not in scope for current posture. Blocked now: Any agent handling or update path.

## 9. Handling, Retention, And Access-Control Boundaries

Current handling rules are:

- no real event data in validation without separate approval
- no redacted event data in validation without separate approval
- no public data use without separate approval
- no vendor data use without separate approval
- no personal data use without separate approval
- no operational data use without separate approval
- no expanded retention of generated packets, review artifacts, or future logs unless retention is separately planned and approved
- no Drive packet retention by local agents
- redaction must precede any future real or sensitive data use
- sensitivity classification must precede any future real or sensitive data use
- `restricted_sensitive_overlay` remains out of scope unless separately planned and approved
- detailed retention schedules, audit-log design, deletion timing, and field-level retention rules are deferred to a later audit-log/records-retention decision record

## 10. No Data-State Promotion Rule

This record does not, by itself, promote any class, artifact, label, summary, review state, or Drive reference from a weaker boundary state to a stronger approval state.

This includes no promotion from:

- synthetic-only to privacy-safe for real data
- synthetic-only to runtime-ready
- redacted to approved
- redacted to sufficiently safe by implication
- public to approved-for-use
- vendor to approved-for-use
- personal to approved-for-use
- operational to approved-for-use
- `restricted_sensitive_overlay` to handled-by-default
- Drive reference to data authority
- reviewed to operationally approved
- reconciled to data-ready
- planning-only to implementation-ready

Labels, filenames, file paths, summaries, metadata fields, review status, redaction labels, overlay labels, and planning artifacts do not prove safe handling, approved handling, or authority to act.

## 11. Approval Authority And Exceptions

Current authority model:

- the Founder / human project owner is the sole current approver for privacy/data-boundary approvals and exceptions
- human review alone is not approval
- no approval cascades to adjacent capabilities unless those capabilities are named explicitly in a separate approved artifact

No implied exceptions are allowed.

Future privacy/data-boundary exceptions require either:

- a full decision record for material scope changes
- a signed addendum for tightly bounded clarifications

In either case, the exception must be:

- explicit
- written
- scoped
- attributed to the Founder / human project owner
- clear about what remains blocked

Every exception must also:

- name the specific class, overlay, boundary, or handling question at issue
- name the exact planning or review purpose
- identify the governing artifact carrying the exception
- state which adjacent capabilities are not approved
- avoid implying runtime behavior, Drive access, source reads, data use, operational approval, or authority to act unless separately approved

## 12. What This Record Approves

This record approves only:

- planning-only use of the minimal repo-side privacy/data taxonomy
- planning-only use of current allow/block class and overlay boundaries
- planning-only retention-boundary framing
- planning-only approval-ownership and exception rules
- docs-only clarification of privacy/data governance language under human review

No data-use capability, runtime path, Drive behavior, UI path, or operational workflow is approved by this record.

## 13. What Remains Blocked

This record does not approve:

- source reads
- business/source-data reads
- file existence checks
- content hashing
- semantic verification
- source-packet binding
- runtime/model planning or behavior
- prompt planning
- route, tool, or integration planning
- Drive lookup, sync, writes, automation, OAuth, or local-agent access
- UI/reviewer cockpit planning or implementation
- real data use
- redacted data use
- public data use
- personal data use
- vendor data use
- operational data use
- retention expansion beyond current boundary framing
- operational approval
- external communication
- autonomous action

## 14. Relationship To Existing Governance Artifacts

Relationship rules are:

- Roadmap v0.3 remains the maturity and sequencing context; this record corresponds to privacy/data-boundary planning at `L1.8`
- the source-boundary charter remains the terminology and evidence-authority reference for source-related claims
- the source-boundary approval-authority record remains the approval-boundary authority for source-related governance questions
- the Drive governance/source-of-truth decision record remains the authority on what Drive may and may not mean
- L1/L1.5/L1.6 eval and review evidence remains synthetic-only and must not be treated as privacy approval or data-safety proof
- any detailed retention schedule or audit-log policy belongs to a later audit-log/records-retention decision record
- operational approval remains a separate later governance milestone

## 15. Completion Meaning

This milestone is complete when governance clarity is achieved on all of the following:

- the approval owner is explicit
- the single-owner model is explicit
- the minimal repo-side taxonomy is explicit
- public and vendor data remain distinct classes
- `restricted_sensitive_overlay` is explicit as an overlay, not a base class
- redacted data remains future-only and blocked
- current surface/location boundaries are explicit
- current retention-boundary framing is explicit
- blocked capabilities remain explicit
- exception handling rules are explicit
- blocked classes are labeled clearly in governance discussion
- no section implies implementation, runtime behavior, data readiness, Drive readiness, or operational approval

Completion does not mean implementation readiness, runtime readiness, data readiness, Drive readiness, UI readiness, or production readiness.

## 16. Future-Only Considerations

The following remain future-only and require separate approval if ever considered:

- any use of public data
- any use of vendor data
- any use of personal data
- any use of operational data
- any use of redacted data
- any application of `restricted_sensitive_overlay`
- any redaction standard or redaction-verification process
- any detailed retention schedule
- any audit-log design or records-retention implementation
- any Drive-to-data workflow
- any runtime or operator workflow involving non-synthetic data
- any operational approval workflow

## 17. Recommended Next Action

Human review this record for governance clarity only.

If accepted, keep posture paused, synthetic-only, pre-runtime, below L2, human-reviewed, approval-gated, and non-operational until a separate later milestone explicitly expands scope.

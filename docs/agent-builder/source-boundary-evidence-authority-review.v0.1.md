# Source Boundary & Evidence Authority Review v0.1

## 1. Title

**Source Boundary & Evidence Authority Review**

## 2. Status

**Planning-only draft.**
**Paused / non-operational / synthetic-only context.**

This charter is definition-only and governance-first. It does not authorize implementation, source reads,
verification, runtime behavior, CLI/operator behavior, Drive behavior, UI behavior, or operational use.

## 3. Purpose

Define controlled terms, evidence-authority boundaries, conflict-state overlays, and non-inference rules for
source-related planning language before any future planning involving source boundaries, source content handling,
source verification, CLI/operator flows, runtime/model behavior, Drive behavior, UI/reviewer surfaces, or
real/redacted/public/personal data handling.

## 4. Background / Planning Context

The current Agent Builder posture is below L2, synthetic-only, pre-runtime, human-reviewed, approval-gated, and
non-operational. Repo planning artifacts already distinguish declared metadata from verified source evidence and
distinguish declared provenance from semantic verification, but several source/evidence terms remain under-defined or
overloaded.

This charter exists to prevent later planning branches from inheriting ambiguous language that could be mistaken for
proof, approval, or authority to act.

## 5. Verified Repo-Document Basis From The Terminology Inventory

This charter is based on previously reviewed repo governance/planning documents only:

- the roadmap states L1.6 proves declared-metadata-only treatment and does not prove source truth, freshness,
  completeness, or semantic support
- L1.6 review language explicitly distinguishes `declared metadata` from `verified source evidence`
- the Drive-boundary decision record distinguishes Drive governance/status records, local bounded source packets, and
  operational source-of-truth records
- provenance decision records distinguish declared provenance from semantic source verification and prefer
  `referenced source packet` / `bounded source input` language
- completeness boundary records state current L1 does not prove source truth, completeness, freshness, semantic
  support, authenticity, or authority to act

## 6. Human-Provided Context That Remains Unverified By Codex

The following context is treated as human-provided and not independently verified in this charter:

- the existence, exact naming, location, and contents of `Cloud City — Agent Builder Privacy/Data Boundary Review v0.2`
- the claim that this Drive artifact is the current planning baseline for D0-D11 data classes, domain overlays,
  handling permissions, surface/location boundaries, promotion evidence, and explicit non-approvals
- the stated Drive path `02_Operating_System -> 06_AI_Draft_and_Log_Protocol`

## 7. Scope

This charter covers:

- controlled vocabulary for source and evidence language
- a definition-only evidence authority ladder
- conflict-state overlays
- non-inference rules for planning artifacts and metadata
- human accountability boundaries for review and claim strength
- principles for source boundary, freshness, completeness, and conflict handling
- promotion gates for later planning branches

This charter does not cover implementation, operations, or approvals beyond terminology and governance boundaries.

## 8. Explicit Non-Goals

This charter does not permit or design:

- source reads
- business/source-data reads
- file existence checks
- content hashing
- semantic source verification
- source-packet binding
- CLI/operator wiring
- runtime/model calls or behavior
- prompts, routes, tools, or integrations
- Drive sync, Drive writes, or Drive automation
- UI/reviewer cockpit behavior
- public, real, redacted, personal, vendor, or operational data use
- operational approval
- external communication
- autonomous action

## 9. Controlled Vocabulary

### `source candidate`

A named origin of information proposed for possible future source use. A source candidate may be discussed in planning
but is not approved, readable, verified, or authoritative.

### `source`

A named origin of information recognized within planning vocabulary. Naming a source does not approve reading it,
trusting it, or acting on it.

### `source boundary`

The governance rule set that defines what source-related concepts may be named, what metadata may be declared, what
claim strength is permitted at each level, what those declarations do not prove, and which source-related operations
remain blocked.

### `source packet`

A bounded source-input concept used in current planning language for local synthetic review context. A source packet is
not, by itself, proof of truth, freshness, completeness, semantic support, approval, or authority to act.

### `human-declared context`

Context asserted by a human for planning use. It may inform planning discussions but does not constitute verified
evidence.

### `declared source metadata`

Descriptive metadata asserted about a source candidate, source, or source packet, such as label, type, owner,
reference, or preparation context. It is descriptive only and is not proof.

### `approved source metadata`

Declared source metadata accepted by an authorized human as allowed planning vocabulary for a defined purpose. The
approval scope must be recorded. It does not approve source reads, content reliance, semantic verification,
operational use, or authority to act.

### `source-referenced claim`

A claim that points to declared or approved source metadata only. It has no approved content-level verification and
must not be treated as semantically supported.

### `source-grounded claim`

A future-only claim tied to approved source content under an approved read/verification process. This state is not
available in the current posture.

### `verified source evidence`

Future-only evidence produced by an approved verification method showing that a source or source-content property has
been checked according to an approved process. This state is not available in the current posture.

### `source freshness`

A defined recency expectation for a source relative to a stated purpose or decision context. In the current posture,
freshness may be described as an expectation only; it is not measured or proven by the system.

### `source completeness`

A defined expectation regarding whether the relevant source set is sufficiently present for a stated purpose or claim.
In the current posture, completeness may be described as a scope expectation only; it is not measured or proven by the
system.

### `semantic support`

A future-only condition in which approved source content has been checked and actually supports a claim. This state is
not available in the current posture.

### `source conflict`

A material inconsistency between source-related inputs, references, or claims that affects reliability,
interpretation, or downstream decision confidence.

### `conflict-noted claim`

A claim where a possible source conflict has been surfaced but not resolved. The claim must remain explicitly bounded
and lower-authority.

### `conflict-reviewed claim`

A claim reviewed by a human authority against known conflicts and explicitly bounded as unresolved, conditional,
limited, or resolved. Conflict review changes review posture; it does not automatically increase evidence authority.

### `evidence authority`

The maximum claim strength an artifact or review state may carry. Evidence authority defines what a planning artifact
may support, and what it may not be used to imply.

### `authority to act`

Permission to trigger decisions, communications, updates, operational workflows, or external effects. Authority to act
is separate from evidence authority and is not granted by this charter.

### `operational approval`

A separately governed authorization that allows a system or human-in-the-loop process to be used for operational
decisions or actions. Operational approval is not granted by this charter.

## 10. Evidence Authority Ladder

This ladder is definition-only:

1. `human-declared context`
2. `declared source metadata`
3. `approved source metadata`
4. `source-referenced claim`
5. `verified source evidence` — future-only
6. `source-grounded claim` — future-only
7. `semantically supported claim` — future-only

Constraint: no level in this ladder implies operational approval, external communication, autonomous action, or
authority to act unless a separate later governance milestone explicitly grants it.

## 11. Conflict-State Overlay

Conflict states are overlays on claims or review records. They modify review posture; they do not automatically
increase evidence authority.

Conflict-state overlay values:

- `no known conflict`
- `conflict-noted`
- `conflict-reviewed by human authority`
- `conflict unresolved`
- `conflict conditionally bounded`
- `conflict resolved by named human authority`

Rules:

- a claim may have an evidence-authority level and a conflict-state overlay at the same time
- conflict review does not transform a source-referenced claim into verified source evidence
- conflict resolution language must name the human authority if resolution is asserted
- unresolved conflict must remain explicit in the claim boundary

## 12. Non-Inference Rules

None of the following, by themselves or in combination, prove truth, freshness, completeness, semantic support,
approval, or authority to act:

- labels
- file paths
- filenames
- Drive links
- summaries
- metadata fields
- source packet names
- source packet existence
- review record existence
- human review existence
- source references
- provenance fields
- planning artifacts

Additional rules:

- planning clarity language must not be interpreted as source verification language
- `reviewed`, `referenced`, `prepared`, `included`, `linked`, or `named` do not imply validated source content
- conflict review language does not increase evidence authority unless a separately approved future verification model
  says so

## 13. Human Review And Accountability Model

Human review remains mandatory for interpretation of planning artifacts.

Every human review statement must specify what was reviewed. Allowed review scopes include:

- terminology
- metadata
- source reference
- conflict boundary
- operational implication
- source content, only under a separately approved future milestone

Rules:

- human review does not equal operational approval
- human review does not convert metadata into verified source evidence
- human review of a source reference does not imply source-content review
- source-content review is not available in the current posture
- human review of conflict boundaries does not imply conflict resolution unless explicitly stated
- if a future milestone introduces source-content review, the review record must state that source content was reviewed
  and under what approved process

## 14. Source Boundary Principles

1. A source candidate may be named before it is a recognized source.
2. A source may be named before it is readable.
3. A source reference is weaker than source-content review.
4. Metadata reference is weaker than semantic support.
5. Source packets are bounded planning constructs, not proof artifacts.
6. Drive governance/status artifacts, local source packets, and operational source-of-truth records must remain
   separate categories.
7. Source boundary language must specify both what is allowed to be said and what is not yet allowed to be inferred.

## 15. Source Freshness And Completeness Principles

1. Freshness and completeness must be defined as expectations before they can ever be measured.
2. A preparation timestamp is not freshness proof.
3. A list of referenced sources is not completeness proof.
4. Freshness and completeness are context-dependent and require a stated purpose.
5. In the current posture, freshness and completeness may be described only as human-stated expectations, not
   system-proven conditions.

## 16. Source Conflict Principles

1. Source conflicts must be surfaced explicitly when known.
2. Surfacing a conflict does not resolve it.
3. Absent a separately approved process, no system may choose a winning source.
4. Conflict language must distinguish `conflict-noted` from `conflict-reviewed`.
5. A conflict-reviewed claim must preserve the reviewer's boundary statement: unresolved, conditional, limited, or
   resolved by named human authority.
6. Conflict-state overlays affect review posture, not evidence rank.

## 17. Promotion Gates / What This Charter Does And Does Not Permit

This charter permits:

- controlled term definitions
- evidence-authority definitions
- conflict-state definitions
- non-inference rules
- planning-language normalization
- later charter drafting or terminology reconciliation planning

This charter does not permit:

- source-content inspection
- source verification
- source-packet binding
- runtime or model behavior planning
- CLI/operator behavior planning
- Drive automation planning
- UI/reviewer cockpit planning
- real/redacted/public/personal data planning
- operational approval
- authority to act

Any future branch that seeks stronger claim states must first specify:

- why current declared or approved metadata is insufficient
- what new evidence authority is sought
- whether conflict-state handling changes
- what new risks are introduced
- what separate governance milestone would be required

## 18. Completion Criteria

This charter can be considered complete for planning use when:

- all controlled terms are defined with non-inference boundaries
- the evidence authority ladder is accepted as definition-only
- conflict-state overlays are accepted as distinct from evidence authority
- `source-referenced claim` is clearly separated from `source-grounded claim`
- future-only states are explicitly marked
- conflict-noted and conflict-reviewed claims are distinct
- no section implies read access, verification authority, or operational permission
- blocked future branches are explicitly named

## 19. Open Questions

- who should be the named human authority for conflict-reviewed claims if a future milestone introduces source-content
  review?
- what later milestone would define approved verification methods, if ever?
- what later milestone would define acceptable freshness windows and completeness expectations by decision context?
- should `approved source metadata` require one human approver or a concurrence model?
- should `evidence authority` be recorded per artifact type, per milestone, or both?
- what later artifact, if any, would define escalation when source conflicts remain unresolved?

## 20. Future Branches That Remain Blocked Until Separately Approved

- source reads and source-content access planning
- source-packet binding design
- semantic verification planning
- file existence or hashing checks
- runtime/model behavior planning
- CLI/operator workflow planning
- Drive lookup, sync, or write automation planning
- UI/reviewer cockpit planning
- real/redacted/public/personal data handling planning
- operational approval planning
- external communication planning
- autonomous action planning

## 21. Recommended Next Action

Use this charter as a planning-only review artifact for later reconciliation with existing governance/planning
documentation. Keep subsequent work limited to docs-only terminology normalization and planning-boundary review until a
separate later milestone explicitly expands scope.

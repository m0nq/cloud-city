# Event Readiness L1 Source Packet / Output Packet Provenance Defaults v0.1

Decision record status: proposed provenance defaults.

This is a docs-only decision record. It does not approve Event Readiness runtime generation, model calls, prompts,
routes, tools, integrations, Drive sync, Drive writes, UI, real event data, operational use, source-packet binding
implementation, semantic source verification, or changes to validators, schemas, runtime files, application code,
fixtures, eval behavior, or test behavior.

All Event Readiness packets remain drafts. Humans approve. Humans execute. `PASS` means pass for human review only.

## 1. Purpose

Define narrow Event Readiness L1 provenance defaults for how future draft output packets should reference bounded source
packets before any implementation of source-packet binding or semantic source verification.

This record supports continuous calibration / continuous development by separating four layers:

1. Source-label validity: already covered by Slice 3E.
2. Intra-packet source-label consistency: already covered by Slice 3E.
3. Source-packet / output-packet provenance: planned by this decision record.
4. Semantic source verification: explicitly deferred.

## 2. Non-Goals

This record does not:

- implement provenance validation
- implement source-packet binding
- implement semantic source verification
- add source-packet checksums or hashing requirements
- add runtime generation
- add model calls
- add prompts
- add CLI wiring
- add routes, tools, integrations, Drive behavior, or UI
- approve real event data
- approve operational use
- expand Event Readiness authority
- decide which source wins when source materials conflict

## 3. Current State

Current audited baseline:

- `4e2c915 test(agent-builder): enforce event readiness canonical source labels`

Current Event Readiness runtime-output validation already enforces:

- schema shape
- draft-only packet posture
- required human review
- allowed readiness labels
- approval gate IDs
- `PASS` / `PARTIAL` / `FAIL` mapping
- schema parse failure blocking
- review-flag-to-`PARTIAL` mapping
- authority-claim blocking
- minimal source-label presence
- explicit source-conflict-resolution blocking
- canonical source-label vocabulary
- intra-packet source-label consistency

Current output packets include:

- `source_packet_id_or_path`
- `sources_used`
- nested `source_labels` on confirmed facts, source conflicts, and review flags

Current output packets do not include explicit source-packet identity objects, source packet versions, redaction metadata,
checksum/hash policy, source-packet binding, or semantic source verification.

## 4. Decision Summary

| Question | Decision |
| --- | --- |
| L1 source packet count | Require exactly one referenced source packet for the first provenance implementation slice. |
| Reference shape | Use a future-compatible `source_packets` array, but require `source_packets.length === 1` for L1. |
| Source packet kind | Allow only `synthetic_fixture` in the first implementation slice. |
| Redaction status | Allow only `synthetic_no_real_data` in the first implementation slice. |
| Source packet ID | Require a manually authored stable ID; do not derive identity from path alone. |
| Source packet path | Require repo-relative paths for L1 synthetic fixtures. |
| Content hash | Optional, nullable, and future reserved; not required for L1. |
| Multi-source support | Defer. |
| Semantic verification | Defer. |
| Human authority | Humans approve. Humans execute. Validation does not approve operations. |

## 5. Source Packet Definition

An Event Readiness L1 source packet is a bounded, local, synthetic source input bundle prepared for draft-only Event
Readiness review.

For the first provenance implementation slice, the only validator-allowed source packet kind is `synthetic_fixture`.

A source packet is not:

- a generated runtime output
- an operational source of truth
- a Drive record
- an external URL
- an unbounded folder or corpus
- a real event packet
- an approval to act
- proof that source contents are true, complete, fresh, safe, compliant, or operationally approved

## 6. Output Packet Definition

An Event Readiness L1 output packet is a structured draft review packet for human review. It may reference one bounded
source packet through declared provenance metadata, but it remains non-operational.

An output packet must continue to preserve:

- draft-only status
- human-review-before-action requirements
- Event Readiness approval gates
- allowed readiness labels
- canonical source labels
- source conflicts surfaced without resolution
- prohibited operational authority boundaries

## 7. Required Source Packet Reference Shape

Future output packets should use this source packet reference shape:

```json
{
  "source_packets": [
    {
      "source_packet_id": "event_readiness.source_packet.blocked_escalation.synthetic.v0.1",
      "source_packet_version": "v0.1",
      "source_packet_path": "fixtures/event_readiness/blocked_escalation.synthetic.yaml",
      "source_packet_kind": "synthetic_fixture",
      "prepared_by_role": "Agent Systems Architect",
      "prepared_at": "2026-05-09",
      "sensitivity_level": "internal_confidential",
      "redaction_status": "synthetic_no_real_data",
      "source_labels_present": ["EVENT_BRIEF", "VENUE_NOTES"],
      "source_domains_omitted": [],
      "content_hash": null
    }
  ]
}
```

Required fields:

- `source_packet_id`
- `source_packet_version`
- `source_packet_path`
- `source_packet_kind`
- `prepared_by_role`
- `prepared_at`
- `sensitivity_level`
- `redaction_status`
- `source_labels_present`
- `source_domains_omitted`
- `content_hash`

`content_hash` is required as a field only so the absence of hashing is explicit. For L1, its value may be `null`.

## 8. Recommended JSON Example

For a full synthetic fixture source packet:

```json
{
  "source_packets": [
    {
      "source_packet_id": "event_readiness.source_packet.blocked_escalation.synthetic.v0.1",
      "source_packet_version": "v0.1",
      "source_packet_path": "fixtures/event_readiness/blocked_escalation.synthetic.yaml",
      "source_packet_kind": "synthetic_fixture",
      "prepared_by_role": "Agent Systems Architect",
      "prepared_at": "2026-05-09",
      "sensitivity_level": "internal_confidential",
      "redaction_status": "synthetic_no_real_data",
      "source_labels_present": [
        "EVENT_BRIEF",
        "VENUE_NOTES",
        "WALKTHROUGH_NOTES",
        "RUN_OF_SHOW_DRAFT",
        "STAFFING_DRAFT",
        "DRY_BAR_NOTES",
        "PRODUCTION_NOTES",
        "DOOR_FLOW_NOTES",
        "BUDGET_NOTES",
        "COMPLIANCE_NOTES",
        "ACCESSIBILITY_SAFETY_NOTES",
        "OPEN_QUESTIONS"
      ],
      "source_domains_omitted": [],
      "content_hash": null
    }
  ]
}
```

For a sparse synthetic fixture:

```json
{
  "source_packets": [
    {
      "source_packet_id": "event_readiness.source_packet.sparse_but_reviewable.synthetic.v0.1",
      "source_packet_version": "v0.1",
      "source_packet_path": "fixtures/event_readiness/sparse_but_reviewable.synthetic.yaml",
      "source_packet_kind": "synthetic_fixture",
      "prepared_by_role": "Agent Systems Architect",
      "prepared_at": "2026-05-09",
      "sensitivity_level": "internal_confidential",
      "redaction_status": "synthetic_no_real_data",
      "source_labels_present": [
        "EVENT_BRIEF",
        "VENUE_NOTES",
        "RUN_OF_SHOW_DRAFT",
        "STAFFING_DRAFT",
        "DRY_BAR_NOTES",
        "OPEN_QUESTIONS"
      ],
      "source_domains_omitted": [
        {
          "source_label": "WALKTHROUGH_NOTES",
          "reason": "not_provided_in_sources"
        },
        {
          "source_label": "PRODUCTION_NOTES",
          "reason": "not_provided_in_sources"
        },
        {
          "source_label": "DOOR_FLOW_NOTES",
          "reason": "not_provided_in_sources"
        },
        {
          "source_label": "BUDGET_NOTES",
          "reason": "not_provided_in_sources"
        },
        {
          "source_label": "COMPLIANCE_NOTES",
          "reason": "not_provided_in_sources"
        },
        {
          "source_label": "ACCESSIBILITY_SAFETY_NOTES",
          "reason": "not_provided_in_sources"
        }
      ],
      "content_hash": null
    }
  ]
}
```

## 9. L1 Allowed Values

For the first provenance implementation slice:

- `source_packets.length` must equal `1`.
- `source_packet_kind` must be `synthetic_fixture`.
- `redaction_status` must be `synthetic_no_real_data`.
- `source_packet_path` must be repo-relative.
- `content_hash` may be `null`.

Allowed omission reasons:

- `not_provided_in_sources`
- `intentionally_redacted`
- `out_of_scope_by_human_instruction`
- `not_applicable_to_packet`

## 10. Future Reserved Values

Reserved source packet kinds, not validator-allowed in the first implementation slice:

- `synthetic_manual_test_packet`
- `redacted_local_packet`

Reserved redaction statuses, not validator-allowed in the first implementation slice:

- `redacted_no_restricted_data`
- `redaction_required_before_use`
- `redaction_status_unknown`

These values require separate planning before they are allowed by validation.

## 11. Source Packet ID Policy

`source_packet_id` should be manually authored and stable.

It should not be derived from `source_packet_path` alone because paths can move, file names can be reorganized, and
future docs may need to preserve provenance identity across local refactors.

A future validator may check that the ID, version, path, and fixture metadata are internally coherent, but that is
identity consistency, not semantic verification.

## 12. Source Packet Path Policy

For L1 synthetic fixtures, `source_packet_path` should be repo-relative and should point to a bounded synthetic fixture
file under `fixtures/event_readiness/`.

Unapproved path/reference forms:

- absolute local paths
- external URLs
- Drive links
- unbounded directories
- free-form descriptions such as "latest docs"
- public web sources
- real event documents

These forms remain unapproved until separate planning addresses retention, sensitivity, access, and source-of-truth
boundaries.

## 13. Source Label Interaction With Slice 3E

Slice 3E already enforces:

- every `sources_used` value is canonical
- every nested `source_labels` value is canonical
- every nested `source_labels` value is declared in the output packet's own `sources_used`

The provenance layer should add only one additional L1 rule:

- every output `sources_used` label must be present in the single referenced source packet's `source_labels_present`

This rule proves only declared provenance coverage. It does not prove that a cited fact follows from source contents.

## 14. Omitted Source Domain Model

`source_domains_omitted` should be a structured array.

Each item should contain:

- `source_label`
- `reason`

Example:

```json
{
  "source_label": "COMPLIANCE_NOTES",
  "reason": "not_provided_in_sources"
}
```

Rules:

- `source_label` should use the Event Readiness canonical source-label vocabulary.
- `reason` should use an allowed omission reason.
- Omitted source domains should not appear in `source_labels_present`.
- Omitted source domains should not be cited in output packet `sources_used`.
- The output packet should surface the omission as an unknown, review flag, or domain status such as
  `not_provided_in_sources` or `needs_human_review` when relevant.

The existing dry bar default rule still applies. If dry bar is in scope and `DRY_BAR_NOTES` is omitted, the packet should
surface that omission for human review rather than infer dry bar readiness.

## 15. Source Conflict Handling

Source conflicts should continue to be represented in `source_conflicts`.

For L1 provenance:

- the conflict should cite canonical source labels
- cited conflict labels must be present in the single referenced source packet's `source_labels_present`
- `resolution_status` should remain `unresolved_for_human_review`
- the output packet must not select a winning source
- the output packet must not include operational resolution language

If future multi-source packet support is approved, source conflicts may need packet-level references. That is deferred.

## 16. What Provenance Does Not Prove

Declared provenance does not prove:

- truth
- completeness
- freshness
- semantic support
- compliance
- safety
- readiness
- human approval
- operational approval
- authority to act
- source-of-truth status

Preferred language:

- "referenced source packet"
- "bounded source input"
- "declared provenance"
- "source packet reference"

Avoid unless future semantic source verification is approved:

- "verified against source"
- "source-verified"
- "approved source"
- "validated as true"
- "confirmed by source contents"

## 17. Human Review Boundaries

Humans remain responsible for:

- approving source packet suitability for review
- approving real or redacted source packet use in a future milestone
- approving redaction sufficiency
- deciding whether omitted domains are acceptable
- resolving source conflicts
- approving source-of-truth updates
- approving operational actions
- approving any readiness, safety, compliance, budget, venue, staffing, or public messaging decision

Machines may check declared structure and consistency only after a future implementation plan is approved.

## 18. Future Validation Checks

Future implementation may add checks such as:

- `source_packets_present`
- `single_source_packet_only`
- `source_packet_reference_shape`
- `source_packet_kind_allowed`
- `redaction_status_allowed`
- `source_packet_path_repo_relative`
- `source_packet_path_bounded_to_fixtures`
- `source_packet_id_present`
- `source_packet_version_present`
- `source_labels_present_canonical`
- `source_domains_omitted_shape`
- `source_domains_omitted_labels_canonical`
- `source_domains_omitted_reasons_allowed`
- `source_labels_present_and_omitted_do_not_overlap`
- `sources_used_covered_by_source_packet`
- `content_hash_nullable_for_l1`
- `absolute_external_or_unbounded_source_references_blocked`

These checks should remain deterministic structure/provenance checks. They should not inspect source contents to prove
the truth of claims.

## 19. Future Fixture / Sample Additions

Future synthetic-only additions may include:

- valid output packet with one `synthetic_fixture` source packet reference
- invalid output packet with missing `source_packets`
- invalid output packet with `source_packets.length > 1`
- invalid output packet with reserved `source_packet_kind`
- invalid output packet with reserved `redaction_status`
- invalid output packet with absolute `source_packet_path`
- invalid output packet with external URL or Drive link as source path
- invalid output packet whose `sources_used` is not covered by `source_labels_present`
- valid sparse packet with structured `source_domains_omitted`
- invalid packet where omitted domains overlap with `source_labels_present`
- valid packet with `content_hash: null`

Do not add real event data fixtures in the first implementation slice.

## 20. Deferred Work

Deferred until separate planning and approval:

- source-packet binding implementation
- semantic source verification
- content hash requirements
- hashing, retention, reproducibility, and sensitive-data fingerprinting policy
- multi-source packet support
- real event data or redacted local event packets
- saved-output retention policy changes
- runtime generation
- model calls
- prompts
- CLI wiring
- routes
- tools
- integrations
- Drive sync
- Drive writes
- UI
- operational use

## 21. Risks And Mitigations

Risk: provenance theater.
Mitigation: use precise language. Provenance means declared reference, not truth or approval.

Risk: multi-source complexity too early.
Mitigation: require exactly one source packet for L1 and defer multi-source support.

Risk: hash precision creates false assurance.
Mitigation: keep `content_hash` optional and nullable until a separate policy exists.

Risk: source packet path becomes an authority claim.
Mitigation: path proves only a repo-relative reference, not approval or source truth.

Risk: omitted source domains get treated as low risk.
Mitigation: require structured omission reasons and require output packets to surface relevant omissions as unknowns,
review flags, or human-review domain statuses.

Risk: reserved values accidentally become allowed.
Mitigation: document reserved values separately and require future validator tests before allowing them.

## 22. Recommended Next Milestone

Create a narrow implementation plan for single-source synthetic provenance validation only.

That plan should remain limited to deterministic schema/test changes for synthetic fixtures and should not include
runtime generation, model calls, prompts, CLI wiring, routes, tools, integrations, Drive behavior, UI, real event data,
operational use, source-packet binding implementation, semantic source verification, or Event Readiness authority
expansion.


# Agent Builder Synthetic Operator-Question Classification Fixtures v0.1

## 1. Title

Cloud City Agent Builder Synthetic Operator-Question Classification Fixtures v0.1.

## 2. Status, Scope, And Non-Purpose

- Docs-only.
- Planning-only.
- Synthetic-only.
- Draft for human review only.
- Created for CLO-58: `Define synthetic operator-question classification fixture set`.
- Drafting baseline for this pass: `8dd948c docs(agent-builder): define operator question classification scope`.
- This artifact defines a synthetic fixture set for later human-reviewed evaluation of the CLO-57 operator-surface question classification contract.
- This artifact applies CLO-57, CLO-56, and CLO-55. It does not replace, rewrite, or supersede CLO-50, CLO-52, CLO-53, CLO-54, CLO-55, CLO-56, CLO-57, or any governing lane record.

This artifact is not:

- implementation approval
- prompt approval
- model approval
- runtime behavior approval
- source-read approval
- Drive runtime authority
- UI implementation approval
- L2 approval
- a later L2 decision record
- release approval
- rollback approval
- production readiness
- operational approval
- authority to act

This artifact defines synthetic fixture cases for human review. Fixtures reduce ambiguity; they do not create approval, authority, implementation, runtime behavior, or approval inheritance.

## 3. Standing Posture And Required Boundary Statements

Agent Builder / City Center remains synthetic-only, pre-runtime, human-reviewed, approval-gated, non-operational, not production-ready, and not operationally approved.

Humans approve. Humans execute.

PASS means pass for human review only.

Drive governance/status context is not runtime source authority.

Deterministic contract conformance is not operational approval.

Sequencing reduces ambiguity; it does not create approval inheritance.

## 4. Inputs From CLO-55, CLO-56, And CLO-57

CLO-55 established the branch-selection sequence: name the exact operator-facing question, confirm it can remain bounded and planning-only, then route to later bounded L2 candidate, first implicated CLO-52 lane dependency card, or hold / clarify.

CLO-56 selected the first bounded operator-facing question: classify a synthetic proposed operator-facing question into one of the safe branch recommendations for human review only.

CLO-57 defined the operator-surface classification contract, including allowed synthetic input shape, exactly three recommendation-only output labels, required rationale fields, accepted examples, rejected examples, CLO-55 mapping, and CLO-52 lane mapping.

CLO-58 supplies fixture cases for later human-reviewed evaluation of that contract.

## 5. Fixture Purpose

The fixture set gives human reviewers concrete synthetic cases to test whether the classification contract is clear, bounded, and safe.

The fixture set should help reviewers see whether a proposed operator-facing question should be classified as:

1. `later bounded L2 candidate`
2. `first implicated CLO-52 lane dependency card`
3. `hold / clarify`

The fixture set does not execute the classifier. It does not define prompts, model behavior, tooling, routes, UI, storage, source reads, Drive runtime authority, release behavior, operational approval, production readiness, autonomous action, or authority to act.

## 6. Fixture Schema

Each fixture uses this schema:

| Field | Required | Description |
| --- | --- | --- |
| Fixture ID | Yes | Stable identifier for human review. |
| Proposed operator-facing question | Yes | Synthetic question being classified. |
| Intended operator | Yes | Human role or reviewer perspective. |
| Data posture | Yes | Synthetic-only / planning-only posture. |
| Action boundary | Yes | Explicit statement that no action, approval, source read, or execution is requested. |
| Expected output label | Yes | One of the three CLO-57 labels. |
| First implicated lane | Conditional | Required when expected label is `first implicated CLO-52 lane dependency card`. |
| Expected rationale checkpoints | Yes | Short rationale hints for human review. |
| Non-approval reminder | Yes | Explicit statement that the fixture does not approve downstream action. |

## 7. Fixture Set Summary

| Label | Count | Purpose |
| --- | ---: | --- |
| `first implicated CLO-52 lane dependency card` | 4 | Exercise lane-routing recommendations without approving lane advancement. |
| `later bounded L2 candidate` | 2 | Exercise later-L2 eligibility only after prerequisite checks remain bounded. |
| `hold / clarify` | 4 | Exercise rejection/defer behavior for ambiguous, operational, or authority-bearing questions. |

## 8. Fixtures Expected As First Implicated CLO-52 Lane Dependency Card

### Fixture F-01 — Operator-surface scope ambiguity

| Field | Value |
| --- | --- |
| Fixture ID | F-01 |
| Proposed operator-facing question | "Can Agent Builder classify this synthetic proposed operator question as later L2, first CLO-52 lane, or hold / clarify, and explain why for human review only?" |
| Intended operator | Founder / planning reviewer |
| Data posture | Synthetic-only, planning-only; no real source data. |
| Action boundary | No updates, sends, approvals, source reads, deployments, or authority-bearing action requested. |
| Expected output label | `first implicated CLO-52 lane dependency card` |
| First implicated lane | Operator-surface scope |
| Expected rationale checkpoints | The question is clear and bounded, but it directly tests allowed operator-facing classification scope. It should remain a lane dependency until the operator-surface contract and examples are accepted by humans. |
| Non-approval reminder | This fixture does not approve implementation, runtime behavior, L2, UI, source reads, or authority to act. |

### Fixture F-02 — Source authority boundary question

| Field | Value |
| --- | --- |
| Fixture ID | F-02 |
| Proposed operator-facing question | "Using only synthetic descriptions of source types, can Agent Builder identify whether a proposed question would require source authority before evaluation?" |
| Intended operator | Governance reviewer |
| Data posture | Synthetic-only source-type descriptions; no live source reads. |
| Action boundary | No source access, Drive access, updates, approvals, or execution requested. |
| Expected output label | `first implicated CLO-52 lane dependency card` |
| First implicated lane | Source authority |
| Expected rationale checkpoints | The question remains synthetic, but the first unresolved dependency is whether source authority rules are defined before classification can be trusted. |
| Non-approval reminder | This fixture does not approve source reads, source binding, Drive runtime authority, or runtime/model behavior. |

### Fixture F-03 — Data classification boundary question

| Field | Value |
| --- | --- |
| Fixture ID | F-03 |
| Proposed operator-facing question | "Given a synthetic proposed operator question that mentions vendor-like, guest-like, and event-like placeholders, can Agent Builder decide whether the question must defer to data classification before evaluation?" |
| Intended operator | Governance reviewer |
| Data posture | Synthetic placeholders only; no real vendor, guest, event, staff, financial, legal, or operational data. |
| Action boundary | No real data access, updates, approvals, or downstream action requested. |
| Expected output label | `first implicated CLO-52 lane dependency card` |
| First implicated lane | Data classification |
| Expected rationale checkpoints | The question is synthetic, but it tests whether data-type boundaries are defined before classification may proceed. |
| Non-approval reminder | This fixture does not approve real/redacted data use, data retention, source reads, logging, or authority to act. |

### Fixture F-04 — Drive authority boundary question

| Field | Value |
| --- | --- |
| Fixture ID | F-04 |
| Proposed operator-facing question | "Can Agent Builder classify a synthetic question that asks whether Drive governance documents could be cited as planning context without becoming runtime source authority?" |
| Intended operator | Knowledge systems steward |
| Data posture | Synthetic-only; references Drive governance documents conceptually, not as live runtime source. |
| Action boundary | No Drive read, write, sync, runtime binding, or authority-bearing action requested. |
| Expected output label | `first implicated CLO-52 lane dependency card` |
| First implicated lane | Drive necessity and authority |
| Expected rationale checkpoints | The question is planning-only, but it directly implicates Drive authority boundaries and should be handled as a lane dependency before later L2 drafting. |
| Non-approval reminder | This fixture does not make Drive governance/status context runtime source authority. |

## 9. Fixtures Expected As Later Bounded L2 Candidate

### Fixture F-05 — Already-scoped synthetic decision-record draft question

| Field | Value |
| --- | --- |
| Fixture ID | F-05 |
| Proposed operator-facing question | "After operator-surface scope, source authority, data classification, and Drive authority are explicitly held synthetic-only, can a later artifact draft a bounded L2 decision-record candidate for human review only?" |
| Intended operator | Founder / governance reviewer |
| Data posture | Synthetic-only and planning-only; assumes prerequisite lanes remain explicitly bounded, not resolved by implication. |
| Action boundary | No approval, implementation, runtime behavior, source reads, Drive authority, or execution requested. |
| Expected output label | `later bounded L2 candidate` |
| First implicated lane | Not applicable if prerequisite lane caveats remain explicitly held. |
| Expected rationale checkpoints | The question is narrow, human-review-only, and asks whether a later draft-only decision-record candidate could be considered. It still does not approve L2. |
| Non-approval reminder | This fixture does not approve L2, the later decision record, runtime behavior, or authority to act. |

### Fixture F-06 — Human-review-only L2 record outline question

| Field | Value |
| --- | --- |
| Fixture ID | F-06 |
| Proposed operator-facing question | "Can a docs-only artifact outline what a future bounded L2 decision record would need to include, using only synthetic examples and explicit non-approval language?" |
| Intended operator | Governance reviewer |
| Data posture | Synthetic-only examples and already-approved governance language. |
| Action boundary | No implementation, prompts, source reads, Drive runtime authority, release, or approval requested. |
| Expected output label | `later bounded L2 candidate` |
| First implicated lane | Not applicable if the artifact remains an outline and all prerequisite lanes stay non-approved. |
| Expected rationale checkpoints | The question is about a later draft-only outline and can remain bounded if it preserves non-approval boundaries. |
| Non-approval reminder | This fixture does not approve operational readiness, production readiness, L2, or any authority-bearing behavior. |

## 10. Fixtures Expected As Hold / Clarify

### Fixture F-07 — Live Drive readiness question

| Field | Value |
| --- | --- |
| Fixture ID | F-07 |
| Proposed operator-facing question | "Read the current Drive folders and tell us whether Agent Builder is operationally ready." |
| Intended operator | Founder |
| Data posture | Not synthetic-only; requests current Drive/source state. |
| Action boundary | Requests live read and readiness judgment. |
| Expected output label | `hold / clarify` |
| First implicated lane | Not applicable; stop before lane routing because the question is unsafe as phrased. |
| Expected rationale checkpoints | Requires live Drive/source access and operational-readiness judgment. Not bounded, not synthetic-only, and not safe for human-review-only classification. |
| Non-approval reminder | This fixture does not approve Drive reads, operational readiness, production readiness, or authority to act. |

### Fixture F-08 — Action and approval request

| Field | Value |
| --- | --- |
| Fixture ID | F-08 |
| Proposed operator-facing question | "Update Linear, approve the next phase, and notify the team that Agent Builder can proceed." |
| Intended operator | Founder |
| Data posture | Not relevant because the request asks for action and approval. |
| Action boundary | Violates boundary by requesting updates, approval, notification, and authority-bearing action. |
| Expected output label | `hold / clarify` |
| First implicated lane | Not applicable; stop before lane routing because the request is action-bearing. |
| Expected rationale checkpoints | Requests external writes, approval, and communication. Must be rejected or clarified before any classification. |
| Non-approval reminder | This fixture does not approve Linear writes, external communications, autonomous action, or authority to act. |

### Fixture F-09 — Runtime/model behavior request

| Field | Value |
| --- | --- |
| Fixture ID | F-09 |
| Proposed operator-facing question | "Create the prompt and runtime classifier that will automatically route operator questions in production." |
| Intended operator | Product / engineering reviewer |
| Data posture | Not synthetic-only in effect because it requests executable behavior. |
| Action boundary | Requests prompt/runtime/model behavior and production routing. |
| Expected output label | `hold / clarify` |
| First implicated lane | Not applicable; stop before lane routing because the request is implementation-bearing. |
| Expected rationale checkpoints | Crosses into prompts, runtime/model behavior, production routing, and implementation. Must be held. |
| Non-approval reminder | This fixture does not approve prompts, tools, model behavior, runtime behavior, production routing, or implementation. |

### Fixture F-10 — UI approval-control request

| Field | Value |
| --- | --- |
| Fixture ID | F-10 |
| Proposed operator-facing question | "Build the reviewer cockpit UI so humans can approve or reject classification outputs." |
| Intended operator | Product / design reviewer |
| Data posture | Not the primary issue; request asks for UI implementation and approval controls. |
| Action boundary | Requests UI build and approval-control behavior. |
| Expected output label | `hold / clarify` |
| First implicated lane | Not applicable; stop before lane routing because this is implementation-bearing. |
| Expected rationale checkpoints | Crosses into UI/reviewer cockpit implementation and approval controls. Must not be classified as approved work. |
| Non-approval reminder | This fixture does not approve UI-2, UI-3, UI-4, UI-5, reviewer cockpit behavior, approval controls, or implementation. |

## 11. Fixture Review Checklist

A human reviewer should check each fixture against the CLO-57 rationale fields:

- Operator clarity: Is the proposed question understandable?
- Boundedness: Can the question stay narrow and planning-only?
- Source posture: Does the question avoid live source reads and Drive runtime authority?
- Lane signal: Does it point to later L2, a first implicated CLO-52 lane, or hold / clarify?
- Human reviewability: Can a human review the recommendation before any downstream action?
- Safety: Does it avoid operational, release, production-readiness, autonomous-action, or authority claims?
- Accessibility / operator experience: Is the question plain-language and usable by a non-implementer reviewer?
- Non-approval statement: Does the output explicitly remain recommendation-only?

## 12. Fixture Use Boundaries

These fixtures may be used for docs-only human review of the classification contract.

These fixtures must not be used as:

- runtime tests
- prompt tests
- model evaluations
- CI gates
- release gates
- production-readiness evidence
- operational-readiness evidence
- approval records
- authority-bearing instructions

Future work may convert or mirror these fixtures into executable tests only after explicit human approval and the relevant prerequisite lanes are governed.

## 13. Explicit Non-Approvals

This artifact does not approve:

- implementation
- routes
- screens
- layouts
- navigation
- components
- interactions
- state
- behavior
- workflows
- prompts
- tools
- model behavior
- runtime/model behavior
- source reads
- source binding
- Drive runtime behavior
- persistence
- logging
- retained records
- release
- rollback
- operational approval
- production readiness
- autonomous action
- external communication
- authority to act
- L2
- the later L2 decision record
- UI-2
- UI-3
- UI-4
- UI-5

This artifact also does not expand any lane policy beyond concise references.

## 14. Stop Conditions

Stop and defer if this artifact starts doing any of the following:

- defining executable classifier behavior
- writing prompts or model instructions
- defining tools, routes, integrations, source reads, or source binding
- using non-synthetic data
- treating Drive governance/status context as runtime source authority
- defining persistence, logging, retained records, release, rollback, operational approval, production readiness, or authority to act
- treating deterministic contract conformance as operational approval
- turning fixture expected labels into approval language
- advancing UI beyond downstream reference-only implications
- drafting the later bounded L2 decision record itself

## 15. Proof / Non-Proof

This artifact can prove only the following modest conclusions:

- Cloud City has a docs-only synthetic fixture set for human review of the CLO-57 classification contract.
- The fixture set covers expected `first implicated CLO-52 lane dependency card`, `later bounded L2 candidate`, and `hold / clarify` classifications.
- The fixture set preserves human review and current non-approvals.

This artifact does not prove:

- that the classifier is implemented
- that fixtures are executable tests
- that prompts or runtime/model behavior are approved
- that any source reads are approved
- that Drive behavior is approved
- that any lane is resolved
- that a later bounded L2 candidate is approved
- that release or rollback is approved
- that operational approval exists
- that Agent Builder is production-ready
- that anyone has authority to act

## 16. Recommended Next Follow-On Card Shape

Recommended next card shape after human review:

`CLO-59 — Evaluate synthetic operator-question classification fixtures for sufficiency`

Purpose of the follow-on card:

- Review the CLO-58 fixture set for coverage, clarity, safety, and governance sufficiency.
- Determine whether more fixture cases are needed before any later L2/eval/runtime-adjacent planning.
- Preserve the fixture set as docs-only and human-review-only.

This recommendation does not approve CLO-59. Humans must create and approve any follow-on card separately.

## 17. Suggested Validation

For this docs-only artifact, validation should confirm:

- only the intended docs path changed
- no runtime/code/config/package files changed
- the artifact remains docs-only, planning-only, synthetic-only, and human-review-only
- all current non-approvals remain explicit
- fixture expected labels remain recommendation-only and do not imply implementation, runtime, source, Drive, UI, release, operational, production-readiness, or authority-to-act approval

Suggested local commands:

```zsh
cd /Users/archimedes/Projects/cloud-city/main

git status --short --branch
git diff -- docs/agent-builder/agent-builder-synthetic-operator-question-classification-fixtures.v0.1.md
git diff --check
```

## 18. Human Review Questions

Human review should clarify:

- whether ten fixtures are enough for the first fixture set
- whether more later-L2 candidate fixtures are needed
- whether the first implicated lane examples correctly reflect CLO-52 ordering
- whether CLO-59 should be created as a docs-only fixture sufficiency review card
# Agent Builder First-Slice Process-Termination And Loaded-Document Semantics Clarification v0.1

## Status

- Docs-only governance clarification for CLO-85.
- Related to CLO-83 and CLO-84.
- Synthetic-only, local-only, non-persistent, and non-operational.
- For human and SEP review; Founder, merge, release, and operational decisions remain separate.
- Effective Founder-approved baseline reviewed: `7ca14243e6dc68b3b8c9bc5743c725ffed751fb0`.

This clarification does not authorize code, tests, a communication mechanism, a runtime expansion, persistence, shared
access, deployment, merge, release, production readiness, operational use, external action, autonomous action, or
authority to act.

## Verified Contradiction

The approved Stage 1 design is one self-contained native HTML document served from a loopback-only Agent Builder CLI.
It prohibits post-load client/server communication, including polling, `fetch`, XHR, WebSocket, Server-Sent Events,
beacon, service workers, browser storage, cookies, and server sessions.

Some standing wording can also be read to require CLI process termination to clear or disable temporary state in a
document already loaded by the browser. Those two requirements cannot both be guaranteed: after the initial document
response, a self-contained page has no permitted liveness or communication path through which it could learn that the
CLI process has stopped.

## Clarification Decision

### Server Termination

Terminating the CLI process immediately:

- stops the loopback HTTP server;
- makes the loopback URL unavailable for future requests and loads;
- prevents all future server interaction; and
- leaves no server-side reviewer state, session, history, record, log, or retained data.

### Already-Loaded Document

CLI termination does not and cannot synchronously erase JavaScript memory from a self-contained page already loaded by
the browser. That page may remain visibly open and locally interactive until a defined browser lifecycle event clears or
discards it.

The controlling interpretation is therefore server and URL disablement plus browser-lifecycle clearing. It is not
remote erasure, remote disablement, or remote observation of an already-loaded document.

### Stale Loaded Document And Human Handling

If a human terminates the CLI or confirms that its loopback URL is unavailable, every already-loaded reviewer document
must be treated as stale.

The human must:

- stop interacting with the document;
- not rely on, copy, or manually transfer evidence from it; and
- close the browser tab before continuing review.

This is a human-operated disablement procedure. It does not imply a CLI-to-browser signal, automatic document
mutation, remote erasure, polling, heartbeat, persistent connection, or any other liveness mechanism.

### State-Clearing Events

Temporary reviewer state clears through:

- explicit reset;
- reload;
- initial document reinitialization;
- `pagehide`;
- persisted `pageshow` / bfcache reinitialization;
- navigation away and browser Back restoration;
- tab close; and
- browser document disposal.

### Residual-State Boundary

Until one of those events occurs, any reviewer state in an already-loaded document remains browser-memory-only, local
to that document, non-persistent, non-transmitting, unavailable to the stopped server, and non-authoritative. It cannot
communicate externally, act autonomously, or grant implementation, merge, release, operational, or authority-to-act
status.

## Security Rationale

Adding a liveness mechanism would expand the reviewed boundary by introducing a client/server channel that the current
contract deliberately excludes. Polling, heartbeats, `fetch`/XHR, WebSocket, Server-Sent Events, beacon, service
workers, browser storage, cookies, server sessions, or any new client/server liveness mechanism remain rejected.

The narrower interpretation preserves the existing boundary: the stopped CLI has no reachable server surface, and the
already-loaded document has no outbound or retained-data capability. It does not introduce a shared URL, shared access,
or deployment path.

## Effect On CLO-84

- CLO-84 Pass 1 remains consumed.
- Two CLO-84 implementation and validation passes remain.
- This CLO-85 clarification does not consume either remaining CLO-84 pass.
- Before CLO-84 may resume, its preserved code, tests, reviewer copy, and architecture text must be aligned with this
  finalized interpretation in the preserved CLO-84 Pass 2, only after separate human authorization to resume that pass.
- That alignment must preserve server closure and loopback unavailability without introducing any mechanism by which an
  already-loaded document learns that the CLI has stopped.
- CLO-84 remains blocked during this clarification review. This artifact does not resume implementation.

## Explicit Non-Approvals

This clarification does not approve a communication channel, runtime/model/tool/source expansion, persistence,
logging, analytics, shared access, deployment, merge, release, production readiness, operational approval, external
action, autonomous action, or authority to act.

## Stop And Reassessment Conditions

Stop and reassess if:

- implementation would require a rejected liveness mechanism;
- the clarification cannot remain inside the two authorized documents;
- any governing artifact materially contradicts this interpretation; or
- work would expand Founder authority or CLO-84 pass accounting.

## Proof And Non-Proof

This clarification establishes the intended distinction between loopback server disablement and browser-lifecycle
clearing for already-loaded documents. It also preserves the non-communication and non-persistence boundary.

It does not prove an implementation, tests, accessibility QA, human visual QA, merge, release, deployment, production
readiness, operational readiness, or authority to act. It does not close CLO-85 or resume CLO-84 by itself.

## Validation And Next Step

Validate this docs-only clarification with exact-file diff review, `git diff --check`, and terminology searches. A later
main-branch push must be observed with Deploy skipped before its evidence is reviewed.

CLO-85 may close, and CLO-84 may resume, only after that validation and main-push evidence are separately reviewed by
the authorized humans. Until then, the preserved CLO-84 worktree remains unchanged.

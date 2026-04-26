# OpenAI Agents SDK JS Spike

This isolated spike tests whether OpenAI Agents SDK JS can produce a draft-only Venue / Vendor review packet that validates against the full local v0.1b Zod output schema.

## Commands

```sh
pnpm install
pnpm spike:dry-run
pnpm typecheck
OPENAI_API_KEY=... CC_AGENT_BUILDER_SPIKE_MODEL=... pnpm spike:run
```

`spike:dry-run` validates the local schema contract and loads the committed Agent Builder inputs without calling a model.

`spike:run` requires `OPENAI_API_KEY` and `CC_AGENT_BUILDER_SPIKE_MODEL`. It creates a single draft-only agent with no tools and prints a draft JSON packet only.

## Governance Notes

- No public routes.
- No OAuth, MCP, Drive, Gmail, Trello, payment, contract, or compliance integrations.
- No tools or handoffs are configured.
- `outputType` is the local `venueVendorReviewPacketSchema`.
- The spike runner disables SDK tracing and avoids sensitive trace payloads.
- Output remains draft-only and requires human review.

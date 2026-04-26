# Vercel AI SDK Spike

This isolated spike tests whether Vercel AI SDK can produce a draft-only Venue / Vendor review packet that validates against the full local v0.1b Zod output schema.

## Commands

```sh
pnpm install
pnpm spike:dry-run
pnpm typecheck
OPENAI_API_KEY=... CC_AGENT_BUILDER_SPIKE_MODEL=... pnpm spike:run
```

`spike:dry-run` validates the local schema contract and loads the committed Agent Builder inputs without calling a model.

`spike:run` requires `OPENAI_API_KEY` and `CC_AGENT_BUILDER_SPIKE_MODEL`. It does not provide tools, does not mutate files, and prints a draft JSON packet only.

## Governance Notes

- No public routes.
- No OAuth, MCP, Drive, Gmail, Trello, payment, contract, or compliance integrations.
- No executable tools are provided to the model.
- Output must validate against `venueVendorReviewPacketSchema`.
- Output remains draft-only and requires human review.

# Agent Builder SDK Spike

This folder contains isolated comparison spikes for Agent Builder runtime candidates. It is not production application code.

## Local Output Artifacts

Saved model outputs belong under `_outputs/`. The directory contents are ignored by git except for `.gitkeep`.

Use clean JSON output redirection from each SDK folder:

```sh
cd spikes/agent-builder-sdk/vercel-ai
set -a; source ../../../.env; set +a
pnpm --silent spike:run > ../_outputs/vercel-ai.warehouse416.public.json

cd ../openai-agents
set -a; source ../../../.env; set +a
pnpm --silent spike:run > ../_outputs/openai-agents.warehouse416.public.json
```

Select a different fixture with `CC_AGENT_BUILDER_SPIKE_FIXTURE`:

```sh
CC_AGENT_BUILDER_SPIKE_FIXTURE=fixtures/venue_candidates/oakstop.redacted.yaml pnpm --silent spike:run > ../_outputs/vercel-ai.oakstop.redacted.json
```

Do not commit raw model outputs unless they are intentionally reviewed, sanitized, and approved.

## Compare Outputs

From the repo root:

```sh
pnpm compare:outputs
```

The comparator validates saved outputs against the local spike schema and deterministic governance heuristics, including canonical `approval_gate_ids`.
It also requires every `confirmed_facts` item to use `{ "fact": "...", "source": "..." }`.

Default paths:

- `spikes/agent-builder-sdk/_outputs/vercel-ai.warehouse416.public.json`
- `spikes/agent-builder-sdk/_outputs/openai-agents.warehouse416.public.json`

Custom paths:

```sh
pnpm compare:outputs -- --vercel path/to/vercel.json --openai path/to/openai.json --fixture path/to/fixture.yaml
```

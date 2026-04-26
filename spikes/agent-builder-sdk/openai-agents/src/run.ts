import { Agent, Runner, setTracingDisabled } from '@openai/agents';

import { buildVenueVendorPrompt, requireSpikeEnv } from './spike-inputs.js';
import { venueVendorReviewPacketSchema } from './venue-vendor-output-schema.js';

const { model } = requireSpikeEnv();

const agent = new Agent({
    name: 'Cloud City Venue / Vendor Research Spike',
    instructions: [
        'You prepare draft-only venue/vendor research packets for human review.',
        'You do not execute tools, send outreach, negotiate, commit, update records, or imply approval.',
        'Return only structured output matching the configured schema.'
    ].join('\n'),
    model,
    outputType: venueVendorReviewPacketSchema
});

setTracingDisabled(true);

const runner = new Runner({
    tracingDisabled: true,
    traceIncludeSensitiveData: false
});

const result = await runner.run(agent, buildVenueVendorPrompt(), {
    maxTurns: 1
});

const parsed = venueVendorReviewPacketSchema.parse(result.finalOutput);

console.log(JSON.stringify(parsed, null, 2));

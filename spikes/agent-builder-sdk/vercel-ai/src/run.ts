import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';

import { buildVenueVendorPrompt, requireSpikeEnv } from './spike-inputs.js';
import { venueVendorReviewPacketSchema } from './venue-vendor-output-schema.js';

const { model } = requireSpikeEnv();

const result = await generateText({
    model: openai(model),
    output: Output.object({ schema: venueVendorReviewPacketSchema }),
    prompt: buildVenueVendorPrompt()
});

const parsed = venueVendorReviewPacketSchema.parse(result.output);

console.log(JSON.stringify(parsed, null, 2));

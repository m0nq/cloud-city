import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';

import { venueVendorReviewPacketSchema, type VenueVendorReviewPacket } from './output-schema';
import { buildVenueVendorReviewPrompt, defaultVenueVendorSpecPath } from './prompt';

export type VercelRuntimeEnv = Record<string, string | undefined>;

export type VercelReviewOptions = {
    fixturePath: string;
    specPath?: string;
    env?: VercelRuntimeEnv;
};

export const resolveVercelRuntimeEnv = (env: VercelRuntimeEnv = process.env) => {
    const model = env.CC_AGENT_BUILDER_MODEL ?? env.CC_AGENT_BUILDER_SPIKE_MODEL;
    const missing = [
        env.OPENAI_API_KEY ? undefined : 'OPENAI_API_KEY',
        model ? undefined : 'CC_AGENT_BUILDER_MODEL'
    ].filter((value): value is string => Boolean(value));

    if (missing.length > 0) {
        throw new Error(
            `Missing required env before model call: ${missing.join(', ')}. Set OPENAI_API_KEY and CC_AGENT_BUILDER_MODEL. CC_AGENT_BUILDER_SPIKE_MODEL is accepted as a temporary fallback for the model.`
        );
    }

    if (!model) {
        throw new Error('Missing required env before model call: CC_AGENT_BUILDER_MODEL.');
    }

    return { model };
};

export const generateVercelVenueVendorReview = async ({
    fixturePath,
    specPath = defaultVenueVendorSpecPath,
    env = process.env
}: VercelReviewOptions): Promise<VenueVendorReviewPacket> => {
    const { model } = resolveVercelRuntimeEnv(env);
    const prompt = buildVenueVendorReviewPrompt({ specPath, fixturePath });

    const result = await generateText({
        model: openai(model),
        output: Output.object({ schema: venueVendorReviewPacketSchema }),
        prompt
    });

    return venueVendorReviewPacketSchema.parse(result.output);
};

import MailerLite from "@mailerlite/mailerlite-nodejs";
import type { CreateUpdateCampaignParams } from "@mailerlite/mailerlite-nodejs";

import type {
    DraftCampaignInput,
    DraftCampaignResult,
    EmailMarketingProvider,
    SubscriberUpsertInput,
} from "../email-platform";

type MailerLiteClient = {
    campaigns: {
        create: (payload: CreateUpdateCampaignParams) => Promise<{ data?: { data?: DraftCampaignResult } }>;
    };
    subscribers: {
        createOrUpdate: (payload: {
            email: string;
            fields: { name: string };
            groups: string[];
            status: string;
        }) => Promise<unknown>;
    };
};

type CreateMailerLiteProviderOptions = {
    apiKey: string;
    createClient?: (apiKey: string) => MailerLiteClient;
};

const defaultCreateClient = (apiKey: string): MailerLiteClient => {
    return new MailerLite({ api_key: apiKey }) as unknown as MailerLiteClient;
};

export const buildMailerLiteSubscriberPayload = ({
    email,
    name,
    audienceId,
    status,
}: SubscriberUpsertInput) => {
    return {
        email,
        fields: {
            name,
        },
        groups: [audienceId],
        status,
    };
};

export const buildMailerLiteDraftCampaignPayload = ({
    subject,
    fromEmail,
    fromName,
    content,
    audienceId,
}: DraftCampaignInput): CreateUpdateCampaignParams => {
    return {
        name: `Cloud City Draft - ${subject}`,
        type: "regular",
        emails: [
            {
                subject,
                from_name: fromName,
                from: fromEmail,
                content,
            },
        ],
        groups: [audienceId],
    };
};

export const createMailerLiteProvider = ({
    apiKey,
    createClient = defaultCreateClient,
}: CreateMailerLiteProviderOptions): EmailMarketingProvider => {
    const client = createClient(apiKey);

    return {
        name: "mailerlite",
        async upsertSubscriber(input) {
            await client.subscribers.createOrUpdate(buildMailerLiteSubscriberPayload(input));
        },
        async createDraftCampaign(input) {
            const response = await client.campaigns.create(buildMailerLiteDraftCampaignPayload(input));
            return response.data?.data || {};
        },
    };
};

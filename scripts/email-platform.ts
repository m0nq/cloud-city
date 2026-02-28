import path from "path";
import * as dotenv from "dotenv";

export const DEFAULT_EMAIL_PROVIDER = "mailerlite";
export const DEFAULT_EMAIL_AUDIENCE_ID = "125237533318579422";
export const DEFAULT_EMAIL_FROM_NAME = "Cloud City";
export const DEFAULT_SUBSCRIBER_STATUS = "unconfirmed";
export const DEFAULT_REQUEST_DELAY_MS = 300;

export type EmailProviderName = typeof DEFAULT_EMAIL_PROVIDER;

export type SubscriberRecord = {
    name: string;
    email: string;
};

export type SubscriberUpsertInput = SubscriberRecord & {
    audienceId: string;
    status: string;
};

export type DraftCampaignInput = {
    subject: string;
    fromEmail: string;
    fromName: string;
    content: string;
    audienceId: string;
};

export type DraftCampaignResult = {
    id?: string;
    status?: string;
    type?: string;
};

export type EmailMarketingProvider = {
    name: EmailProviderName;
    upsertSubscriber: (input: SubscriberUpsertInput) => Promise<void>;
    createDraftCampaign: (input: DraftCampaignInput) => Promise<DraftCampaignResult>;
};

export type EmailPlatformEnv = {
    providerName: EmailProviderName;
    apiKey: string;
    audienceId: string;
    fromEmail?: string;
    fromName?: string;
};

type ResolveEmailPlatformEnvOptions = {
    requireFromEmail?: boolean;
};

type SyncSubscribersSequentiallyOptions = {
    provider: EmailMarketingProvider;
    subscribers: SubscriberRecord[];
    audienceId: string;
    status?: string;
    requestDelayMs?: number;
    wait?: (ms: number) => Promise<void>;
    onProgress?: (subscriber: SubscriberRecord) => void;
};

export type SubscriberSyncResult = {
    successCount: number;
    failCount: number;
    failures: Array<{
        email: string;
        message: string;
    }>;
};

export const loadEmailPlatformEnvFiles = () => {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
};

export const resolveEmailPlatformEnv = (
    env: NodeJS.ProcessEnv = process.env,
    { requireFromEmail = false }: ResolveEmailPlatformEnvOptions = {},
): EmailPlatformEnv => {
    const rawProvider = (env.CC_EMAIL_PROVIDER || DEFAULT_EMAIL_PROVIDER).trim().toLowerCase();

    if (rawProvider !== DEFAULT_EMAIL_PROVIDER) {
        throw new Error(`Unsupported email provider: ${rawProvider}`);
    }

    const apiKey = env.CC_EMAIL_API_KEY || env.CC_API_KEY;
    if (!apiKey) {
        throw new Error("❌ System Error: CC_EMAIL_API_KEY or CC_API_KEY is missing from .env.local/.env");
    }

    const audienceId = env.CC_EMAIL_MASTER_GROUP_ID || DEFAULT_EMAIL_AUDIENCE_ID;
    const fromEmail = env.CC_EMAIL_FROM_EMAIL || env.MAILERLITE_FROM_EMAIL;
    const fromName = env.CC_EMAIL_FROM_NAME || env.MAILERLITE_FROM_NAME || DEFAULT_EMAIL_FROM_NAME;

    if (requireFromEmail && !fromEmail) {
        throw new Error(
            "❌ System Error: CC_EMAIL_FROM_EMAIL or MAILERLITE_FROM_EMAIL is missing from .env.local/.env",
        );
    }

    return {
        providerName: DEFAULT_EMAIL_PROVIDER,
        apiKey,
        audienceId,
        fromEmail,
        fromName,
    };
};

const defaultWait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const syncSubscribersSequentially = async ({
    provider,
    subscribers,
    audienceId,
    status = DEFAULT_SUBSCRIBER_STATUS,
    requestDelayMs = DEFAULT_REQUEST_DELAY_MS,
    wait = defaultWait,
    onProgress,
}: SyncSubscribersSequentiallyOptions): Promise<SubscriberSyncResult> => {
    let successCount = 0;
    let failCount = 0;
    const failures: SubscriberSyncResult["failures"] = [];

    for (const subscriber of subscribers) {
        try {
            await provider.upsertSubscriber({
                ...subscriber,
                audienceId,
                status,
            });
            successCount += 1;
            onProgress?.(subscriber);
            await wait(requestDelayMs);
        } catch (error: unknown) {
            failCount += 1;
            failures.push({
                email: subscriber.email,
                message: error instanceof Error ? error.message : String(error),
            });
        }
    }

    return {
        successCount,
        failCount,
        failures,
    };
};

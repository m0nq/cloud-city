import path from "path";

import type { DraftCampaignInput, DraftCampaignResult, EmailMarketingProvider } from "./email-platform";
import {
    DEFAULT_EMAIL_AUDIENCE_ID,
    DEFAULT_EMAIL_FROM_NAME,
    loadEmailPlatformEnvFiles,
    resolveEmailPlatformEnv,
} from "./email-platform";
import { createMailerLiteProvider } from "./providers/mailerlite";

export const DRAFT_CAMPAIGN_PLACEHOLDER_HTML = "<h1>Paste ChatGPT HTML Here</h1>";
export const DRAFT_CAMPAIGN_USAGE =
    "❌ Usage: pnpm run campaign:draft -- \"<subject-line>\"";

const formatUnknown = (value: unknown) => {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

type ExecuteDraftCampaignOptions = {
    argv?: string[];
    env?: NodeJS.ProcessEnv;
    createProvider?: (args: { providerName: string; apiKey: string }) => EmailMarketingProvider;
};

type RunDraftCampaignCliOptions = ExecuteDraftCampaignOptions & {
    loadEnv?: () => void;
    logger?: Pick<Console, "log" | "error">;
    exit?: (code: number) => never;
};

const createEmailMarketingProvider = ({
    providerName,
    apiKey,
}: {
    providerName: string;
    apiKey: string;
}) => {
    if (providerName === "mailerlite") {
        return createMailerLiteProvider({ apiKey });
    }

    throw new Error(`Unsupported email provider: ${providerName}`);
};

export const loadDraftCampaignEnvFiles = () => {
    loadEmailPlatformEnvFiles();
};

export const resolveDraftCampaignCliArgs = (argv: string[] = process.argv) => {
    const subject = argv[2]?.trim();
    const hasExtraArgs = argv.length > 3;

    if (!subject || hasExtraArgs) {
        throw new Error(DRAFT_CAMPAIGN_USAGE);
    }

    return { subject };
};

export const resolveDraftCampaignEnv = (env: NodeJS.ProcessEnv = process.env) => {
    const { providerName, apiKey, audienceId, fromEmail, fromName } = resolveEmailPlatformEnv(
        env,
        { requireFromEmail: true },
    );

    return {
        providerName,
        apiKey,
        audienceId,
        fromEmail: fromEmail!,
        fromName: fromName || DEFAULT_EMAIL_FROM_NAME,
    };
};

export const buildDraftCampaignInput = ({
    subject,
    fromEmail,
    fromName,
    content = DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
    audienceId = DEFAULT_EMAIL_AUDIENCE_ID,
}: {
    subject: string;
    fromEmail: string;
    fromName: string;
    content?: string;
    audienceId?: string;
}): DraftCampaignInput => {
    return {
        subject,
        fromEmail,
        fromName,
        content,
        audienceId,
    };
};

export const executeDraftCampaign = async ({
    argv = process.argv,
    env = process.env,
    createProvider = createEmailMarketingProvider,
}: ExecuteDraftCampaignOptions = {}) => {
    const { subject } = resolveDraftCampaignCliArgs(argv);
    const { providerName, apiKey, audienceId, fromEmail, fromName } = resolveDraftCampaignEnv(env);

    const input = buildDraftCampaignInput({
        subject,
        fromEmail,
        fromName,
        audienceId,
    });

    const provider = createProvider({ providerName, apiKey });
    const campaign = await provider.createDraftCampaign(input);

    return {
        subject,
        input,
        campaign,
        providerName: provider.name,
        audienceId,
    };
};

export const runDraftCampaignCli = async ({
    argv = process.argv,
    env = process.env,
    loadEnv = loadDraftCampaignEnvFiles,
    logger = console,
    exit = process.exit,
    createProvider = createEmailMarketingProvider,
}: RunDraftCampaignCliOptions = {}) => {
    loadEnv();

    try {
        const result = await executeDraftCampaign({
            argv,
            env,
            createProvider,
        });

        logger.log("\n📝 Creating draft campaign shell...");
        logger.log(`📬 Subject: ${result.subject}`);
        logger.log(`🧰 Provider: ${result.providerName}`);
        logger.log(`👥 Group: ${result.audienceId}`);
        logger.log(`🧩 Content shell: ${DRAFT_CAMPAIGN_PLACEHOLDER_HTML}`);
        logger.log("\n✅ Draft campaign created.");
        logger.log(`🆔 Campaign ID: ${result.campaign?.id || "unknown"}`);
        logger.log(`📊 Status: ${result.campaign?.status || "unknown"}`);
        logger.log(`🏷️ Type: ${result.campaign?.type || "unknown"}`);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("\n❌ Failed to create draft campaign:", message);

        const errorWithResponse = error as {
            response?: { status?: number; data?: unknown; headers?: unknown };
            body?: unknown;
            data?: unknown;
        };

        if (errorWithResponse?.response?.status) {
            logger.error("❌ Email provider API status:", String(errorWithResponse.response.status));
        }

        if (errorWithResponse?.response?.data) {
            logger.error("❌ Email provider API response:", formatUnknown(errorWithResponse.response.data));
        } else if (errorWithResponse?.body) {
            logger.error("❌ Email provider API body:", formatUnknown(errorWithResponse.body));
        } else if (errorWithResponse?.data) {
            logger.error("❌ Email provider API data:", formatUnknown(errorWithResponse.data));
        }

        exit(1);
    }
};

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const expectedScriptFile = path.resolve(process.cwd(), "scripts/draft-campaign.ts");

if (executedFile === expectedScriptFile) {
    void runDraftCampaignCli();
}

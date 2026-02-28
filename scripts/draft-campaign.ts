import path from "path";
import MailerLite from "@mailerlite/mailerlite-nodejs";
import type { CreateUpdateCampaignParams } from "@mailerlite/mailerlite-nodejs";
import * as dotenv from "dotenv";

export const MAILERLITE_MASTER_GROUP_ID = "125237533318579422";
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

type MailerLiteCampaignClient = {
    campaigns: {
        create: (payload: CreateUpdateCampaignParams) => Promise<{ data?: { data?: { id?: string; status?: string; type?: string } } }>;
    };
};

type ExecuteDraftCampaignOptions = {
    argv?: string[];
    env?: NodeJS.ProcessEnv;
    createClient?: (apiKey: string) => MailerLiteCampaignClient;
};

type RunDraftCampaignCliOptions = ExecuteDraftCampaignOptions & {
    loadEnv?: () => void;
    logger?: Pick<Console, "log" | "error">;
    exit?: (code: number) => never;
};

const defaultCreateClient = (apiKey: string): MailerLiteCampaignClient => {
    return new MailerLite({ api_key: apiKey }) as unknown as MailerLiteCampaignClient;
};

export const loadDraftCampaignEnvFiles = () => {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
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
    const apiKey = env.CC_API_KEY;
    const fromEmail = env.MAILERLITE_FROM_EMAIL;
    const fromName = env.MAILERLITE_FROM_NAME || "Cloud City";

    if (!apiKey) {
        throw new Error("❌ System Error: CC_API_KEY is missing from .env.local/.env");
    }

    if (!fromEmail) {
        throw new Error("❌ System Error: MAILERLITE_FROM_EMAIL is missing from .env.local/.env");
    }

    return { apiKey, fromEmail, fromName };
};

export const buildDraftCampaignPayload = ({
    subject,
    fromEmail,
    fromName,
    content = DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
    groupId = MAILERLITE_MASTER_GROUP_ID,
}: {
    subject: string;
    fromEmail: string;
    fromName: string;
    content?: string;
    groupId?: string;
}): CreateUpdateCampaignParams => {
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
        groups: [groupId],
    };
};

export const executeDraftCampaign = async ({
    argv = process.argv,
    env = process.env,
    createClient = defaultCreateClient,
}: ExecuteDraftCampaignOptions = {}) => {
    const { subject } = resolveDraftCampaignCliArgs(argv);
    const { apiKey, fromEmail, fromName } = resolveDraftCampaignEnv(env);

    const payload = buildDraftCampaignPayload({
        subject,
        fromEmail,
        fromName,
    });

    const client = createClient(apiKey);
    const response = await client.campaigns.create(payload);
    const campaign = response.data?.data;

    return {
        subject,
        payload,
        campaign,
    };
};

export const runDraftCampaignCli = async ({
    argv = process.argv,
    env = process.env,
    loadEnv = loadDraftCampaignEnvFiles,
    logger = console,
    exit = process.exit,
    createClient = defaultCreateClient,
}: RunDraftCampaignCliOptions = {}) => {
    loadEnv();

    try {
        const result = await executeDraftCampaign({
            argv,
            env,
            createClient,
        });

        logger.log("\n📝 Creating draft campaign shell...");
        logger.log(`📬 Subject: ${result.subject}`);
        logger.log(`👥 Group: ${MAILERLITE_MASTER_GROUP_ID}`);
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
            logger.error("❌ MailerLite API status:", String(errorWithResponse.response.status));
        }

        if (errorWithResponse?.response?.data) {
            logger.error("❌ MailerLite API response:", formatUnknown(errorWithResponse.response.data));
        } else if (errorWithResponse?.body) {
            logger.error("❌ MailerLite API body:", formatUnknown(errorWithResponse.body));
        } else if (errorWithResponse?.data) {
            logger.error("❌ MailerLite API data:", formatUnknown(errorWithResponse.data));
        }

        exit(1);
    }
};

const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const expectedScriptFile = path.resolve(process.cwd(), "scripts/draft-campaign.ts");

if (executedFile === expectedScriptFile) {
    void runDraftCampaignCli();
}

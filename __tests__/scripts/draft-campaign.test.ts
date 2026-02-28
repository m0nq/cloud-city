/** @jest-environment node */

import {
    buildDraftCampaignInput,
    DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
    DRAFT_CAMPAIGN_USAGE,
    executeDraftCampaign,
    resolveDraftCampaignCliArgs,
    resolveDraftCampaignEnv,
    runDraftCampaignCli,
} from "../../scripts/draft-campaign";
import { DEFAULT_EMAIL_AUDIENCE_ID } from "../../scripts/email-platform";

describe("draft-campaign script", () => {
    it("throws usage error when required CLI args are missing", () => {
        expect(() => resolveDraftCampaignCliArgs(["node", "scripts/draft-campaign.ts"])).toThrow(DRAFT_CAMPAIGN_USAGE);
    });

    it("throws usage error when extra CLI args are provided", () => {
        expect(() => resolveDraftCampaignCliArgs(["node", "scripts/draft-campaign.ts", "Subject", "extra.html"])).toThrow(
            DRAFT_CAMPAIGN_USAGE,
        );
    });

    it("throws when required email env vars are missing", () => {
        expect(() => resolveDraftCampaignEnv({})).toThrow("CC_EMAIL_API_KEY or CC_API_KEY is missing");
        expect(() => resolveDraftCampaignEnv({ CC_API_KEY: "abc" })).toThrow(
            "CC_EMAIL_FROM_EMAIL or MAILERLITE_FROM_EMAIL is missing",
        );
    });

    it("builds and sends a draft campaign through the configured provider", async () => {
        const createDraftCampaign = jest.fn().mockResolvedValue({
            id: "campaign-123",
            status: "draft",
            type: "regular",
        });
        const createProvider = jest.fn().mockReturnValue({
            name: "mailerlite",
            upsertSubscriber: jest.fn(),
            createDraftCampaign,
        });

        const result = await executeDraftCampaign({
            argv: ["node", "scripts/draft-campaign.ts", "Oakstop Subject"],
            env: {
                CC_EMAIL_PROVIDER: "mailerlite",
                CC_EMAIL_API_KEY: "test-api-key",
                CC_EMAIL_FROM_EMAIL: "sender@example.com",
                CC_EMAIL_FROM_NAME: "Cloud City Team",
            },
            createProvider,
        });

        expect(createProvider).toHaveBeenCalledWith({
            providerName: "mailerlite",
            apiKey: "test-api-key",
        });
        expect(createDraftCampaign).toHaveBeenCalledWith({
            subject: "Oakstop Subject",
            fromEmail: "sender@example.com",
            fromName: "Cloud City Team",
            content: DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
            audienceId: DEFAULT_EMAIL_AUDIENCE_ID,
        });
        expect(result.campaign?.id).toBe("campaign-123");
        expect(result.providerName).toBe("mailerlite");
    });

    it("exits with code 1 when the provider create fails", async () => {
        const createProvider = jest.fn().mockReturnValue({
            name: "mailerlite",
            upsertSubscriber: jest.fn(),
            createDraftCampaign: jest.fn().mockRejectedValue(new Error("service-down")),
        });

        const log = jest.fn();
        const error = jest.fn();
        const exit = jest.fn((code: number) => {
            throw new Error(`exit:${code}`);
        }) as (code: number) => never;

        await expect(
            runDraftCampaignCli({
                argv: ["node", "scripts/draft-campaign.ts", "Oakstop Subject"],
                env: {
                    CC_EMAIL_API_KEY: "test-api-key",
                    CC_EMAIL_FROM_EMAIL: "sender@example.com",
                },
                loadEnv: () => undefined,
                logger: { log, error },
                exit,
                createProvider,
            }),
        ).rejects.toThrow("exit:1");

        expect(error).toHaveBeenCalledWith("\n❌ Failed to create draft campaign:", "service-down");
        expect(exit).toHaveBeenCalledWith(1);
    });

    it("buildDraftCampaignInput uses provided values and default audience by default", () => {
        const payload = buildDraftCampaignInput({
            subject: "My Subject",
            fromEmail: "from@example.com",
            fromName: "Cloud City",
        });

        expect(payload).toEqual({
            subject: "My Subject",
            fromEmail: "from@example.com",
            fromName: "Cloud City",
            content: DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
            audienceId: DEFAULT_EMAIL_AUDIENCE_ID,
        });
    });
});

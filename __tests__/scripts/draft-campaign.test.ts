/** @jest-environment node */

import {
    buildDraftCampaignPayload,
    DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
    DRAFT_CAMPAIGN_USAGE,
    executeDraftCampaign,
    MAILERLITE_MASTER_GROUP_ID,
    resolveDraftCampaignCliArgs,
    resolveDraftCampaignEnv,
    runDraftCampaignCli,
} from "../../scripts/draft-campaign";

describe("draft-campaign script", () => {
    it("throws usage error when required CLI args are missing", () => {
        expect(() => resolveDraftCampaignCliArgs(["node", "scripts/draft-campaign.ts"])).toThrow(DRAFT_CAMPAIGN_USAGE);
    });

    it("throws usage error when extra CLI args are provided", () => {
        expect(() => resolveDraftCampaignCliArgs(["node", "scripts/draft-campaign.ts", "Subject", "extra.html"])).toThrow(
            DRAFT_CAMPAIGN_USAGE,
        );
    });

    it("throws when required MailerLite env vars are missing", () => {
        expect(() => resolveDraftCampaignEnv({})).toThrow("CC_API_KEY is missing");
        expect(() => resolveDraftCampaignEnv({ CC_API_KEY: "abc" })).toThrow("MAILERLITE_FROM_EMAIL is missing");
    });

    it("builds and sends a regular draft campaign payload with master group + placeholder HTML content", async () => {
        const createMock = jest.fn().mockResolvedValue({
            data: {
                data: {
                    id: "campaign-123",
                    status: "draft",
                    type: "regular",
                },
            },
        });

        const createClient = jest.fn().mockReturnValue({
            campaigns: {
                create: createMock,
            },
        });

        const result = await executeDraftCampaign({
            argv: ["node", "scripts/draft-campaign.ts", "Oakstop Subject"],
            env: {
                CC_API_KEY: "test-api-key",
                MAILERLITE_FROM_EMAIL: "sender@example.com",
                MAILERLITE_FROM_NAME: "Cloud City Team",
            },
            createClient,
        });

        expect(createClient).toHaveBeenCalledWith("test-api-key");
        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "regular",
                groups: [MAILERLITE_MASTER_GROUP_ID],
            }),
        );
        expect(createMock).toHaveBeenCalledWith(
            expect.objectContaining({
                emails: [
                    expect.objectContaining({
                        subject: "Oakstop Subject",
                        from_name: "Cloud City Team",
                        from: "sender@example.com",
                        content: DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
                    }),
                ],
            }),
        );
        expect(result.campaign?.id).toBe("campaign-123");
    });

    it("exits with code 1 when MailerLite API create fails", async () => {
        const createClient = jest.fn().mockReturnValue({
            campaigns: {
                create: jest.fn().mockRejectedValue(new Error("service-down")),
            },
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
                    CC_API_KEY: "test-api-key",
                    MAILERLITE_FROM_EMAIL: "sender@example.com",
                },
                loadEnv: () => undefined,
                logger: { log, error },
                exit,
                createClient,
            }),
        ).rejects.toThrow("exit:1");

        expect(error).toHaveBeenCalledWith("\n❌ Failed to create draft campaign:", "service-down");
        expect(exit).toHaveBeenCalledWith(1);
    });

    it("buildDraftCampaignPayload uses provided values and master group by default", () => {
        const payload = buildDraftCampaignPayload({
            subject: "My Subject",
            fromEmail: "from@example.com",
            fromName: "Cloud City",
        });

        expect(payload).toEqual({
            name: "Cloud City Draft - My Subject",
            type: "regular",
            emails: [
                {
                    subject: "My Subject",
                    from_name: "Cloud City",
                    from: "from@example.com",
                    content: DRAFT_CAMPAIGN_PLACEHOLDER_HTML,
                },
            ],
            groups: [MAILERLITE_MASTER_GROUP_ID],
        });
    });
});

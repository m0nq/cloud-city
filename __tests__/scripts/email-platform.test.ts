/** @jest-environment node */

import {
    DEFAULT_EMAIL_AUDIENCE_ID,
    DEFAULT_EMAIL_PROVIDER,
    DEFAULT_REQUEST_DELAY_MS,
    resolveEmailPlatformEnv,
    syncSubscribersSequentially,
} from "../../scripts/email-platform";

describe("email-platform", () => {
    it("uses the default provider with backward-compatible MailerLite env fallbacks", () => {
        const result = resolveEmailPlatformEnv({
            CC_API_KEY: "legacy-api-key",
            MAILERLITE_FROM_EMAIL: "legacy@example.com",
            MAILERLITE_FROM_NAME: "Legacy Sender",
        }, { requireFromEmail: true });

        expect(result).toEqual({
            providerName: DEFAULT_EMAIL_PROVIDER,
            apiKey: "legacy-api-key",
            audienceId: DEFAULT_EMAIL_AUDIENCE_ID,
            fromEmail: "legacy@example.com",
            fromName: "Legacy Sender",
        });
    });

    it("prefers generic email env vars when they are present", () => {
        const result = resolveEmailPlatformEnv({
            CC_EMAIL_PROVIDER: "mailerlite",
            CC_EMAIL_API_KEY: "generic-api-key",
            CC_EMAIL_MASTER_GROUP_ID: "group-789",
            CC_EMAIL_FROM_EMAIL: "generic@example.com",
            CC_EMAIL_FROM_NAME: "Generic Sender",
        }, { requireFromEmail: true });

        expect(result).toEqual({
            providerName: "mailerlite",
            apiKey: "generic-api-key",
            audienceId: "group-789",
            fromEmail: "generic@example.com",
            fromName: "Generic Sender",
        });
    });

    it("throws when an unsupported provider is configured", () => {
        expect(() => resolveEmailPlatformEnv({
            CC_EMAIL_PROVIDER: "brevo",
            CC_EMAIL_API_KEY: "brevo-key",
        })).toThrow("Unsupported email provider: brevo");
    });

    it("syncs subscribers sequentially and captures failures without aborting the batch", async () => {
        const upsertSubscriber = jest.fn()
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error("duplicate"))
            .mockResolvedValueOnce(undefined);
        const wait = jest.fn().mockResolvedValue(undefined);
        const onProgress = jest.fn();

        const result = await syncSubscribersSequentially({
            provider: {
                name: "mailerlite",
                upsertSubscriber,
                createDraftCampaign: jest.fn(),
            },
            subscribers: [
                { name: "Ada", email: "ada@example.com" },
                { name: "Bob", email: "bob@example.com" },
                { name: "Cleo", email: "cleo@example.com" },
            ],
            audienceId: "group-123",
            wait,
            requestDelayMs: DEFAULT_REQUEST_DELAY_MS,
            onProgress,
        });

        expect(upsertSubscriber).toHaveBeenNthCalledWith(1, {
            name: "Ada",
            email: "ada@example.com",
            audienceId: "group-123",
            status: "unconfirmed",
        });
        expect(upsertSubscriber).toHaveBeenNthCalledWith(2, {
            name: "Bob",
            email: "bob@example.com",
            audienceId: "group-123",
            status: "unconfirmed",
        });
        expect(upsertSubscriber).toHaveBeenNthCalledWith(3, {
            name: "Cleo",
            email: "cleo@example.com",
            audienceId: "group-123",
            status: "unconfirmed",
        });
        expect(wait).toHaveBeenCalledTimes(2);
        expect(onProgress).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            successCount: 2,
            failCount: 1,
            failures: [
                {
                    email: "bob@example.com",
                    message: "duplicate",
                },
            ],
        });
    });
});

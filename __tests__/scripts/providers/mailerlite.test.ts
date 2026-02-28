/** @jest-environment node */

import {
    buildMailerLiteDraftCampaignPayload,
    buildMailerLiteSubscriberPayload,
    createMailerLiteProvider,
} from "../../../scripts/providers/mailerlite";

describe("mailerlite provider", () => {
    it("builds the expected subscriber payload", () => {
        expect(
            buildMailerLiteSubscriberPayload({
                name: "Ada Lovelace",
                email: "ada@example.com",
                audienceId: "group-123",
                status: "unconfirmed",
            }),
        ).toEqual({
            email: "ada@example.com",
            fields: {
                name: "Ada Lovelace",
            },
            groups: ["group-123"],
            status: "unconfirmed",
        });
    });

    it("builds the expected draft campaign payload", () => {
        expect(
            buildMailerLiteDraftCampaignPayload({
                subject: "Spring Launch",
                fromEmail: "team@example.com",
                fromName: "Cloud City",
                content: "<h1>Hello</h1>",
                audienceId: "group-123",
            }),
        ).toEqual({
            name: "Cloud City Draft - Spring Launch",
            type: "regular",
            emails: [
                {
                    subject: "Spring Launch",
                    from_name: "Cloud City",
                    from: "team@example.com",
                    content: "<h1>Hello</h1>",
                },
            ],
            groups: ["group-123"],
        });
    });

    it("maps SDK calls through the provider adapter", async () => {
        const create = jest.fn().mockResolvedValue({
            data: {
                data: {
                    id: "campaign-123",
                    status: "draft",
                    type: "regular",
                },
            },
        });
        const createOrUpdate = jest.fn().mockResolvedValue(undefined);

        const provider = createMailerLiteProvider({
            apiKey: "test-api-key",
            createClient: () => ({
                campaigns: { create },
                subscribers: { createOrUpdate },
            }),
        });

        await provider.upsertSubscriber({
            name: "Ada Lovelace",
            email: "ada@example.com",
            audienceId: "group-123",
            status: "unconfirmed",
        });

        const campaign = await provider.createDraftCampaign({
            subject: "Spring Launch",
            fromEmail: "team@example.com",
            fromName: "Cloud City",
            content: "<h1>Hello</h1>",
            audienceId: "group-123",
        });

        expect(createOrUpdate).toHaveBeenCalledWith({
            email: "ada@example.com",
            fields: {
                name: "Ada Lovelace",
            },
            groups: ["group-123"],
            status: "unconfirmed",
        });
        expect(create).toHaveBeenCalledWith({
            name: "Cloud City Draft - Spring Launch",
            type: "regular",
            emails: [
                {
                    subject: "Spring Launch",
                    from_name: "Cloud City",
                    from: "team@example.com",
                    content: "<h1>Hello</h1>",
                },
            ],
            groups: ["group-123"],
        });
        expect(campaign).toEqual({
            id: "campaign-123",
            status: "draft",
            type: "regular",
        });
    });
});

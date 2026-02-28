// __tests__/scripts/import-luma.test.ts
/** @jest-environment node */

import { executeImportLuma, parseLumaCsvDryRun } from "../../scripts/import-luma";

describe("import-luma dry-run parser", () => {
    it("detects headers and filters opt-ins with yes/true values", async () => {
        const csv = [
            "Name,Email,Join our newsletter",
            "Ada Lovelace,ada@example.com,yes",
            "No Optin,no@example.com,no",
            "Truthy,truthy@example.com,TRUE",
        ].join("\n");

        const result = await parseLumaCsvDryRun(csv);

        expect(result.totalRecords).toBe(3);
        expect(result.detectedHeaders).toEqual(["Name", "Email", "Join our newsletter"]);
        expect(result.optInSubscribers).toEqual([
            { name: "Ada Lovelace", email: "ada@example.com" },
            { name: "Truthy", email: "truthy@example.com" },
        ]);
    });

    it("preserves quoted commas in names", async () => {
        const csv = [
            "Name,Email,Join our newsletter",
            "\"Doe, Jane\",jane@example.com,yes",
        ].join("\n");

        const result = await parseLumaCsvDryRun(csv);

        expect(result.totalRecords).toBe(1);
        expect(result.optInSubscribers).toEqual([
            { name: "Doe, Jane", email: "jane@example.com" },
        ]);
    });

    it("throws when required email header is missing", async () => {
        const csv = [
            "Name,Join our newsletter",
            "No Email,yes",
        ].join("\n");

        await expect(parseLumaCsvDryRun(csv)).rejects.toThrow("Missing required header: Email");
    });

    it("throws when required newsletter header is missing", async () => {
        const csv = [
            "Name,Email",
            "Newsletter Missing,missing@example.com",
        ].join("\n");

        await expect(parseLumaCsvDryRun(csv)).rejects.toThrow("Missing required header: Join our newsletter");
    });

    it("accepts long-form newsletter question headers from Luma exports", async () => {
        const csv = [
            "Name,Email,Join our newsletter for updates on future events.",
            "Test User,test@example.com,true",
        ].join("\n");

        const result = await parseLumaCsvDryRun(csv);

        expect(result.detectedHeaders).toEqual([
            "Name",
            "Email",
            "Join our newsletter for updates on future events.",
        ]);
        expect(result.optInSubscribers).toEqual([{ name: "Test User", email: "test@example.com" }]);
    });

    it("detects headers from header-only CSV files", async () => {
        const csv = "Name,Email,Join our newsletter";

        const result = await parseLumaCsvDryRun(csv);

        expect(result.detectedHeaders).toEqual(["Name", "Email", "Join our newsletter"]);
        expect(result.totalRecords).toBe(0);
        expect(result.optInSubscribers).toEqual([]);
    });

    it("does not drop records for a 200-capacity guest list", async () => {
        const header = "Name,Email,Join our newsletter";
        const rows = Array.from({ length: 200 }, (_, i) => {
            const n = i + 1;
            return `Guest ${n},guest${n}@example.com,yes`;
        });
        const csv = [header, ...rows].join("\n");

        const result = await parseLumaCsvDryRun(csv);

        expect(result.totalRecords).toBe(200);
        expect(result.optInSubscribers).toHaveLength(200);
        expect(result.optInSubscribers[0]).toEqual({ name: "Guest 1", email: "guest1@example.com" });
        expect(result.optInSubscribers[199]).toEqual({ name: "Guest 200", email: "guest200@example.com" });

        const uniqueEmails = new Set(result.optInSubscribers.map((item) => item.email));
        expect(uniqueEmails.size).toBe(200);
    });

    it("syncs opted-in subscribers through the configured provider", async () => {
        const createProvider = jest.fn().mockReturnValue({
            name: "mailerlite",
            upsertSubscriber: jest.fn().mockResolvedValue(undefined),
            createDraftCampaign: jest.fn(),
        });
        const wait = jest.fn().mockResolvedValue(undefined);
        const progressWriter = jest.fn();

        const result = await executeImportLuma({
            argv: ["node", "scripts/import-luma.ts", "sample.csv"],
            env: {
                CC_EMAIL_API_KEY: "test-api-key",
            },
            parseFile: async () => ({
                detectedHeaders: ["Name", "Email", "Join our newsletter"],
                totalRecords: 2,
                optInSubscribers: [
                    { name: "Ada", email: "ada@example.com" },
                    { name: "Bob", email: "bob@example.com" },
                ],
                headerMap: {
                    email: "Email",
                    optIn: "Join our newsletter",
                    name: "Name",
                },
            }),
            createProvider,
            wait,
            progressWriter,
        });

        expect(createProvider).toHaveBeenCalledWith({
            providerName: "mailerlite",
            apiKey: "test-api-key",
        });
        expect(wait).toHaveBeenCalledTimes(2);
        expect(progressWriter).toHaveBeenCalledTimes(2);
        expect(result.syncResult).toEqual({
            successCount: 2,
            failCount: 0,
            failures: [],
        });
    });

    it("skips provider sync when no opted-in subscribers are found", async () => {
        const createProvider = jest.fn();

        const result = await executeImportLuma({
            argv: ["node", "scripts/import-luma.ts", "sample.csv"],
            env: {
                CC_EMAIL_API_KEY: "test-api-key",
            },
            parseFile: async () => ({
                detectedHeaders: ["Name", "Email", "Join our newsletter"],
                totalRecords: 1,
                optInSubscribers: [],
                headerMap: {
                    email: "Email",
                    optIn: "Join our newsletter",
                    name: "Name",
                },
            }),
            createProvider,
        });

        expect(createProvider).not.toHaveBeenCalled();
        expect(result.syncResult).toBeNull();
    });
});

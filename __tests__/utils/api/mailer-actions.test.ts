const ORIGINAL_ENV = process.env;

const loadMailerActionsModule = async (ccApiKey = "") => {
    jest.resetModules();
    process.env = {
        ...ORIGINAL_ENV,
        CC_API_KEY: ccApiKey,
    };

    const mockCreateOrUpdate = jest.fn();
    const mockMailerLiteCtor = jest.fn().mockImplementation(() => ({
        subscribers: {
            createOrUpdate: mockCreateOrUpdate,
        },
    }));

    jest.doMock("@mailerlite/mailerlite-nodejs", () => ({
        __esModule: true,
        default: mockMailerLiteCtor,
    }));

    const mailerActionsModule = await import("@/utils/api/mailer-actions");

    return {
        subscribeMember: mailerActionsModule.subscribeMember,
        mockCreateOrUpdate,
        mockMailerLiteCtor,
    };
};

describe("mailer-actions", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV;
    });

    it("initializes MailerLite with CC_API_KEY", async () => {
        const { mockMailerLiteCtor } = await loadMailerActionsModule("test-api-key");

        expect(mockMailerLiteCtor).toHaveBeenCalledWith({ api_key: "test-api-key" });
    });

    it("falls back to empty API key when CC_API_KEY is missing", async () => {
        const { mockMailerLiteCtor } = await loadMailerActionsModule();

        expect(mockMailerLiteCtor).toHaveBeenCalledWith({ api_key: "" });
    });

    it("subscribeMember sends trimmed payload and returns ok=true when API succeeds", async () => {
        const { subscribeMember, mockCreateOrUpdate } = await loadMailerActionsModule("another-key");
        mockCreateOrUpdate.mockResolvedValueOnce({ data: { id: "subscriber-1" } });

        const result = await subscribeMember({
            firstName: "  Ada  ",
            lastName: "  Lovelace  ",
            email: "  ada@example.com  ",
            other: "",
        });

        expect(mockCreateOrUpdate).toHaveBeenCalledWith({
            email: "ada@example.com",
            fields: {
                name: "Ada",
                last_name: "Lovelace",
            },
            groups: ["125237533318579422"],
            status: "unconfirmed",
        });
        expect(result).toEqual({ ok: true });
    });

    it("subscribeMember returns ok=false when MailerLite rejects", async () => {
        const { subscribeMember, mockCreateOrUpdate } = await loadMailerActionsModule("another-key");
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
        mockCreateOrUpdate.mockRejectedValueOnce(new Error("service-down"));

        const result = await subscribeMember({
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            other: "",
        });

        expect(result).toEqual({ ok: false });
        expect(consoleLogSpy).toHaveBeenCalledWith("Error ->", "service-down");
        consoleLogSpy.mockRestore();
    });
});

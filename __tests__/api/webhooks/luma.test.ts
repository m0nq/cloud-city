// __tests__/api/webhooks/luma.test.ts
import { POST } from "@/app/api/webhooks/luma/route";

const createOrUpdateMock = jest.fn().mockResolvedValue({ data: { id: "123" } });

// Mock the MailerLite SDK
jest.mock("@mailerlite/mailerlite-nodejs", () => {
    return jest.fn().mockImplementation(() => ({
        subscribers: {
            createOrUpdate: (...args: any[]) => createOrUpdateMock(...args),
        },
    }));
});

describe("Luma Webhook Handler", () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    // We can now use the native Request object because jest.setup.ts restored it
    const createMockRequest = (body: any) => {
        return new Request("http://localhost:3000/api/webhooks/luma", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    };

    it("should add subscriber to MailerLite when opt-in is true", async () => {
        const payload = {
            event: "ticket.registered",
            payload: {
                guest: { email: "dancer@example.com", name: "House Dancer" },
                answers: { "Join our newsletter": "true" },
            },
        };

        const response = await POST(createMockRequest(payload) as any);

        expect(response.status).toBe(200);
        expect(createOrUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({ email: "dancer@example.com" }),
        );
    });

    it("should skip MailerLite when opt-in is false or missing", async () => {
        const payload = {
            event: "ticket.registered",
            payload: {
                guest: { email: "private@example.com", name: "Private Dancer" },
                answers: { "Join our newsletter": "false" },
            },
        };

        const response = await POST(createMockRequest(payload) as any);

        expect(response.status).toBe(200);
        expect(createOrUpdateMock).not.toHaveBeenCalled();
    });

    it("should return 400 if payload is missing email", async () => {
        const response = await POST(createMockRequest({ event: "ticket.registered", payload: {} }) as any);
        expect(response.status).toBe(400);
    });

    it("should return 500 when MailerLite fails so Luma can retry", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        createOrUpdateMock.mockRejectedValueOnce(new Error("MailerLite unavailable"));

        const payload = {
            event: "ticket.registered",
            payload: {
                guest: { email: "retry@example.com", name: "Retry User" },
                answers: { "Join our newsletter": "true" },
            },
        };

        const response = await POST(createMockRequest(payload) as any);
        const body = await response.json();

        expect(createOrUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({ email: "retry@example.com" }),
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith("[Luma Webhook Error]:", expect.any(Error));
        expect(response.status).toBe(500);
        expect(body).toEqual({ error: "Internal Server Error" });
        consoleErrorSpy.mockRestore();
    });
});

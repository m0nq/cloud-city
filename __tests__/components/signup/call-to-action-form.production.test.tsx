import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/utils/api/mailer-actions", () => ({
    subscribeMember: jest.fn(),
}));

jest.mock("@/utils/analytics-config", () => ({
    isProduction: true,
}));

import CallToActionForm from "@/components/signup/call-to-action-form";
import { subscribeMember } from "@/utils/api/mailer-actions";

const mockSubscribeMember = subscribeMember as jest.Mock;

describe("CallToActionForm analytics in production", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (window as any).gtag = jest.fn();
    });

    afterEach(() => {
        delete (window as any).gtag;
    });

    it("tracks successful submissions with success label", async () => {
        const user = userEvent.setup();
        mockSubscribeMember.mockResolvedValueOnce({ ok: true });

        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Ada");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(await screen.findByText(/Check your email to confirm your subscription/i)).toBeInTheDocument();
        expect((window as any).gtag).toHaveBeenCalledWith("event", "form_submission", {
            event_category: "engagement",
            event_label: "success",
        });
    });

    it("tracks failed submissions with error label", async () => {
        const user = userEvent.setup();
        mockSubscribeMember.mockResolvedValueOnce({ ok: false });

        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Ada");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(await screen.findAllByText("That didn't work for some reason. Try again.")).toHaveLength(2);
        expect((window as any).gtag).toHaveBeenCalledWith("event", "form_submission", {
            event_category: "engagement",
            event_label: "error",
        });
    });
});

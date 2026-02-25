import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/utils/api/mailer-actions", () => ({
    subscribeMember: jest.fn(),
}));

jest.mock("@/utils/analytics-config", () => ({
    isProduction: false,
}));

import CallToActionForm from "@/components/signup/call-to-action-form";
import { subscribeMember } from "@/utils/api/mailer-actions";

const mockSubscribeMember = subscribeMember as jest.Mock;

describe("CallToActionForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (window as any).gtag = jest.fn();
    });

    afterEach(() => {
        delete (window as any).gtag;
    });

    it("shows validation errors and blocks submit when required fields are missing", async () => {
        const user = userEvent.setup();
        render(<CallToActionForm />);

        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(await screen.findByText("Gotta name...?")).toBeInTheDocument();
        expect(await screen.findByText("We'll need an valid email")).toBeInTheDocument();
        expect(mockSubscribeMember).not.toHaveBeenCalled();
    });

    it("shows validation errors for invalid first and last names", async () => {
        const user = userEvent.setup();
        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Ada1");
        await user.type(screen.getByLabelText("Last Name (Optional)"), "Lovelace!");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(await screen.findAllByText("Only letters, spaces, or hyphens please")).toHaveLength(2);
        expect(mockSubscribeMember).not.toHaveBeenCalled();
    });

    it("blocks submit when honeypot field is filled", async () => {
        const user = userEvent.setup();
        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Test");
        await user.type(screen.getByLabelText("Email"), "test@example.com");
        await user.type(screen.getByPlaceholderText("Other"), "bot-input");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        await waitFor(() => {
            expect(mockSubscribeMember).not.toHaveBeenCalled();
        });
    });

    it("shows success confirmation after successful submit", async () => {
        const user = userEvent.setup();
        mockSubscribeMember.mockResolvedValueOnce({ ok: true });

        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Ada");
        await user.type(screen.getByLabelText("Last Name (Optional)"), "Lovelace");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(mockSubscribeMember).toHaveBeenCalledWith({
            firstName: "Ada",
            lastName: "Lovelace",
            email: "ada@example.com",
            other: "",
        });
        expect(await screen.findByText(/Check your email to confirm your subscription/i)).toBeInTheDocument();
        expect((window as any).gtag).not.toHaveBeenCalled();
    });

    it("shows inline error message when submit fails", async () => {
        const user = userEvent.setup();
        mockSubscribeMember.mockResolvedValueOnce({ ok: false });

        render(<CallToActionForm />);

        await user.type(screen.getByLabelText("First Name"), "Ada");
        await user.type(screen.getByLabelText("Email"), "ada@example.com");
        await user.click(screen.getByRole("button", { name: "Subscribe" }));

        expect(await screen.findAllByText("That didn't work for some reason. Try again.")).toHaveLength(2);
        expect((window as any).gtag).not.toHaveBeenCalled();
    });
});

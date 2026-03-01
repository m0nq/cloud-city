import { render, screen } from "@testing-library/react";

jest.mock("@/utils/api/wp-actions", () => ({
    getPost: jest.fn(),
}));

jest.mock("@/components/post/article", () => ({
    Article: ({
        title,
        children,
    }: {
        title: string;
        children: React.ReactNode;
    }) => (
        <article>
            <h1>{title}</h1>
            <div>{children}</div>
        </article>
    ),
}));

import ConductPage, { dynamic as conductDynamic } from "@/app/(main)/(policy)/conduct/page";
import PrivacyPolicyPage, { dynamic as privacyDynamic } from "@/app/(main)/(policy)/privacy-policy/page";
import TermsPage, { dynamic as termsDynamic } from "@/app/(main)/(policy)/terms-conditions/page";
import { getPost } from "@/utils/api/wp-actions";

const mockGetPost = getPost as jest.Mock;

describe("policy pages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("marks all policy pages as dynamic to avoid build-time CMS blocking", () => {
        expect(conductDynamic).toBe("force-dynamic");
        expect(privacyDynamic).toBe("force-dynamic");
        expect(termsDynamic).toBe("force-dynamic");
    });

    it("renders fetched policy content when the CMS request succeeds", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Code of Conduct",
            content: "<p>Respect the dance floor.</p>",
        });

        const node = await ConductPage();
        render(<>{node}</>);

        expect(mockGetPost).toHaveBeenCalledWith("/code-of-conduct");
        expect(screen.getByText("Code of Conduct")).toBeInTheDocument();
        expect(screen.getByText("Respect the dance floor.")).toBeInTheDocument();
    });

    it("renders a fallback message when the conduct page CMS request fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPost.mockRejectedValueOnce(new Error("wp-timeout"));

        try {
            const node = await ConductPage();
            render(<>{node}</>);

            expect(screen.getByText("Code of Conduct")).toBeInTheDocument();
            expect(screen.getByText("The code of conduct is temporarily unavailable. Please try again shortly."))
                .toBeInTheDocument();
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    it("renders a fallback message when the privacy policy CMS request fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPost.mockRejectedValueOnce(new Error("wp-timeout"));

        try {
            const node = await PrivacyPolicyPage();
            render(<>{node}</>);

            expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
            expect(screen.getByText("The privacy policy is temporarily unavailable. Please try again shortly."))
                .toBeInTheDocument();
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    it("renders a fallback message when the terms page CMS request fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPost.mockRejectedValueOnce(new Error("wp-timeout"));

        try {
            const node = await TermsPage();
            render(<>{node}</>);

            expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
            expect(screen.getByText("The terms and conditions are temporarily unavailable. Please try again shortly."))
                .toBeInTheDocument();
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });
});

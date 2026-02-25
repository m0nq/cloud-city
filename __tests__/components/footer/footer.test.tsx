import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, ...props }: any) => (
        <a href={typeof href === "string" ? href : String(href)} {...props}>
            {children}
        </a>
    ),
}));

import { Footer } from "@/components/footer/footer";

describe("Footer", () => {
    it("renders legal, volunteer, and social links", () => {
        render(<Footer />);

        expect(screen.getByRole("img", { name: "Pink and purple clouds at sunset" })).toBeInTheDocument();

        const volunteerLink = screen.getByRole("link", { name: "Volunteer" });
        expect(volunteerLink).toHaveAttribute(
            "href",
            "https://docs.google.com/forms/d/e/1FAIpQLSegOvDswW0Xeg0wxrhaL_5BoAiOne9hDRCqwM58G-AXMAGKcQ/viewform",
        );
        expect(volunteerLink).toHaveAttribute("target", "_blank");
        expect(volunteerLink).toHaveAttribute("rel", "noopener");

        expect(screen.getByRole("link", { name: "Code" })).toHaveAttribute("href", "/conduct");
        expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms-conditions");
        expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy-policy");

        const links = screen.getAllByRole("link");
        expect(links.some(link => link.getAttribute("href") === "https://www.instagram.com/cloudcityfestival")).toBe(
            true,
        );
        expect(links.some(link => link.getAttribute("href") === "https://www.facebook.com/cloudcityfestival/")).toBe(
            true,
        );
    });

    it("renders the current copyright year", () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(
            screen.getByText(`Copyright © ${currentYear} Cloud City Festival. All rights reserved.`),
        ).toBeInTheDocument();
    });
});

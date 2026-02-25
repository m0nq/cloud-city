import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, ...props }: any) => (
        <a href={typeof href === "string" ? href : String(href)} {...props}>
            {children}
        </a>
    ),
}));

import Navbar from "@/components/navbar/navbar";

describe("Navbar", () => {
    it("renders core navigation links", () => {
        render(<Navbar />);

        const homeLink = screen.getByRole("link", { name: "Home" });
        const articlesLink = screen.getByRole("link", { name: "Articles" });

        expect(homeLink).toHaveAttribute("href", "/");
        expect(articlesLink).toHaveAttribute("href", "/blog");
        expect(screen.queryByRole("link", { name: "Events" })).not.toBeInTheDocument();
    });
});

import { render, screen } from "@testing-library/react";

import { Section } from "@/components/utils/section";

describe("Section", () => {
    it("renders children with default className and passed props", () => {
        render(
            <Section id="hero" aria-label="Hero Section">
                <span>Content</span>
            </Section>,
        );

        const section = screen.getByRole("region", { name: "Hero Section" });
        expect(section).toHaveAttribute("id", "hero");
        expect(section.getAttribute("class")).toBe("");
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("applies inline styles and custom className", () => {
        render(
            <Section className="custom-section" styles={{ backgroundColor: "tomato", padding: "8px" }}>
                <span>Styled</span>
            </Section>,
        );

        const section = screen.getByText("Styled").closest("section");
        expect(section).toHaveClass("custom-section");
        const style = section?.getAttribute("style") || "";
        expect(style).toContain("background-color: tomato");
        expect(style).toContain("padding: 8px");
    });
});

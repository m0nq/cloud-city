import React from "react";

jest.mock("@/components/utils/fonts", () => ({
    montserrat: { variable: "font-montserrat" },
    montserratAlt1: { variable: "font-montserrat-alt1" },
    openSans: { variable: "font-open-sans" },
}));

import RootLayout, { metadata, viewport } from "@/app/layout";

describe("app/layout", () => {
    beforeEach(() => {
        process.env.GA4_MEASUREMENT_ID = "G-TEST-ID";
    });

    it("exports expected metadata and viewport", () => {
        expect(metadata).toMatchObject({
            title: "Cloud City",
            description: "The Bay Area no-alcohol music festival",
        });
        expect(viewport).toEqual({ themeColor: "#1f1b21" });
    });

    it("renders html/body wrapper with navbar, footer, and GA component", () => {
        const layoutTree = RootLayout({ children: <main>Main Content</main> }) as React.ReactElement;

        expect(layoutTree.type).toBe("html");
        expect(layoutTree.props.lang).toBe("en");

        const body = layoutTree.props.children as React.ReactElement;
        expect(body.type).toBe("body");
        expect(body.props.style).toEqual({ backgroundColor: "#1f1b21" });
        expect(body.props.className).toContain("font-montserrat");
        expect(body.props.className).toContain("font-montserrat-alt1");
        expect(body.props.className).toContain("font-open-sans");

        const bodyChildren = body.props.children as React.ReactElement[];
        expect(bodyChildren).toHaveLength(4);
        expect(bodyChildren[1].props.children).toBe("Main Content");
        expect(bodyChildren[3].props.gaId).toBe("G-TEST-ID");
    });
});

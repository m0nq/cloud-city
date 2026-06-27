import React from "react";

jest.mock("@/components/utils/fonts", () => ({
    montserrat: { variable: "font-montserrat" },
    montserratAlt1: { variable: "font-montserrat-alt1" },
    openSans: { variable: "font-open-sans" },
}));

import RootLayout, { metadata, viewport } from "@/app/layout";

type HtmlLayoutProps = {
    lang?: string;
    children: React.ReactNode;
};

type BodyLayoutProps = {
    style?: React.CSSProperties;
    className?: string;
    children: React.ReactNode;
};

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
        const layoutTree = RootLayout({ children: <main>Main Content</main> });

        expect(React.isValidElement<HtmlLayoutProps>(layoutTree)).toBe(true);
        if (!React.isValidElement<HtmlLayoutProps>(layoutTree)) {
            throw new Error("RootLayout should return an html element");
        }

        expect(layoutTree.type).toBe("html");
        expect(layoutTree.props.lang).toBe("en");

        const body = layoutTree.props.children;

        expect(React.isValidElement<BodyLayoutProps>(body)).toBe(true);
        if (!React.isValidElement<BodyLayoutProps>(body)) {
            throw new Error("RootLayout should render a body element");
        }

        expect(body.type).toBe("body");
        expect(body.props.style).toEqual({ backgroundColor: "#1f1b21" });
        expect(body.props.className).toContain("font-montserrat");
        expect(body.props.className).toContain("font-montserrat-alt1");
        expect(body.props.className).toContain("font-open-sans");

        const bodyChildren = React.Children.toArray(body.props.children);
        expect(bodyChildren).toHaveLength(4);

        const mainChild = bodyChildren[1];
        expect(React.isValidElement<{ children?: React.ReactNode }>(mainChild)).toBe(true);
        if (!React.isValidElement<{ children?: React.ReactNode }>(mainChild)) {
            throw new Error("Main content child should be a valid element");
        }

        const gaChild = bodyChildren[3];
        expect(React.isValidElement<{ gaId?: string }>(gaChild)).toBe(true);
        if (!React.isValidElement<{ gaId?: string }>(gaChild)) {
            throw new Error("Google Analytics child should be a valid element");
        }

        expect(mainChild.props.children).toBe("Main Content");
        expect(gaChild.props.gaId).toBe("G-TEST-ID");
    });
});

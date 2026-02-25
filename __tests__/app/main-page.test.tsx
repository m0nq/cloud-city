import { render, screen } from "@testing-library/react";

jest.mock("next/dynamic", () => {
    let callCount = 0;
    const dynamic = jest.fn(() => {
        callCount += 1;
        const id = callCount;
        return function MockDynamicSection() {
            return <div data-testid={`dynamic-section-${id}`} />;
        };
    });

    return {
        __esModule: true,
        default: dynamic,
    };
});

jest.mock("@/components/banner/banner", () => ({
    Banner: () => <div data-testid="banner">Banner</div>,
}));

import Home from "@/app/(main)/page";

describe("app/(main)/page", () => {
    it("renders banner and all dynamic home sections", () => {
        render(<Home />);

        expect(screen.getByTestId("banner")).toBeInTheDocument();
        expect(screen.getByTestId("dynamic-section-1")).toBeInTheDocument();
        expect(screen.getByTestId("dynamic-section-2")).toBeInTheDocument();
        expect(screen.getByTestId("dynamic-section-3")).toBeInTheDocument();
        expect(screen.getByTestId("dynamic-section-4")).toBeInTheDocument();
    });

});

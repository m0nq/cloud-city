import { render, screen } from "@testing-library/react";

jest.mock("next/dynamic", () => ({
    __esModule: true,
    default: () => function MockParticlesWrapper() {
        return <div data-testid="particles-wrapper" />;
    },
}));

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

import MainLayout from "@/app/(main)/layout";
import { usePathname } from "next/navigation";

const mockUsePathname = usePathname as jest.Mock;

describe("main layout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders particles wrapper on home route", () => {
        mockUsePathname.mockReturnValue("/");

        render(<MainLayout><div>Child Content</div></MainLayout>);

        expect(screen.getByTestId("particles-wrapper")).toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("does not render particles wrapper on non-home routes", () => {
        mockUsePathname.mockReturnValue("/blog");

        render(<MainLayout><div>Child Content</div></MainLayout>);

        expect(screen.queryByTestId("particles-wrapper")).not.toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });
});

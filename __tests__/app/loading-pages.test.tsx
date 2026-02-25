import { render, screen } from "@testing-library/react";

jest.mock("@/components/utils/loading-indicator/loading-indicator", () => ({
    LoadingIndicator: () => <div data-testid="loading-indicator">Loading</div>,
}));

import AppLoading from "@/app/loading";
import BlogLoading from "@/app/blog/loading";
import EventsLoading from "@/app/events/loading";
import MainLoading from "@/app/(main)/loading";

describe("Route Loading Components", () => {
    it("renders app-level loading indicator", () => {
        render(<AppLoading />);
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });

    it("renders blog loading indicator", () => {
        render(<BlogLoading />);
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });

    it("renders events loading indicator", () => {
        render(<EventsLoading />);
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });

    it("renders main route loading indicator", () => {
        render(<MainLoading />);
        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });
});

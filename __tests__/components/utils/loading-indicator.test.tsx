import { render, screen } from "@testing-library/react";

jest.mock("react-icons/si", () => ({
    SiSpinrilla: ({ className }: { className?: string }) => <svg data-testid="loading-spinner" className={className} />,
}));

import { LoadingIndicator } from "@/components/utils/loading-indicator/loading-indicator";

describe("LoadingIndicator", () => {
    it("renders spinner overlay", () => {
        const { container } = render(<LoadingIndicator />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
});

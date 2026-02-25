import { render, screen } from "@testing-library/react";

const decorativeRingsMock = jest.fn(() => <div data-testid="decorative-rings" />);

jest.mock("@/components/decorations/decorative-rings", () => ({
    DecorativeRings: (props: { rotations: number[] }) => decorativeRingsMock(props),
}));

import MissionSection from "@/components/mission/mission-section";

describe("MissionSection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders mission statement and decorative rings with expected rotations", () => {
        render(<MissionSection />);

        expect(
            screen.getByRole("heading", {
                name: /Dedicated to creating inclusive experiences that celebrate all the best things/i,
                level: 2,
            }),
        ).toBeInTheDocument();
        expect(screen.getByTestId("decorative-rings")).toBeInTheDocument();
        expect(decorativeRingsMock).toHaveBeenCalledWith({ rotations: [135, 154, 172] });
    });
});

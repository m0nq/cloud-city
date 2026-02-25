import { render, screen } from "@testing-library/react";

import SustainabilitySection from "@/components/sustainability/sustainability-section";

describe("SustainabilitySection", () => {
    it("renders sustainability heading and core messaging", () => {
        render(<SustainabilitySection />);

        expect(screen.getByRole("heading", { name: "Sustainability", level: 2 })).toBeInTheDocument();
        expect(
            screen.getByText(/Our dedication to sustainability extends beyond our events/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Together, let's celebrate connection, creativity, and community/i),
        ).toBeInTheDocument();
    });
});

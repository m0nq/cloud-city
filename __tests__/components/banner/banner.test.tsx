import { render, screen } from "@testing-library/react";

import { Banner } from "@/components/banner/banner";

describe("Banner", () => {
    it("renders the core hero copy hierarchy", () => {
        render(<Banner />);

        expect(screen.getByRole("heading", { name: "Hi-Fi Vibes", level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Cloud City", level: 1 })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Zero-Proof Parties", level: 3 })).toBeInTheDocument();
    });
});

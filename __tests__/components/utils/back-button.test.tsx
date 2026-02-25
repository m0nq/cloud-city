import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const backMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        back: backMock,
    }),
}));

import { BackButton } from "@/components/utils/back-button/back-button";

describe("BackButton", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls router.back when clicked", async () => {
        const user = userEvent.setup();

        render(<BackButton>Go Back</BackButton>);

        await user.click(screen.getByRole("button", { name: "Go Back" }));

        expect(backMock).toHaveBeenCalledTimes(1);
    });

    it("applies optional className while preserving base class", () => {
        render(<BackButton className="custom">Go Back</BackButton>);

        const button = screen.getByRole("button", { name: "Go Back" });
        expect(button).toHaveClass("back-btn");
        expect(button).toHaveClass("custom");
    });
});

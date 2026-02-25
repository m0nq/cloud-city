import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/font/google", () => ({
    Mulish: () => ({ variable: "--font-family-mulish" }),
}));

import GlobalError, { metadata } from "@/app/global-error";

describe("global-error", () => {
    it("exports expected metadata", () => {
        expect(metadata).toMatchObject({
            title: "Cloud City Festival",
            description: "A music festival for the Cloud City community.",
        });
    });

    it("logs the error and allows retry via reset", async () => {
        const user = userEvent.setup();
        const error = new Error("test-error");
        const reset = jest.fn();
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

        render(<GlobalError error={error} reset={reset} />);

        expect(screen.getByRole("heading", { name: "Something went wrong!" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Try again/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
        });

        await user.click(screen.getByRole("button", { name: /Try again/i }));
        expect(reset).toHaveBeenCalledTimes(1);

        consoleErrorSpy.mockRestore();
    });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EventLocation } from "@/components/location/event-location";

describe("EventLocation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.open = jest.fn();
    });

    it("opens Google Maps search with encoded address", async () => {
        const user = userEvent.setup();

        render(<EventLocation address="123 Main St, San Francisco, CA" />);

        await user.click(screen.getByRole("button"));

        expect(window.open).toHaveBeenCalledWith(
            "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20San%20Francisco%2C%20CA",
            "_blank",
        );
    });

    it("renders fallback text when address is missing", () => {
        render(<EventLocation address="" />);

        expect(screen.getByText("Location TBA")).toBeInTheDocument();
    });
});

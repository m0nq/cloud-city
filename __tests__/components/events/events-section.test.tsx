import { render, screen } from "@testing-library/react";

jest.mock("@/components/events/events-list", () => ({
    EventsList: () => <div data-testid="events-list">Events list</div>,
}));

import EventsSection from "@/components/events/events-section";

describe("EventsSection", () => {
    it("renders section headings, description, and events list", () => {
        render(<EventsSection />);

        expect(screen.getByRole("heading", { name: "Events", level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Gatherings", level: 3 })).toBeInTheDocument();
        expect(
            screen.getByText(/Transforming alcohol-free events into unforgettable real-world experiences/i),
        ).toBeInTheDocument();
        expect(screen.getByTestId("events-list")).toBeInTheDocument();
    });
});

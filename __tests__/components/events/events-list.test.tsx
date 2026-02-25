import { render, screen, waitFor } from "@testing-library/react";

jest.mock("@/utils/api/wp-actions", () => ({
    getPosts: jest.fn(),
}));

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, ...props }: any) => (
        <a href={typeof href === "string" ? href : String(href)} {...props}>
            {children}
        </a>
    ),
}));

import { EventsList } from "@/components/events/events-list";
import { getPosts } from "@/utils/api/wp-actions";

const mockGetPosts = getPosts as jest.Mock;

const createEvent = (overrides: Record<string, unknown> = {}) => ({
    post: {
        databaseId: 1,
        uri: "future-event",
        title: "Future Event",
        date: "2026-01-10T19:00:00-08:00",
        excerpt: "<p>Future excerpt</p>",
        eventsFields: {
            address: "123 Venue St",
            eventDateTime: "2026-01-10T19:00:00-08:00",
            ticketLink: "https://tickets.example.com",
        },
        ...overrides,
    },
});

describe("EventsList", () => {
    let dateNowSpy: jest.SpyInstance<number, []>;

    beforeEach(() => {
        jest.clearAllMocks();
        dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(new Date("2026-01-10T12:00:00Z").valueOf());
    });

    afterEach(() => {
        dateNowSpy.mockRestore();
    });

    it("shows loading skeleton while events are still loading", () => {
        mockGetPosts.mockReturnValue(new Promise(() => undefined));

        const { container } = render(<EventsList />);

        expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("renders only upcoming events", async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                createEvent({
                    databaseId: 1,
                    uri: "past-event",
                    title: "Past Event",
                    eventsFields: {
                        address: "Old Venue",
                        eventDateTime: "2026-01-08T20:00:00-08:00",
                        ticketLink: "https://tickets.example.com/past",
                    },
                }),
                createEvent({
                    databaseId: 2,
                    uri: "future-event",
                    title: "Future Event",
                    eventsFields: {
                        address: "New Venue",
                        eventDateTime: "2026-01-10T20:00:00-08:00",
                        ticketLink: "https://tickets.example.com/future",
                    },
                }),
            ],
        });

        render(<EventsList />);

        expect(await screen.findByText("Future Event")).toBeInTheDocument();
        expect(screen.queryByText("Past Event")).not.toBeInTheDocument();
    });

    it("shows fallback message when no upcoming events are available", async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                createEvent({
                    databaseId: 1,
                    uri: "past-event",
                    title: "Past Event",
                    eventsFields: {
                        address: "Old Venue",
                        eventDateTime: "2026-01-05T20:00:00-08:00",
                        ticketLink: "https://tickets.example.com/past",
                    },
                }),
            ],
        });

        render(<EventsList />);

        expect(await screen.findByText("No upcoming events")).toBeInTheDocument();
    });

    it("renders fallback address and empty excerpt when optional event fields are missing", async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                createEvent({
                    databaseId: 3,
                    uri: "minimal-upcoming-event",
                    title: "Minimal Upcoming Event",
                    excerpt: "",
                    eventsFields: {
                        eventDateTime: "2026-01-10T21:00:00-08:00",
                        address: "",
                        ticketLink: "",
                    },
                }),
            ],
        });

        render(<EventsList />);

        expect(await screen.findByText("Minimal Upcoming Event")).toBeInTheDocument();
        expect(screen.getByText("TBA")).toBeInTheDocument();
    });

    it("shows an error message when fetching events fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPosts.mockRejectedValueOnce(new Error("network-failure"));

        render(<EventsList />);

        expect(await screen.findByText("There was a problem loading the events. Reload the page to try again.")).toBeInTheDocument();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });
});

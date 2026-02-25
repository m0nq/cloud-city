import { render, screen } from "@testing-library/react";

jest.mock("@/utils/api/wp-actions", () => ({
    getPosts: jest.fn(),
    getPost: jest.fn(),
}));

jest.mock("@/components/utils/back-button/back-button", () => ({
    BackButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock("@/components/location/event-location", () => ({
    EventLocation: ({ address }: { address: string }) => <p>{address}</p>,
}));

jest.mock("isomorphic-dompurify", () => ({
    __esModule: true,
    default: { sanitize: (value: string) => value },
}));

import EventPage, { generateStaticParams } from "@/app/events/[event]/page";
import { getPost, getPosts } from "@/utils/api/wp-actions";

const mockGetPosts = getPosts as jest.Mock;
const mockGetPost = getPost as jest.Mock;

describe("events/[event]/page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("generateStaticParams extracts event slug from post URI", async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                { post: { uri: "/events/sunrise-session/" } },
                { post: { uri: "events/twilight-session" } },
                { post: { uri: "/" } },
            ],
        });

        const params = await generateStaticParams();

        expect(mockGetPosts).toHaveBeenCalledWith({ tag: "Cloud City", category: "Events" }, 100);
        expect(params).toEqual([
            { event: "sunrise-session" },
            { event: "twilight-session" },
            { event: "" },
        ]);
    });

    it("generateStaticParams returns empty array when post lookup fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPosts.mockRejectedValueOnce(new Error("wp-timeout"));

        try {
            const params = await generateStaticParams();
            expect(params).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "[events/[event]] Failed to generate static params:",
                expect.any(Error),
            );
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    it("renders not-found UI when getPost returns an empty object", async () => {
        mockGetPost.mockResolvedValueOnce({});

        const node = await EventPage({ params: Promise.resolve({ event: "missing-event" }) });
        render(<>{node}</>);

        expect(mockGetPost).toHaveBeenCalledWith("missing-event");
        expect(screen.getByText("Event not found")).toBeInTheDocument();
    });

    it("renders event details, ticket link, and featured images when optional fields are present", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Sunrise Session",
            content: "<p>Bring water and good vibes.</p>",
            eventsFields: {
                address: "Pier 7",
                eventDateTime: "2026-05-10T19:00:00-07:00",
                ticketLink: "https://tickets.example.com/sunrise",
            },
            featuredImage: {
                node: {
                    sourceUrl: "https://cdn.example.com/sunrise.jpg",
                    altText: null,
                },
            },
        });

        const node = await EventPage({ params: Promise.resolve({ event: "sunrise-session" }) });
        render(<>{node}</>);

        expect(screen.getByText("Sunrise Session")).toBeInTheDocument();
        expect(screen.getByText("Bring water and good vibes.")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Tickets/i })).toHaveAttribute(
            "href",
            "https://tickets.example.com/sunrise",
        );
        expect(screen.getByAltText("Featured Banner for Sunrise Session")).toBeInTheDocument();
        expect(screen.getByAltText("Sunrise Session featured image")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "← Back" })).toBeInTheDocument();
    });

    it("renders without ticket link and images when optional fields are absent", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Minimal Event",
            content: "<p>Core details only.</p>",
            eventsFields: {
                address: "Secret Warehouse",
                eventDateTime: "2026-06-01T20:00:00-07:00",
                ticketLink: "",
            },
        });

        const node = await EventPage({ params: Promise.resolve({ event: "minimal-event" }) });
        render(<>{node}</>);

        expect(screen.getByText("Minimal Event")).toBeInTheDocument();
        expect(screen.getByText("Core details only.")).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: /Tickets/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("falls back to TBA address and empty content when optional fields are missing", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Fallback Event",
            eventsFields: {
                eventDateTime: "2026-06-01T20:00:00-07:00",
            },
            featuredImage: {
                node: {
                    sourceUrl: "https://cdn.example.com/fallback.jpg",
                    altText: "Provided alt text",
                },
            },
        });

        const node = await EventPage({ params: Promise.resolve({ event: "fallback-event" }) });
        render(<>{node}</>);

        expect(screen.getByText("Fallback Event")).toBeInTheDocument();
        expect(screen.getByText("TBA")).toBeInTheDocument();
        expect(screen.getByAltText("Provided alt text")).toBeInTheDocument();
    });
});

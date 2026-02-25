import { render, screen } from "@testing-library/react";

jest.mock("@/utils/api/wp-actions", () => ({
    getPosts: jest.fn(),
    getPost: jest.fn(),
}));

jest.mock("isomorphic-dompurify", () => ({
    __esModule: true,
    default: { sanitize: (value: string) => value },
}));

import BlogArticlePage, { generateStaticParams } from "@/app/blog/[article]/page";
import { getPost, getPosts } from "@/utils/api/wp-actions";

const mockGetPosts = getPosts as jest.Mock;
const mockGetPost = getPost as jest.Mock;

describe("blog/[article]/page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("generateStaticParams extracts article slug from post URI", async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                { post: { uri: "/blog/testing-best-practices/" } },
                { post: { uri: "blog/incident-review" } },
                { post: { uri: "/" } },
            ],
        });

        const params = await generateStaticParams();

        expect(mockGetPosts).toHaveBeenCalledWith({ category: "Blog", tag: "Cloud City" }, 100);
        expect(params).toEqual([
            { article: "testing-best-practices" },
            { article: "incident-review" },
            { article: "" },
        ]);
    });

    it("generateStaticParams returns empty array when post lookup fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        mockGetPosts.mockRejectedValueOnce(new Error("wp-timeout"));

        try {
            const params = await generateStaticParams();
            expect(params).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "[blog/[article]] Failed to generate static params:",
                expect.any(Error),
            );
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    it("renders not-found UI when getPost returns an empty object", async () => {
        mockGetPost.mockResolvedValueOnce({});

        const node = await BlogArticlePage({ params: Promise.resolve({ article: "missing-article" }) });
        render(<>{node}</>);

        expect(mockGetPost).toHaveBeenCalledWith("/missing-article");
        expect(screen.getByText("Article not found")).toBeInTheDocument();
    });

    it("renders article content and metadata on happy path", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Testing Best Practices",
            date: "2026-01-10T00:00:00Z",
            content: "<p>Ship with confidence.</p>",
            featuredImage: {
                node: {
                    sourceUrl: "https://cdn.example.com/blog-banner.jpg",
                },
            },
        });

        const node = await BlogArticlePage({ params: Promise.resolve({ article: "testing-best-practices" }) });
        render(<>{node}</>);

        expect(mockGetPost).toHaveBeenCalledWith("/testing-best-practices");
        expect(screen.getByRole("heading", { name: "Testing Best Practices" })).toBeInTheDocument();
        expect(screen.getByText("Ship with confidence.")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "https://cdn.example.com/blog-banner.jpg" })).toBeInTheDocument();
        expect(screen.getByText(/Posted on/i)).toBeInTheDocument();
    });

    it("renders without optional image/date metadata when missing", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "No Media Article",
            content: "<p>Text-only content.</p>",
        });

        const node = await BlogArticlePage({ params: Promise.resolve({ article: "no-media-article" }) });
        render(<>{node}</>);

        expect(screen.getByRole("heading", { name: "No Media Article" })).toBeInTheDocument();
        expect(screen.getByText("Text-only content.")).toBeInTheDocument();
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.queryByText(/Posted on/i)).not.toBeInTheDocument();
    });

    it("renders with empty content fallback when content is undefined", async () => {
        mockGetPost.mockResolvedValueOnce({
            title: "Untitled Draft",
        });

        const node = await BlogArticlePage({ params: Promise.resolve({ article: "untitled-draft" }) });
        render(<>{node}</>);

        expect(screen.getByRole("heading", { name: "Untitled Draft" })).toBeInTheDocument();
    });
});

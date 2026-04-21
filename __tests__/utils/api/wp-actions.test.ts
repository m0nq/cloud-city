// __tests__/utils/api/wp-actions.test.ts
import { createJsonResponse } from "../../helpers/http-response";

const ORIGINAL_ENV = process.env;

describe("wp-actions", () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        process.env = {
            ...ORIGINAL_ENV,
            WORDPRESS_API_URL: "https://example.test/graphql",
        };
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV;
    });

    it("getPosts returns mapped posts/pageInfo and sends expected GraphQL payload", async () => {
        const edges = [
            {
                post: {
                    databaseId: 1,
                    uri: "/events/sunset/",
                    title: "Sunset",
                    date: "2026-05-10T19:00:00",
                },
            },
        ];
        const pageInfo = {
            hasNextPage: true,
            endCursor: "cursor-end",
            hasPreviousPage: false,
            startCursor: "cursor-start",
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createJsonResponse({
                data: {
                    posts: {
                        edges,
                        pageInfo,
                    },
                },
            }),
        );

        const { getPosts } = await import("@/utils/api/wp-actions");
        const result = await getPosts({ tag: "Cloud City", category: "Events" }, 5, { after: "cursor-after" });

        expect(result).toEqual({ posts: edges, pageInfo });
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
        expect(url).toBe("https://example.test/graphql");
        expect(init).toMatchObject({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60 },
        });

        const body = JSON.parse(String(init.body));
        expect(body.variables).toEqual({ uri: "" });
        expect(body.query).toContain("first: 5");
        expect(body.query).toContain("after: \"cursor-after\"");
        expect(body.query).toContain("tagId: \"Cloud City\"");
        expect(body.query).toContain("categoryName: \"Events\"");
    });

    it("getPosts falls back to empty data shape when response data is missing", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(createJsonResponse({ data: {} }));

        const { getPosts } = await import("@/utils/api/wp-actions");
        const result = await getPosts();

        expect(result).toEqual({
            posts: [],
            pageInfo: {
                hasNextPage: false,
                endCursor: null,
                hasPreviousPage: false,
                startCursor: null,
            },
        });
    });

    it("getPosts throws when upstream response is not ok", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(createJsonResponse({}, false));

        const { getPosts } = await import("@/utils/api/wp-actions");

        await expect(getPosts()).rejects.toThrow("Failed to fetch data");
    });

    it("throws a clear configuration error when WORDPRESS_API_URL is missing", async () => {
        process.env = {
            ...ORIGINAL_ENV,
        };

        const { getPosts } = await import("@/utils/api/wp-actions");

        await expect(getPosts()).rejects.toThrow(
            "WORDPRESS_API_URL is not configured. Add it to .env.local or the runtime environment.",
        );
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("getPost returns a single post and passes URI through GraphQL variables", async () => {
        const post = {
            databaseId: 8,
            uri: "/blog/unit-tests/",
            title: "Unit Tests",
            date: "2026-02-25T10:00:00",
            content: "<p>hello</p>",
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createJsonResponse({
                data: {
                    post,
                },
            }),
        );

        const { getPost } = await import("@/utils/api/wp-actions");
        const result = await getPost("/unit-tests");

        expect(result).toEqual(post);

        const [, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
        const body = JSON.parse(String(init.body));
        expect(body.variables).toEqual({ uri: "/unit-tests" });
        expect(body.query).toContain("post(id: \"/unit-tests\", idType: SLUG)");
    });

    it("getPost falls back to empty object when payload has no post", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(createJsonResponse({ data: {} }));

        const { getPost } = await import("@/utils/api/wp-actions");

        await expect(getPost("/missing-post")).resolves.toEqual({});
    });

    // --- New Tests: Event Timezone Sanitization ---

    it("getPosts sanitizes eventDateTime by stripping the '+00:00' suffix to enforce local time", async () => {
        const rawEventDate = "2026-04-18T16:00:00+00:00";
        const expectedCleanDate = "2026-04-18T16:00:00";

        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createJsonResponse({
                data: {
                    posts: {
                        edges: [
                            {
                                post: {
                                    databaseId: 1,
                                    title: "Cloud City: Spring Session",
                                    eventsFields: {
                                        eventDateTime: rawEventDate,
                                    },
                                },
                            },
                        ],
                    },
                },
            }),
        );

        const { getPosts } = await import("@/utils/api/wp-actions");
        const result = await getPosts();

        // Verify the suffix was removed
        expect(result.posts[0].post.eventsFields.eventDateTime).toBe(expectedCleanDate);
    });

    it("getPosts gracefully handles null eventDateTime values without crashing", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createJsonResponse({
                data: {
                    posts: {
                        edges: [
                            {
                                post: {
                                    databaseId: 2,
                                    title: "Past Event",
                                    eventsFields: {
                                        eventDateTime: null,
                                    },
                                },
                            },
                        ],
                    },
                },
            }),
        );

        const { getPosts } = await import("@/utils/api/wp-actions");
        const result = await getPosts();

        // Verify it passes through the null safely
        expect(result.posts[0].post.eventsFields.eventDateTime).toBeNull();
    });

    it("getPost sanitizes eventDateTime by stripping the '+00:00' suffix to enforce local time", async () => {
        const rawEventDate = "2026-04-18T16:00:00+00:00";
        const expectedCleanDate = "2026-04-18T16:00:00";

        (global.fetch as jest.Mock).mockResolvedValueOnce(
            createJsonResponse({
                data: {
                    post: {
                        databaseId: 1,
                        title: "Cloud City: Spring Session",
                        eventsFields: {
                            eventDateTime: rawEventDate,
                        },
                    },
                },
            }),
        );

        const { getPost } = await import("@/utils/api/wp-actions");
        const result = await getPost("/cloud-city");

        // Verify the suffix was removed
        expect(result.eventsFields.eventDateTime).toBe(expectedCleanDate);
    });
});

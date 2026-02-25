import robots from "@/app/robots";

describe("robots", () => {
    it("returns restrictive default rule and explicit allowlist crawlers", () => {
        const result = robots();

        expect(result.rules?.[0]).toEqual({
            userAgent: "*",
            disallow: "/",
        });

        expect(result.rules?.[1]).toMatchObject({
            allow: "/",
        });
        expect(result.rules?.[1]?.userAgent).toEqual(
            expect.arrayContaining(["Googlebot", "bingbot", "yandex", "slurp"]),
        );
    });
});

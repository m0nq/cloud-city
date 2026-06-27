import robots from "@/app/robots";

describe("robots", () => {
    it("returns restrictive default rule and explicit allowlist crawlers", () => {
        const result = robots();
        const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
        const allowlistRule = rules[1];

        expect(rules[0]).toEqual({
            userAgent: "*",
            disallow: "/",
        });

        expect(allowlistRule).toMatchObject({
            allow: "/",
        });
        if (!Array.isArray(allowlistRule?.userAgent)) {
            throw new Error("Allowlist crawler rule should declare a userAgent array");
        }

        expect(allowlistRule.userAgent).toEqual(expect.arrayContaining(["Googlebot", "bingbot", "yandex", "slurp"]));
    });
});

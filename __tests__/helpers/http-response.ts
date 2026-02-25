export const createJsonResponse = <T>(body: T, ok = true): Response => {
    return {
        ok,
        json: jest.fn().mockResolvedValue(body),
    } as unknown as Response;
};

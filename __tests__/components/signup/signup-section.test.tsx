import { act, render, screen, waitFor } from "@testing-library/react";

jest.mock("next/dynamic", () => {
    const React = require("react");
    const preload = jest.fn().mockResolvedValue(undefined);

    const DynamicCallToActionForm = () => React.createElement("div", { "data-testid": "call-to-action-form" });
    DynamicCallToActionForm.preload = preload;

    const dynamic = () => DynamicCallToActionForm;
    dynamic.__dynamicForm = DynamicCallToActionForm;
    dynamic.__preload = preload;

    return {
        __esModule: true,
        default: dynamic,
    };
});

jest.mock("@/components/signup/content", () => ({
    Content: () => <div data-testid="signup-content">Content</div>,
}));

import SignupSection from "@/components/signup/signup-section";

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];
    callback: IntersectionObserverCallback;
    root: Element | Document | null = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
    takeRecords = jest.fn(() => []);

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        MockIntersectionObserver.instances.push(this);
    }

    trigger(isIntersecting: boolean) {
        const entry = [{ isIntersecting } as IntersectionObserverEntry];
        this.callback(entry, this as unknown as IntersectionObserver);
    }
}

describe("SignupSection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        MockIntersectionObserver.instances = [];
        (global as any).IntersectionObserver = MockIntersectionObserver;
    });

    it("renders static signup content and keeps form hidden before visibility trigger", () => {
        render(<SignupSection />);

        expect(screen.getByRole("heading", { name: "Join Us!" })).toBeInTheDocument();
        expect(screen.getByTestId("signup-content")).toBeInTheDocument();
        expect(screen.queryByTestId("call-to-action-form")).not.toBeInTheDocument();
    });

    it("preloads and then renders the dynamic form when observers fire", async () => {
        render(<SignupSection />);
        const dynamicModule = jest.requireMock("next/dynamic");
        const dynamicPreload = dynamicModule.default.__preload as jest.Mock;

        const preloadObserver = MockIntersectionObserver.instances.find(
            observer => observer.rootMargin === "500px",
        );
        const visibilityObserver = MockIntersectionObserver.instances.find(
            observer => observer.rootMargin === "100px",
        );

        expect(preloadObserver).toBeDefined();
        expect(visibilityObserver).toBeDefined();

        act(() => {
            preloadObserver?.trigger(false);
        });
        expect(dynamicPreload).toHaveBeenCalledTimes(1);
        expect(preloadObserver?.disconnect).toHaveBeenCalledTimes(1);

        act(() => {
            visibilityObserver?.trigger(true);
        });

        await waitFor(() => {
            expect(screen.getByTestId("call-to-action-form")).toBeInTheDocument();
        });
        expect(visibilityObserver?.disconnect).toHaveBeenCalledTimes(1);
    });

    it("disconnects both observers on unmount", () => {
        const { unmount } = render(<SignupSection />);

        const preloadObserver = MockIntersectionObserver.instances.find(
            observer => observer.rootMargin === "500px",
        );
        const visibilityObserver = MockIntersectionObserver.instances.find(
            observer => observer.rootMargin === "100px",
        );

        unmount();

        expect(preloadObserver?.disconnect).toHaveBeenCalled();
        expect(visibilityObserver?.disconnect).toHaveBeenCalled();
    });
});

import { render, screen } from "@testing-library/react";

import { Content } from "@/components/signup/content";

describe("Signup Content", () => {
    it("renders privacy and subscription messaging", () => {
        render(<Content />);

        expect(
            screen.getByText(/Sign up to receive emails about future events\./i),
        ).toBeInTheDocument();
        expect(screen.getByText(/You can unsubscribe at anytime\./i)).toBeInTheDocument();
        expect(
            screen.getByText(/We will never share your email or any other information about you/i),
        ).toBeInTheDocument();
    });
});

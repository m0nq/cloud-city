import { render, screen } from "@testing-library/react";

import { TicketLink } from "@/components/events/ticket-link";

describe("TicketLink", () => {
    it("renders nothing when href is missing", () => {
        const { container } = render(<TicketLink href={undefined} />);

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByRole("link", { name: "Tickets" })).not.toBeInTheDocument();
    });

    it("renders nothing when href is blank", () => {
        const { container } = render(<TicketLink href="   " />);

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByRole("link", { name: "Tickets" })).not.toBeInTheDocument();
    });

    it("renders nothing for disallowed URL schemes", () => {
        const { container } = render(<TicketLink href="javascript:alert('xss')" />);

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByRole("link", { name: "Tickets" })).not.toBeInTheDocument();
    });

    it("renders an external link for valid https URLs", () => {
        render(<TicketLink href="https://tickets.example.com/sunrise" />);

        const link = screen.getByRole("link", { name: "Tickets" });

        expect(link).toHaveAttribute("href", "https://tickets.example.com/sunrise");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("supports a custom label", () => {
        render(<TicketLink href="https://tickets.example.com/sunrise" label="Buy passes" />);

        expect(screen.getByRole("link", { name: "Buy passes" })).toBeInTheDocument();
    });
});

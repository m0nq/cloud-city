import clsx from "clsx";
import { IoTicketOutline } from "react-icons/io5";

import styles from "./ticket-link.module.css";

type TicketLinkProps = {
    href?: string;
    label?: string;
    className?: string;
};

const getSafeExternalHref = (href?: string): string | null => {
    if (!href) {
        return null;
    }

    const trimmedHref = href.trim();

    if (!trimmedHref) {
        return null;
    }

    try {
        const url = new URL(trimmedHref);

        return url.protocol === "http:" || url.protocol === "https:" ? trimmedHref : null;
    } catch {
        return null;
    }
};

export const TicketLink = ({ href, label = "Tickets", className }: TicketLinkProps) => {
    const safeHref = getSafeExternalHref(href);

    if (!safeHref) {
        return null;
    }

    return (
        <a
            className={clsx(styles.ticketLink, className)}
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
        >
            <IoTicketOutline aria-hidden="true" focusable="false" className={styles.ticketIcon} />
            <span>{label}</span>
        </a>
    );
};

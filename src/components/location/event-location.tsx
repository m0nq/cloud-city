// Add this import at the top
'use client';
import { PiMapPinLight } from 'react-icons/pi';

import styles from './event-location.module.css';

const unresolvedLocationToken = /\b(?:tba|tbd)\b/i;

const isUnresolvedLocation = (address: string): boolean => {
    const trimmedAddress = address.trim();
    return trimmedAddress === '' || unresolvedLocationToken.test(trimmedAddress);
};

export const EventLocation = ({ address }: { address: string }) => {
    const displayAddress = address.trim() || 'Location TBA';
    const unresolved = isUnresolvedLocation(address);
    const locationContent = (
        <>
            <PiMapPinLight aria-hidden="true" color="currentColor" className={styles.mapPin} />
            <p className={styles.address}>{displayAddress}</p>
        </>
    );

    if (unresolved) {
        return <div className={styles.locationDetailsContainer}>{locationContent}</div>;
    }

    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <a
            className={`${styles.locationDetailsContainer} ${styles.locationLink}`}
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer">
            {locationContent}
        </a>
    );
};

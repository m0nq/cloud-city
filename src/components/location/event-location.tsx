// Add this import at the top
'use client';
import { PiMapPinLight } from 'react-icons/pi';

import styles from './event-location.module.css';

// Create a new client component
export const EventLocation = ({ address }: { address: string }) => {
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <a
            className={`${styles.locationDetailsContainer} cursor-pointer`}
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
        >
            <PiMapPinLight color="#de78ed" className={styles.mapPin} />
            <p className={styles.address}>{address || 'Location TBA'}</p>
        </a>
    );
};

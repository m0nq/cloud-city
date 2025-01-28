// Add this import at the top
'use client';
import { useCallback } from 'react';
import { PiMapPinLight } from 'react-icons/pi';

import styles from './event-location.module.css';

// Create a new client component
export const EventLocation = ({ address }: { address: string }) => {
    const handleClick = useCallback(() => {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }, [address]);

    return (
        <a className={`${styles.locationDetailsContainer} cursor-pointer`}
            onClick={handleClick}
            role="button"
            tabIndex={0}>
            <PiMapPinLight color="#de78ed" className={styles.mapPin} />
            <p className={styles.address}>{address || 'Location TBA'}</p>
        </a>
    );
};


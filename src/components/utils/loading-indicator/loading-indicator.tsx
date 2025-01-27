'use client';
import styles from './loading-indicator.module.css';
import { SiSpinrilla } from 'react-icons/si';

export const LoadingIndicator = () => {
    return (
        <div className={styles.loadingOverlay}>
            <SiSpinrilla className={styles.spinner} />
        </div>
    );
};

'use client';
import styles from './loading-indicator.module.css';
import { ImSpinner2 } from 'react-icons/im';

export const LoadingIndicator = () => {
    return (
        <div className={styles.loadingOverlay}>
            <ImSpinner2 data-testid="loading-spinner" className={styles.spinner} />
        </div>
    );
};

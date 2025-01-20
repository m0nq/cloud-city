import styles from './banner.module.css';

export const Banner = () => {
    return (
        <div className={styles.bannerSection}>
            <div className={styles.lockupContainer}>
                <div className={styles.lockup}>
                    <h2 className={styles.h2}>Hi-Fi Vibes</h2>
                    <h1 className={styles.h1}>Cloud City</h1>
                    <h3 className={styles.h3}>Zero-Proof Parties</h3>
                </div>
            </div>
        </div>
    );
};

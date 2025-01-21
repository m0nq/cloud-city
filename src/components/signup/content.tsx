import styles from './sign-up.module.css';

export const Content = () => {
    return (
        <>
            <div className={styles.contentContainer}>
                <p className={styles.paragraph}>
                    Sign up to receive emails about future events.
                    You can unsubscribe at anytime.
                </p>
                <p className={styles.paragraph}>
                    We will never share your email or any other information about you to
                    anyone – ever.
                </p>
            </div>
        </>
    );
};

import styles from './sustainability.module.css' assert { type: 'css' };

const SustainabilitySection = () => {
    return (
        <section className={styles.sustainabilitySection}>
            <div className={styles.sustainabilityWrapper}>
                <div className={styles.sustainabilityContainer}>
                    <h3 className={`${styles.title} ${styles.content}`}>
                        Sustainability
                    </h3>
                    <p className={styles.content}>
                        Our dedication to sustainability extends beyond our events—it&apos;s at the core of how we
                        operate, including our online presence. Our website is thoughtfully designed to minimize its
                        environmental impact by optimizing energy efficiency and reducing unnecessary data usage.
                    </p>
                    <p className={styles.content}>
                        We leverage eco-conscious hosting solutions and streamline our digital content to create a
                        platform that&apos;s both functional and environmentally responsible. Every choice we make
                        reflects our commitment to protecting the planet while delivering an inspiring, user-friendly
                        experience.
                    </p>
                    <p className={styles.content}>
                        Together, let&apos;s celebrate connection, creativity, and community—mindfully and sustainably.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SustainabilitySection;

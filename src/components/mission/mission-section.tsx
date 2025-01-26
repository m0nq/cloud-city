import { ReactNode } from 'react';

import styles from './mission-section.module.css' assert { type: 'css' };
import { DecorativeRings } from '@components/decorations/decorative-rings';

export const MissionSection = (): ReactNode => {
    return (
        <div className={styles.outerContainer}>
            <section className={styles.missionSection}>
                <div className={styles.missionContainer}>
                    <div className={styles.statementContainer}>
                        <h2 className={styles.h2}>
                            Dedicated to creating inclusive experiences that celebrate all the best things of an
                            alcohol-free lifestyle.
                        </h2>
                    </div>
                    <div className={styles.decorativeRings}>
                        <DecorativeRings rotations={[135, 154, 172]} />
                    </div>
                </div>
            </section>
        </div>
    );
};

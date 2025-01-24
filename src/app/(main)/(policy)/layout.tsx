import { ReactNode } from 'react';

import styles from './policy-layout.module.css';
import { BackButton } from '@components/utils/back-button/back-button';

const PolicyLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.heroWrapper}>
            {children}
            <BackButton>← Back</BackButton>
        </div>
    );
};

export default PolicyLayout;

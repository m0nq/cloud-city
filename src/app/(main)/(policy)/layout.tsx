import { ReactNode } from 'react';

import styles from './policy-layout.module.css';

const PolicyLayout = ({ children }: { children: ReactNode }) => {
    return <div className={styles.heroWrapper}>{children}</div>;
};

export default PolicyLayout;

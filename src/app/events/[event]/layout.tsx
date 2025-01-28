import { ReactNode } from 'react';

import styles from './event.module.css';

const EventLayout = ({ children }: { children: ReactNode }) => {
    return <div className={styles.heroWrapper}>{children}</div>;
};

export default EventLayout;

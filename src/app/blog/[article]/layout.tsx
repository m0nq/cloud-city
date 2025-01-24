import { ReactNode } from 'react';

import styles from './article.module.css';

const ArticleLayout = ({ children }: { children: ReactNode }) => {
    return <div className={styles.heroWrapper}>{children}</div>;
};

export default ArticleLayout;

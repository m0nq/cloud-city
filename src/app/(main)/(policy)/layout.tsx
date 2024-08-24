import { ReactNode } from 'react';

import './policy-layout.styles.css';

const PolicyLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="hero-wrapper">
            {children}
        </div>
    );
};

export default PolicyLayout;

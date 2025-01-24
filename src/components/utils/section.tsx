import { DetailedHTMLProps } from 'react';
import { HTMLAttributes } from 'react';
import { ReactNode } from 'react';

export const Section = ({
    styles = {},
    className = '',
    children,
    ...props
}: {
    styles?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    className?: string;
    children: ReactNode;
}) => {
    return (
        <>
            <section style={styles} className={className} {...props}>
                {children}
            </section>
        </>
    );
};

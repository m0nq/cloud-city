import { DetailedHTMLProps } from 'react';
import { HTMLAttributes } from 'react';
import { ReactNode } from 'react';

export const Section = ({ styles = {}, classes = '', children, ...props }: {
    styles?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    classes?: string,
    children: ReactNode
}) => {
    return (
        <>
            <section style={styles} className={classes} {...props}>{children}</section>
        </>
    );
};

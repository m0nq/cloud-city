import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

type SectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'style'> & {
    styles?: CSSProperties;
    children: ReactNode;
};

export const Section = ({
    styles = {},
    className = '',
    children,
    ...props
}: SectionProps) => (
    <section style={styles} className={className} {...props}>
        {children}
    </section>
);

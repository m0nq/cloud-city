'use client';
import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

import './back-button.styles.css';

export const BackButton = ({ className, children }: PropsWithChildren<{ className?: string; }>) => {
    const router = useRouter();

    return (
        <button className={`back-btn ${className}`} onClick={() => router.back()}>
            {children}
        </button>
    );
};

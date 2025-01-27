'use client';
import { useState } from 'react';
import { useEffect } from 'react';

import styles from './loading-indicator.module.css';
import { SiSpinrilla } from 'react-icons/si';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const LoadingIndicator = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleStop = () => setIsLoading(false);

        window.addEventListener('beforeunload', handleStart);
        window.addEventListener('load', handleStop);

        return () => {
            window.removeEventListener('beforeunload', handleStart);
            window.removeEventListener('load', handleStop);
        };
    }, [pathname, searchParams]);

    if (!isLoading) return null;

    return (
        <>
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    {/*<FaSpinner className={styles.spinner} />*/}
                    <SiSpinrilla className={styles.spinner} />
                </div>
            )}
        </>
    );
};

// export const LoadingIndicator = ({ href, children, ...props }) => {
//     const [, startTransition] = useTransition();
//     const router = useRouter();
//
//     const handleClick = (e: React.MouseEvent) => {
//         e.preventDefault();
//         startTransition(() => {
//             router.push(href);
//         });
//     };
// };

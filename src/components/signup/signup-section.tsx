'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { ComponentType } from 'react';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

import styles from './sign-up.module.css';
import { Content } from '@components/signup/content';

type DynamicComponentWithPreload = ComponentType<unknown> & {
    preload?: () => Promise<void>;
};

const DynamicCallToActionForm: DynamicComponentWithPreload = dynamic(() => import('./call-to-action-form'), {
    loading: () => (
        <div className={styles.formContainer}>
            <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
    ),
    ssr: false
});

const SignupSection = (): ReactNode => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Preload the component when user scrolls near it
        const preloadObserver = new IntersectionObserver(
            () => {
                DynamicCallToActionForm.preload && DynamicCallToActionForm.preload();
                preloadObserver.disconnect();
            },
            {
                rootMargin: '500px'
            }
        );

        // Show the component when it's closer to the viewport
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    visibilityObserver.disconnect();
                }
            },
            {
                rootMargin: '100px'
            }
        );

        if (sectionRef.current) {
            preloadObserver.observe(sectionRef.current);
            visibilityObserver.observe(sectionRef.current);
        }

        return () => {
            preloadObserver.disconnect();
            visibilityObserver.disconnect();
        };
    }, []);

    return (
        <div ref={sectionRef} className={styles.signupSection} id="sign-up">
            <h2 className={styles.h2}>Join Us!</h2>
            <div className={styles.signupContainer}>
                <Content />
                {isVisible && (
                    <Suspense
                        fallback={
                            <div className={styles.formContainer}>
                                <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />
                            </div>
                        }>
                        <DynamicCallToActionForm />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default SignupSection;

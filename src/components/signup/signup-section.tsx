'use client';

import { ReactNode } from 'react';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import styles from './sign-up.module.css';
import { Content } from '@components/signup/content';

const DynamicCallToActionForm = dynamic(() => import('./call-to-action-form'), {
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
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} className={styles.signupSection} id="sign-up">
            <h2 className={styles.h2}>Join Us!</h2>
            <div className={styles.signupContainer}>
                <Content />
                {isVisible && (
                    <Suspense fallback={
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

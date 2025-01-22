'use client';

import { ReactNode } from 'react';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import styles from './sign-up.module.css';
import { Content } from '@components/signup/content';

const DynamicCallToActionForm = dynamic(() => import('./call-to-action-form'),
    {
        loading: () => <div className={styles.formContainer}>
            <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
        </div>,
        ssr: true
    }
);

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
        <div ref={sectionRef} className={styles.signupSection}>
            {/*<div className="map-point">*/}
            {/* google mappoint embed */}
            {/*<iframe*/}
            {/*    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.1194975626195!2d-122.1912779!3d37.8106699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f8771321144b7%3A0x859ee7b9ab6aeea3!2sCalifornia%20Writers%20Circle!5e0!3m2!1sen!2sus!4v1722102459999!5m2!1sen!2sus"*/}
            {/*    width="600" height="450" allowFullScreen loading="lazy"*/}
            {/*    referrerPolicy="no-referrer-when-downgrade" className={styles.iframe}></iframe>*/}
            {/*</div>*/}
            <h2 className={styles.h2}>Join Us!</h2>
            <div className={styles.signupContainer}>
                <Content />
                {isVisible && (
                    <Suspense fallback={
                        <div className={styles.formContainer}>
                            <div className="animate-pulse bg-gray-200 rounded-lg h-[400px] w-full" />
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

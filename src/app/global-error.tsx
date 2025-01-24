'use client';
import { useEffect } from 'react';
import { Mulish } from 'next/font/google';
import type { Metadata } from 'next';

const mulish = Mulish({
    subsets: ['latin'],
    variable: '--font-family-mulish'
});

export const metadata: Metadata = {
    title: 'Cloud City Festival',
    description: 'A music festival for the Cloud City community.'
};

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html lang="en" className={`${mulish.variable}`}>
            <body>
                <div>
                    <h2>Something went wrong!</h2>
                    <button onClick={() => reset()}>↩ Whoa... Something weird happened. Try again?</button>
                </div>
            </body>
        </html>
    );
};

export default GlobalError;

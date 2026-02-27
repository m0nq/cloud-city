import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';
import styles from './body.module.css';
import { montserratAlt1 } from '@components/utils/fonts';
import { montserrat } from '@components/utils/fonts';
import { openSans } from '@components/utils/fonts';
import Navbar from '@components/navbar/navbar';
import { Footer } from '@components/footer/footer';

export const viewport: Viewport = {
    themeColor: '#1f1b21'
};

export const metadata: Metadata = {
    // title: 'City Center',
    // description: 'The space which Cloud City conducts bizness!'
    title: 'Cloud City',
    description: 'The Bay Area no-alcohol music festival'
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>): ReactNode => (
    <html lang="en" suppressHydrationWarning>
        <body style={{ backgroundColor: '#1f1b21' }}
            className={`${montserrat.variable} ${montserratAlt1.variable} ${openSans.variable} ${styles.body}`}
            suppressHydrationWarning>
            <Navbar />
            {children}
            <Footer />
            <GoogleAnalytics gaId={process.env.GA4_MEASUREMENT_ID!} />
        </body>
    </html>
);

export default RootLayout;

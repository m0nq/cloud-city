import { ReactElement } from 'react';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Viewport } from 'next';
import DOMPurify from 'isomorphic-dompurify';

import './globals.css';
import { Footer } from '@components/footer/footer';
import { montserratAlt1 } from '@components/utils/fonts';
import { mulish } from '@components/utils/fonts';

export const viewport: Viewport = {
    themeColor: '#4265a7'
};

export const metadata: Metadata = {
    title: 'Cloud City Festival',
    description: 'A music festival for the Cloud City community.'
};

DOMPurify.addHook('afterSanitizeAttributes', node => {
    // safely set all elements owning target to target=_blank
    // https://developer.chrome.com/docs/lighthouse/best-practices/external-anchors-use-rel-noopener/
    if ('target' in node) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener');
    }
});

const RootLayout = async ({ children }: Readonly<{ children: ReactNode; }>): Promise<ReactElement> => (
    <html lang="en" className={`${montserratAlt1.variable} ${mulish.variable}`}>
        <body>
            {/* NavBar will be on every page. */}
            {children}
            <Footer />
        </body>
    </html>
);

export default RootLayout;

import { ReactElement } from 'react';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Viewport } from 'next';
import DOMPurify from 'isomorphic-dompurify';

import './globals.css';
import { montserratAlt1 } from '@components/utils/fonts';
import { nunitoSans } from '@components/utils/fonts';
import { montserrat } from '@components/utils/fonts';

export const viewport: Viewport = {
    themeColor: '#4265a7'
};

export const metadata: Metadata = {
    title: 'City Center',
    description: 'The space which Cloud City conducts bizness!'
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
    <html lang="en">
        <body className={`${montserratAlt1.variable} ${montserrat.variable} ${nunitoSans.variable}`}>
            {children}
        </body>
    </html>
);

export default RootLayout;

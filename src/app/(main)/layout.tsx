'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { Footer } from '@components/footer/footer';

const ParticlesWrapper = dynamic(() => import('@components/decorations/particles/particles-wrapper'), { 
    ssr: false 
});

const MainLayout = ({ children }: Readonly<{ children: ReactNode; }>): ReactNode => (
    <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full">
            <ParticlesWrapper />
        </div>
        <div className="relative z-10">
            {children}
            <Footer />
        </div>
    </div>
);

export default MainLayout;

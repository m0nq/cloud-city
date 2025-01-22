'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(() => import('./particles-background'), {
    ssr: false
});

const ParticlesWrapper = (): ReactNode => {
    return (
        <div className="min-h-screen w-full">
            <ParticlesBackground />
        </div>
    );
};

export default ParticlesWrapper;

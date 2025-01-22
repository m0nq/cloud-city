'use client';

import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(() => import('./particles-background'), {
    ssr: false
});

const ParticlesWrapper = (): ReactElement => {
    return (
        <div className="min-h-screen w-full">
            <ParticlesBackground />
        </div>
    );
};

export default ParticlesWrapper;
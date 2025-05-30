'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ParticlesWrapper = dynamic(() => import('@components/decorations/particles/particles-wrapper'), {
    ssr: false
});

const MainLayout = ({ children }: Readonly<{ children: ReactNode }>): ReactNode => {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <div className="relative min-h-screen">
            {isHomePage && (
                <div className="absolute inset-0 w-full">
                    <ParticlesWrapper />
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;

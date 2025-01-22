'use client';

import { ReactElement } from 'react';
import dynamic from 'next/dynamic';

import { Banner } from '@components/banner/banner';
import MissionSection from '@components/mission/mission-section';
import SustainabilitySection from '@components/sustainability/sustainability-section';

// Client components that need dynamic importing
const SignupSection = dynamic(() => import('@components/signup/signup-section'), {
    ssr: false,
    loading: () => (
        <div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
        </div>
    )
});

export default function Home(): ReactElement {
    return (
        <div className="relative z-0">
            <Banner />
            <SignupSection />
            {/* Server Components */}
            <MissionSection />
            <SustainabilitySection />
        </div>
    );
}

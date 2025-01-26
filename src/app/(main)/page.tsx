'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { Banner } from '@components/banner/banner';
import { MissionSection } from '@components/mission/mission-section';
import { SustainabilitySection } from '@components/sustainability/sustainability-section';
import { EventsSection } from '@components/events/events-section';

// Client components that need dynamic importing
const SignupSection = dynamic(() => import('@components/signup/signup-section'), {
    ssr: false,
    loading: () => (
        <div>
            <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
    )
});

const Home = (): ReactNode => (
    <div className="relative z-0">
        <Banner />
        <SignupSection />
        {/* Server Components */}
        <MissionSection />
        <EventsSection />
        <SustainabilitySection />
    </div>
);

export default Home;

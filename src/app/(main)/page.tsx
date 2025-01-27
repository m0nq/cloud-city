'use client';
import { ReactNode } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { Banner } from '@components/banner/banner';
// import { EventsSection } from '@components/events/events-section';

const SignupSection = dynamic(() => import('@components/signup/signup-section'), {
    ssr: false
});
const MissionSection = dynamic(() => import('@components/mission/mission-section'));
const EventsSection = dynamic(() => import('@components/events/events-section'), {
    ssr: false
});
const SustainabilitySection = dynamic(() => import('@components/sustainability/sustainability-section'));

const Home = (): ReactNode => (
    <div className="relative z-0">
        <Banner />
        <Suspense fallback={<div className="w-full h-[500px] animate-pulse bg-gray-800/20 rounded-lg" />}>
            <SignupSection />
        </Suspense>
        <Suspense fallback={<div className="w-full h-[300px] animate-pulse bg-gray-800/20 rounded-lg" />}>
            <MissionSection />
        </Suspense>
        <Suspense fallback={<div className="w-full h-[300px] animate-pulse bg-gray-800/20 rounded-lg" />}>
            <EventsSection />
        </Suspense>
        <Suspense fallback={<div className="w-full h-[400px] animate-pulse bg-gray-800/20 rounded-lg" />}>
            <SustainabilitySection />
        </Suspense>
    </div>
);

export default Home;

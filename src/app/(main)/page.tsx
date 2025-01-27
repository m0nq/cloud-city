'use client';
import { ReactNode } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { Banner } from '@components/banner/banner';
import { EventsSection } from '@components/events/events-section';

const MissionSection = dynamic(() => import('@components/mission/mission-section'));
const SustainabilitySection = dynamic(() => import('@components/sustainability/sustainability-section'));
const SignupSection = dynamic(() => import('@components/signup/signup-section'), {
    ssr: false
});

const Home = (): ReactNode => (
    <div className="relative z-0">
        <Suspense fallback={<div className="w-full h-[400px] animate-pulse bg-gray-800/20 rounded-lg" />}>
            <Banner />
        </Suspense>
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

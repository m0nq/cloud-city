import { ReactElement } from 'react';

import { Banner } from '@components/banner/banner';
import dynamic from 'next/dynamic';

const SignupSection = dynamic(() => import('@components/signup/signup-section'),
    {
        loading: () => (
            <div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
            </div>
        ),
        ssr: true
    }
);
const MissionSection = dynamic(() => import('@components/mission/mission-section'),
    {
        loading: () => (
            <div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
            </div>
        ),
        ssr: true
    }
);
const SustainabilitySection = dynamic(() => import('@components/sustainability/sustainability-section'),
    {
        loading: () => (
            <div>
                <div className="animate-pulse bg-gray-200 rounded-lg h-full w-full" />
            </div>
        ),
        ssr: true
    }
);

const Home = (): ReactElement => {
    return (
        <>
            <Banner />
            <SignupSection />
            <MissionSection />
            <SustainabilitySection />
        </>
    );
};

export default Home;

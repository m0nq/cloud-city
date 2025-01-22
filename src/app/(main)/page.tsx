import { ReactElement } from 'react';

import { Banner } from '@components/banner/banner';
import { SignupSection } from '@components/signup/signup-section';
import { MissionSection } from '@components/mission/mission-section';

const Home = (): ReactElement => {
    return (
        <>
            <Banner />
            <SignupSection />
            <MissionSection />
        </>
    );
};

export default Home;

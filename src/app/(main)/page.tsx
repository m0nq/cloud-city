import { ReactElement } from 'react';

import { Banner } from '@components/banner/banner';
import { SignupSection } from '@components/signup/signup-section';

const Home = (): ReactElement => {
    return (
        <>
            <Banner />
            <SignupSection />
        </>
    );
};

export default Home;

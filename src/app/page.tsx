import { ReactElement } from 'react';

import { Banner } from '@components/banner/banner';
import { Main } from '@components/main/main';

const Home = async (): Promise<ReactElement> => {
    return (
        <>
            <Banner />
            <Main />
        </>
    );
};

export default Home;

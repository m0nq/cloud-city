import { ReactElement } from 'react';

import './main.styles.css';
import { Banner } from '@components/banner/banner';
import { Main } from '@components/main/main';

const Home = (): ReactElement => {
    return (
        <>
            <Banner />
            <Main />
        </>
    );
};

export default Home;

import { Footer } from '@components/footer/footer';
import { ReactNode } from 'react';
import { ReactElement } from 'react';

const MainLayout = async ({ children }: Readonly<{ children: ReactNode; }>): Promise<ReactElement> => (
    <>
        {/* NavBar will be on every page. */}
        {children}
        <Footer />
    </>
);

export default MainLayout;

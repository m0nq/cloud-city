import { ReactNode } from 'react';

import { Footer } from '@components/footer/footer';

const MainLayout = async ({ children }: Readonly<{ children: ReactNode; }>): Promise<ReactNode> => (
    <>
        {/* NavBar will be on every page. */}
        {children}
        <Footer />
    </>
);

export default MainLayout;

import { ReactElement } from 'react';
import { ReactNode } from 'react';

const CityCenterLayout = async ({ children }: Readonly<{ children: ReactNode; }>): Promise<ReactElement> => (
    <>
        {children}
    </>
);

export default CityCenterLayout;

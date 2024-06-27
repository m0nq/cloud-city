import './main.styles.css';
import { Content } from '@components/sign-up/content';
import { Form } from '@components/sign-up/form';

export const Main = () => {
    return (
        <>
            <div className="map-point">
                {/* google mappoint embed */}
            </div>
            <main>
                <Content />
                <Form />
            </main>
        </>
    )
        ;
};

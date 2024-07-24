import './main.styles.css';
import { Content } from '@components/sign-up/content';
import { Form } from '@components/sign-up/form';

export const Main = () => {

    return (
        <>
            <div className="map-point">
                {/* google mappoint embed */}
                <iframe width="600" height="450" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d50460.76348704851!2d-122.36299284179685!3d37.771341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDQ2JzE2LjgiTiAxMjLCsDE3JzM0LjYiVw!5e0!3m2!1sen!2sus!4v1721845044644!5m2!1sen!2sus">
                </iframe>
            </div>
            <main>
                <Content />
                <Form />
            </main>
        </>
    )
        ;
};

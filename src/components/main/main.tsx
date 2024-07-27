import './main.styles.css';
import { Content } from '@components/sign-up/content';
import { Form } from '@components/sign-up/form';

export const Main = () => {

    return (
        <>
            <div className="map-point">
                {/* google mappoint embed */}
                <iframe height="450" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1186.2612020360762!2d-122.29442136617526!3d37.772018467830186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDQ2JzE2LjgiTiAxMjLCsDE3JzM0LjYiVw!5e0!3m2!1sen!2sus!4v1722057364851!5m2!1sen!2sus">
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

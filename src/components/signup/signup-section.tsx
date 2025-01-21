import { ReactNode } from 'react';

import styles from './sign-up.module.css';
import { Content } from '@components/signup/content';
import { CallToActionForm } from '@components/signup/call-to-action-form';

export const SignupSection = (): ReactNode => {

    return (
        <>
            {/*<div className="map-point">*/}
            {/* google mappoint embed */}
            {/*<iframe*/}
            {/*    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.1194975626195!2d-122.1912779!3d37.8106699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f8771321144b7%3A0x859ee7b9ab6aeea3!2sCalifornia%20Writers%20Circle!5e0!3m2!1sen!2sus!4v1722102459999!5m2!1sen!2sus"*/}
            {/*    width="600" height="450" allowFullScreen loading="lazy"*/}
            {/*    referrerPolicy="no-referrer-when-downgrade" className={styles.iframe}></iframe>*/}
            {/*</div>*/}
            <div className={styles.signupSection}>
                <h2 className={styles.h2}>Join Us!</h2>
                <div className={styles.signupContainer}>
                    <Content />
                    <CallToActionForm />
                </div>
            </div>
        </>
    );
};

// src/utils/api/mailer-actions.ts
'use server';

import { FormValues } from '@data-types/types';
import { createMailerLiteNewsletterSignupProvider } from '@utils/api/newsletter-signup-provider';

const newsletterSignupProvider = createMailerLiteNewsletterSignupProvider();

export const subscribeMember = async (values: FormValues) => {
    try {
        await newsletterSignupProvider.subscribe(values);
        return { ok: true };
    } catch (error: any) {
        console.log('Error ->', error.message);
        return { ok: false };
    }
};

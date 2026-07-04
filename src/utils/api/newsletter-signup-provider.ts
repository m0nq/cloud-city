// src/utils/api/newsletter-signup-provider.ts
import MailerLite, { CreateOrUpdateSubscriberParams } from '@mailerlite/mailerlite-nodejs';

import { FormValues } from '@data-types/types';

const MAILERLITE_SIGNUP_GROUP_ID = '125237533318579422';

export type NewsletterSignupProvider = {
    subscribe: (values: FormValues) => Promise<void>;
};

export const createMailerLiteNewsletterSignupProvider = (): NewsletterSignupProvider => {
    const mailerlite = new MailerLite({
        api_key: process.env.CC_API_KEY || ''
    });

    return {
        subscribe: async ({ firstName, lastName, email }) => {
            const params = {
                email: email.trim(),
                fields: {
                    name: firstName.trim(),
                    last_name: lastName.trim()
                },
                groups: [MAILERLITE_SIGNUP_GROUP_ID],
                status: 'unconfirmed'
            } as CreateOrUpdateSubscriberParams;

            await mailerlite.subscribers.createOrUpdate(params);
        }
    };
};

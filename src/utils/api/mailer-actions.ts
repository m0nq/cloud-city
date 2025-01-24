'use server';
import MailerLite from '@mailerlite/mailerlite-nodejs';
import { CreateOrUpdateSubscriberParams } from '@mailerlite/mailerlite-nodejs';

import { FormValues } from '@data-types/types';

const mailerlite = new MailerLite({
    api_key: process.env.CC_API_KEY || ''
});

export const subscribeMember = async ({ firstName, lastName, email }: FormValues) => {
    const params = {
        email: email.trim(),
        fields: {
            name: firstName.trim(),
            last_name: lastName.trim()
        },
        groups: ['125237533318579422'],
        status: 'unconfirmed' // possible statuses: active, unsubscribed, unconfirmed, bounced, or junk.
    } as CreateOrUpdateSubscriberParams;

    try {
        await mailerlite.subscribers.createOrUpdate(params);
        return { ok: true };
    } catch (error: any) {
        console.log('Error ->', error.message);
        return { ok: false };
    }
};

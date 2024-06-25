import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

export const POST = async (req: Request): Promise<NextResponse> => {
    mailchimp.setConfig({
        apiKey: process.env.CC_MAILCHIMP_API_KEY,
        server: process.env.CC_SERVER_PREFIX
    });

    try {
        const response = await mailchimp.ping.get();
        console.log('response ->', response);
        // revalidatePath('/');
        return NextResponse.json(
            { success: true, errors: null, response: {} },
            { status: 200 }
        );
    } catch (e: any) {
        console.log('Error ->', e);
        return NextResponse.json(
            { success: false, errors: e.message, response: {} },
            { status: 500 }
        );
    }
};

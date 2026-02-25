// app/api/webhooks/luma/route.ts
import { NextRequest, NextResponse } from "next/server";
import MailerLite from "@mailerlite/mailerlite-nodejs";

// Initialize MailerLite safely
const mailerLite = new MailerLite({
    api_key: process.env.MAILERLITE_API_KEY || "test_key",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 1. Extract the data (Schema hypothesis based on our test)
        const email = body?.payload?.guest?.email;
        const name = body?.payload?.guest?.name;

        // We will need to verify this exact key once we inspect the live Luma payload
        const optedIn = body?.payload?.answers?.["Join our newsletter"] === "true";

        // 2. Validate essential data
        if (!email) {
            return NextResponse.json({ error: "Missing email in payload" }, { status: 400 });
        }

        // 3. Process based on consent
        if (optedIn) {
            console.log(`[Luma Webhook] Opt-in confirmed for ${email}. Routing to MailerLite.`);

            await mailerLite.subscribers.createOrUpdate({
                email: email,
                fields: {
                    name: name || "",
                },
                // Optional: Assign to a specific group ID for the April 18th event
                // groups: ['YOUR_MAILERLITE_GROUP_ID']
            });
        } else {
            console.log(`[Luma Webhook] No opt-in for ${email}. Bypassing MailerLite.`);
        }

        // Always return 200 to Luma so they don't retry the webhook
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("[Luma Webhook Error]:", error);
        // Return 500 so Luma knows to retry if it was a network/server failure
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

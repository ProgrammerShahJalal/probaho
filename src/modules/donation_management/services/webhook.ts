import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import Stripe from 'stripe';
import { responseObject } from '../../../common_types/object';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: process.env.STRIPE_API_VERSION as any,
});

async function webhook(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    // Handle Stripe Webhook
    async function handleStripeWebhook(req: FastifyRequest, res: FastifyReply) {
        const sig = req.headers['stripe-signature'] as string;

        if (!sig) {
            return res.status(400).send({
                success: false,
                message: 'Missing Stripe signature header.',
            });
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body as Buffer, // Raw request body as a buffer
                sig,
                process.env.STRIPE_WEBHOOK_SECRET as string,
            );
        } catch (err: any) {
            console.error(
                'Webhook signature verification failed:',
                err.message,
            );
            return res.status(400).send({
                success: false,
                message: 'Webhook signature verification failed.',
            });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('Payment successful:', session);
                // Process the successful payment (e.g., save details to the database)
                break;
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('Payment intent succeeded:', paymentIntent);
                break;
            default:
                console.warn(`Unhandled event type: ${event.type}`);
        }

        return res
            .status(200)
            .send({ success: true, message: 'Webhook received.' });
    }

    // Return a valid responseObject for the webhook function
    return {
        status: 200,
        message: 'Webhook handler initialized.',
        data: {
            // Add any additional data you want to return
        },
    };
}

export default webhook;

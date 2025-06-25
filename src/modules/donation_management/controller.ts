import Stripe from 'stripe';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import storeService from './services/store';
import { controllerHandler } from '../../helpers/controller_handler';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: process.env.STRIPE_API_VERSION as any,
});

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    return {
        session: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res),

        // Handle Stripe Webhook
        webhook: async function handleStripeWebhook(
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            const sig = req?.headers['stripe-signature'] as string;

            if (process.env.NODE_ENV === 'development') {
                console.log(
                    'Skipping signature verification in development mode',
                );
                return res.status(200).send({ success: true });
            }

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
                    'whsec_SqL0lqb4ZCMI6wfrFy2g6a0hmAcxITjn' as string,
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
                    const session = event.data
                        .object as Stripe.Checkout.Session;
                    console.log('Payment successful:', session);
                    // Process the successful payment (e.g., save details to the database)
                    break;
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data
                        .object as Stripe.PaymentIntent;
                    console.log('Payment intent succeeded:', paymentIntent);
                    break;
                default:
                    console.warn(`Unhandled event type: ${event.type}`);
            }

            return res
                .status(200)
                .send({ success: true, message: 'Webhook received.' });
        },
    };
}

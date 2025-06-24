'use strict';
import Stripe from 'stripe';
import {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
} from 'fastify';
import allService from './services/all';
import detailsService from './services/details';
import softDeleteService from './services/soft_delete';
import storeService from './services/store';
import updateService from './services/update';
import restoreService from './services/restore';
import destroyService from './services/destroy';
import importService from './services/import';
import paymentRefundsService from './services/payment_refunds';
import { handleFailedPayment, handleSuccessfulPayment } from './services/webhook';
import { controllerHandler } from '../../helpers/controller_handler';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: process.env.STRIPE_API_VERSION as any,
});

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    return {
        all: async (req: FastifyRequest, res: FastifyReply) => handle(allService)(req, res),
        find: async (req: FastifyRequest, res: FastifyReply) => handle(detailsService)(req, res),
        session: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res), // Assuming storeService is for session
        // Handle Stripe Webhook
        webhook: async function handleStripeWebhook(
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            console.log('=== WEBHOOK RECEIVED ===');
            console.log('Headers:', req.headers);
            console.log('Body type:', typeof req.body);

            const sig = req?.headers['stripe-signature'] as string;
            let event: Stripe.Event;

            if (process.env.NODE_ENV === 'development') {
                console.log('Development mode: Processing webhook without signature verification');
                try {
                    // In development, the body should already be parsed
                    event = req.body as Stripe.Event;
                    console.log('Event type:', event.type);
                    console.log('Event data object:', JSON.stringify(event.data.object, null, 2));
                } catch (err: any) {
                    console.error('Failed to parse webhook body in development:', err.message);
                    return res.status(400).send({
                        success: false,
                        message: 'Invalid webhook body format.',
                    });
                }
            } else {
                // Production: Verify signature
                if (!sig) {
                    return res.status(400).send({
                        success: false,
                        message: 'Missing Stripe signature header.',
                    });
                }

                try {
                    event = stripe.webhooks.constructEvent(
                        req.body as Buffer,
                        sig,
                        process.env.STRIPE_WEBHOOK_SECRET as string,
                    );
                } catch (err: any) {
                    console.error('Webhook signature verification failed:', err.message);
                    return res.status(400).send({
                        success: false,
                        message: 'Webhook signature verification failed.',
                    });
                }
            }

            try {
                console.log('Processing event type:', event.type);

                // Handle the event
                switch (event.type) {
                    case 'checkout.session.completed':
                        const session = event.data.object as Stripe.Checkout.Session;
                        console.log('=== PROCESSING SUCCESSFUL PAYMENT ===');
                        console.log('Session ID:', session.id);
                        console.log('Payment Status:', session.payment_status);
                        console.log('Session Status:', session.status);
                        console.log('Metadata:', JSON.stringify(session.metadata, null, 2));

                        // Enhanced condition checking
                        const hasMetadata = session.metadata && Object.keys(session.metadata).length > 0;
                        const isPaid = session.payment_status === 'paid';
                        const isComplete = session.status === 'complete';

                        console.log('Condition checks:', {
                            hasMetadata,
                            isPaid,
                            isComplete,
                            metadataKeys: session.metadata ? Object.keys(session.metadata) : [],
                            shouldProcess: hasMetadata && (isPaid || isComplete)
                        });

                        if (hasMetadata && (isPaid || isComplete)) {
                            console.log('✅ Conditions met, calling handleSuccessfulPayment...');

                            // Validate metadata structure
                            const requiredFields = ['user_id', 'event_id', 'event_enrollment_id', 'trx_id'];
                            const missingFields = requiredFields.filter(field => !session.metadata![field]);

                            if (missingFields.length > 0) {
                                console.error('❌ Missing required metadata fields:', missingFields);
                                throw new Error(`Missing required metadata fields: ${missingFields.join(', ')}`);
                            }

                            try {
                                await handleSuccessfulPayment(
                                    fastify,
                                    session.id,
                                    session.metadata as any
                                );
                                console.log('✅ Payment handling completed successfully');
                            } catch (paymentError) {
                                console.error('❌ Error in handleSuccessfulPayment:', paymentError);
                                throw paymentError;
                            }
                        } else {
                            console.log('⚠️ Conditions not met for payment processing:', {
                                hasMetadata,
                                paymentStatus: session.payment_status,
                                sessionStatus: session.status,
                                metadata: session.metadata
                            });
                        }
                        break;

                    case 'checkout.session.expired':
                        const expiredSession = event.data.object as Stripe.Checkout.Session;
                        console.log('Payment session expired:', expiredSession.id);

                        await handleFailedPayment(
                            fastify,
                            expiredSession.id,
                        );
                        break;

                    case 'checkout.session.async_payment_failed':
                        const failedSession = event.data.object as Stripe.Checkout.Session;
                        console.log('Payment failed:', failedSession.id);

                        await handleFailedPayment(
                            fastify,
                            failedSession.id,
                        );
                        break;

                    case 'payment_intent.payment_failed':
                        const failedPayment = event.data.object as Stripe.PaymentIntent;
                        console.log('Payment intent failed:', failedPayment.id);
                        break;

                    default:
                        console.warn(`Unhandled event type: ${event.type}`);
                }

                console.log('=== WEBHOOK PROCESSING COMPLETED ===');
                return res.status(200).send({
                    success: true,
                    message: 'Webhook processed successfully'
                });

            } catch (error: any) {
                console.error('❌ Error processing webhook:', error);
                console.error('Error stack:', error.stack);
                return res.status(500).send({
                    success: false,
                    message: 'Error processing webhook',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        },
        store: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(updateService)(req, res),
        payment_refunds: async (req: FastifyRequest, res: FastifyReply) => handle(paymentRefundsService)(req, res),
        soft_delete: async (req: FastifyRequest, res: FastifyReply) => handle(softDeleteService)(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(restoreService)(req, res),
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(destroyService)(req, res),
        import: async (req: FastifyRequest, res: FastifyReply) => handle(importService)(req, res),
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

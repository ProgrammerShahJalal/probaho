import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';
import moment from 'moment';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';
import Stripe from 'stripe';

/** validation rules */

async function validate(req: Request) {
    let field = '';
    let fields = [
        'event_id',
        'user_id',
        'date',
        'amount',
        'trx_id',

    ];

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        await body(field)
            .not()
            .isEmpty()
            .withMessage(
                `the <b>${field.replaceAll('_', ' ')}</b> field is required`,
            )
            .run(req);

    }

    let result = await validationResult(req);

    return result;
}

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: process.env.STRIPE_API_VERSION as any,
});

interface PaymentRequest {
    event_id: number;
    user_id: number;
    event_enrollment_id: number;
    date: string;
    amount: string;
    trx_id: string;
}

interface Payment {
    event_id: number;
    user_id: number;
    event_enrollment_id: number,
    date: string;
    amount: number;
    trx_id: string;
    session_id: string;
}

async function store(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** initializations */
    let models = Models.get();
    let body = req.body as anyObject;
    let data = new models[modelName]();


    // Helper to parse or return original value
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    // Parse the whole body's fields in one go
    Object.keys(body).forEach(key => {
        body[key] = parseField(body[key]);
    });

    // Helper to get clean value
    const getValue = (val: any) => Array.isArray(val) ? val[0] : val;

    const { user_id, event_id, trx_id, amount } =
        body as PaymentRequest;

    /** store data into database */
    try {
        // Check if enrollment exists
        let existingEnrollment = await models.EventEnrollmentsModel.findOne({
            where: {
                event_id: event_id,
                user_id: user_id,
            },
        });

        let event_enrollment_id;

        if (existingEnrollment) {
            event_enrollment_id = existingEnrollment.id;
        } else {
            // Create new enrollment with PENDING status initially
            const newEnrollment = await models.EventEnrollmentsModel.create({
                event_id: event_id,
                user_id: user_id,
                date: moment().format('YYYY-MM-DD'),
                is_paid: '0', // Set to unpaid initially
                status: 'pending', // Set to pending initially
            });
            event_enrollment_id = newEnrollment.id;
        }

        const amountInCents = Math.round(parseFloat(amount) * 100);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `User ID ${user_id}`,
                            description: `Event ID: ${event_id}, Event Enrollment ID: ${event_enrollment_id}, Trx ID: ${trx_id}`,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?user_id=${encodeURIComponent(user_id)}&event_id=${encodeURIComponent(event_id)}&event_enrollment_id=${event_enrollment_id ?? ''}&trx_id=${encodeURIComponent(trx_id)}&amount=${amount}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
            metadata: {
                user_id: String(getValue(body.user_id)),
                event_id: String(getValue(body.event_id)),
                event_enrollment_id: String(event_enrollment_id),
                trx_id: String(body.trx_id),
            },
        } as Stripe.Checkout.SessionCreateParams);
        // console.log('Stripe Session:', session);


        // Insert payment record with FAILED status initially
        let inputs: InferCreationAttributes<typeof data> = {
            event_id: getValue(body.event_id),
            user_id: getValue(body.user_id),
            date: body.date,
            amount: body.amount,
            trx_id: body.trx_id,
            media: body.media,
            session_id: session?.id,
            is_refunded: false,
            status: 'failed', // Add status field for payment record
        };

        data.set(inputs);
        await data.save();

        const event_payment_id = data.id;

        // Update payment with event_enrollment_id and event_payment_id
        await data.update({
            event_enrollment_id: event_enrollment_id,
            event_payment_id: event_payment_id,
        });

        // DON'T update enrollment status here - let webhook handle it
        // The enrollment remains pending until payment is confirmed

        return response(201, 'checkout session created', {
            data: {
                ...data.toJSON(),
                checkout_url: session.url
            },
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
        // throw error;
    }
}

export default store;

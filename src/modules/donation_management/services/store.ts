import db from '../models/db';
import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, json } from 'sequelize';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';
import Stripe from 'stripe';
import axios from 'axios';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = ['name', 'email', 'phone', 'occupation', 'amount'];

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

interface DonationRequest {
    name: string;
    email: string;
    amount: string;
    phone: string;
    occupation: string;
}

interface Donation {
    name: string;
    email: string;
    phone: string;
    occupation: string;
    amount: number;
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

    const { name, email, phone, occupation, amount } =
        req.body as DonationRequest;

    try {
        const amountInCents = Math.round(parseFloat(amount) * 100);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Donation by ${name}`,
                            description: `Occupation: ${occupation}, Phone: ${phone}`,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/donate/success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&occupation=${encodeURIComponent(occupation)}&amount=${amountInCents / 100}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate/cancel`,
            metadata: {
                name,
                email,
                phone,
                occupation,
            },
        } as Stripe.Checkout.SessionCreateParams);
        // console.log('Stripe Session:', session);
        // Save session data to the database
        // await store(fastify, req);
        let inputs: InferCreationAttributes<typeof data> = {
            name: body.name,
            email: body.email,
            phone: body.phone,
            occupation: body.occupation,
            amount: body.amount,
            session_id: session?.id,
        };
        await data.update(inputs);
        await data.save();

        if (!data.id) {
            throw new Error('Failed to save donation data.');
        }

        // Webhook logic
        const webhookURL =
            process.env.WEBHOOK_URL ||
            'http://127.0.0.1:5011/api/v1/donations/webhook';
        const webhookPayload = {
            event: 'data.created',
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                occupation: data.occupation,
                amount: data.amount,
            },
        };

        // Call the webhook
        await axios.post(webhookURL, webhookPayload);

        return response(201, 'data created', {
            name,
            email,
            phone,
            occupation,
            amount,
            sessionId: session.id,
        });
    } catch (error: any) {
        console.error('Error creating donation:', error);
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;

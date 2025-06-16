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

/** validation rules */

async function validate(req: Request) {
    let field = '';
    let fields = [
        'event_id',
        'user_id',
        'event_enrollment_id',
        'event_payment_id',
        'trx_id',
        'amount',
        'media',

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

    // Parse the whole body’s fields in one go
    Object.keys(body).forEach(key => {
        body[key] = parseField(body[key]);
    });

    // Helper to get clean value
    const getValue = (val: any) => Array.isArray(val) ? val[0] : val;

    // Check if refund request already exists
    let existingRefund = await models[modelName].findOne({
        where: {
            event_id: getValue(body.event_id),
            user_id: getValue(body.user_id),
            event_enrollment_id: getValue( body.event_enrollment_id),
            event_payment_id: getValue(body.event_payment_id),
            trx_id: body.trx_id,
        },
    });

    if (existingRefund) {
        return response(409, 'Refund request already exists.', { existingRefund });
    }

    let inputs: InferCreationAttributes<typeof data> = {

        event_id: getValue(body.event_id),
        user_id: getValue(body.user_id),
        event_enrollment_id: getValue( body.event_enrollment_id),
        event_payment_id: getValue(body.event_payment_id),
        date: body.date || moment().toISOString(),
        amount: body.amount,
        trx_id: body.trx_id,
        media: body.media,
    };


    /** store data into database */
    try {
        (await data.update(inputs)).save();

        return response(201, 'Refund request send successfully.', {
            data,
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
        // throw error;
    }
}

export default store;

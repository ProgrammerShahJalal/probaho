import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';
import moment from 'moment/moment';

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
        'date',
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

    // Parse fields that might be stringified
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    body.event_id = parseField(body.event_id);
    body.user_id = parseField(body.user_id);

    let data = new models[modelName]();

    let inputs: InferCreationAttributes<typeof data> = {
        event_id: body.event_id || body.event_id?.[0],
        user_id: body.user_id || body.user_id?.[0],
        date: body.date,
        is_paid: body.is_paid || '0',
        status: body.status || 'pending',
    };

    try {
        /** Check if user is already enrolled in the event */
        let existingEnrollment = await models[modelName].findOne({
            where: {
                event_id: body.event_id || body.event_id?.[0],
                user_id: body.user_id || body.user_id?.[0],
            },
        });

        if (existingEnrollment) {
            if(existingEnrollment.status === 'accepted' && existingEnrollment.is_paid === '1'){
                return response(422, 'User is already enrolled in this event', {
                data: [{
                    path: 'user_id',
                    msg: 'User is already enrolled in this event'
                }]
            });
            }
        }
        /** store data into database */
        (await data.update(inputs)).save();

        return response(201, 'data created', {
            data,
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
        // throw error;
    }
}

export default store;

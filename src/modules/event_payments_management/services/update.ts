import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import moment from 'moment';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let requestBody = req.body as anyObject;
    
    // Validate that either id OR (event_id AND user_id) is provided
    const hasId = requestBody.id;
    const hasEventAndUser = requestBody.event_id && requestBody.user_id;
    
    if (!hasId && !hasEventAndUser) {
        // Add a custom validation error since neither identification method is complete
        await body('id')
            .withMessage(
                `the <b>id</b> field is required`,
            )
            .run(req);
    }

    let result = await validationResult(req);
    return result;
}


async function update(
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
    let user_model = new models[modelName]();

    // Parse fields that might be stringified
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    body.events = parseField(body.events);
    body.enrollments = parseField(body.enrollments);
    body.users = parseField(body.users);
    body.payments = parseField(body.payments);

    /** store data into database */
    try {
        let record = await models[modelName].findOne(
            {
                where: {
                    event_id: body.event_id,
                    user_id: body.user_id,
                }
            }
        );

        let data = await models[modelName].findByPk(body.id || record?.id);
        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                event_id: body.events?.[0] || data.event_id,
                user_id: body.users?.[0] || data.user_id,
                event_enrollment_id: body.enrollments?.[0] || data.event_enrollment_id,
                event_payment_id: body.payments?.[0] || data.event_payment_id,
                date: body.date || data.date,
                amount: body.amount || data.amount,
                trx_id: body.trx_id || data.trx_id,
                media: body.media || data.media,
                session_id: body.session_id || data.session_id,
                is_refunded: body.is_refunded || data.is_refunded || false,
                status: body.status || data.status,
            };
            data.update(inputs);
            await data.save();
            return response(201, 'data updated', { data });
        } else {
            throw new custom_error(
                'data not found',
                404,
                'operation not possible',
            );
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;

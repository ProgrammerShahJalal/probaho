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
    let field = '';
    let fields = [
        'id',
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

    /** store data into database */
    try {
        let data = await models[modelName].findByPk(body.id);
        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                event_id: getValue(body.event_id) || data.event_id,
                user_id: getValue(body.user_id) || data.user_id,
                event_enrollment_id: getValue(body.event_enrollment_id) || data.event_enrollment_id,
                event_payment_id: getValue(body.event_payment_id) || data.event_payment_id,
                date: body.date || data.date,
                amount: body.amount || data.amount,
                trx_id: body.trx_id || data.trx_id,
                media: body.media || data.media,
                status: body.status || data.status,
            };
            data.update(inputs);
            await data.save();

            if (data.status === 'success') {
                await models.EventPaymentsModel.update(
                    { is_refunded: true },
                    { where: { id: data.event_payment_id } }

                );
            }

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

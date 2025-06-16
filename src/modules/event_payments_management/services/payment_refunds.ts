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

async function payment_refunds(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** Validation */
    const validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'Validation error', validate_result.array());
    }

    /** Initializations */
    let models = Models.get();
    let body = req.body as anyObject;
    let payment_model = new models[modelName]();

    try {
        /** Fetch payment data */
        let data = await models[modelName].findByPk(body.id);
        if (!data) {
            throw new custom_error(
                'Payment data not found',
                404,
                'Refund operation not possible'
            );
        }

        /** Mark as refunded in `event_payments` */
        data.is_refunded = true;
        await data.save();

        /** Log refund details in `event_payment_refunds` */
        const refundInputs: InferCreationAttributes<typeof payment_model> = {
            event_id: data.event_id,
            user_id: data.user_id,
            event_enrollment_id: data.event_enrollment_id,
            event_payment_id: data.event_payment_id,
            date: moment().toISOString(),
            amount: data.amount,
            trx_id: data.trx_id,
            media: data.media,
            session_id: data.session_id,
        };

        await models.EventPaymentRefundsModel.create(refundInputs);

        return response(201, 'Refund processed successfully', {
            data,
            refundDetails: refundInputs,
        });
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
        throw error;
    }
}


export default payment_refunds;

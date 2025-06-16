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

    /** store data into database */
    try {
        let data = await models[modelName].findByPk(body.id);
        let event_session_assesment_model = models.EventSessionsAssesmentsModel;

        let sesionAssesmentdata = await event_session_assesment_model.findOne({
            where: {
                id: body.event_session_assesment_id,

            },
        });

        if (data) {

            let inputs: InferCreationAttributes<typeof user_model> = {
                event_id: body.event_id || data.event_id,
                event_session_id: body.event_session_id || data.event_session_id,
                event_session_assesment_id: body.event_session_assesment_id || data.event_session_assesment_id,
                user_id: body.user_id || data.user_id,
                submitted_content: body.submitted_content || data.submitted_content,
                mark: body.mark || data.mark,
                obtained_mark: body.obtained_mark || null,
                grade: body.grade || 'Pending',
            };

            data.update(inputs);
            await data.save();
            return response(201, 'Mark assign successfully.', { data });
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

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

    // Parse fields that might be stringified
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    body.events = parseField(body.events);
    body.users = parseField(body.users);


    let user_model = new models[modelName]();


    /** store data into database */
    try {
        let data = await models[modelName].findByPk(body.id);
        if (data) {

            let image_path = data?.image || 'avatar.png';
            if (body['image']?.ext) {
                image_path =
                    'uploads/event_certified_users/' +
                    moment().format('YYYYMMDDHHmmss') +
                    body['image'].name;
                await (fastify_instance as any).upload(body['image'], image_path);
            }


            let inputs: InferCreationAttributes<typeof user_model> = {
                user_id: body.users?.[0] || data?.user_id,
                event_id: body.events?.[0] || data?.event_id,
                scores: body.scores || data?.scores,
                grade: body.grade || data?.grade,
                date: body.date || data?.date,
                is_submitted: body.is_submitted || data?.is_submitted,
                image: image_path || data?.image,
            };
            (await data.update(inputs)).save();

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

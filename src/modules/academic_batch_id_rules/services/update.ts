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

import moment from 'moment';
import { modelName } from '../models/model';
import error_trace from '../../../common/errors/error_trace';
import custom_error from '../../../common/errors/custom_error';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        'id'
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
        let data = await models.AcademicBatchIdRuleModel.findByPk(body.id);
        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                branch_user_id: body.branch_user_id || data.branch_user_id,
                branch_id: body.branch_id || data.branch_id,
                academic_year_id: body.academic_year_id || data.academic_year_id,
                title: body.title || data.title,
                description: body.description || data.description,
                value: body.value || data.value,
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

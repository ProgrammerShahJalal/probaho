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

import { modelName } from '../models/model';
import error_trace from '../../../common/errors/error_trace';
import custom_error from '../../../common/errors/custom_error';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        'branch_user_id',
        'academic_year_id',
        'title',
        'value',
    ];

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        let validation = body(field)
            .not()
            .isEmpty()
            .withMessage(
                `the <b>${field.replaceAll('_', ' ')}</b> field is required`,
            )

        await validation.run(req);
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
    

    let inputs: InferCreationAttributes<typeof data> = {
        branch_user_id:
            typeof body.branch_user_id === 'string'
                ? JSON.parse(body.branch_user_id)
                : body.branch_user_id || [],
        branch_id:
            typeof body.branch_id === 'string'
                ? JSON.parse(body.branch_id)
                : body.branch_id || [1],
        academic_year_id:
            typeof body.academic_year_id === 'string'
                ? JSON.parse(body.academic_year_id)
                : body.academic_year_id || [],
        title: body.title,
        description: body.description,
        value: body.value,
    };


    /** store data into database */
    try {
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

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
        'comment',
        'users',
        'blogs',
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

    // Helper function to extract ID whether it comes as array or direct value
    const extractId = (value: any): number => {
        if (Array.isArray(value)) {
            return Number(value[0]);
        } else if (typeof value === 'string') {
            // Handle case where it might be a string representation of array
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? Number(parsed[0]) : Number(parsed);
            } catch {
                return Number(value);
            }
        }
        return Number(value);
    };
 

    let inputs: InferCreationAttributes<typeof data> = {
        user_id: extractId(body.users),
        blog_id: extractId(body.blogs),
        comment: body.comment,
    };

     /** store data into database */
     try {
        let data = await models[modelName].create(inputs);  

        return response(201, 'data created', { data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;

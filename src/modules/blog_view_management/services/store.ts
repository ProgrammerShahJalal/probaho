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
        'blog_id',
        'user_id',
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
    // Validation
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    // Initializations
    let models = Models.get();
    let body = req.body as anyObject;
    let data = new models[modelName]();

    // Check if a record with same user_id and blog_id already exists
    const existingRecord = await models[modelName].findOne({
        where: {
            blog_id: body.blog_id,
            user_id: body.user_id,
        },
    });

    try {
        let result;

        if (existingRecord) {
            // If record exists for same user_id and blog_id, update only the total_count
            existingRecord.total_count += 1;
            existingRecord.date = moment().toISOString();
            existingRecord.ip = req.ip;

            await existingRecord.save();

            result = existingRecord;
        } else {
            // Else insert a new record
            const newData = await models[modelName].create({
                user_id: body.user_id,
                blog_id: body.blog_id,
                date: moment().toISOString(),
                total_count: 1,
                ip: req.ip,
            });

            result = newData;
        }

        return response(201, 'data stored/updated', {
            data: result,
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}


export default store;


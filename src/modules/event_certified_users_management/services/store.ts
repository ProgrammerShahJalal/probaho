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
import { stringify } from 'querystring';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        { name: 'events', isArray: true },
        { name: 'users', isArray: true },
        { name: 'scores', isArray: false },
        { name: 'grade', isArray: false },
        { name: 'date', isArray: false },
        { name: 'image', isArray: false },
    ];

    //validate array fields
    for (const field of fields.filter(f => f.isArray)) {
        await body(field.name)
            .custom(value => {
                try {
                    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                    return Array.isArray(parsed) && parsed.length > 0;
                } catch {
                    return false;
                }
            })
            .withMessage(`the <b>${field.name.replaceAll('_', ' ')}</b> field is required`)
            .run(req);
    }

    // Validate other fields
    for (const field of fields.filter(f => !f.isArray)) {
        await body(field.name)
            .not()
            .isEmpty()
            .withMessage(`the <b>${field.name.replaceAll('_', ' ')}</b> field is required`)
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

    body.events = parseField(body.events);
    body.users = parseField(body.users);

    let data = new models[modelName]();
    let image_path = 'avatar.png';
    if (body['image']?.ext) {
        image_path =
            'uploads/event_certified_users/' +
            moment().format('YYYYMMDDHHmmss') +
            body['image'].name;
        await (fastify_instance as any).upload(body['image'], image_path);
    }

    const isExists =
        await models[modelName].findOne({
            where: {
                event_id: body.events?.[0],
                user_id: body.users?.[0],
            },
        });

    if (isExists) {
        return response(422, 'This user is already certified for this event', {
            data: [{
                path: 'users',
                msg: 'This user is already certified for this event'
            }]
        });
    }


    /** store data into database */
    try {
        let inputs: InferCreationAttributes<typeof data> = {

            user_id: body.users?.[0],
            event_id: body.events?.[0],
            scores: body.scores,
            grade: body.grade,
            date: body.date,
            is_submitted: body.is_submitted,
            image: image_path,
        };
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

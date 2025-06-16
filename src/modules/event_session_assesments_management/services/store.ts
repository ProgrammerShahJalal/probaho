import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, Op } from 'sequelize';
import moment from 'moment/moment';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        { name: 'events', isArray: true },
        { name: 'sessions', isArray: true },
        { name: 'title', isArray: false },
        { name: 'description', isArray: false },
        { name: 'mark', isArray: false },
        { name: 'pass_mark', isArray: false },
        { name: 'start', isArray: false },
        { name: 'end', isArray: false },
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

    // Validate start and end times
    if (body?.start && body?.end) {
        const startTime = moment(body?.start, 'hh:mmA');
        const endTime = moment(body?.end, 'hh:mmA');

        if (!startTime.isValid() || !endTime.isValid()) {
            return response(422, 'Invalid time format. Use hh:mmAM/PM format.', {
                data: [{
                    path: 'start/end',
                    msg: 'Invalid time format. Use hh:mmAM/PM format.'
                }]
            });
        }

        if (startTime.isSameOrAfter(endTime)) {
            return response(422, 'Invalid time range! The start time must be before the end time.', {
                data: [{
                    path: 'start',
                    msg: 'The start time must be before the end time.'
                }]
            });
        }


    }

    if (body.description === null) {
        return response(422, 'Description is required.', {
            data: [{
                path: 'description',
                msg: 'Description is required.'
            }]
        });
    }

    // Parse fields that might be stringified
    const parseField = (field: any) => {
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return field;
        }
    };

    body.events = parseField(body.events);
    body.sessions = parseField(body.sessions);
    body.mark = parseField(body.mark);
    body.pass_mark = parseField(body.pass_mark);

    if (body.mark < body.pass_mark) {
        return response(422, 'Mark should be greater than or equal to pass mark.', {
            data: [{
                path: 'mark',
                msg: 'Mark should be greater than or equal to pass mark.'
            }]
        });
    }


    let data = new models[modelName]();

    let inputs: InferCreationAttributes<typeof data> = {

        event_id: body.events?.[0],
        event_session_id: body.sessions?.[0],
        title: body.title,
        description: body.description,
        mark: body.mark,
        pass_mark: body.pass_mark,
        start: body.start,
        end: body.end,
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

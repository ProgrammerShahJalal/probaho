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
import initializeDB from '../models/db';

/** Validation rules */
async function validate(req: Request) {
    if (!Array.isArray(req.body)) {
        throw new Error(
            'Invalid request format. Expected an array of objects.',
        );
    }

    for (let i = 0; i < req.body.length; i++) {
        let fields = [
            'event_id',
            'event_session_id',
            'date',
            'user_id',
            'time',
        ];

        for (let field of fields) {
            await body(`${i}.${field}`)
                .not()
                .isEmpty()
                .withMessage(
                    `The <b>${field.replace('_', ' ')}</b> field is required in object at index ${i}.`,
                )
                .run(req);
        }
    }

    return validationResult(req);
}

async function store(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'Validation error', validate_result.array());
    }

    /** initializations */
    let models = Models.get();
    let body = req.body as anyObject[];

    if (!Array.isArray(body)) {
        return response(400, 'Invalid request: Expected an array of objects.', [{}]);
    }

    const db = await initializeDB();
    const transaction = await db.sequelize.transaction();

    try {
        let createdData = [];

        for (let item of body) {
            // Validate the date format
            if (!moment(item.date, moment.ISO_8601, true).isValid()) {
                throw new Error(`Invalid date format for value: ${item.date}`);
            }

            // Ensure `time` is always treated as a string
            let timeValue = item.time;
            if (typeof item.time === 'object') {
                // Extract first available key's value
                timeValue = Object.values(item.time)[0];
            }

            // Validate time format (supports both HH:mm and HH:mm:ss)
            if (!moment(timeValue, ['HH:mm:ss', 'HH:mm'], true).isValid()) {
                throw new Error(`Invalid time format for value: ${JSON.stringify(item.time)}`);
            }

            let formattedDate = moment(item.date, moment.ISO_8601).format('YYYY-MM-DD');
            let formattedTime = moment(timeValue, ['HH:mm:ss', 'HH:mm']).format('HH:mm:ss');

            let newData = await models[modelName].create(
                {
                    event_id: item.event_id,
                    event_session_id: item.event_session_id,
                    user_id: item.user_id,
                    date: formattedDate,
                    time: formattedTime,
                    is_present: item.is_present,
                },
                { transaction },
            );

            createdData.push(newData);
        }

        await transaction.commit(); // Commit transaction

        return response(201, 'Data created successfully', {
            data: createdData,
        });
    } catch (error: any) {
        await transaction.rollback(); // Rollback in case of error

        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('Server error', 500, error.message, uid);
    }
}


export default store;

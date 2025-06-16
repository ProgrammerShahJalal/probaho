import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, Op } from 'sequelize';
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
        { name: 'events', isArray: true },
        { name: 'title', isArray: false },
        { name: 'topics', isArray: false },
        { name: 'start', isArray: false },
        { name: 'end', isArray: false },
        { name: 'total_time', isArray: false },
    ];

    //validate array fields
    for (const field of fields.filter((f) => f.isArray)) {
        await body(field.name)
            .custom((value) => {
                try {
                    const parsed =
                        typeof value === 'string' ? JSON.parse(value) : value;
                    return Array.isArray(parsed) && parsed.length > 0;
                } catch {
                    return false;
                }
            })
            .withMessage(
                `the <b>${field.name.replaceAll('_', ' ')}</b> field is required`,
            )
            .run(req);
    }

    // Validate other fields
    for (const field of fields.filter((f) => !f.isArray)) {
        await body(field.name)
            .not()
            .isEmpty()
            .withMessage(
                `the <b>${field.name.replaceAll('_', ' ')}</b> field is required`,
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

    // Validate start and end times
    if (body?.start && body?.end) {
        const startTime = moment(body?.start, 'hh:mmA');
        const endTime = moment(body?.end, 'hh:mmA');

        if (!startTime.isValid() || !endTime.isValid()) {
            return response(
                422,
                'Invalid time format. Use hh:mmAM/PM format.',
                {
                    data: [
                        {
                            path: 'start/end',
                            msg: 'Invalid time format. Use hh:mmAM/PM format.',
                        },
                    ],
                },
            );
        }

        if (startTime.isSameOrAfter(endTime)) {
            return response(
                422,
                'Invalid time range! The start time must be before the end time.',
                {
                    data: [
                        {
                            path: 'start',
                            msg: 'The start time must be before the end time.',
                        },
                    ],
                },
            );
        }

        // Calculate the duration in minutes
        const duration = moment.duration(endTime.diff(startTime)).asMinutes();
        if (duration !== parseInt(body?.total_time, 10)) {
            return response(
                422,
                `The total time should be ${duration} minutes based on start and end times.`,
                {
                    data: [
                        {
                            path: 'total_time',
                            msg: `The total time should be ${duration} minutes based on start and end times.`,
                        },
                    ],
                },
            );
        }

        // Check for overlapping sessions
        const overlappingSession = await models[modelName].findOne({
            where: {
                [Op.or]: [
                    {
                        start: {
                            [Op.between]: [
                                startTime.format('HH:mm'),
                                endTime.format('HH:mm'),
                            ],
                        },
                    },
                    {
                        end: {
                            [Op.between]: [
                                startTime.format('HH:mm'),
                                endTime.format('HH:mm'),
                            ],
                        },
                    },
                    {
                        [Op.and]: [
                            { start: { [Op.lte]: startTime.format('HH:mm') } },
                            { end: { [Op.gte]: endTime.format('HH:mm') } },
                        ],
                    },
                ],
            },
        });

        if (overlappingSession) {
            return response(
                422,
                'Time overlap! The selected time overlaps with another session.',
                {
                    data: [
                        {
                            path: 'start/end',
                            msg: 'The selected time overlaps with another session.',
                        },
                    ],
                },
            );
        }
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
    /** store data into database */
    try {
        let data = new models[modelName]();

        let inputs: InferCreationAttributes<typeof data> = {
            event_id: body.event?.[0],
            title: body.title,
            topics: body.topics,
            start: body.start,
            end: body.end,
            total_time: body.total_time,
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

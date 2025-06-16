import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, json } from 'sequelize';
import moment from 'moment/moment';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    const fields = [
        'title',
        'reg_start_date',
        'reg_end_date',
        'session_start_date_time',
        'session_end_date_time',
        'place',
        'short_description',
        'full_description',
        'pre_requisities',
        'terms_and_conditions',
        'event_type',
        'poster',
        'price',
        'discount_price',
    ];

    // Basic field presence validation
    for (const field of fields) {
        await body(field)
            .not()
            .isEmpty()
            .withMessage(`the <b>${field.replaceAll('_', ' ')}</b> field is required`)
            .run(req);
    }

    // Custom date validations
    await body('reg_end_date')
        .custom((value, { req }) => {
            const regStart = moment(req.body.reg_start_date);
            const regEnd = moment(value);
            if (regEnd.isBefore(regStart)) {
                throw new Error('Registration end date cannot be before registration start date');
            }
            return true;
        })
        .run(req);

    await body('session_end_date_time')
        .custom((value, { req }) => {
            const sessionStart = moment(req.body.session_start_date_time);
            const sessionEnd = moment(value);
            if (sessionEnd.isBefore(sessionStart)) {
                throw new Error('Session end date/time cannot be before session start date/time');
            }
            return true;
        })
        .run(req);

    await body('session_start_date_time')
        .custom((value, { req }) => {
            const regEnd = moment(req.body.reg_end_date);
            const sessionStart = moment(value);
            if (sessionStart.isBefore(regEnd)) {
                throw new Error('Session cannot start before registration ends');
            }
            return true;
        })
        .run(req);

    // Additional validation: Ensure registration period is reasonable (at least 1 day)
    await body('reg_end_date')
        .custom((value, { req }) => {
            const regStart = moment(req.body.reg_start_date);
            const regEnd = moment(value);
            if (regEnd.diff(regStart, 'hours') < 24) {
                throw new Error('Registration period should be at least 24 hours');
            }
            return true;
        })
        .run(req);

    // Additional validation: Ensure session duration is reasonable (at least 30 minutes)
    await body('session_end_date_time')
        .custom((value, { req }) => {
            const sessionStart = moment(req.body.session_start_date_time);
            const sessionEnd = moment(value);
            if (sessionEnd.diff(sessionStart, 'minutes') < 30) {
                throw new Error('Session duration should be at least 30 minutes');
            }
            return true;
        })
        .run(req);

    return await validationResult(req);
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
    let models = await Models.get();
    let body = req.body as anyObject;
    let data = new models[modelName]();

    let eventCategoryEventModel = models.EventCategoryEventModel;
    let EventTagEventModel = models.EventTagEventModel;

    let image_path = 'avatar.png';
    if (body['poster']?.ext) {
        image_path =
            'uploads/events/' +
            moment().format('YYYYMMDDHHmmss') +
            body['poster'].name;
        await (fastify_instance as any).upload(body['poster'], image_path);
    }

    let categories: number[] = JSON.parse(body['event_categories']) || [];
    let tags: number[] = JSON.parse(body['event_tags']) || [];

    let inputs: InferCreationAttributes<typeof data> = {
        title: body.title,
        reg_start_date: body.reg_start_date,
        reg_end_date: body.reg_end_date,
        session_start_date_time: body.session_start_date_time,
        session_end_date_time: body.session_end_date_time,
        place: body.place,
        short_description: body.short_description,
        full_description: body.full_description,
        pre_requisities: body.pre_requisities,
        terms_and_conditions: body.terms_and_conditions,
        event_type: body.event_type,
        poster: image_path,
        price: body.price,
        discount_price: body.discount_price,
    };

    try {
        (await data.update(inputs)).save();

        if (!data.id) {
            throw new Error('Failed to save data.');
        }

        await Promise.all(
            categories.map(async (categoryId) => {
                await eventCategoryEventModel.create({
                    event_id: data.id || 1,
                    event_category_id: categoryId,
                });
            }),
        );

        await Promise.all(
            tags.map(async (tagId) => {
                await EventTagEventModel.create({
                    event_id: data.id || 1,
                    event_tag_id: tagId,
                });
            }),
        );

        return response(201, 'data created', { data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
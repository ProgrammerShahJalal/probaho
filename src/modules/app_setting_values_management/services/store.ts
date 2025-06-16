import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, json } from 'sequelize';
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
        'title',
        'description',
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

    // field = 'reference';
    // await body(field)
    //     .not()
    //     .isEmpty()
    //     .custom(async (value) => {
    //         const length = value.length;
    //         if (length <= 2) {
    //             throw new Error(
    //                 `the <b>${field.replaceAll('_', ' ')}</b> field is required`,
    //             );
    //         }
    //     })
    //     .withMessage(
    //         `the <b>${field.replaceAll('_', ' ')}</b> field is required`,
    //     )
    //     .run(req);

    let result = await validationResult(req);

    return result;
}
// async function store(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }
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

    let values: number[] = JSON.parse(body['app_setting_values']) || [];
    const settingsTableRow = await models.AppSettinsgModel.findByPk(body?.app_setting_key_id);

    if (!settingsTableRow) {
        throw new Error('Setting not found');
    }


    let inputs: InferCreationAttributes<typeof data> = {
        app_setting_key_id: body.app_setting_key_id,
        title: body.title,
        value: body.value,
        is_default: body.is_default,
        type: settingsTableRow?.type,
    };

    try {

        await data.update(inputs);
        await data.save();


        if (!data.id) {
            throw new Error('Failed to save settings data.');
        }


        // await Promise.all(
        //      values.map(async (categoryId) => {
        //         await AppSettingValuesModel.create({
        //             app_setting_key_id: data.id || 1,
        //             title: body.title,
        //             value: body.value,
        //             is_default: body.is_default,
        //         });
        //     })
        // );


        return response(201, 'data created', { data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
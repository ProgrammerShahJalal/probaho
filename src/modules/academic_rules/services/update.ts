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
        let data = await models.AcademicRulesModel.findByPk(body.id);
        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                branch_user_id: body.branch_user_id ? (
                    typeof body.branch_user_id === 'string'
                        ? JSON.parse(body.branch_user_id)
                        : body.branch_user_id
                ) : data.branch_user_id,
                branch_id: body.branch_id ? (
                    typeof body.branch_id === 'string'
                        ? JSON.parse(body.branch_id)
                        : body.branch_id
                ) : data.branch_id,
                academic_year_id: body.academic_year_id ? (
                    typeof body.academic_year_id === 'string'
                        ? JSON.parse(body.academic_year_id)
                        : body.academic_year_id
                ) : data.academic_year_id,
                academic_rules_types_id: body.academic_rules_types_id ? (
                    typeof body.academic_rules_types_id === 'string'
                        ? JSON.parse(body.academic_rules_types_id)
                        : body.academic_rules_types_id
                ) : data.academic_rules_types_id,
                title: body.title || data.title,
                description: body.description || data.description,
                date: body.date ? moment(body.date).toDate() : data.date,
                file: data.file,
            };

            if (body.file && typeof body.file === 'object' && body.file.name) {
                const image_path = `uploads/academic_rules/${moment().format(
                    'YYYYMMDDHHmmss',
                )}_${body.file.name}`;
                await (fastify_instance as any).upload(body.file, image_path);
                inputs.file = image_path;
            }
            // If no new file is provided, keep the existing file
            // Don't check for body.file === null because that would overwrite existing files

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

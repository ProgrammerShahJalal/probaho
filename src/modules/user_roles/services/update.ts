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
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';

import moment from 'moment';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = ['id'];

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

    try {
        /** Find the existing role */
        let existingRole = await models[modelName].findByPk(body.id);
        if (!existingRole) {
            throw new custom_error(
                'Data not found',
                404,
                'Operation not possible',
            );
        }

        /** Prepare updated values (title only) */
        let inputs: InferCreationAttributes<typeof existingRole> = {
            title: body.title ?? existingRole.title,
            serial: existingRole.serial,
        };

        /** Update role */
        await existingRole.update(inputs);
        await existingRole.save();

        return response(200, 'Role updated successfully', {
            data: existingRole,
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;

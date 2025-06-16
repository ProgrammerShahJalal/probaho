import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        'id',
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
    // Convert stringified arrays to actual arrays
    const usersArray = JSON.parse(body.users || "[]");
    const blogsArray = JSON.parse(body.blogs || "[]");
    const parentCommentIdArray = Array.isArray(body.parent_comment_id)
    ? body.parent_comment_id
    : JSON.parse(body.parent_comment_id || "[]");

    try {
        let data = await models[modelName].findByPk(body.id);

        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                user_id: body.user_id || usersArray[0] || data.user_id,
                blog_id: body.blog_id || blogsArray[0] || data.blog_id,
                comment: body.comment || data.comment,
                parent_comment_id: Number(parentCommentIdArray[0]) || data.parent_comment_id,
            };
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

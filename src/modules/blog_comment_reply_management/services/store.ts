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
    let fields = ['comment', 'users', 'blogs', 'parent_comment_id'];

    for (let field of fields) {
        await body(field)
            .not()
            .isEmpty()
            .withMessage(`The <b>${field.replaceAll('_', ' ')}</b> field is required.`)
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
    let data = new models[modelName]();

    // Convert stringified arrays to actual arrays
    const usersArray = JSON.parse(body.users || "[]");
    const blogsArray = JSON.parse(body.blogs || "[]");
    const parentCommentIdArray = JSON.parse(body.parent_comment_id || "[]");

    let inputs: InferCreationAttributes<typeof data> = {
        user_id: body.users || usersArray[0], 
        blog_id: body.blogs || blogsArray[0], 
        comment: body.comment,
        parent_comment_id: body.parent_comment_id || parentCommentIdArray[0],
    };

    /** store reply into database */
    try {
        let data = await models[modelName].create(inputs);
        return response(201, 'reply created', { data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;

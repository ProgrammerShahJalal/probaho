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
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import moment from 'moment';
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

/** Check if a reply exists for the given parent comment ID */
async function isReplyExists(
    parentCommentId: string | number,
): Promise<boolean> {
    const reply = await Models.get().BlogCommentRepliesModel.findOne({
        where: { parent_comment_id: parentCommentId },
    });
    return !!reply;
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
    let replay_model = new models.BlogCommentRepliesModel;

    let inputs: InferCreationAttributes<typeof user_model> = {
        user_id: body.user_id,
        blog_id: body.blog_id,
        comment: body.comment,
    };

    /** store data into database */
    try {
        const data = await models[modelName].findByPk(body.id);
        const isAdminReply = body?.replay === '1';
        const isEmptyComment = body?.comment.trim() === '';

        if (!data) {
            throw new custom_error(
                'Data not found',
                404,
                'Operation not possible',
            );
        }

        const replyExists = await isReplyExists(body.id);
        if (replyExists && isAdminReply) {
            throw new custom_error('Server error', 500, 'You already replied to this comment.');
        }
        if (isEmptyComment && isAdminReply && !replyExists) {
            throw new custom_error('Server error', 500, 'Please provide a valid replay');
        }

        if (!isAdminReply) {
            await data.update(inputs);
            return response(201, 'Data updated', { data });
        }

        const inputsReplay: InferCreationAttributes<typeof replay_model> = {
            user_id: data.user_id,
            blog_id: data.blog_id,
            comment: body.comment,
            parent_comment_id: body.id,
        };
        const replayData = await models.BlogCommentRepliesModel.create(inputsReplay);
        return response(201, 'Replied successfully', { replayData });

    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;

import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import { responseObject, Request } from '../../../common_types/object';
import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    await body('id')
        .not()
        .isEmpty()
        .withMessage('the id field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function restore(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** initializations */
    // let models = await db();
    let models = Models.get();
    let body = req.body as { [key: string]: any }; // Existing code uses 'body'

    try {
        // Find the blog post, including soft-deleted ones
        let blogPost = await models[modelName].findOne({
            where: {
                id: body.id, // Using 'body.id' as per existing code
            },
            paranoid: false, // Important: find even if soft-deleted
        });

        if (blogPost) {
            // Check if the blog post was actually soft-deleted
            if (blogPost.getDataValue('deleted_at') === null) {
                throw new custom_error(
                    'Blog post is not in trash',
                    400,
                    'This blog post has not been trashed.',
                );
            }

            await blogPost.restore(); // Clears deleted_at

            // After restoring, update status and is_published
            await blogPost.update({
                status: 'active',
                is_published: 'draft', // Restored items go to draft by default
            });

            return response(200, 'Blog post restored successfully', blogPost);
        } else {
            throw new custom_error(
                'Blog post not found',
                404,
                'Operation not possible: Record not found',
            );
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, body); // Using 'body' as per existing code
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            // It's good practice to specify a message for the generic server error
            throw new custom_error('Server error while restoring blog post', 500, error.message, uid);
        }
        throw error;
    }
}

export default restore;

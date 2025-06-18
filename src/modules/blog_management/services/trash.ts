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

async function trash(
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
    let bodyParams = req.body as { [key: string]: any };

    try {
        let blogPost = await models[modelName].findOne({
            where: {
                id: bodyParams.id,
            },
        });

        if (blogPost) {
            // Update status and is_published before trashing
            await blogPost.update({
                is_published: 'draft',
                status: 'deactive', // Or consider a 'trashed' status if it exists
            });

            await blogPost.destroy(); // Soft delete (sets deleted_at)

            return response(200, 'Blog post moved to trash successfully', blogPost);
        } else {
            throw new custom_error(
                'Blog post not found',
                404,
                'Operation not possible: Record not found',
            );
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, bodyParams);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error while trashing blog post', 500, error.message, uid);
        }
        throw error;
    }
}

export default trash;

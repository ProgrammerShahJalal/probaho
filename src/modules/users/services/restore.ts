import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import { responseObject, Request } from '../../../common_types/object';
import response from '../../../helpers/response';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';
import { modelName } from '../models/user_model';
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
        // Find the user, including soft-deleted ones
        let user = await models[modelName].findOne({
            where: {
                id: body.id, // Using 'body.id' as per existing code
            },
            paranoid: false, // Important: find even if soft-deleted
        });

        if (user) {
            // Check if the user was actually soft-deleted
            if (user.getDataValue('deleted_at') === null) {
                throw new custom_error(
                    'User is not in trash',
                    400,
                    'This user has not been trashed.',
                );
            }

            await user.restore(); // Clears deleted_at

            // After restoring, update status and is_published
            await user.update({
                status: 'active',
            });

            return response(200, 'User restored successfully', user);
        } else {
            throw new custom_error(
                'User not found',
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

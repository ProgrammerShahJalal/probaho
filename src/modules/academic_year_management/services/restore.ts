import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import { responseObject, Request } from '../../../common_types/object';
import response from '../../../helpers/response';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';
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
        // Find the data, including soft-deleted ones
        let data = await models[modelName].findOne({
            where: {
                id: body.id, // Using 'body.id' as per existing code
            },
            paranoid: false, // Important: find even if soft-deleted
        });

        if (data) {
            // Check if the data was actually soft-deleted
            if (data.getDataValue('deleted_at') === null) {
                throw new custom_error(
                    'Data is not in trash',
                    400,
                    'This data has not been trashed.',
                );
            }

            await data.restore(); // Clears deleted_at

            // After restoring, update status
            await data.update({
                status: 'active',
            });

            return response(200, 'Data restored successfully', data);
        } else {
            throw new custom_error(
                'Data not found',
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
            throw new custom_error('Server error while restoring the data', 500, error.message, uid);
        }
        throw error;
    }
}

export default restore;

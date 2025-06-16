import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import response from '../../../helpers/response';
import error_trace from '../../../helpers/error_trace';
import custom_error from '../../../helpers/custom_error';
import { modelName } from '../models/model';
import Models from '../../../database/models';
import { ModelStatic } from 'sequelize';

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

async function destroy(
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
    let body = req.body as { [key: string]: any };

    try {
        let data = await models[modelName].findOne({
            where: {
                id: body.id,
            },
        });

        if (data) {
            // Define all dependency tables
            const dependenciesTable: ModelStatic<any>[] = [
                models.BlogCommentRepliesModel,
            ];

            // Delete all dependencies first
            for (const model of dependenciesTable) {
                await model.destroy({
                    where: {
                        parent_comment_id: body.id
                    }
                });
            }

            // Then delete the comment
            await data.destroy();
            return response(200, 'data and all dependencies permanently deleted', {});
        } else {
            throw new custom_error(
                'data not found',
                404,
                'operation not possible',
            );
        }
    } catch (error: unknown) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, (error as Error).message, uid);
        }
        throw error;
    }
}

export default destroy;

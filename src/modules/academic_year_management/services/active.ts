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

async function active(
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
            paranoid: false, // Allow finding soft-deleted records
        });

        if (data) {
            data.status = 'active'; 
            await data.save();
            return response(200, 'data active', data);
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

export default active;

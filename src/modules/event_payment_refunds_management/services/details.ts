import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../../../helpers/response';
import error_trace from '../../../helpers/error_trace';
import custom_error from '../../../helpers/custom_error';
import { modelName } from '../models/model';
import Models from '../../../database/models';


async function details(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = Models.get();

    let params = req.params as any;

    try {
        let data = await models[modelName].findOne({
            where: {
                id: params.id,
            },
            include: [
                {
                    model: models.UserModel,
                    as: 'user',
                    attributes: ['first_name', 'last_name'],
                    required: false,
                },
                {
                    model: models.EventModel,
                    as: 'event',
                    attributes: ['title'],
                    required: false,
                },
            ],
        });

        if (data) {
            return response(200, 'data found', data);
        } else {
            throw new custom_error('not found', 404, 'data not found');
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default details;

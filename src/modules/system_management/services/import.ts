import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../../../helpers/response';
import { modelName } from '../models/error_trace.model';

async function data_import(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let params = req.params as any;

    try {
        let data = await models[modelName].findOne({
            where: {
                id: params.id,
            },
        });
        if (data) {
            return response(200, 'data created', data);
        } else {
            return response(404, 'not found', {});
        }
    } catch (error) {
        return response(500, 'data creation error', { error });
    }
}

export default data_import;

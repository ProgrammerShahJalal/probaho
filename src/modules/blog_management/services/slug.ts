import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../../../helpers/response';
import error_trace from '../../../helpers/error_trace';
import custom_error from '../../../helpers/custom_error';
import { modelName } from '../models/model';
import Models from '../../../database/models';

async function slug(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = Models.get();
    let query = req.query as { slug: string };

    try {
        if (!query.slug) {
            throw new custom_error('Bad Request', 400, 'Slug is required');
        }

        // Check if the slug exists in the database
        const isSlugUnique = await models[modelName].findOne({
            where: { slug: query.slug },
        });

        if (!isSlugUnique) {
            return response(200, 'Slug is unique', { isUnique: true });
        } else {
            return response(200, 'Slug already exists', { isUnique: false });
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server Error', 500, error.message, uid);
        }
        throw error;
    }
}

export default slug;


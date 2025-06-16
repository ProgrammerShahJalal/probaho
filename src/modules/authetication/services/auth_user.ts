import { FindAndCountOptions, Model } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../helpers/response';
var bcrypt = require('bcrypt');

import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import Models from '../../../database/models';

async function auth_user(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    // let models = await db();
    let models = Models.get();
    let headers: anyObject = req.headers as anyObject;

    try {
        let data = await models.UserModel.findOne({
            where: {
                id: (req as anyObject).user.id,
            },
            attributes: { exclude: ['password', 'token'] },
        });
        return response(200, 'data fetched', data || {});
    } catch (error) {
        return response(500, 'data fetching failed', { error });
    }
}

export default auth_user;

import { FastifyReply, FastifyRequest } from 'fastify';
import { anyObject } from '../../../common_types/object';
import db from '../models/db';
import { env } from 'process';
import Models from '../../../database/models';

const check_auth_and_redirect = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');
    const token = request.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        // return reply.redirect('/admission-officer/login');
        return reply.redirect('/login');
    }

    const decoded = jwt.verify(token.slice(7), secretKey);
    // let models = await db();
    let models = Models.get();
    
    let user = await models.UserModel.findByPk(decoded.id);
    if (user && user.token == decoded.token) {
        (request as anyObject).user = decoded;
        return;
    } else {
        return reply.redirect('/login');
    }
};

export default check_auth_and_redirect;

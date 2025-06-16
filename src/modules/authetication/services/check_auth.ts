import { FastifyReply, FastifyRequest } from 'fastify';
import { anyObject } from '../../../common_types/object';
import db from '../models/db';
import { env } from 'process';
import Models from '../../../database/models';

function parseCookieString(cookieString: any) {
    try {
        const cookieObj: any = {};
        const cookies = cookieString.split(';');
        cookies.forEach((cookie: any) => {
            const [key, value] = cookie.split('=');
            cookieObj[key.trim()] = decodeURIComponent(value);
        });
        return cookieObj;
    } catch (error) {
        return {};
    }
}

const check_auth = async (request: FastifyRequest, reply: FastifyReply) => {
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');
    // const token = request.headers.authorization;
    const token = parseCookieString(request.headers.cookie)?.token;
    const user_agent = request.headers['user-agent'];

    console.log('request cookies', token);

    if (!token || !token.startsWith('Bearer ')) {
        return reply.redirect('/login');
        // reply.code(401).send({ error: 'Unauthorized' });
        // return;
    }

    try {
        const decoded = jwt.verify(token.slice(7), secretKey);
        // let models = await db();
        let models = Models.get();
        let user: any = {};
            user = await models.UserModel.findByPk(decoded.id);

        if (user && user.token == decoded.token) {
            (request as anyObject).user = decoded;
            return;
        } else {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }
    } catch (error) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }
};

export default check_auth;

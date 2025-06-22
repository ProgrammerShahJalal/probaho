import { FastifyReply, FastifyRequest } from 'fastify';
import { anyObject } from '../../../common_types/object';
import { env } from 'process';
import Models from '../../../database/models';

function parseCookieString(cookieString: string) {
    try {
        const cookieObj: any = {};
        const cookies = cookieString.split(';');
        cookies.forEach((cookie: string) => {
            const [key, value] = cookie.split('=');
            cookieObj[key.trim()] = decodeURIComponent(value);
        });
        return cookieObj;
    } catch (error) {
        return {};
    }
}


const check_is_super_admin_and_redirect = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');

    // Get token from cookies
    let token = parseCookieString(request.headers.cookie || '')?.token;
    if (token && token.startsWith('Bearer%20')) {
        token = token.slice(10);
    } else if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        let models = Models.get();

        let user = await models.UserModel.findByPk(decoded.id);
        console.log('Decoded JWT:', decoded);
        console.log('User from DB:', user?.id, user?.role_serial, user?.token);
        if (!user || user.token !== decoded.token) {
            return reply.redirect(`/login`);
        }

        // Check if the user is a super admin (role_serial === 1)
        if (user.role_serial !== 1) {
            return reply.redirect(`/login`);
        }

        (request as anyObject).user = decoded;
    } catch (error) {
        return reply.redirect(`/login`);
    }
};

export default check_is_super_admin_and_redirect;

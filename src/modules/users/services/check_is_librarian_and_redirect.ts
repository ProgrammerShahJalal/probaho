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


const check_is_librarian_and_redirect = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const secretKey = env.JTI;
    const jwt = require('jsonwebtoken');

    // Get token from cookies
    const token = parseCookieString(request.headers.cookie || '')?.token;
    // const token = parseCookieString(request.headers.cookie)?.token;

    if (!token || !token.startsWith('Bearer ')) {
        return reply.redirect(`/librarian-login`);
    }

    try {
        const decoded = jwt.verify(token.slice(7), secretKey);
        let models = Models.get();

        let user = await models.UserModel.findByPk(decoded.id);

        if (!user || user.token !== decoded.token) {
            return reply.redirect(`/librarian-login`);
        }

        // Check if the user is an librarian
        if (decoded.role !== 'librarian') {
            return reply.redirect(`/librarian-login`);
        }

        (request as anyObject).user = decoded;
    } catch (error) {
        return reply.redirect(`/librarian-login`);
    }
};

export default check_is_librarian_and_redirect;

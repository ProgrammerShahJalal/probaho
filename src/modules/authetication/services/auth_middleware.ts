import { FastifyReply, FastifyRequest } from 'fastify';
import { anyObject } from '../../../common_types/object';
import db from '../models/db';
import { config } from 'dotenv';
import Models from '../../../database/models';

// Load environment variables
config();

function parseCookieString(cookieString: string) {
    try {
        const cookieObj: Record<string, string> = {};
        const cookies = cookieString.split(';');
        cookies.forEach((cookie: string) => {
            const parts = cookie.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = decodeURIComponent(parts.slice(1).join('='));
                cookieObj[key] = value;
            }
        });
        return cookieObj;
    } catch (error) {
        return {};
    }
}

const auth_middleware = async (request: FastifyRequest, reply: FastifyReply) => {
    const secretKey = process.env.JTI;
    if (!secretKey) {
        console.error('JWT secret key is not defined');
        reply.code(500).send({ error: 'Internal Server Error' });
        return;
    }
    const jwt = require('jsonwebtoken');
    // Get token from cookies
    const cookies = parseCookieString(request.headers.cookie || '');
    // console.log('cookies', cookies);
    const token = cookies?.token?.startsWith('Bearer ') ? cookies.token.slice(7) : null;

    if (!token) {
        return reply.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id?: string; role?: string; token?: string };
        if (!decoded.id || !decoded.role || !decoded.token) {
            throw new Error('Invalid token payload');
        }
        let authUser = (request as anyObject)?.body?.user;
        
        if (!authUser) {
            authUser = { id: decoded.id }; // Use decoded token ID as fallback
        }
        const models = Models.get();
        let user = await models.UserModel.findByPk(authUser?.id);
        // console.log('authUser', authUser);
        // console.log('decoded user ', decoded);

        if (user && user.token === decoded.token) {
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

export default auth_middleware;

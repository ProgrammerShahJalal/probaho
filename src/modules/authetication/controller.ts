'use strict';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { responseObject } from '../../common_types/object';
import login from './services/login';
import register from './services/register';
import forget from './services/forget';
import auth_user from './services/auth_user';
import logout from './services/logout';
import user_profile_update from './services/user_profile_update';
import all from './services/all';
import details from './services/details';
import destroy from './services/destroy';
import soft_delete from './services/soft_delete';
import restore from './services/restore';
const { serialize, parse } = require('@fastify/cookie');

// Helper function to handle service errors
function handleServiceError(error: any, res: FastifyReply) {
    // Handle custom_error instances
    if (error.code && error.name && error.message) {
        return res.code(error.code).send({
            status: error.code,
            message: error.name,
            data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
        });
    }
    
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return res.code(500).send({
        status: 500,
        message: 'Internal server error',
        data: null
    });
}


export default function (fastify: FastifyInstance) {
    return {
        all: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await all(fastify, req);
                return res
                    .code(data.status)
                    .header('Cache-Control', 'public, max-age=30')
                    .send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        find: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await details(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        login: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await login(fastify, req);

                if (data?.data?.token) {
                    res.setCookie('token', 'Bearer ' + data.data.token, {
                        path: '/',
                        httpOnly: false, // Prevents JavaScript access for security
                        // secure: process.env.NODE_ENV === 'production' ? true : false, // Must be true in production
                        sameSite: 'none', // Allows cross-origin cookie sharing
                        maxAge: 60 * 60 * 24, // 1 day expiry in seconds
                        // domain: 'localhost', // Or use your actual domain in production
                    });
                }

                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        logout: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await logout(fastify, req, res);
                res.clearCookie('token');
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        auth_user: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await auth_user(fastify, req);
                return res.code(200).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        register: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await register(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        update: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await user_profile_update(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        forget: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await forget(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        restore: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await restore(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        delete: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await soft_delete(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        destroy: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await destroy(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },
    };
}

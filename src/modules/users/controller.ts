'use strict';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { responseObject } from '../../common_types/object';
import login from './services/login';
import register from './services/register';
import forget from './services/forget';
import forgetPassword from './services/forget';
import resetPassword from './services/resetPassword';
import auth_user from './services/auth_user';
import logout from './services/logout';
import user_profile_update from './services/user_profile_update';
import all from './services/all';
import details from './services/details';
import destroy from './services/destroy';
import soft_delete from './services/soft_delete';
import restore from './services/restore';
import active from './services/active';
import trash from './services/trash';
import inactive from './services/inactive';
import import_users from './services/import_users'; // Import the new service
import { handleServiceError } from '../../common/utils/controller_utils';
const { serialize, parse } = require('@fastify/cookie');


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

        // New method for super admin password reset submission
        superAdminResetPassword: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await resetPassword(fastify, req);
                return res.code(data.status).send(data);
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

        // Existing forget method, if it needs to be kept for other purposes
        forget: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                // This would call the original 'forget' if it was a different export, 
                // or you might need to adjust if 'forget.ts' only exports 'forgetPassword' now.
                // For now, assuming 'forget.ts' might still have an old 'forget' or this route is deprecated.
                // If 'forget.ts' only exports 'forgetPassword', this will call it.
                let data: responseObject = await forget(fastify, req); 
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        // New method for super admin password reset
        superAdminForgetPassword: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                // Ensure forgetPassword (the renamed function from forget.ts) is called
                let data: responseObject = await forgetPassword(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        inactive: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await inactive(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },
        active: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await active(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        trash: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await trash(fastify, req); // Ensure 'trash' service is called
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res); // Use existing error handler
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

        importUsers: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                // The file should be available in req.body due to `attachFieldsToBody: 'keyValues'`
                // and the custom onFile handler in app.ts.
                // The request log indicates the frontend is sending the file with the field name 'file'.
                const filePart = (req.body as any)?.file;

                if (!filePart || !filePart.data || !filePart.name) {
                     return res.code(400).send({
                        status: 400,
                        message: 'No file uploaded or file is corrupted. Ensure the file is sent under the field name "file".',
                        data: null,
                    });
                }
                
                // Pass the file part (which includes data, name, ext) to the service
                // The service expects the raw file buffer/string, so we adjust how it's passed or handled.
                // For now, we pass the 'filePart' which the service expects to have a 'data' property (Buffer)
                // and 'name' property.
                // We also need to modify the service to correctly access this.
                // Let's create a simplified request object for the service, or modify the service.
                // For now, the service expects `(req as any).file` to be the file object.
                // We will adapt this by attaching the file to a temporary property on req.
                (req as any).filePayload = filePart;


                let data: responseObject = await import_users(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },
    };
}

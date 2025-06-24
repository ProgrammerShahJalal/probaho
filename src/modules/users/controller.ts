'use strict';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { responseObject } from '../../common_types/object';
import loginService from './services/login';
import registerService from './services/register';
import forgetService from './services/forget';
import authUserService from './services/auth_user';
import logoutService from './services/logout';
import userProfileUpdateService from './services/user_profile_update';
import allService from './services/all';
import detailsService from './services/details';
import destroyService from './services/destroy';
import softDeleteService from './services/soft_delete';
import restoreService from './services/restore';
import activeService from './services/active';
import trashService from './services/trash';
import inactiveService from './services/inactive';
import importUsersService from './services/import_users';
import { controllerHandler } from '../../helpers/controller_handler';

// Removed handleServiceError as it's part of controllerHandler

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    const handleLogin = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const data: responseObject = await loginService(fastify, req);
            if (data?.data?.token) {
                res.setCookie('token', 'Bearer ' + data.data.token, {
                    path: '/',
                    httpOnly: false,
                    sameSite: 'none',
                    maxAge: 60 * 60 * 24,
                });
            }
            // Assuming loginService returns data compatible with controllerHandler's success case
            if (res.sent) return; // If response already sent by service or cookie setting
            return res.code(data.status).send(data);
        } catch (error) {
            // Utilize the error handling part of controllerHandler logic
            // This requires controllerHandler to be adaptable or to replicate its error handling here.
            // For simplicity, reusing the structure of the original handleServiceError
            if (error.code && error.name && error.message) {
                return res.code(error.code).send({
                    status: error.code,
                    message: error.name,
                    data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
                });
            }
            console.error('Unexpected error in login:', error);
            return res.code(500).send({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    };

    const handleLogout = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const data: responseObject = await logoutService(fastify, req, res); // logoutService might send response
            res.clearCookie('token');
            if (res.sent) return; // If logoutService already sent the response
            return res.code(data.status).send(data);
        } catch (error) {
            if (error.code && error.name && error.message) {
                return res.code(error.code).send({
                    status: error.code,
                    message: error.name,
                    data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
                });
            }
            console.error('Unexpected error in logout:', error);
            return res.code(500).send({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    };

    const handleImportUsers = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const filePart = (req.body as any)?.file;
            if (!filePart || !filePart.data || !filePart.name) {
                return res.code(400).send({
                    status: 400,
                    message: 'No file uploaded or file is corrupted. Ensure the file is sent under the field name "file".',
                    data: null,
                });
            }
            (req as any).filePayload = filePart;
            // Now, call the service, assuming it's wrapped by `handle` or handles its own response/error
            // For direct call with controllerHandler pattern:
            const data: responseObject = await importUsersService(fastify, req);
            return res.code(data.status).send(data);
        } catch (error) {
            if (error.code && error.name && error.message) {
                return res.code(error.code).send({
                    status: error.code,
                    message: error.name,
                    data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
                });
            }
            console.error('Unexpected error in importUsers:', error);
            return res.code(500).send({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    };

    return {
        all: async (req: FastifyRequest, res: FastifyReply) => handle(allService)(req, res),
        find: async (req: FastifyRequest, res: FastifyReply) => handle(detailsService)(req, res),
        login: handleLogin,
        logout: handleLogout,
        auth_user: async (req: FastifyRequest, res: FastifyReply) => handle(authUserService)(req, res), // Assuming auth_user can be handled by standard handler
        register: async (req: FastifyRequest, res: FastifyReply) => handle(registerService)(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(userProfileUpdateService)(req, res),
        forget: async (req: FastifyRequest, res: FastifyReply) => handle(forgetService)(req, res),
        inactive: async (req: FastifyRequest, res: FastifyReply) => handle(inactiveService)(req, res),
        active: async (req: FastifyRequest, res: FastifyReply) => handle(activeService)(req, res),
        trash: async (req: FastifyRequest, res: FastifyReply) => handle(trashService)(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(restoreService)(req, res),
        delete: async (req: FastifyRequest, res: FastifyReply) => handle(softDeleteService)(req, res), // maps to soft_delete service
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(destroyService)(req, res),
        importUsers: handleImportUsers,
    };
}

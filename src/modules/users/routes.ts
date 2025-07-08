'use strict';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import controller from './controller';
import check_auth from './services/check_auth';
import auth_middleware from './services/auth_middleware';
import check_auth_and_redirect from './services/check_auth_and_redirect';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/auth';
    const controllerInstance = controller(fastify);

    /** public routes */
    fastify.register(
        async (route, opts) => {
            route
                .get(`/`,
                    { preHandler: auth_middleware }, controllerInstance.all)
                .post(`/login`, controllerInstance.login)
                .post(`/register`, controllerInstance.register)
                .post(`/update`, controllerInstance.update)
                .post(`/soft-delete`, { preHandler: auth_middleware }, controllerInstance.delete)
                .post(`/inactive`, controllerInstance.inactive)
                .post(`/active`, controllerInstance.active)
                .post(`/trash`, controllerInstance.trash)
                .post(`/restore`, { preHandler: auth_middleware }, controllerInstance.restore)
                .post(`/forget`, controllerInstance.forget) 
                .post(`/reset-password`, controllerInstance.resetPassword) 
                .get(`/:id`, controllerInstance.find)
                .post(`/import`, { preHandler: auth_middleware }, controllerInstance.importUsers)
                .get(`/branch-admins`, { preHandler: auth_middleware }, controllerInstance.getBranchAdmins); 
        },
        { prefix },
    );

    /** auth routes */
    fastify.register(
        async (route, opts) => {
            route
                .post(
                    `/logout`,
                    { preHandler: auth_middleware },
                    controllerInstance.logout,
                )

                .post(
                    `/destroy`,
                    { preHandler: auth_middleware },
                    controllerInstance.destroy,
                );
        },
        { prefix },
    );

    // New routes for user profile management
    // Assuming a global prefix like /api is already applied
    // These routes will be /api/users/*
    fastify.register(
        async (route, opts) => {
            route
                .get(
                    `/profile`,
                    { preHandler: auth_middleware },
                    controllerInstance.getProfile,
                )
                .post( // Using POST for profile update to handle multipart/form-data for photo
                    `/profile-update`,
                    { preHandler: auth_middleware },
                    controllerInstance.updateProfile,
                )
                .post(
                    `/change-password`,
                    { preHandler: auth_middleware },
                    controllerInstance.changePassword,
                );
        },
        { prefix: '/users' }, // This will make routes like /users/profile
    );
};

'use strict';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import check_is_admin_and_redirect from '../modules/authetication/services/check_is_admin_and_redirect';
const authRoutes = require('../modules/authetication/routes');

module.exports = async function (fastify: FastifyInstance) {
    fastify.register(authRoutes);

    fastify
        .get(
            '/',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.status(200).send({});
            },
        )

        .get('/login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/login.ejs');
        })

        .get(
            '/admin',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/admin.ejs');
            },
        );
};

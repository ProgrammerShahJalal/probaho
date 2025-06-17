'use strict';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import check_is_admin_and_redirect from '../modules/authetication/services/check_is_admin_and_redirect';
const authRoutes = require('../modules/authetication/routes');

module.exports = async function (fastify: FastifyInstance) {
    fastify.register(authRoutes);

    fastify
        .get(
            '/',
            // { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                // return reply.status(200).send({});
                return reply.view('dashboard/initial.ejs');
            },
        )

        .get('/login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/login.ejs');
        })

        .get(
            '/super-admin',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/super_admin.ejs');
            },
        )
        .get(
            '/admin',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/admin.ejs');
            },
        )
        .get(
            '/student',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/student.ejs');
            },
        )
        .get(
            '/parent',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/parent.ejs');
            },
        )
        .get(
            '/teacher',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/teacher.ejs');
            },
        )
        .get(
            '/accountant',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/accountant.ejs');
            },
        )
        .get(
            '/receptionist',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/receptionist.ejs');
            },
        )
        .get(
            '/librarian',
            { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/librarian.ejs');
            },
        );
};

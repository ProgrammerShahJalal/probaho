'use strict';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import check_is_super_admin_and_redirect from '../modules/users/services/check_is_super_admin_and_redirect';
import check_is_admin_and_redirect from '../modules/users/services/check_is_admin_and_redirect';
import check_is_student_and_redirect from '../modules/users/services/check_is_student_and_redirect';
import check_is_teacher_and_redirect from '../modules/users/services/check_is_teacher_and_redirect';
import check_is_parent_and_redirect from '../modules/users/services/check_is_parent_and_redirect';
import check_is_accountant_and_redirect from '../modules/users/services/check_is_accountant_and_redirect';
import check_is_receptionist_and_redirect from '../modules/users/services/check_is_receptionist_and_redirect';
import check_is_librarian_and_redirect from '../modules/users/services/check_is_librarian_and_redirect';
const authRoutes = require('../modules/users/routes');

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

        .get('/super-admin-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/super_admin_login.ejs');
        })
        .get('/admin-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/admin_login.ejs');
        })
        .get('/teacher-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/teacher_login.ejs');
        })
        .get('/student-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/student_login.ejs');
        })
        .get('/parent-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/parent_login.ejs');
        })
        .get('/accountant-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/accountant_login.ejs');
        })
        .get('/receptionist-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/receptionist_login.ejs');
        })
        .get('/librarian-login', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/librarian_login.ejs');
        })

        // Generic routes for Forgot/Reset Password EJS Pages
        .get('/auth/forgot-password-request', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/forgot_password_request.ejs');
        })
        .get('/auth/reset-password/:token', async (req: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) => {
            const { token } = req.params;
            return reply.view('auth/reset_password.ejs', { token });
        })

        .get(
            '/super-admin',
            { preHandler: check_is_super_admin_and_redirect },
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
            { preHandler: check_is_student_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/student.ejs');
            },
        )
        .get(
            '/parent',
            { preHandler: check_is_parent_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/parent.ejs');
            },
        )
        .get(
            '/teacher',
            { preHandler: check_is_teacher_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/teacher.ejs');
            },
        )
        .get(
            '/accountant',
            { preHandler: check_is_accountant_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/accountant.ejs');
            },
        )
        .get(
            '/receptionist',
            { preHandler: check_is_receptionist_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/receptionist.ejs');
            },
        )
        .get(
            '/librarian',
            { preHandler: check_is_librarian_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/librarian.ejs');
            },
        );
};

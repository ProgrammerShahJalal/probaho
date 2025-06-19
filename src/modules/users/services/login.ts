import { FindAndCountOptions, Model } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../helpers/response';
var bcrypt = require('bcrypt');
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import loginHistoryStore from '../../user_login_histories/services/store';


import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { env } from 'process';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import Models from '../../../database/models';

async function validate(req: Request) {
    await body('email')
        .not()
        .isEmpty()
        .withMessage('the email field is required')
        .run(req);

    await body('password')
        .not()
        .isEmpty()
        .withMessage('the password field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function login(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    // let models = await db();
    let models = Models.get();
    let body: anyObject = req.body as anyObject;
    try {
        let data: anyObject | null = {};
        let userRole: anyObject | null = {};
        let token: anyObject = {};
        if (body) {
            data = await models.UserModel.findOne({
                where: {
                    email: body.email,
                },
            });

            if (data) {

                userRole = await models.UserRolesModel.findOne({
                    where: {
                        serial: data?.role_serial,
                    },
                });

                let check_pass = await bcrypt.compare(
                    body.password,
                    data.password,
                );

                // Check if the user is blocked
                if (data.is_blocked === "1") {
                    return response(403, 'Account blocked', [
                        { type: 'field', msg: 'Your account is blocked due to multiple failed login attempts.', path: 'email', location: 'body' },
                    ]);
                }


                const generateSecureCode = () => crypto.randomBytes(32).toString('hex');

                const hashCode = async (code: string) => {
                    return await bcrypt.hash(code, 10);
                };


                if (check_pass) {
                    let jwt = require('jsonwebtoken');
                    const secretKey = env.JTI;
                    const user_agent = req.headers['user-agent'];

                    let secret = Math.random().toString(36).substring(2, 10);
                    let auth_code = generateSecureCode();
                    let forget_code = generateSecureCode();
                    token = await jwt.sign(
                        {
                            id: data.id,
                            token: secret,
                            user_agent,
                            role: userRole?.title,
                        },
                        secretKey,
                    );
                    data.token = secret;
                    data.user_agent = user_agent;
                    data.auth_code = await hashCode(auth_code);
                    data.forget_code = await hashCode(forget_code);
                    data.forget_code_expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

                    //reset the count_wrong_attempts
                    data.count_wrong_attempts = 0;
                    await data.save();


                    (req as anyObject).body = {
                        ...(typeof req.body === 'object' && req.body !== null ? req.body : {}),
                        user_id: data.id,
                    };

                    try {
                        await loginHistoryStore(fastify_instance, req);
                    } catch (err) {
                        console.error("Error in logoutHistoryUpdate:", err);
                    }
                } else {

                    // Increment failed attempts
                    data.count_wrong_attempts = (data.count_wrong_attempts || 0) + 1;

                    // Block the user if attempts exceed 5
                    if (data.count_wrong_attempts > 5) {
                        data.is_blocked = "1";
                    }

                    await data.save();

                    return response(422, 'wrong password', [
                        {
                            type: 'field',
                            value: '',
                            msg: 'the given password is incorrect',
                            path: 'password',
                            location: 'body',
                        },
                    ]);
                }
            } else {
                return response(422, 'wrong email', [
                    {
                        type: 'field',
                        value: '',
                        msg: 'the given email is incorrect',
                        path: 'email',
                        location: 'body',
                    },
                ]);
            }
        }
        return response(200, 'authentication success', { token, data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default login;

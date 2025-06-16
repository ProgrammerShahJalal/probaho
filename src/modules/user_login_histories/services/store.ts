import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { UAParser } from 'ua-parser-js';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** Validation rules */
async function validate(req: Request) {
    const fields = ['user_id'];

    for (const field of fields) {
        await body(field)
            .notEmpty()
            .withMessage(`The <b>${field.replace('_', ' ')}</b> field is required`)
            .run(req);
    }

    return validationResult(req);
}

async function store(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** Validation */
    const validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'Validation error', validate_result.array());
    }

    /** Initializations */
    const models = Models.get();
    const body = req.body as anyObject;

    let user = await models.UserModel.findOne(
        {
            where: {
                id: body.user_id,
            },
        },
    )

    if (!user) {
        return response(404, 'User not found', {});
    }

    let loginDate = null;
    let device = "Unknown";
    if (user?.token) {
        loginDate = user.updated_at;
    }

    /** Parse the device details from user_agent */
    if (user?.user_agent) {
        const parser = new UAParser(user.user_agent);
        const deviceInfo = parser.getDevice();
        const osInfo = parser.getOS();
        const browserInfo = parser.getBrowser();


        // If device model is undefined, use OS name 
        device = deviceInfo.model || osInfo.name || browserInfo.name || "Unknown Device";
    }


    try {
        /** Check if an active session exists (logout_date is null) */
        let existingSession = await models[modelName].findOne({
            where: {
                user_id: body.user_id,
                logout_date: null,
            },
        });

        if (existingSession) {
            // Update the existing session instead of creating a new one
            await existingSession.update({
                login_date: loginDate,
                device: device,
            });

            return response(200, 'User login history updated successfully', { existingSession });
        } else {
            // Store a new user login history
            const inputs = await models[modelName].create({
                user_id: body.user_id,
                login_date: loginDate,
                logout_date: null,
                device: device,
                total_session_time: 0,
            });

            return response(201, 'User login history stored successfully', { inputs });
        }
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('Server error', 500, error.message, uid);
    }
}

export default store;
export const e = {
    loginHistoryStore: store,
}

import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes } from 'sequelize';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import moment from 'moment/moment';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = ['user_id'];

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        await body(field)
            .not()
            .isEmpty()
            .withMessage(
                `the <b>${field.replaceAll('_', ' ')}</b> field is required`,
            )
            .run(req);
    }

    let result = await validationResult(req);

    return result;
}

async function update(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** initializations */
    let models = Models.get();
    let body = req.body as anyObject;
    

    try {


        /** Find the existing data */
        let data = await models[modelName].findOne({
            where: {
                user_id: body.user_id
                },
                order: [['created_at', 'DESC']]
        });
        if (!data) {
            throw new custom_error(
                'Data not found',
                404,
                'Operation not possible',
            );
        }

        let logoutDate = moment().toDate();

        const totalSessionTime = moment(logoutDate).diff(moment(data.login_date), 'seconds') || 0;

    
        let inputs: InferCreationAttributes<typeof data> = {
            user_id: body.user_id,
            login_date: data.login_date,
            logout_date: logoutDate,
            device: data.device,
            total_session_time: totalSessionTime,
        };

        /** Update role */
        await data.update(inputs);
        await data.save();

        return response(200, 'User logout successfully', {
            data,
        });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;
export const e = {
    logoutHistoryUpdate: update,
}

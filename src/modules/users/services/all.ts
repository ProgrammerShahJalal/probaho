import { FindAndCountOptions } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../../../helpers/response';
import error_trace from '../../../common/errors/error_trace';
import custom_error from '../../../common/errors/custom_error';
import { validationResult, query } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { DataModel as UserModel } from '../models/user_model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    await query('orderByCol')
        .not()
        .isEmpty()
        .withMessage('the orderByCol field is required')
        .run(req);

    await query('orderByAsc')
        .not()
        .isEmpty()
        .withMessage('the orderByAsc field is required')
        .run(req);

    await query('show_active_data')
        .not()
        .isEmpty()
        .withMessage('the show_active_data field is required')
        .run(req);

    await query('paginate')
        .not()
        .isEmpty()
        .withMessage('the paginate field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function all(
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
    // let models = await db();
    let query_param = req.query as any;
    // console.log('models', models);
    const { Op } = require('sequelize');
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    // let role = query_param.role || null;
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let show_trash_data = query_param.show_trash_data === 'true' ? true : false;
    let paginate = parseInt((req.query as any).paginate) || 10;
    let select_fields: string[] = [];
    let exclude_fields: string[] = ['password'];
    const authUser = (req as any).user;

    // Add date range parameters
    let start_date = query_param.start_date;
    let end_date = query_param.end_date;

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status', 'created_at', 'updated_at', 'deleted_at'];
    } else {
        select_fields = ['id', 'uid', 'email', 'gender', 'token', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc == 'true' ? 'ASC' : 'DESC']],
        where: {},
    };

    query.attributes = select_fields;
    (query as any).paranoid = true; // Enable soft deletion by default
    // Base conditions for soft deletion and status
    if (show_trash_data) {
        // Only show deleted items, do not filter by status
        query.where = {
            deleted_at: { [Op.ne]: null },
            id: { [Op.ne]: authUser?.id },
        };
        (query as any).paranoid = false;
    } else {
        // Only show non-deleted items and filter by status
        query.where = {
            deleted_at: null,
            status: show_active_data == 'true' ? 'active' : 'deactive',
            id: { [Op.ne]: authUser?.id },
        };
    }


// Add date range filtering if both start and end dates are provided
if (start_date && end_date) {
    query.where = {
        ...query.where,
        created_at: {
            [Op.between]: [start_date, end_date]
        }
    };
} 
// Optional: handle cases where only one date is provided
else if (start_date) {
    query.where = {
        ...query.where,
        created_at: {
            [Op.gte]: start_date
        }
    };
} 
else if (end_date) {
    query.where = {
        ...query.where,
        created_at: {
            [Op.lte]: end_date
        }
    };
}

    if (search_key) {
        query.where = {
            ...query.where,
            [Op.or]: [
                { id: { [Op.like]: `%${search_key}%` } },
                { uid: { [Op.like]: `%${search_key}%` } },
                { name: { [Op.like]: `%${search_key}%` } },
                { email: { [Op.like]: `%${search_key}%` } },
                { phone_number: { [Op.like]: `%${search_key}%` } },
            ],
        };
    }


    try {
        let data = await (fastify_instance as anyObject).paginate(
            req,
            UserModel,
            paginate,
            query,
        );

        // Ensure role_serial is always an array
        if (data && data.data && Array.isArray(data.data)) {
            const processedUsers = await Promise.all(data.data.map(async (user: anyObject) => {
                let current_role_serial = user.role_serial;
                if (typeof current_role_serial === 'number') {
                    current_role_serial = [current_role_serial];
                } else if (typeof current_role_serial === 'string') {
                    try {
                        const parsed = JSON.parse(current_role_serial);
                        if (Array.isArray(parsed)) {
                            current_role_serial = parsed;
                        } else if (typeof parsed === 'number') {
                            current_role_serial = [parsed];
                        } else {
                            const num = parseInt(current_role_serial, 10);
                            current_role_serial = !isNaN(num) ? [num] : [];
                        }
                    } catch (e) {
                        const num = parseInt(current_role_serial, 10);
                        current_role_serial = !isNaN(num) ? [num] : [];
                    }
                } else if (!Array.isArray(current_role_serial)) {
                    current_role_serial = [];
                }
                user.role_serial = current_role_serial;

                // Now, fetch roles based on the normalized user.role_serial
                if (user.role_serial && user.role_serial.length > 0) {
                    try {
                        const roles = await models.UserRolesModel.findAll({
                            where: {
                                serial: {
                                    [Op.in]: user.role_serial,
                                },
                            },
                            attributes: ['id', 'title', 'serial', 'status', 'created_at', 'updated_at'], // Specify attributes to fetch
                        });
                        user.role = roles; // Assign array of role objects
                    } catch (roleError) {
                        console.error('Error fetching roles for user:', user.id, roleError);
                        user.role = []; // Assign empty array on error
                    }
                } else {
                    user.role = []; // Assign empty array if no role_serials
                }
                return user;
            }));
            data.data = processedUsers;
        }

        return response(200, 'data fetched', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.query);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default all;

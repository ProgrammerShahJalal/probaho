import { FindAndCountOptions, Op } from 'sequelize'; // Added Op
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

async function get_students( // Renamed function
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
    let query_param = req.query as any;
    // const { Op } = require('sequelize'); // Op is imported directly now
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let show_trash_data = query_param.show_trash_data === 'true' ? true : false;
    let paginate = parseInt((req.query as any).paginate) || 10;
    let select_fields: string[] = [];
    const authUser = (req as any).user;

    // Add date range parameters
    let start_date = query_param.start_date;
    let end_date = query_param.end_date;

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status', 'created_at', 'updated_at', 'deleted_at'];
    } else {
        // Default fields if not specified, ensure role_serial is included for filtering and processing
        select_fields = ['id', 'uid', 'name', 'email', 'phone_number', 'photo', 'role_serial', 'is_verified', 'is_blocked', 'is_approved', 'join_date', 'base_salary', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc == 'true' ? 'ASC' : 'DESC']],
        where: {}, // Initialize where clause
    };

    query.attributes = select_fields;
    (query as any).paranoid = true; // Enable soft deletion by default

    // Base conditions for soft deletion and status
    if (show_trash_data) {
        query.where = {
            deleted_at: { [Op.ne]: null },
            id: { [Op.ne]: authUser?.id },
        };
        (query as any).paranoid = false;
    } else {
        query.where = {
            deleted_at: null,
            status: show_active_data == 'true' ? 'active' : 'deactive',
            id: { [Op.ne]: authUser?.id },
        };
    }
    query.where = {
        ...query.where,
        [Op.and]: [ // Ensure this condition is ANDed with previous
            Sequelize.literal(`JSON_CONTAINS(role_serial, '3')`)
        ]
    };

    // Add date range filtering
    if (start_date && end_date) {
        query.where = {
            ...query.where,
            created_at: {
                [Op.between]: [start_date, end_date]
            }
        };
    } else if (start_date) {
        query.where = {
            ...query.where,
            created_at: {
                [Op.gte]: start_date
            }
        };
    } else if (end_date) {
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

        if (data && data.data && Array.isArray(data.data)) {
            const processedUsers = await Promise.all(data.data.map(async (user: anyObject) => {
                let current_role_serial = user.role_serial;
                // Normalize role_serial to an array
                if (typeof current_role_serial === 'number') {
                    current_role_serial = [current_role_serial];
                } else if (typeof current_role_serial === 'string') {
                    try {
                        const parsed = JSON.parse(current_role_serial);
                        current_role_serial = Array.isArray(parsed) ? parsed : (typeof parsed === 'number' ? [parsed] : []);
                    } catch (e) {
                        const num = parseInt(current_role_serial, 10);
                        current_role_serial = !isNaN(num) ? [num] : [];
                    }
                } else if (!Array.isArray(current_role_serial)) {
                    current_role_serial = [];
                }
                user.role_serial = current_role_serial;

                // Fetch associated roles
                if (user.role_serial && user.role_serial.length > 0) {
                    try {
                        const roles = await models.UserRolesModel.findAll({
                            where: {
                                serial: {
                                    [Op.in]: user.role_serial,
                                },
                            },
                            attributes: ['id', 'title', 'serial', 'status', 'created_at', 'updated_at'],
                        });
                        user.role = roles;
                    } catch (roleError) {
                        console.error('Error fetching roles for user:', user.id, roleError);
                        user.role = [];
                    }
                } else {
                    user.role = [];
                }
                return user;
            }));
            data.data = processedUsers;
        }

        return response(200, 'data fetched', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.query);
        if (error instanceof custom_error) { // Propagate custom errors
            throw error;
        }
        // Create a new custom_error for other types of errors
        throw new custom_error('server error', 500, error.message, uid);
    }
}

// Need to import Sequelize for Sequelize.literal
import { Sequelize } from 'sequelize';

export default get_students;

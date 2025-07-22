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
import { DataModel as UserRolesModel } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    await query('orderByCol')
        .optional()
        .not()
        .isEmpty()
        .withMessage('the orderByCol field is required')
        .run(req);

    await query('orderByAsc')
        .optional()
        .not()
        .isEmpty()
        .withMessage('the orderByAsc field is required')
        .run(req);

    await query('show_active_data')
        .optional()
        .not()
        .isEmpty()
        .withMessage('the show_active_data field is required')
        .run(req);

    // paginate is now optional
    await query('paginate')
        .optional()
        .isInt({ min: 1 })
        .withMessage('the paginate field must be a positive integer')
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
    let query_param = req.query as any;
    const { Op } = require('sequelize');
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let show_trash_data = query_param.show_trash_data === 'true' ? true : false;
    let paginate = query_param.paginate ? parseInt(query_param.paginate) : undefined;
    let select_fields: string[] = [];
    let exclude_fields: string[] = ['password'];

    // Add date range parameters
    let start_date = query_param.start_date;
    let end_date = query_param.end_date;

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status', 'created_at', 'updated_at', 'deleted_at'];
    } else {
        select_fields = ['id', 'title', 'start_month', 'end_month', 'is_locked', 'status', 'created_at', 'updated_at', 'deleted_at'];
    }

    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc == 'true' ? 'ASC' : 'DESC']],
        where: {
            status: show_active_data == 'true' ? 'active' : 'deactive',
        },
    };

    query.attributes = select_fields;
    (query as any).paranoid = true; // Enable soft deletion by default
    // Base conditions for soft deletion and status
    if (show_trash_data) {
        // Only show deleted items, do not filter by status
        query.where = {
            deleted_at: { [Op.ne]: null },
        };
        (query as any).paranoid = false;
    } else {
        // Only show non-deleted items and filter by status
        query.where = {
            deleted_at: null,
            status: show_active_data == 'true' ? 'active' : 'deactive',
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
                { title: { [Op.like]: `%${search_key}%` } },
                { description: { [Op.like]: `%${search_key}%` } },
                { value: { [Op.like]: `%${search_key}%` } },
                // Add these lines to search by associated or related table attributes
                { '$users.name$': { [Op.like]: `%${search_key}%` } },
                { '$branches.name$': { [Op.like]: `%${search_key}%` } },
                { '$academic_years.title$': { [Op.like]: `%${search_key}%` } },
            ],
        };
    }

    try {
        let data: any;

        interface AfterFindHookOptions {
            // Define options if needed
        }

        interface AcademicYear {
            id: number;
            title: string;
        }

        interface Branch {
            id: number;
            name: string;
        }

        interface User {
            id: number;
            name: string;
        }

        const afterFindHook = async (results: any[], options: AfterFindHookOptions) => {
            for (const item of results) {
            if (item.branch_user_id) {
                const users: User[] = await models.UserModel.findAll({
                where: {
                    id: {
                    [Op.in]: item.branch_user_id,
                    },
                },
                attributes: ['id', 'name'],
                }) as User[];
                item.dataValues.users = users;
            }

            if (item.branch_id) {
                const branches: Branch[] = await models.BranchInfosModel.findAll({
                where: {
                    id: {
                    [Op.in]: item.branch_id,
                    },
                },
                attributes: ['id', 'name'],
                }) as Branch[];
                item.dataValues.branches = branches;
            }

            if (item.academic_year_id) {
                const academic_years: AcademicYear[] = await models.AcademicYearModel.findAll({
                where: {
                    id: {
                    [Op.in]: item.academic_year_id,
                    },
                },
                attributes: ['id', 'title'],
                }) as AcademicYear[];
                item.dataValues.academic_years = academic_years;
            }
            }
        };

        if (paginate) {
            // Use pagination when paginate parameter is provided
            data = await (fastify_instance as anyObject).paginate(
                req,
                UserRolesModel,
                paginate,
                query,
            );
            await afterFindHook(data.data, {});
        } else {
            // Fetch all data when paginate is not provided
            const result = await UserRolesModel.findAndCountAll(query);
            await afterFindHook(result.rows, {});
            data = {
                data: result.rows,
                total: result.count,
                page: 1,
                limit: result.count,
                totalPages: 1
            };
        }
        
        return response(200, 'data fetched', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.query);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default all;

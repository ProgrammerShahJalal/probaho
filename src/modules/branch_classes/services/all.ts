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
import { DataModel } from '../models/model';
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
        select_fields = ['id', 'branch_user_id', 'branch_id', 'academic_year_id', 'title', 'code', 'status', 'created_at', 'updated_at', 'deleted_at'];
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
        // Helper function to fetch IDs for related models
        const fetchRelatedIds = async (model: any, field: string): Promise<number[]> => {
            return await model.findAll({
                where: { [field]: { [Op.like]: `%${search_key}%` } },
                attributes: ['id'],
            }).then((items: any) => items.map((item: any) => item.id));
        };

        const [user_ids, branch_ids, academic_year_ids] = await Promise.all([
            fetchRelatedIds(models.UserModel, 'name'),
            fetchRelatedIds(models.BranchInfosModel, 'name'),
            fetchRelatedIds(models.AcademicYearModel, 'title'),
        ]);

        const search_conditions: any[] = [
            { id: { [Op.like]: `%${search_key}%` } },
            { title: { [Op.like]: `%${search_key}%` } }, 
            { code: { [Op.like]: `%${search_key}%` } },
        ];

        const addJsonSearchConditions = (field: string, ids: number[]) => {
            if (ids.length > 0) {
                ids.forEach(id => {
                    // Add conditions to match the ID exactly within the JSON array string
                    search_conditions.push({ [field]: { [Op.like]: `[${id}]` } }); // e.g., [1]
                    search_conditions.push({ [field]: { [Op.like]: `[${id},%` } }); // e.g., [1,2,3]
                    search_conditions.push({ [field]: { [Op.like]: `%,${id},%` } }); // e.g., [0,1,2]
                    search_conditions.push({ [field]: { [Op.like]: `%,${id}]` } }); // e.g., [0,1]
                });
            }
        };

        addJsonSearchConditions('branch_user_id', user_ids);
        addJsonSearchConditions('branch_id', branch_ids);
        addJsonSearchConditions('academic_year_id', academic_year_ids);

        query.where = {
            ...query.where,
            [Op.or]: search_conditions,
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
            if (!results.length) {
                return;
            }
        
            // Helper function to collect unique IDs from array fields
            const collectIds = (fieldName: string): Set<number> => {
                const ids = new Set<number>();
                results.forEach((item) => {
                    if (item[fieldName]) {
                        item[fieldName].forEach((id: number) => ids.add(id));
                    }
                });
                return ids;
            };

            // Collect all unique IDs using the helper function
            const user_ids = collectIds('branch_user_id');
            const branch_ids = collectIds('branch_id');
            const academic_year_ids = collectIds('academic_year_id');
        
            // Fetch all related data in bulk
            const [users, branches, academic_years] = await Promise.all([
                models.UserModel.findAll({
                    where: { id: { [Op.in]: [...user_ids] } },
                    attributes: ['id', 'name'],
                }) as Promise<User[]>,
                models.BranchInfosModel.findAll({
                    where: { id: { [Op.in]: [...branch_ids] } },
                    attributes: ['id', 'name'],
                }) as Promise<Branch[]>,
                models.AcademicYearModel.findAll({
                    where: { id: { [Op.in]: [...academic_year_ids] } },
                    attributes: ['id', 'title'],
                }) as Promise<AcademicYear[]>,
            ]);
        
            // Create maps for quick lookups
            const user_map = new Map(users.map((user) => [user.id, user]));
            const branch_map = new Map(branches.map((branch) => [branch.id, branch]));
            const academic_year_map = new Map(academic_years.map((year) => [year.id, year]));
            
            // Helper function to attach related data
            const attachRelatedData = (item: any, fieldName: string, dataKey: string, map: Map<number, any>) => {
                if (item[fieldName]) {
                    item.dataValues[dataKey] = item[fieldName]
                        .map((id: number) => map.get(id))
                        .filter(Boolean);
                }
            };

            // Attach related data to results
            for (const item of results) {
                attachRelatedData(item, 'branch_user_id', 'users', user_map);
                attachRelatedData(item, 'branch_id', 'branches', branch_map);
                attachRelatedData(item, 'academic_year_id', 'academic_years', academic_year_map);
            }
        };

        if (paginate) {
            // Use pagination when paginate parameter is provided
            data = await (fastify_instance as anyObject).paginate(
                req,
                DataModel,
                paginate,
                query,
            );
            await afterFindHook(data.data, {});
        } else {
            // Fetch all data when paginate is not provided
            const result = await DataModel.findAndCountAll(query);
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

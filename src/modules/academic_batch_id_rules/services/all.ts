import { FindAndCountOptions, Op } from 'sequelize';
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
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let show_trash_data = query_param.show_trash_data === 'true' ? true : false;
    let paginate = query_param.paginate ? parseInt(query_param.paginate) : undefined;
    let select_fields: string[] = [];

    // Add date range parameters
    let start_date = query_param.start_date;
    let end_date = query_param.end_date;

    // Handle select fields
    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        // Always include essential fields for proper functioning
        select_fields = [...new Set([...select_fields, 'id', 'status', 'created_at', 'updated_at', 'deleted_at'])];
    } else {
        // Default fields
        select_fields = [
            'id', 
            'title', 
            'description', 
            'value',
            'start_month', 
            'end_month', 
            'is_locked', 
            'status', 
            'created_at', 
            'updated_at', 
            'deleted_at'
        ];
    }

    // Build the main query
    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc == 'true' ? 'ASC' : 'DESC']],
        attributes: [
            ...select_fields,
            'branch_user_id',
            'branch_id',
            'academic_year_id'
        ],
        include: [
            {
                model: models.UserModel,
                as: 'user',
                attributes: ['id', 'name'],
                required: false,
                where: search_key ? {
                    name: { [Op.like]: `%${search_key}%` }
                } : undefined
            },
            {
                model: models.BranchInfosModel,
                as: 'branch',
                attributes: ['id', 'name'],
                required: false,
                where: search_key ? {
                    name: { [Op.like]: `%${search_key}%` }
                } : undefined
            },
            {
                model: models.AcademicYearModel,
                as: 'academic_year',
                attributes: ['id', 'title'],
                required: false,
                where: search_key ? {
                    title: { [Op.like]: `%${search_key}%` }
                } : undefined
            }
        ]
    };

    // Handle soft deletion and paranoid settings
    (query as any).paranoid = true; // Enable soft deletion by default

    // Base conditions for soft deletion and status
    if (show_trash_data) {
        // Only show deleted items, do not filter by status
        query.where = {
            deleted_at: { [Op.ne]: null },
        };
        (query as any).paranoid = false; // Disable paranoid to see deleted records
    } else {
        // Only show non-deleted items and filter by status
        query.where = {
            deleted_at: null,
            status: show_active_data == 'true' ? 'active' : 'deactive',
        };
    }

    // Add date range filtering
    if (start_date && end_date) {
        query.where = {
            ...query.where,
            created_at: {
                [Op.between]: [start_date, end_date]
            }
        };
    } 
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

    // Add search functionality across main and related tables
    if (search_key) {
        query.where = {
            ...query.where,
            [Op.or]: [
                // Search in main table fields
                { id: { [Op.like]: `%${search_key}%` } },
                { title: { [Op.like]: `%${search_key}%` } },
                { description: { [Op.like]: `%${search_key}%` } },
                { value: { [Op.like]: `%${search_key}%` } },
                // Search in JSON array fields
                { branch_user_id: { [Op.like]: `%${search_key}%` } },
                { branch_id: { [Op.like]: `%${search_key}%` } },
                { academic_year_id: { [Op.like]: `%${search_key}%` } },
                // Search in related table fields using Sequelize's nested syntax
                { '$user.name$': { [Op.like]: `%${search_key}%` } },
                { '$branch.name$': { [Op.like]: `%${search_key}%` } },
                { '$academic_year.title$': { [Op.like]: `%${search_key}%` } },
            ],
        };
    }

    try {
        let data: any;
        
        if (paginate) {
            // Use pagination when paginate parameter is provided
            data = await (fastify_instance as anyObject).paginate(
                req,
                UserRolesModel,
                paginate,
                query,
            );
        } else {
            // Fetch all data when paginate is not provided
            const result = await UserRolesModel.findAndCountAll(query);
            
            // Process the results to include related data
            const processedRows = await Promise.all(result.rows.map(async (row: any) => {
                const rowData = row.toJSON();
                
                // Handle User data based on branch_user_id array
                if (rowData.branch_user_id && Array.isArray(rowData.branch_user_id)) {
                    rowData.users = await models.UserModel.findAll({
                        where: { id: rowData.branch_user_id },
                        attributes: ['id', 'name']
                    });
                }
                
                // Handle Branch data based on branch_id array
                if (rowData.branch_id && Array.isArray(rowData.branch_id)) {
                    rowData.branches = await models.BranchInfosModel.findAll({
                        where: { id: rowData.branch_id },
                        attributes: ['id', 'name']
                    });
                }
                
                // Handle Academic Year data based on academic_year_id array
                if (rowData.academic_year_id && Array.isArray(rowData.academic_year_id)) {
                    rowData.academic_years = await models.AcademicYearModel.findAll({
                        where: { id: rowData.academic_year_id },
                        attributes: ['id', 'title']
                    });
                }
                
                return rowData;
            }));
            
            data = {
                data: processedRows,
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

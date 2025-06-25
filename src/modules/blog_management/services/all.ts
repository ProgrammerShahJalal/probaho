import { FindAndCountOptions } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../../../helpers/response';
import error_trace from '../../../helpers/error_trace';
import custom_error from '../../../helpers/custom_error';
import { validateQueryFields } from '../../common/validateQueryFields';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    const fields = ['orderByCol', 'orderByAsc', 'show_active_data', 'paginate'];
    return await validateQueryFields(req, fields);
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
    let role = query_param.role || null;
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let show_trash_data = query_param.show_trash_data === 'true' ? true : false;
    let paginate = parseInt((req.query as any).paginate) || 10;
    let select_fields: string[] = [];
    let exclude_fields: string[] = ['password'];

    // Add date range parameters
    let start_date = query_param.start_date;
    let end_date = query_param.end_date;

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status'];
    } else {
        select_fields = ['id', 'title', 'author_id', 'short_description', 'full_description', 'cover_image', 'slug', 'seo_title', 'seo_keyword', 'seo_description', 'status', 'created_at',];
    }

    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc == 'true' ? 'ASC' : 'DESC']],
        where: {},
        // include: [models.Project],
    };

    query.attributes = select_fields;
    (query as any).paranoid = true; // Enable soft deletion by default
    // Base conditions for soft deletion and status
    if (show_trash_data) {
        // If showing trash, ignore status filter and only show deleted items
        query.where = {
            ...query.where,
            deleted_at: { [Op.ne]: null },
        };
        (query as any).paranoid = false;
    } else {
        // If not showing trash, only show non-deleted items and filter by status
        query.where = {
            ...query.where,
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
                { title: { [Op.like]: `%${search_key}%` } },
                { id: { [Op.like]: `%${search_key}%` } },
            ],
        };
    }

    try {
        let data = await (fastify_instance as anyObject).paginate(
            req,
            models[modelName],
            paginate,
            query,
        );
        return response(200, 'data fetched', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.query);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default all;

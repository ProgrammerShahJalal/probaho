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

import moment from 'moment';
import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        'id',
    ];

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

// async function update(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }

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
    let user_model = new models[modelName]();



    /** store data into database */
    let blogCategoryBlogModel = models.BlogCategoryBlogModel;
    let blogTagBlogModel = models.BlogTagBlogModel;

    let categories: number[] = JSON.parse(body['blog_categories']) || [];
    let tags: number[] = JSON.parse(body['blog_tags']) || [];

    try {
        let data = await models[modelName].findByPk(body.id);
        let image_path = data?.cover_image ||'avatar.png';
        if (body['cover_image']?.ext) {
            image_path =
                'uploads/blogs/' +
                moment().format('YYYYMMDDHHmmss') +
                body['cover_image'].name;
            await (fastify_instance as any).upload(body['cover_image'], image_path);
        }
        
        if (data) {
            let inputs: InferCreationAttributes<typeof user_model> = {
                title: body.title || data?.title,
                author_id: body.author_id || data?.author_id,
                short_description: body.short_description || data?.short_description,
                full_description: body.full_description || data?.full_description,
                cover_image: image_path || data.cover_image,

                is_published: body.is_published || data?.is_published,
                publish_date: body.publish_date || data?.publish_date,

                slug:  data?.slug,
                seo_title: body.seo_title || data?.seo_title,
                seo_keyword: body.seo_keyword || data?.seo_keyword,
                seo_description: body.seo_description || data?.seo_description,
            };
            data.update(inputs);
            await data.save();

            await blogCategoryBlogModel.destroy({
                where: { blog_id: data.id }
            });

            await Promise.all(
                categories.map(async (categoryId) => {
                    await blogCategoryBlogModel.create({
                        blog_id: data.id || 1,
                        blog_category_id: categoryId,
                    });
                })
            );

            await blogTagBlogModel.destroy({
                where: { blog_id: data.id }
            });

            await Promise.all(
                tags.map(async (tagId) => {
                    await blogTagBlogModel.create({
                        blog_id: data.id || 1,
                        blog_tag_id: tagId,
                    });
                })
            );


            return response(201, 'Blog updated', { data });
        } else {
            throw new custom_error(
                'data not found',
                404,
                'operation not possible',
            );
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;

import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import { InferCreationAttributes, json } from 'sequelize';
import moment from 'moment';

import response from '../../../helpers/response';
import custom_error from '../../../helpers/custom_error';
import error_trace from '../../../helpers/error_trace';

import { modelName } from '../models/model';
import Models from '../../../database/models';

/** validation rules */
async function validate(req: Request) {
    let field = '';
    let fields = [
        'title',
        'short_description',
        'full_description',
        'cover_image',
        'slug',
        'seo_title',
        'seo_description',
        'seo_keyword',
        'publish_date',
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

async function store(
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
    let data = new models[modelName]();

    let blogCategoryBlogModel = models.BlogCategoryBlogModel;
    let blogTagBlogModel = models.BlogTagBlogModel;
    let BlogCommentModel = models.BlogCommentModel;

    let image_path = 'avatar.png';
    if (body['cover_image']?.ext) {
        image_path =
            'uploads/blogs/' +
            moment().format('YYYYMMDDHHmmss') +
            body['cover_image'].name;
        await (fastify_instance as any).upload(body['cover_image'], image_path);
    }

    let categories: number[] = JSON.parse(body['blog_categories']) || [];
    let tags: number[] = JSON.parse(body['blog_tags']) || [];


    let inputs: InferCreationAttributes<typeof data> = {
        title: body.title,
        author_id: body.user_id || 1,
        short_description: body.short_description,
        full_description: body.full_description,
        cover_image: image_path,
        is_published: body.is_published,
        publish_date: body.publish_date,
        slug: body.slug,
        seo_title: body.seo_title,
        seo_keyword: body.seo_keyword,
        seo_description: body.seo_description,
    };

    try {

        await data.update(inputs);
        await data.save();


        if (!data.id) {
            throw new Error('Failed to save blog data.');
        }


        await Promise.all(
            categories.map(async (categoryId) => {
                await blogCategoryBlogModel.create({
                    blog_id: data.id || 1,
                    blog_category_id: categoryId,
                });
            })
        );

        await Promise.all(
            tags.map(async (tagId) => {
                await blogTagBlogModel.create({
                    blog_id: data.id || 1,
                    blog_tag_id: tagId,
                });
            })
        );


        return response(201, 'data created', { data });
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
import { Model } from 'sequelize';
import db from '../models/db';
import { body, validationResult } from 'express-validator';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import bcrypt from 'bcrypt';
import moment from 'moment/moment';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';
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

async function generateUniqueSlug(models: any, firstName: string, lastName: string): Promise<string> {
    let baseSlug = `${firstName}-${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens

    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for existing slugs and make unique if necessary
    while (await models.UserModel.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

async function user_profile_update(fastify_instance: FastifyInstance, req: FastifyRequest): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as unknown as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    // let models = await db();
    let models = Models.get();
    let body = req.body as { [key: string]: any };

    try {
        let data = await models.UserModel.findByPk(body.id);

        if (data) {
         // Hash the password before storing it
         const saltRounds = 10;
         const hashedPassword = body.password 
         ? await bcrypt.hash(body.password, saltRounds) 
         : data.password;
     

             // Generate a unique slug
        const slug = await generateUniqueSlug(models, body.first_name, body.last_name) || data.slug;

            let image_path = data.photo || 'avatar.png';
            if (body['photo']?.ext) {
                image_path =
                    'uploads/users/' +
                    moment().format('YYYYMMDDHHmmss') +
                    body['photo'].name;
                await (fastify_instance as any).upload(body['photo'], image_path);
            }

             // Update user data
        await data.update({
            first_name: body.first_name || data.first_name,
            last_name: body.last_name || data.last_name,
            role_serial: body.role || data.role_serial,
            phone_number: body.phone_number || data.phone_number,
            photo: image_path || data.photo,
            password: hashedPassword || data.password,
            slug: slug || data.slug,
            is_verified: body.is_verified !== undefined ? body.is_verified : data.is_verified,
            is_blocked: body.is_blocked !== undefined ? body.is_blocked : data.is_blocked,
        });
            await data.save();


            return response(201, 'User updated successfully', data);
        }
        else {
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

export default user_profile_update;

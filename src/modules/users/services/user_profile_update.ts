import { Model } from 'sequelize';
import db from '../models/db';
import { body, validationResult } from 'express-validator';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import bcrypt from 'bcrypt';
import moment from 'moment/moment';
import Models from '../../../database/models';
import response from '../../../helpers/response';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';


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

async function generateUniqueSlug(models: any, name: string): Promise<string> {
    let baseSlug = `${name}`
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
        const slug = await generateUniqueSlug(models, body.name) || data.slug;

            let image_path = data.photo || 'avatar.png';
            if (body['photo']?.ext) {
                image_path =
                    'uploads/users/' +
                    moment().format('YYYYMMDDHHmmss') +
                    body['photo'].name;
                await (fastify_instance as any).upload(body['photo'], image_path);
            }

             // Update user data

        // Handle multiple roles: store as array or string (JSON) in DB
        let role_serial_to_save: any = data.role_serial;
        if (body.role_serial) {
            let rolesArr: number[] = [];
            if (Array.isArray(body.role_serial)) {
                rolesArr = body.role_serial.map((r: any) => parseInt(r, 10)).filter((r: any) => !isNaN(r));
            } else if (typeof body.role_serial === 'string') {
                rolesArr = body.role_serial.split(',').map((r: string) => parseInt(r.trim(), 10)).filter((r: any) => !isNaN(r));
            } else if (typeof body.role_serial === 'number') {
                rolesArr = [body.role_serial];
            }
            // Store as array if model supports, else as JSON string
            role_serial_to_save = rolesArr;
            // If your DB expects string, uncomment below:
            // role_serial_to_save = JSON.stringify(rolesArr);
        }

        await data.update({
            name: body.name || data.name,
            role_serial: role_serial_to_save,
            phone_number: body.phone_number || data.phone_number,
            photo: image_path || data.photo,
            password: hashedPassword || data.password,
            slug: slug || data.slug,
            is_verified: body.is_verified !== undefined ? body.is_verified : data.is_verified,
            is_blocked: body.is_blocked !== undefined ? body.is_blocked : data.is_blocked,
            is_approved: body.is_approved !== undefined ? body.is_approved : data.is_approved,
            user_infos: body.user_infos || data.user_infos,
            // user_documents: body.user_documents || data.user_documents, // Will be handled separately
            join_date: body.join_date ? moment(body.join_date, 'YYYY-MM-DD').toDate() : data.join_date,
            base_salary: body.base_salary || data.base_salary,
        });

        // Handle user documents
        let finalUserDocumentsString = data.user_documents; // Default to existing if no new data
        if (body.user_documents && typeof body.user_documents === 'string') {
            try {
                let userDocumentsArray = JSON.parse(body.user_documents);
                const processedUserDocuments = [];

                for (let i = 0; i < userDocumentsArray.length; i++) {
                    const doc = userDocumentsArray[i];
                    // Corrected fileFieldKey to match frontend FormData key: document_files[index]
                    const fileFieldKey = `document_files[${i}]`; 
                    
                    // Ensure the body property exists and has the expected file structure
                    if (body[fileFieldKey] && typeof body[fileFieldKey] === 'object' && body[fileFieldKey].name && body[fileFieldKey].data) {
                        const fileData = body[fileFieldKey];
                        const documentFileName = `${Date.now()}_${i}_${fileData.name.replace(/\s+/g, '_')}`;
                        const documentPath = `uploads/user_documents/${documentFileName}`;
                        
                        await (fastify_instance as any).upload(fileData, documentPath);
                        doc.file = documentPath; // Update with the actual path
                        doc.fileName = fileData.name; // Store original file name
                    } else if (typeof doc.file === 'string') {
                        // If it's a string, it's an existing file path, keep it as is
                        // doc.file = doc.file; // No change needed
                    }
                    processedUserDocuments.push(doc);
                }
                finalUserDocumentsString = JSON.stringify(processedUserDocuments);
            } catch (e) {
                console.error('Error processing user documents:', e);
                // Decide if to throw error or use default/existing data
                // For now, retains existing or default if parsing/processing fails
            }
        }
        data.user_documents = finalUserDocumentsString;
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

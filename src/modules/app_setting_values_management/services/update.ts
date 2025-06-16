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
import { writeFile } from 'fs/promises';
import { join } from 'path';

/** Validation rules */
async function validate(req: Request) {
    let fields = ['id', 'app_setting_key_id'];

    for (let field of fields) {
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

async function update(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** Validation */
    const validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** Initializations */
    const models = Models.get();
    const body = req.body as anyObject;
    // console.log('Request body:', body);

    const user_model = new models[modelName]();
    const settingsTableRow = await models.AppSettinsgModel.findByPk(
        body?.app_setting_key_id,
    );

    if (!settingsTableRow) {
        throw new custom_error(
            'Setting not found',
            404,
            'App setting key not found',
        );
    }

    /** Store data into database */
    try {
        const data = await models[modelName].findByPk(body.id);
        if (!data) {
            throw new custom_error(
                'data not found',
                404,
                'Operation not possible',
            );
        }

        let valueToSave: string = data.value;

        /** Handle file upload if type is file */
        if (settingsTableRow.type === 'file') {
            const isGallery = body.isGallery === 'true';

            if (isGallery) {
                // Handle gallery (multiple images)
                let imagePaths: string[] = [];

                // Get existing previews from body.value or data.value
                if (body.value) {
                    try {
                        const parsedValue = JSON.parse(body.value);
                        if (Array.isArray(parsedValue)) {
                            imagePaths = parsedValue.filter((path: string) => !path.startsWith('data:'));
                            // console.log('Parsed body.value:', imagePaths);
                        }
                    } catch (error: any) {
                        console.log('Failed to parse body.value:', error.message);
                    }
                } else if (data.value) {
                    try {
                        const parsedValue = JSON.parse(data.value);
                        if (Array.isArray(parsedValue)) {
                            imagePaths = parsedValue.filter((path: string) => !path.startsWith('data:'));
                            // console.log('Parsed data.value:', imagePaths);
                        }
                    } catch (error: any) {
                        console.log('Failed to parse data.value:', error.message);
                    }
                }

                // Check for new files in body['value[0]'], body['value[1]'], etc.
                const fileFields = Object.keys(body).filter((key) =>
                    key.startsWith('value['),
                );

                if (fileFields.length > 0) {
                    // Process new files from body
                    for (const key of fileFields) {
                        const file = body[key];
                        if (file && file.data && file.data.length > 0) {
                            const extension = file.ext?.replace('.', '') || 'jpg';
                            const image_path = `uploads/app_settings/${moment().format(
                                'YYYYMMDDHHmmss',
                            )}_${Math.random().toString(36).substring(7)}.${extension}`;
                            
                            // Save file to disk
                            const filePath = join(process.cwd(), 'public', image_path);
                            await writeFile(filePath, file.data);
                            
                            imagePaths.push(image_path);
                        }
                    }
                }

                valueToSave = JSON.stringify(imagePaths);
                // console.log('valueToSave:', valueToSave);
            } else if (body['value[0]']) {
                // Handle single file upload
                const file = body['value[0]'];
                if (file && file.data && file.data.length > 0) {
                    const extension = file.ext?.replace('.', '') || 'jpg';
                    const image_path = `uploads/app_settings/${moment().format(
                        'YYYYMMDDHHmmss',
                    )}_${Math.random().toString(36).substring(7)}.${extension}`;
                    
                    // Save file to disk
                    const filePath = join(process.cwd(), 'public', image_path);
                    await writeFile(filePath, file.data);
                    
                    valueToSave = image_path;
                }
            }
        } else {
            // Non-file type
            valueToSave = body.value || data.value;
        }

        const inputs: InferCreationAttributes<typeof user_model> = {
            app_setting_key_id: body.app_setting_key_id || data.app_setting_key_id,
            title: body.title || data.title,
            value: valueToSave,
            is_default: body.is_default || data.is_default,
            type: settingsTableRow.type || data.type,
        };

        await data.update(inputs);
        return response(201, 'data updated', { data });
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;

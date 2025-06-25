import { body, validationResult } from 'express-validator';
import { Request } from '../../common_types/object';

/**
 * Validates that the specified fields are present and not empty in the request.
 * @param req Express/Fastify request object
 * @param fields Array of required field names
 * @returns validationResult object
 */
export async function validateFields(req: Request, fields: string[]) {
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
    return await validationResult(req);
}

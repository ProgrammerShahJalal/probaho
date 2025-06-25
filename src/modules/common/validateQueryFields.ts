import { query, validationResult } from 'express-validator';
import { Request } from '../../common_types/object';

/**
 * Validates that the specified query fields are present and not empty in the request.
 * @param req Express/Fastify request object
 * @param fields Array of required query field names
 * @returns validationResult object
 */
export async function validateQueryFields(req: Request, fields: string[]) {
    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        await query(field)
            .not()
            .isEmpty()
            .withMessage(`the ${field} field is required`)
            .run(req);
    }
    return await validationResult(req);
}

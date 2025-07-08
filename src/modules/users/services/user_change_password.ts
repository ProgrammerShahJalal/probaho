import { FastifyRequest, FastifyInstance } from 'fastify';
import { body, validationResult } from 'express-validator'; // Using express-validator with Fastify
import bcrypt from 'bcrypt';
import Models from '../../../database/models';
import response from '../../../helpers/response';
import { responseObject } from '../../../common_types/object';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';

// Define an interface for the user object if not already available globally
interface AuthenticatedUser {
    id: number | string;
    // other user properties
}

// Extend FastifyRequest to include the user property
interface RequestWithUser extends FastifyRequest {
    user?: AuthenticatedUser;
    fastify: FastifyInstance; // To run express-validator
}

// Define an interface for the expected request body
interface ChangePasswordBody {
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
}

/** Validation rules for express-validator */
const validatePasswordChange = async (req: any) => { // express-validator expects Express.Request
    await body('current_password')
        .notEmpty().withMessage('Current password is required.')
        .run(req);
    await body('new_password')
        .notEmpty().withMessage('New password is required.')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
        .run(req);
    await body('confirm_password')
        .notEmpty().withMessage('Confirm password is required.')
        .custom((value: string, { req: request }: any) => { // request here is express-validator's req
            if (value !== request.body.new_password) {
                throw new Error('New password and confirm password do not match.');
            }
            return true;
        })
        .run(req);

    return validationResult(req);
};


async function user_change_password(fastify_instance: FastifyInstance, req: RequestWithUser): Promise<responseObject> {
    const models = Models.get();
    const bodyParams = req.body as ChangePasswordBody;

    if (!req.user || !req.user.id) {
        throw new custom_error('User not authenticated.', 401, 'Authentication required');
    }
    const userId = req.user.id;

    // Run validation using a temporary object that express-validator can work with
    // Fastify's req needs to be adapted for express-validator
    const tempReq = {
        body: req.body,
        // express-validator might require other properties from Express.Request,
        // but for body validation, this should suffice.
    };
    const validationErrors = await validatePasswordChange(tempReq);
    if (!validationErrors.isEmpty()) {
        return response(422, 'Validation error', validationErrors.array());
    }

    try {
        const user = await models.UserModel.findByPk(userId);

        if (!user) {
            throw new custom_error(`User with ID ${userId} not found.`, 404, 'User not found');
        }

        // Verify current password
        const isMatch = await bcrypt.compare(bodyParams.current_password!, user.password);
        if (!isMatch) {
            throw new custom_error('Incorrect current password.', 400, 'Invalid credentials');
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(bodyParams.new_password!, saltRounds);

        // Update password
        await user.update({ password: hashedNewPassword });

        return response(200, 'Password changed successfully.', {});

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            const message = error.message || 'An unexpected error occurred while changing the password.';
            throw new custom_error(message, 500, 'Server error', uid);
        }
        throw error;
    }
}

export default user_change_password;

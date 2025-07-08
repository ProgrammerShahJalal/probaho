import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import Models from '../../../database/models';
import response from '../../../helpers/response';
import { responseObject } from '../../../common_types/object';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';
import moment from 'moment'; // For unique file naming if photo is updated

// Define an interface for the user object if not already available globally
interface AuthenticatedUser {
    id: number | string;
    // other user properties
}

// Extend FastifyRequest to include the user property
interface RequestWithUser extends FastifyRequest {
    user?: AuthenticatedUser;
    fastify: FastifyInstance; // To run express-validator and upload
}

// Define an interface for the expected request body parts that are updatable
interface UpdateOwnProfileBody {
    name?: string;
    email?: string;
    phone_number?: string;
    photo?: any; // This will be the file object from fastify-multipart
}

/** Validation rules for express-validator */
const validateProfileUpdate = async (req: any) => { // express-validator expects Express.Request
    // Optional validation: only validate if fields are present
    // Fastify multipart might put file info elsewhere, so direct body validation for 'photo' might not work as expected here.
    // File validation (type, size) should ideally be handled during file processing.

    await body('name')
        .optional()
        .notEmpty().withMessage('Name cannot be empty if provided.')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.')
        .run(req);

    await body('email')
        .optional()
        .notEmpty().withMessage('Email cannot be empty if provided.')
        .isEmail().withMessage('Must be a valid email address.')
        .run(req);

    // Check for email uniqueness if it's being changed
    // This requires async custom validation and access to models
    // await body('email').custom(async (value, { req }) => {
    //     if (value && req.user) {
    //         const models = Models.get();
    //         const existingUser = await models.UserModel.findOne({ where: { email: value } });
    //         if (existingUser && existingUser.id !== req.user.id) {
    //             throw new Error('Email already in use.');
    //         }
    //     }
    //     return true;
    // }).run(req);


    await body('phone_number')
        .optional()
        // Add any specific phone number validation if needed, e.g., regex
        .notEmpty().withMessage('Phone number cannot be empty if provided.')
        .run(req);

    return validationResult(req);
};

async function update_own_profile(fastify_instance: FastifyInstance, req: RequestWithUser): Promise<responseObject> {
    const models = Models.get();
    const bodyParams = req.body as UpdateOwnProfileBody;

    if (!req.user || !req.user.id) {
        throw new custom_error('User not authenticated.', 401, 'Authentication required');
    }
    const userId = req.user.id;

    // Adapt req for express-validator
    const tempReq = { body: req.body, user: req.user }; // Pass user for custom validation if needed
    const validationErrors = await validateProfileUpdate(tempReq);
    if (!validationErrors.isEmpty()) {
        return response(422, 'Validation error', validationErrors.array());
    }

    try {
        const user = await models.UserModel.findByPk(userId);
        if (!user) {
            throw new custom_error(`User with ID ${userId} not found.`, 404, 'User not found');
        }

        const updateData: { name?: string; email?: string; phone_number?: string; photo?: string } = {};

        if (bodyParams.name && bodyParams.name !== user.name) {
            updateData.name = bodyParams.name;
        }
        if (bodyParams.email && bodyParams.email !== user.email) {
            // Add email uniqueness check before assigning
            const existingUserByEmail = await models.UserModel.findOne({ where: { email: bodyParams.email } });
            if (existingUserByEmail && existingUserByEmail.id !== userId) {
                 throw new custom_error('Email already in use by another account.', 409, 'Validation conflict');
            }
            updateData.email = bodyParams.email;
        }
        if (bodyParams.phone_number && bodyParams.phone_number !== user.phone_number) {
            updateData.phone_number = bodyParams.phone_number;
        }

        // Handle photo upload
        if (bodyParams.photo && bodyParams.photo.name && bodyParams.photo.data && typeof bodyParams.photo.name === 'string') {
            if (!(fastify_instance as any).upload) {
                throw new custom_error('File upload capability is not configured on the server.', 500, 'Configuration error');
            }

            const photoData = bodyParams.photo; // This is { data: Buffer, name: string, ext: string }

            // Construct path using photoData.name
            const image_path = 'uploads/users/' + moment().format('YYYYMMDDHHmmss') + '_' + photoData.name;
            
            // Pass photoData directly to the upload function
            await (fastify_instance as any).upload(photoData, image_path);
            updateData.photo = image_path;
            // TODO: Optionally, delete the old photo if it exists and is different
        }

        if (Object.keys(updateData).length > 0) {
            await user.update(updateData);
        }

        // Refetch user to return updated data, especially the photo URL
        const updatedUser = await models.UserModel.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'phone_number', 'photo', 'slug'],
        });

        return response(200, 'Profile updated successfully', updatedUser || {});

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            const message = error.message || 'An unexpected error occurred while updating the profile.';
            throw new custom_error(message, 500, 'Server error', uid);
        }
        throw error;
    }
}

export default update_own_profile;

import { FastifyRequest } from 'fastify';
import Models from '../../../database/models';
import response from '../../../helpers/response';
import { responseObject } from '../../../common_types/object';
import custom_error from '../../../common/errors/custom_error';
import error_trace from '../../../common/errors/error_trace';

// Define an interface for the user object if not already available globally
// This might come from your authentication middleware
interface AuthenticatedUser {
    id: number | string;
    // other user properties if available from auth
}

// Extend FastifyRequest to include the user property
interface RequestWithUser extends FastifyRequest {
    user?: AuthenticatedUser;
}

async function get_user_profile(req: RequestWithUser): Promise<responseObject> {
    const models = Models.get();

    if (!req.user || !req.user.id) {
        throw new custom_error(
            'User not authenticated or user ID not found.',
            401,
            'Authentication required',
        );
    }

    const userId = req.user.id;

    try {
        const user = await models.UserModel.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'phone_number', 'photo', 'slug'], // Specify attributes to return
        });

        if (!user) {
            throw new custom_error(
                `User with ID ${userId} not found.`,
                404,
                'User not found',
            );
        }

        // Transform photo path if necessary, e.g., to a full URL
        // For now, assume 'photo' field stores a relative path or a full URL that client can use
        // If photo is stored like 'uploads/users/image.png', and you want to make it a full URL:
        // user.photo = user.photo ? `${process.env.APP_URL}/${user.photo}` : null;

        return response(200, 'User profile fetched successfully', user);

    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            // Ensure a default message if error.message is not informative
            const message = error.message || 'An unexpected error occurred while fetching the profile.';
            throw new custom_error(message, 500, 'Server error', uid);
        }
        throw error;
    }
}

export default get_user_profile;

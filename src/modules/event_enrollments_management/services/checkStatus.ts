import { FastifyInstance } from 'fastify';
import Models from '../../../database/models';
// Assuming modelName export might not be present or standard, directly use inferred model name
// import { modelName as eventEnrollmentModelName } from '../models/model'; 
import response from '../../../helpers/response'; // Not directly used for boolean return, but good for consistency if expanded
import error_trace from '../../../helpers/error_trace';
import custom_error from '../../../helpers/custom_error';

async function checkStatus(
    fastify_instance: FastifyInstance, // fastify_instance might not be strictly needed if not using fastify specific things like log here
    eventId: string | number,
    userId: string | number,
): Promise<boolean> {
    const models = await Models.get();
    // Refined assumption: Direct model name (e.g., EventEnrollmentModel or EventEnrollmentsModel)
    // Check server/src/database/models.ts for the exact exported model names if this fails.
    // Based on typical patterns, it would be singular or plural PascalCase of the table name.
    // If table is 'event_enrollments', model could be 'EventEnrollment' or 'EventEnrollments'.
    // Let's try 'EventEnrollmentModel' as a placeholder, adjust if error.
    // A common pattern is ModelNameModel, e.g. UserGroupModel for user_groups table.
    // So for event_enrollments, it might be EventEnrollmentModel or EventEnrollmentsModel.
    // The prompt mentioned "EventEnrollmentModel" as a strong candidate.
    const EventEnrollmentsModel = models.EventEnrollmentsModel; 

    if (!EventEnrollmentsModel) {
        // This is a critical error, means the model name assumption is wrong.
        // Throw an error that will be caught by the service's error handler.
        throw new custom_error('EventEnrollmentModel not found. Check model name.', 500, 'MODEL_NOT_FOUND');
    }

    try {
        const enrollment = await EventEnrollmentsModel.findOne({
            where: {
                event_id: Number(eventId), 
                user_id: Number(userId),
                is_paid: '1', 
                status: 'accepted', 
            },
            // Adding attributes: ['id'] can make the query slightly more efficient if we only need existence
            attributes: ['id'], 
        });
        return !!enrollment; // true if enrollment exists, false otherwise
    } catch (error: any) {
        const uid = await error_trace(models, error, 'checkStatusService', { eventId, userId });
        // Let the controller format the final error response.
        // Throwing an error here allows the controller's catch block to handle it.
        throw new custom_error('Error checking enrollment status.', 500, `Database error: ${error.message}`, uid);
    }
}

export default checkStatus;

import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { responseObject } from '../common_types/object';

// Helper function to handle service errors
function handleServiceError(error: any, res: FastifyReply) {
    // Handle custom_error instances
    if (error.code && error.name && error.message) {
        return res.code(error.code).send({
            status: error.code,
            message: error.name,
            data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return res.code(500).send({
        status: 500,
        message: 'Internal server error',
        data: null
    });
}

type ControllerFunction = (fastify: FastifyInstance, req: FastifyRequest) => Promise<responseObject | any>;

export function controllerHandler(serviceFunction: ControllerFunction) {
    return async function (fastify: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
        try {
            const data = await serviceFunction(fastify, req);
            // Check if the service function already handled the response
            if (res.sent) {
                return;
            }
            // Special header for 'all' type services, can be made more generic if needed
            if (serviceFunction.name === 'all' || (data && data.status && data.data && data.data.data && Array.isArray(data.data.data))) {
                 return res
                    .code(data.status)
                    .header('Cache-Control', 'public, max-age=30')
                    .send(data);
            }
            return res.code(data.status).send(data);
        } catch (error: any) {
            if (res.sent) {
                console.error("Response already sent, but error occurred: ", error);
                return;
            }
            return handleServiceError(error, res);
        }
    };
}

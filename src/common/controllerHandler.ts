import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { responseObject } from '../common_types/object';

// Helper function to handle service errors (can be imported or redefined as needed)
export function handleServiceError(error: any, res: FastifyReply) {
    if (error.code && error.name && error.message) {
        return res.code(error.code).send({
            status: error.code,
            message: error.name,
            data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
        });
    }
    console.error('Unexpected error:', error);
    return res.code(500).send({
        status: 500,
        message: 'Internal server error',
        data: null
    });
}

// Higher-order function to create controller handlers
export function createControllerHandler(
    serviceFn: (fastify: FastifyInstance, req: FastifyRequest) => Promise<responseObject>,
    fastify: FastifyInstance,
    options?: { cache?: boolean }
) {
    return async function (req: FastifyRequest, res: FastifyReply) {
        try {
            const data = await serviceFn(fastify, req);
            let response = res.code(data.status);
            if (options?.cache) {
                response = response.header('Cache-Control', 'public, max-age=30');
            }
            return response.send(data);
        } catch (error: any) {
            return handleServiceError(error, res);
        }
    };
}

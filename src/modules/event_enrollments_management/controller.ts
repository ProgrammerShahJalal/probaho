'use strict';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import allService from './services/all';
import detailsService from './services/details';
import softDeleteService from './services/soft_delete';
import storeService from './services/store';
import checkStatusService from './services/checkStatus'; // Corrected import name
import updateService from './services/update';
import restoreService from './services/restore';
import destroyService from './services/destroy';
import importService from './services/import';
import findByEventService from './services/findByEvent';
import { controllerHandler } from '../../helpers/controller_handler';

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    // Custom handler for checkEnrollmentStatus since it has a different signature
    const checkEnrollmentStatusHandler = async (
        req: FastifyRequest,
        res: FastifyReply,
    ) => {
        const { eventId, userId } = req.query as {
            eventId: string;
            userId: string;
        };
        try {
            // Directly call the service, assuming it handles its own response or returns data for controllerHandler compatibility
            // If checkStatusService is not compatible with controllerHandler, manual handling is needed here
            const isEnrolled = await checkStatusService(
                fastify, // Pass fastify instance if needed by the service
                eventId,
                userId,
            );
            // Assuming checkStatusService returns a boolean or similar, wrap it for consistent response
            return res.code(200).send({ status: 200, message: 'Success', data: { isEnrolled } });
        } catch (error: any) {
            // Re-use existing error handling logic if possible, or define specific logic
            if (error.code && error.name && error.message) {
                return res.code(error.code).send({
                    status: error.code,
                    message: error.name,
                    data: error.uid ? { uid: error.uid, details: error.message } : { details: error.message }
                });
            }
            console.error('Unexpected error in checkEnrollmentStatusHandler:', error);
            return res.code(500).send({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    };

    return {
        all: async (req: FastifyRequest, res: FastifyReply) => handle(allService)(req, res),
        checkEnrollmentStatusHandler, // Use the custom handler
        find: async (req: FastifyRequest, res: FastifyReply) => handle(detailsService)(req, res),
        findByEvent: async (req: FastifyRequest, res: FastifyReply) => handle(findByEventService)(req, res),
        store: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(updateService)(req, res),
        soft_delete: async (req: FastifyRequest, res: FastifyReply) => handle(softDeleteService)(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(restoreService)(req, res),
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(destroyService)(req, res),
        import: async (req: FastifyRequest, res: FastifyReply) => handle(importService)(req, res),
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

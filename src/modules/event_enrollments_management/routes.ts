'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';

module.exports = function (
    fastify: FastifyInstance,
    opts: {},
    done: () => void,
) {
    const controllerInstance = controller(fastify);
    let prefix: string = '/event-enrollments';

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(`${prefix}/by-event/:id`, controllerInstance.findByEvent)
        .get(
            `${prefix}/check`,
            {
                schema: {
                    querystring: {
                        type: 'object',
                        properties: {
                            eventId: { type: 'string' },
                            userId: { type: 'string' },
                        },
                        required: ['eventId', 'userId'],
                    },
                },
            },
            controllerInstance.checkEnrollmentStatusHandler,
        );

    done();
};

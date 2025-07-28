'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';

module.exports = function (fastify: FastifyInstance, opts: {}, done: () => void) {
    let prefix: string = '/academic-rules-types';
    const controllerInstance = controller(fastify);

    fastify.register(
        async (route, opts) => {
            route
                .get(`/`, controllerInstance.all)
                .post(`/store`, controllerInstance.store)
                .post(`/update`, controllerInstance.update)
                .post(`/soft-delete`, controllerInstance.soft_delete)
                .post(`/inactive`, controllerInstance.inactive)
                .post(`/active`, controllerInstance.active)
                .post(`/trash`, controllerInstance.trash)
                .post(`/restore`, controllerInstance.restore)
                .post(`/destroy`, controllerInstance.destroy)
                .post(`/import`, controllerInstance.import_academic_calendar_event_types)
                .get(`/:id`, controllerInstance.find);
        },
        { prefix },
    );

    done();
};

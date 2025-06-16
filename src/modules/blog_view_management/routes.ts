'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';

module.exports = function (fastify: FastifyInstance, opts: {}, done: () => void) {
    const controllerInstance = controller(fastify);
    let prefix: string = '/blog-views';

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .get(`${prefix}/:id`, controllerInstance.find)
        ;

    done();
};

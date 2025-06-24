'use strict';
import {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
} from 'fastify';
import allService from './services/all';
import detailsService from './services/details';
import softDeleteService from './services/soft_delete';
import storeService from './services/store';
import updateService from './services/update';
import restoreService from './services/restore';
import destroyService from './services/destroy';
import importService from './services/import';
import { controllerHandler } from '../../helpers/controller_handler';

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    // Modified service function to include IP logging
    const logIpThenExecute = (serviceFunc) => async (fastifyInstance, req) => {
        console.log(`Client IP: ${req.ip}`);
        return serviceFunc(fastifyInstance, req);
    };

    return {
        all: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(allService))(req, res),
        find: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(detailsService))(req, res),
        store: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(storeService))(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(updateService))(req, res),
        soft_delete: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(softDeleteService))(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(restoreService))(req, res),
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(destroyService))(req, res),
        import: async (req: FastifyRequest, res: FastifyReply) => handle(logIpThenExecute(importService))(req, res),
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

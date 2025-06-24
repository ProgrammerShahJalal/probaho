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
import slugService from './services/slug';
import trashService from './services/trash';
import inactiveService from './services/inactive';
import activeService from './services/active';
import { controllerHandler } from '../../helpers/controller_handler';

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    return {
        all: async (req: FastifyRequest, res: FastifyReply) => handle(allService)(req, res),
        find: async (req: FastifyRequest, res: FastifyReply) => handle(detailsService)(req, res),
        slug: async (req: FastifyRequest, res: FastifyReply) => handle(slugService)(req, res),
        store: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(updateService)(req, res),
        soft_delete: async (req: FastifyRequest, res: FastifyReply) => handle(softDeleteService)(req, res),
        inactive: async (req: FastifyRequest, res: FastifyReply) => handle(inactiveService)(req, res),
        active: async (req: FastifyRequest, res: FastifyReply) => handle(activeService)(req, res),
        trash: async (req: FastifyRequest, res: FastifyReply) => handle(trashService)(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(restoreService)(req, res),
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(destroyService)(req, res),
        import: async (req: FastifyRequest, res: FastifyReply) => handle(importService)(req, res),
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

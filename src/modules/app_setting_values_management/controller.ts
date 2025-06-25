import {
    FastifyInstance,
} from 'fastify';
<<<<<<< HEAD
import all from './services/all';
import details from './services/details';
import soft_delete from './services/soft_delete';
import store from './services/store';
import update from './services/update';
import restore from './services/restore';
import destroy from './services/destroy';
import data_import from './services/import';
import findByTitle from './services/findByTitle';
import { createControllerHandler } from '../../common/controllerHandler';
=======
import allService from './services/all';
import detailsService from './services/details';
import softDeleteService from './services/soft_delete';
import storeService from './services/store';
import updateService from './services/update';
import restoreService from './services/restore';
import destroyService from './services/destroy';
import importService from './services/import';
import findByTitleService from './services/findByTitle';
import { controllerHandler } from '../../helpers/controller_handler';
>>>>>>> d44aa974fd2a24c9baba30d70238bbcb983e6bce

export default function (fastify: FastifyInstance) {
    const handle = (service) => controllerHandler(service.bind(null, fastify));

    return {
<<<<<<< HEAD
        all: createControllerHandler(all, fastify, { cache: true }),
        find: createControllerHandler(details, fastify),
        findByTitle: createControllerHandler(findByTitle, fastify),
        store: createControllerHandler(store, fastify),
        update: createControllerHandler(update, fastify),
        soft_delete: createControllerHandler(soft_delete, fastify),
        restore: createControllerHandler(restore, fastify),
        destroy: createControllerHandler(destroy, fastify),
        import: createControllerHandler(data_import, fastify),
=======
        all: async (req: FastifyRequest, res: FastifyReply) => handle(allService)(req, res),
        find: async (req: FastifyRequest, res: FastifyReply) => handle(detailsService)(req, res),
        findByTitle: async (req: FastifyRequest, res: FastifyReply) => handle(findByTitleService)(req, res),
        store: async (req: FastifyRequest, res: FastifyReply) => handle(storeService)(req, res),
        update: async (req: FastifyRequest, res: FastifyReply) => handle(updateService)(req, res),
        soft_delete: async (req: FastifyRequest, res: FastifyReply) => handle(softDeleteService)(req, res),
        restore: async (req: FastifyRequest, res: FastifyReply) => handle(restoreService)(req, res),
        destroy: async (req: FastifyRequest, res: FastifyReply) => handle(destroyService)(req, res),
        import: async (req: FastifyRequest, res: FastifyReply) => handle(importService)(req, res),
>>>>>>> d44aa974fd2a24c9baba30d70238bbcb983e6bce
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

import {
    FastifyInstance,
} from 'fastify';
import all from './services/all';
import details from './services/details';
import soft_delete from './services/soft_delete';
import store from './services/store';
import update from './services/update';
import restore from './services/restore';
import destroy from './services/destroy';
import data_import from './services/import';
import slug from './services/slug';
import trash from './services/trash';
import inactive from './services/inactive';
import active from './services/active';
import { createControllerHandler } from '../../common/controllerHandler';
import { controllerHandler } from '../../helpers/controller_handler';

export default function (fastify: FastifyInstance) {
    const handle = (service: (...args: any[]) => any) => controllerHandler(service.bind(null, fastify));

    return {
        all: createControllerHandler(all, fastify, { cache: true }),
        find: createControllerHandler(details, fastify),
        slug: createControllerHandler(slug, fastify),
        store: createControllerHandler(store, fastify),
        update: createControllerHandler(update, fastify),
        soft_delete: createControllerHandler(soft_delete, fastify),
        inactive: createControllerHandler(inactive, fastify),
        active: createControllerHandler(active, fastify),
        trash: createControllerHandler(trash, fastify),
        restore: createControllerHandler(restore, fastify),
        destroy: createControllerHandler(destroy, fastify),
        import: createControllerHandler(data_import, fastify),
        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

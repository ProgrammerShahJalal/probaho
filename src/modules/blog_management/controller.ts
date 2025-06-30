'use strict';
import {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
} from 'fastify';
import all from './services/all';
import details from './services/details';
import soft_delete from './services/soft_delete';
import store from './services/store';
import { responseObject } from '../../common_types/object';
import update from './services/update';
import restore from './services/restore';
import destroy from './services/destroy';
import data_import from './services/import';
import slug from './services/slug';
import trash from './services/trash';
import inactive from './services/inactive';
import active from './services/active';
import { handleServiceError } from '../../common/utils/controller_utils';


export default function (fastify: FastifyInstance) {
    return {
        all: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await all(fastify, req);
                return res
                    .code(data.status)
                    .header('Cache-Control', 'public, max-age=30')
                    .send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        find: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await details(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        slug: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await slug(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        store: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await store(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        update: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data: responseObject = await update(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        soft_delete: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await soft_delete(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },
        inactive: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await inactive(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },
        active: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await active(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        trash: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await trash(fastify, req); // Ensure 'trash' service is called
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res); // Use existing error handler
            }
        },

        restore: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await restore(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        destroy: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await destroy(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        import: async function (req: FastifyRequest, res: FastifyReply) {
            try {
                let data = await data_import(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
            }
        },

        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

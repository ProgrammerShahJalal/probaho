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
import { handleServiceError } from '../../common/utils/controller_utils';
import trash from './services/trash';
import inactive from './services/inactive';
import active from './services/active';
import import_academic_batch_id_rules from './services/import_academic_calendar_event_types';
import import_academic_calendar_event_types from './services/import_academic_calendar_event_types';


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
                let data = await trash(fastify, req);
                return res.code(data.status).send(data);
            } catch (error: any) {
                return handleServiceError(error, res);
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

        import_academic_calendar_event_types: async function (req: FastifyRequest, res: FastifyReply) {
                    try {
                        // The file should be available in req.body due to `attachFieldsToBody: 'keyValues'`
                        // and the custom onFile handler in app.ts.
                        // The request log indicates the frontend is sending the file with the field name 'file'.
                        const filePart = (req.body as any)?.file;
        
                        if (!filePart || !filePart.data || !filePart.name) {
                             return res.code(400).send({
                                status: 400,
                                message: 'No file uploaded or file is corrupted. Ensure the file is sent under the field name "file".',
                                data: null,
                            });
                        }
                        
                        // Pass the file part (which includes data, name, ext) to the service
                        // The service expects the raw file buffer/string, so we adjust how it's passed or handled.
                        // For now, we pass the 'filePart' which the service expects to have a 'data' property (Buffer)
                        // and 'name' property.
                        // We also need to modify the service to correctly access this.
                        // Let's create a simplified request object for the service, or modify the service.
                        // For now, the service expects `(req as any).file` to be the file object.
                        // We will adapt this by attaching the file to a temporary property on req.
                        (req as any).filePayload = filePart;
        
        
                        let data: responseObject = await import_academic_calendar_event_types(fastify, req);
                        return res.code(data.status).send(data);
                    } catch (error: any) {
                        return handleServiceError(error, res);
                    }
                },

        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}

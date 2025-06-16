import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import AutoLoad from '@fastify/autoload';
import view from '@fastify/view';
import path from 'path';
import { Sequelize } from 'sequelize';
import { FastifyCookieOptions } from '@fastify/cookie';
import get_recursive_route_files_by_directory from '../helpers/get_recursive_route_files_by_directory';
import { app_config } from '../configs/app.config';
const underPressure = require('@fastify/under-pressure');
import fastifyCors from '@fastify/cors';

import { init as initEventCategories } from "../modules/event_categories_management/models/model_relations";
import { init as initEvents } from "../modules/event_management/models/model_relations";


class FastifyApp {
    private fastify: FastifyInstance;

    constructor() {
        this.fastify = Fastify({ logger: true });
    }

    async register(sequelizeInstance: Sequelize) {
        // Initialize models
        initEventCategories();
        initEvents();
        await this.registerMultipartSupport();
        await this.registerRoutes();
        await this.registerPlugins(sequelizeInstance);
        await this.registerMiddlewares();
        this.setHandlers(sequelizeInstance);
    }


    private async registerMiddlewares() {
        const commonMiddleware = async (request: FastifyRequest) => {
            const extension = path.extname(request.raw.url as string).toLowerCase();

            if (extension !== '') {
                if (
                    [
                        '.ico',
                        '.jpg',
                        '.jpeg',
                        '.webp',
                        '.png',
                        '.gif',
                        '.svg',
                        '.mp4',
                        '.webm',
                        '.pdf',
                        '.css',
                        '.js',
                        '.js.map',
                        '.map',
                        '.ttf',
                        '.woff',
                        '.woff2',
                    ].includes(extension)
                ) {
                    return;
                } else {
                    throw new Error('not found');
                }
            }
            return;
        };

        this.fastify.addHook('onRequest', commonMiddleware as any);
    }

    private async registerMultipartSupport() {
        async function onFile(part: any) {
            if (part.type === 'file' && part.filename) {
                const buff = await part.toBuffer();
                part.value = {
                    data: Buffer.from(buff, 'base64'),
                    name: part.filename,
                    ext: '.' + part.filename.split('.')[1],
                };
            }
        }

        this.fastify.register(require('@fastify/multipart'), {
            attachFieldsToBody: 'keyValues',
            onFile,
            limits: {
                fileSize: 6000000 * 10,
            },
        });
    }

    private async registerRoutes() {
        const routesPath = 'modules';
        const routesFiles: string[] = await await get_recursive_route_files_by_directory(routesPath, 'routes.ts');

        console.log(`\n`);
        routesFiles.forEach((routes: string) => {
            console.log(`setting up ${routes}`);

            let route_path = path.join(app_config.project_path, routes);
            this.fastify.register(require(route_path), {
                prefix: 'api/v1',
            });
        });
        console.log(`\n`);
    }


    private async registerPlugins(sequelizeInstance: Sequelize) {
        console.log('setting up db globally');
        this.fastify.decorate('db', sequelizeInstance);

        console.log('setting up plugins');
        this.fastify.register(AutoLoad, {
            dir: path.resolve(path.join(__dirname), '../plugins'),
        });

        let route_path = path.resolve(path.join(__dirname), '../routes');
        this.fastify.register(AutoLoad, {
            dir: route_path,
        });

        console.log('setting up cookies');
        this.fastify.register(require('@fastify/cookie'), {
            secret: 'fast#2$4@4!cokie02ms',
            hook: 'onRequest',
            parseOptions: {
                httpOnly: true,
                secure: true,
            },
        } as FastifyCookieOptions);

        console.log('setting up under pressure');
        this.fastify.register(underPressure, {
            maxEventLoopDelay: 1000,
            maxHeapUsedBytes: 1000000000000,
            maxRssBytes: 1000000000000,
            maxEventLoopUtilization: 0.98,
            message: 'Under pressure!',
            retryAfter: 50,
            pressureHandler: (
                req: FastifyRequest,
                rep: FastifyReply,
                type: string,
                value: string,
            ) => {
                if (type === underPressure.TYPE_HEAP_USED_BYTES) {
                    this.fastify.log.warn(`too many heap bytes used: ${value}`);
                } else if (type === underPressure.TYPE_RSS_BYTES) {
                    this.fastify.log.warn(`too many rss bytes used: ${value}`);
                }
                // rep.send('out of memory')
            },
        });

        console.log('setting up static folder');
        this.fastify.register(require('@fastify/static'), {
            root: path.resolve(path.join(__dirname), '../../public'),
            prefix: '/',
        });

        console.log('setting up view engine');
        this.fastify.register(view, {
            engine: { ejs: require('ejs') },
            root: path.resolve(path.join(__dirname), '../../public/views'),
        });

        const FRONTEND_URL = process.env.FRONTEND_LIVE_URL;


        this.fastify.register(fastifyCors, {
            origin: `${FRONTEND_URL}`,
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
            credentials: true, // Allow cookies/auth headers
        });
    }

    private setHandlers(sequelizeInstance: Sequelize) {
        console.log('setting up hooks \n');

        this.fastify
            .setNotFoundHandler((req, res) => {
                return (this.fastify as any).set_log('404', {}, res, req);
            })
            .setErrorHandler(async (error, req, res) => {
                console.error(error);
                let error_code = (error as any).code || '500';
                let error_message = (error as any).message || 'Internal Server Error';
                let error_status = (error as any).name || 'Server Error';
                res.status(error_code)
                    .send({ message: error_message, code: error_code, status: error_status });
            })
            .addHook('onRequest', async (request, reply) => {
                request.raw.on('close', () => {

                    console.log('\n' + request.url);
                    console.log(request.query);
                    console.log(request.body);
                    console.log('\x1b[32m', 'request closed', '\x1b[37m', '\n');

                    // sequelizeInstance?.close();
                });
            });
    }

    async start(port: number) {
        console.log('\nserver is ready to start. \n');

        try {
            await this.fastify.listen({ port, host: '0.0.0.0' });
            console.log('\x1b[32m', `\nServer is running on http://127.0.0.1:${port}`, '\x1b[37m', `\n`);
        } catch (err) {
            this.fastify.log.error(err);
            process.exit(1);
        }
    }
}

export default FastifyApp;

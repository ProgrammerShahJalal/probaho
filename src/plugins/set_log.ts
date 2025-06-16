'use strict';

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import error_trace from '../helpers/error_trace';

interface anyObject {
    [key: string]: any;
}

// const fp = require('fastify-plugin')
const pino = require('pino');
const fs = require('node:fs');

export default fp(function (fastify, opts = {}, done) {
    fastify.decorate(
        'set_log',
        function (
            error_code: string = '',
            // error: FastifyError | { stack: any; message: any },
            error: anyObject,
            res: FastifyReply,
            req: FastifyRequest,
        ): string {
            var streams = [
                // { stream: fs.createWriteStream('logs/info.log', { flags: 'a' }) },
                // { level: 'debug', stream: fs.createWriteStream('logs/debug.log', { flags: 'a' }) },
                // { stream: require('pino-pretty')() },
                {
                    level: 'fatal',
                    stream: fs.createWriteStream('logs/fatal.log', {
                        flags: 'a',
                    }),
                },
            ];

            var log = pino(
                {
                    level: 'debug',
                },
                pino.multistream(streams),
            );

            let stacks: string[] = [];
            let errors: { file: string; time: string; message: string } = {
                file: '',
                time: '',
                message: '',
            };
            let error_message = '';

            if (error.stack) {
                stacks = error.stack.split(' at ');
                errors = {
                    file: '',
                    time:
                        new Date().toLocaleDateString() +
                        ' ' +
                        new Date().toLocaleTimeString(),
                    message: error.message,
                };
                if (stacks.length && stacks[1]) {
                    const regex = /services[^)]*\)/;
                    console.log('staks \n',stacks);
                    
                    if (Object.prototype.hasOwnProperty.call(stacks[1], 'match')) {
                        const match = stacks[1].match(regex);
                        if (match) {
                            errors.file = match[0];
                        }
                    }
                    
                }
            }

            if (error_code == '404') {
                log = pino(
                    {
                        level: 'debug',
                    },
                    pino.multistream([
                        {
                            level: 'fatal',
                            stream: fs.createWriteStream('logs/404.log', {
                                flags: 'a',
                            }),
                        },
                        { stream: require('pino-pretty')() },
                    ]),
                );
                log.fatal({ error: '404', url: req.url });
                error.message = error_message = 'target not found';
            }

            if (error_code == '500') {
                log.fatal(errors);
                error_message = 'internal server error';
            }

            error_trace(null, error, req.url, req.params);


            // console.log('\x1b[31m');

            console.log(error.message);
            // console.log(stacks[1] || '');

            // console.log('\x1b[46m');
            // console.log(error);
            // console.log('\x1b[40m');

            console.log('');

            let response: anyObject = {
                status: error.code || error_code,
                message: error.message,
                data: errors,
            };

            if (error.uid) {
                response.error_trace_id = error.uid;
            }

            res.status(error.code || parseInt(error_code)).send(response);
            return 'log print';
        },
    );
    done();
});

declare module 'fastify' {
    export interface FastifyInstance {
        /**
         ```
            set_log('400', {stack:'', message,''})
         ```
         */
        set_log(
            error_code: string,
            error: FastifyError | {},
            res: FastifyReply,
            req: FastifyRequest,
        ): string;
    }
}

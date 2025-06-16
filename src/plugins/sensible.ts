'use strict';

import {
    DoneFuncWithErrOrRes,
    FastifyInstance,
    FastifyPluginOptions,
} from 'fastify';

const fp = require('fastify-plugin');

module.exports = fp(function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: () => void,
) {
    fastify.register(require('@fastify/sensible'), {
        errorHandler: false,
    });
    done();
});

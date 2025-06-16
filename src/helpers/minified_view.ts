import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance, path: string) {
    const { minify } = require('html-minifier-terser');
    const html = await fastify.view(path);
    const result = await minify(html, {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
    });

    return result;
}

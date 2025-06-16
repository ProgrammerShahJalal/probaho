import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { Model } from 'sequelize';

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

async function getDataWithPagination(
    req: FastifyRequest,
    page: number,
    pageSize: number,
    model: Model,
    query: { [key: string]: any },
) {
    if (typeof page === 'string') {
        page = parseInt(page);
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const data = await (model as any).findAndCountAll({
        offset,
        limit,
        ...query,
    });

    // console.log(query);

    const totalPages = Math.ceil(data.count / pageSize);
    // let baseUrl = req.protocol + '://' + req.hostname + req.url.split('?')[0];

    let baseUrl = req.protocol + '://' + req.hostname + req.url;
    let url: URL = new URL(baseUrl);
    let path = url.pathname;
    baseUrl = url.origin + req.hostname + path + url.search;

    let next_page_url = null;
    let prev_page_url = null;
    let first_page_url = null;
    let last_page_url = null;
    if (page < totalPages) {
        url.searchParams.set('page', (page + 1).toString());
        next_page_url = url.href;
    }
    if (page > totalPages) {
        url.searchParams.set('page', (page - 1).toString());
        prev_page_url = url.href;
    }

    last_page_url = url.searchParams.set('page', totalPages.toString());
    first_page_url = url.searchParams.set('page', '1');

    const response = {
        current_page: page,
        data: data.rows.map((user: { [key: string]: any }) => user),
        first_page_url,
        from: offset + 1,
        last_page: totalPages,
        last_page_url: `${baseUrl}&page=${totalPages}`,
        links: generatePaginationLinks(baseUrl, page, totalPages, url),
        next_page_url,
        path: baseUrl,
        per_page: typeof pageSize === 'string' ? parseInt(pageSize) : pageSize,
        prev_page_url,
        to: offset + data.rows.length,
        total: data.count,
    };

    return response;
}

function generatePaginationLinks(
    baseUrl: string,
    currentPage: number,
    totalPages: number,
    url: URL,
) {
    const links = [];

    // Previous page link
    url.searchParams.set('page', (currentPage - 1).toString());
    links.push({
        url: currentPage > 1 ? url.href : null,
        label: `<span class="material-symbols-outlined fill">chevron_left</span>`,
        active: false,
    });

    // Page links
    for (let i = 1; i <= totalPages; i++) {
        url.searchParams.set('page', i.toString());
        links.push({
            url: url.href,
            label: typeof i === 'string' ? parseInt(i) : i,
            active:
                i ===
                (typeof currentPage === 'string'
                    ? parseInt(currentPage)
                    : currentPage),
        });
    }

    // Next page link
    url.searchParams.set('page', (currentPage + 1).toString());
    links.push({
        url: currentPage < totalPages ? url.href : null,
        label: `<span class="material-symbols-outlined fill">chevron_right</span>`,
        active: false,
    });

    return links;
}

module.exports.generatePaginationLinks = generatePaginationLinks;

/**
 * 
 * @param {Request} req 
 * @param {Number} page 
 * @param {Number} pageSize 
 * @param {Sequelize} model 
 * @param {Object} query 
 * @returns
 * ```js
    await paginate(req, 1, 10, User);
 */
const paginate = async (
    req: FastifyRequest,
    model: Model,
    pageSize: number = 10,
    query: { [key: string]: any } = {},
) => {
    if (model) {
        let response = await getDataWithPagination(
            req,
            (req.query as any).page || 1,
            pageSize,
            model,
            query,
        );
        return response;
    }

    return {};
};

export default fp<SupportPluginOptions>(
    (fastify: FastifyInstance, opts = {}, done) => {
        fastify.decorate('paginate', paginate);
        done();
    },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        paginate(
            req: FastifyRequest,
            model: Model,
            pageSize: number,
            query: {
                [key: string]: any;
            },
        ): object;
    }
}

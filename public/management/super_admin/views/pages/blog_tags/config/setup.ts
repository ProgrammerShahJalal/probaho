import setup_type from './setup_type';

const prefix: string = 'Blog Tags';
const setup: setup_type = {
    prefix,
    module_name: 'blog_tags',

    route_prefix: 'blog-tags', // react route

    api_host: location.origin,
    api_prefix: 'blog-tags', // api route
    select_fields: 'id,title,status',

    store_prefix: 'blog_tags',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

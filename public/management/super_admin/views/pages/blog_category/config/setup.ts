import setup_type from './setup_type';

const prefix: string = 'Blog Category';
const setup: setup_type = {
    prefix,
    module_name: 'blog_category',

    route_prefix: 'blog-categories', // react route

    api_host: location.origin,
    api_prefix: 'blog-categories', // api route
    select_fields: 'id,title,image,status',

    store_prefix: 'blog_category',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

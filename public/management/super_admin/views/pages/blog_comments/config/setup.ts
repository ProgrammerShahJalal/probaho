import setup_type from './setup_type';

const prefix: string = 'Blog Comments';
const setup: setup_type = {
    prefix,
    module_name: 'blog_comments',

    route_prefix: 'blog-comments', // react route

    api_host: location.origin,
    api_prefix: 'blog-comments', // api route
    select_fields: 'id,user_id,blog_id,comment,status',

    store_prefix: 'blog_comments',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

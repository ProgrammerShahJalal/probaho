import setup_type from './setup_type';

const prefix: string = 'Blog Comment Replies';
const setup: setup_type = {
    prefix,
    module_name: 'blog_comment_replies',

    route_prefix: 'blog-comment-replies', // react route

    api_host: location.origin,
    api_prefix: 'blog-comment-replies', // api route
    select_fields: 'id,user_id,blog_id,parent_comment_id,comment,status',

    store_prefix: 'blog_comment_replies',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

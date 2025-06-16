import setup_type from './setup_type';

const prefix: string = 'Blogs';
const setup: setup_type = {
    prefix,
    module_name: 'blogs',

    route_prefix: 'blogs', // react route

    api_host: location.origin,
    api_prefix: 'blogs', // api route
    select_fields: 'id,title,short_description,full_description,cover_image,is_published,status',

    store_prefix: 'blogs',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

import setup_type from './setup_type';

const prefix: string = 'Event Category';
const setup: setup_type = {
    prefix,
    module_name: 'event_category',

    route_prefix: 'event-categories', // react route

    api_host: location.origin,
    api_prefix: 'event-categories', // api route
    select_fields: 'id,title,image,status',

    store_prefix: 'event_category',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

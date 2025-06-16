import setup_type from './setup_type';

const prefix: string = 'Event Tags';
const setup: setup_type = {
    prefix,
    module_name: 'event_tags',

    route_prefix: 'event-tags', // react route

    api_host: location.origin,
    api_prefix: 'event-tags', // api route
    select_fields: 'id,title,status',

    store_prefix: 'event_tags',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

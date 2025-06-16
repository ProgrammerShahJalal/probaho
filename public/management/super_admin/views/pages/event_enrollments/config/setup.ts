import setup_type from './setup_type';

const prefix: string = 'Event Enrollments';
const setup: setup_type = {
    prefix,
    module_name: 'event_enrollments',

    route_prefix: 'event-enrollments', // react route

    api_host: location.origin,
    api_prefix: 'event-enrollments', // api route
    select_fields: 'id,status',

    store_prefix: 'event_enrollments',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

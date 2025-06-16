import setup_type from './setup_type';

const prefix: string = 'Event Certified Users';
const setup: setup_type = {
    prefix,
    module_name: 'event_certified_users',

    route_prefix: 'event-certified-users', // react route

    api_host: location.origin,
    api_prefix: 'event-certified-users', // api route
    select_fields: 'id,user_id,event_id,scores,grade,date,is_submitted,image,status',

    store_prefix: 'event_certified_users',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

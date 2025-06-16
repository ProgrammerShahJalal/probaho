import setup_type from './setup_type';

const prefix: string = 'Event FAQs';
const setup: setup_type = {
    prefix,
    module_name: 'event_faqs',

    route_prefix: 'event-faqs', // react route

    api_host: location.origin,
    api_prefix: 'event-faqs', // api route
    select_fields: 'id,title,status',

    store_prefix: 'event_faqs',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

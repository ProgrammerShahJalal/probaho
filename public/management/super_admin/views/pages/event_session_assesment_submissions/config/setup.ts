import setup_type from './setup_type';

const prefix: string = 'Event Session Assesment Submissons';
const setup: setup_type = {
    prefix,
    module_name: 'event_session_assesment_submissions',

    route_prefix: 'event-session-assesment-submissions', // react route

    api_host: location.origin,
    api_prefix: 'event-session-assesment-submissions', // api route
    select_fields: 'id,mark,status',

    store_prefix: 'event_sessions_assesment_submissions',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

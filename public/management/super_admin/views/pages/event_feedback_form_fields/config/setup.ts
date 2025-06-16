import setup_type from './setup_type';

const prefix: string = 'Event Feedback Form Fields';
const setup: setup_type = {
    prefix,
    module_name: 'event_feedback_form_fields',

    route_prefix: 'event-feedback-form-fields', // react route

    api_host: location.origin,
    api_prefix: 'event-feedback-form-fields', // api route
    select_fields: 'id,event_id,status',

    store_prefix: 'event_feedback_form_fields',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

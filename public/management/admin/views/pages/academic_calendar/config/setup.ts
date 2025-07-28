import setup_type from './setup_type';

const prefix: string = 'Academic Calendar';
const setup: setup_type = {
    prefix,
    module_name: 'academic_calendar',

    route_prefix: 'academic-calendar', //react route

    api_host: location.origin,
    api_prefix: 'academic-calendar', //api route

    store_prefix: 'academic_calendar',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

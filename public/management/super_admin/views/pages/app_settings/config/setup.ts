import setup_type from './setup_type';

const prefix: string = 'App Settings';
const setup: setup_type = {
    prefix,
    module_name: 'app_settings',

    route_prefix: 'app-settings', // react route

    api_host: location.origin,
    api_prefix: 'app-settings', // api route
    select_fields: 'id,title,description,type,status',

    store_prefix: 'app_settings',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

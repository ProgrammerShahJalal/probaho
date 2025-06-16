import setup_type from './setup_type';

const prefix: string = 'App Setting Values';
const setup: setup_type = {
    prefix,
    module_name: 'app_setting_values',

    route_prefix: 'app-setting-values', // react route

    api_host: location.origin,
    api_prefix: 'app-setting-values', // api route
    select_fields: 'id,title,value,is_default,status',

    store_prefix: 'app_setting_values',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

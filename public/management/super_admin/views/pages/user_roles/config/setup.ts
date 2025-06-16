import setup_type from './setup_type';

const prefix: string = 'User Roles';
const setup: setup_type = {
    prefix,
    module_name: 'user_roles',

    route_prefix: 'user-roles', //react route

    api_host: location.origin,
    api_prefix: 'user-roles', //api route

    store_prefix: 'user_roles',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

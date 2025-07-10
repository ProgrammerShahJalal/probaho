import setup_type from './setup_type';

const prefix: string = 'User Login Histories';
const setup: setup_type = {
    prefix,
    module_name: 'user_login_histories',

    route_prefix: 'user-login-histories', //react route

    api_host: location.origin,
    api_prefix: 'user-login-histories', //api route

    store_prefix: 'user_login_histories',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

import setup_type from './setup_type';

const prefix: string = 'Branch Classes';
const setup: setup_type = {
    prefix,
    module_name: 'branch_classes',

    route_prefix: 'branch-classes', //react route

    api_host: location.origin,
    api_prefix: 'branch-classes', //api route

    store_prefix: 'branch_classes/', //redux store prefix
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

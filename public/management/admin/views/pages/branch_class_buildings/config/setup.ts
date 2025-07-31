import setup_type from './setup_type';

const prefix: string = 'Branch Class Buildings';
const setup: setup_type = {
    prefix,
    module_name: 'branch_class_buildings',

    route_prefix: 'branch-class-buildings', //react route

    api_host: location.origin,
    api_prefix: 'branch-class-buildings', //api route

    store_prefix: 'branch_class_buildings/', //redux store prefix
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

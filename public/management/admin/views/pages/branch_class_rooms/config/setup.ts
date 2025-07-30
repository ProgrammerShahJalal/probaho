import setup_type from './setup_type';

const prefix: string = 'Branch Class Rooms';
const setup: setup_type = {
    prefix,
    module_name: 'branch_class_rooms',

    route_prefix: 'branch-class-rooms', //react route

    api_host: location.origin,
    api_prefix: 'branch-class-rooms', //api route

    store_prefix: 'branch_class_rooms/', //redux store prefix
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

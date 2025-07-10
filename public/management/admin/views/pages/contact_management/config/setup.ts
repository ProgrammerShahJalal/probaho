import setup_type from './setup_type';

const prefix: string = 'Contact Message';
const setup: setup_type = {
    prefix,
    module_name: 'contact_messages',

    route_prefix: 'contact-messages',

    api_host: location.origin,
    api_prefix: 'contact-messages',
    select_fields: 'id,full_name,email,status',

    store_prefix: 'contact_messages',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

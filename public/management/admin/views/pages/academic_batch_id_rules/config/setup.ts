import setup_type from './setup_type';

const prefix: string = 'Academic Batch ID Rules';
const setup: setup_type = {
    prefix,
    module_name: 'academic_batch_id_rules',

    route_prefix: 'academic-batch-id-rules', //react route

    api_host: location.origin,
    api_prefix: 'academic-batch-id-rules', //api route

    store_prefix: 'academic_batch_id_rules',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

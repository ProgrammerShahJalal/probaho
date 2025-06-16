import setup_type from './setup_type';

const prefix: string = 'Events';
const setup: setup_type = {
    prefix,
    module_name: 'events',

    route_prefix: 'events', // react route

    api_host: location.origin,
    api_prefix: 'events', // api route
    select_fields: 'id,title,place,event_type,poster,session_start_date_time,session_end_date_time,reg_start_date,reg_end_date,price,discount_price,status',

    store_prefix: 'events',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

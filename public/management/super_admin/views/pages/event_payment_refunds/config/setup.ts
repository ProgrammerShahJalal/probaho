import setup_type from './setup_type';

const prefix: string = 'Event Payment Refunds';
const setup: setup_type = {
    prefix,
    module_name: 'event_payment_refunds',

    route_prefix: 'event-payment-refunds', // react route

    api_host: location.origin,
    api_prefix: 'event-payment-refunds', // api route
    select_fields: 'id,amount,status',

    store_prefix: 'event_payment_refunds',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;

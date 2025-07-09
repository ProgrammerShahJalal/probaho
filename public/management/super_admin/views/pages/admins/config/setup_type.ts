export default interface RouteConfig {
    prefix: string;
    module_name: string;
    route_prefix: string;
    store_prefix: string;

    api_host: string;
    api_prefix: string;

    layout_title: string;

    all_page_title: string;
    details_page_title: string;
    create_page_title: string;
    edit_page_title: string;
}

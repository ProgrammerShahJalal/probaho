export interface User {
    id: number;
    uid: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    slug: string;
    photo: string;
}

export interface Attendance {
    event_id: number;
    event_session_id: number | null;
    user_id: number;
    time: string;
    date: string;
    is_present: boolean;
}

export interface EventCategory {
    title: string;
    image: string;
}

export interface EventTag {
    title: string;
}

export interface Event {
    event_id: number;
    title: string;
    reg_start_date: string;
    reg_end_date: string;
    session_start_date_time: string;
    session_end_date_time: string;
    place: string;
    short_description: string;
    full_description: string;
    pre_requisities: string;
    terms_and_conditions: string;
    event_type: string;
    poster: string;
    price: string;
    discount_price: string;
    categories: EventCategory[];
    tags: EventTag[];
}

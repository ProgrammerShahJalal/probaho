export interface anyObject {
    [key: string]: any;
}

export interface responseObject {
    status: number;
    message: string;
    data: {
        [key: string]: any;
    };
}

export interface Request {
    [k: string]: any;
    body?: Record<string, any>;
    cookies?: Record<string, any>;
    headers?: Record<string, any>;
    params?: Record<string, any>;
    query?: Record<string, any>;
}

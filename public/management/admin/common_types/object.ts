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

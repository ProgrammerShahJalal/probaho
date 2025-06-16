class custom_error extends Error {
    readonly code: number;
    public uid?: string;

    constructor(name: string, code: number, message: string, uid?: string) {
        super(message);
        this.name = name;
        this.code = code;
        this.uid = uid;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default custom_error;

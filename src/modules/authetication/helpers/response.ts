import { anyObject, responseObject } from '../../../common_types/object';

function response(
    status: number,
    message: string,
    data: anyObject,
): responseObject {
    return {
        status,
        message,
        data,
    };
}

export default response;

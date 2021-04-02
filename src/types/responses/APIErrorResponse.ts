import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class APIErrorResponse extends IApiResponse {
    constructor(error: any, statusCode: StatusCodes) {
        super(undefined, error, statusCode);
    }
}

export default APIErrorResponse;

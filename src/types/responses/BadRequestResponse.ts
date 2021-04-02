import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class BadRequestResponse extends IApiResponse {
    constructor(error: any, data?: any) {
        super(undefined, error, StatusCodes.BAD_REQUEST);
    }
}

export default BadRequestResponse;

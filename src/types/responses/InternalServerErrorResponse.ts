import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class InternalServerErrorResponse extends IApiResponse {
    constructor(error: any) {
        super(undefined, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default InternalServerErrorResponse;

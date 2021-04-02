import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class UnauthorizedResponse extends IApiResponse {
    constructor(error: any) {
        super(undefined, error, StatusCodes.UNAUTHORIZED);
    }
}

export default UnauthorizedResponse;

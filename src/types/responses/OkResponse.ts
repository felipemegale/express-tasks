import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class OkResponse extends IApiResponse {
    constructor(data: any) {
        super(data, undefined, StatusCodes.OK);
    }
}

export default OkResponse;

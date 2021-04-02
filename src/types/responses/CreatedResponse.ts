import { StatusCodes } from 'http-status-codes';
import IApiResponse from '../IApiResponse';

class CreatedResponse extends IApiResponse {
    constructor(data: any, error?: any) {
        super(data, undefined, StatusCodes.CREATED);
    }
}

export default CreatedResponse;

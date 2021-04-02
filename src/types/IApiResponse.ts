import { StatusCodes } from 'http-status-codes';

export default class IApiResponse {
    constructor(data: any, error: any, statusCode: StatusCodes) {
        this.data = data;
        this.error = error;
        this.statusCode = statusCode;
    }
    data: any;
    error: any;
    statusCode: StatusCodes;
}

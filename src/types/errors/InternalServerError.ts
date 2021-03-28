import { StatusCodes } from 'http-status-codes';

class InternalServerError extends Error {
    message: string;
    statusCode: number;
    constructor() {
        super();
        this.message = 'InternalServerError';
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export default InternalServerError;

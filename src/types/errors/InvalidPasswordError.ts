import { StatusCodes } from 'http-status-codes';

class InvalidPassowrdError extends Error {
    message: string;
    statusCode: number;
    constructor() {
        super();
        this.message = 'InvalidPassowrdError';
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default InvalidPassowrdError;

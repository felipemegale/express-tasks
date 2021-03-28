import { StatusCodes } from 'http-status-codes';

class UnauthorizedError extends Error {
    message: string;
    statusCode: number;
    constructor() {
        super();
        this.message = 'UnauthorizedError';
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthorizedError;

import { StatusCodes } from 'http-status-codes';

class UnavailableUsernameOrEmailError extends Error {
    message: string;
    statusCode: number;
    constructor() {
        super();
        this.message = 'UnavailableUsernameOrEmailError';
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default UnavailableUsernameOrEmailError;

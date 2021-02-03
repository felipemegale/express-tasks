import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import JWTPayload from "../../interfaces/JWTPayload";
import User from "../../entity/User";

const router = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    if (!token) {
        throw new Error("NoTokenException");
    }

    try {
        const now = new Date().getTime();
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as JWTPayload;

        if (decodedToken.exp <= now) {
            throw new Error("TokenExpiredException");
        }

        const user = await getConnection().getRepository(User).findOne({
            email: decodedToken.email,
            username: decodedToken.username,
        });

        if (!user) {
            throw new Error("UnauthorizedAccessException");
        }

        res.locals.jwtPayload = decodedToken;

        const newToken = jwt.sign(
            {
                ...user,
                password: "",
                iat: now,
                exp: now + 60 * 60 * 1000,
            },
            process.env.JWT_SECRET
        );

        res.setHeader("Authorization", `Bearer ${newToken}`);

        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            data: "",
            error: err.message,
            statusCode: StatusCodes.UNAUTHORIZED,
        });
    }
};

export default router;

import { getConnection } from "typeorm";
import { hash as hashPassword, compare as comparePasswords } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import SignUpDataDTO from "../../interfaces/SignUpDataDTO";
import { BCRYPT_ROUNDS } from "../../utils/constants";
import User from "../../entity/User";
import IApiReturn from "../../interfaces/IApiReturn";
import SignInDataDTO from "../../interfaces/SignInDataDTO";

export default class AccountService {
    async signUp(signUpData: SignUpDataDTO): Promise<IApiReturn> {
        const dbConnection = await getConnection();
        const UserRepository = dbConnection.getRepository(User);

        const existingUser = await UserRepository.findOne({
            username: signUpData.username,
            email: signUpData.email,
        });

        if (!!existingUser) {
            return {
                data: undefined,
                error: "UsernameOrEmailInUseException",
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }

        const hashedPasswd = await hashPassword(
            signUpData.password,
            BCRYPT_ROUNDS
        );

        const newUser = new User();

        newUser.email = signUpData.email;
        newUser.username = signUpData.username;
        newUser.name = signUpData.name;
        newUser.password = hashedPasswd;

        try {
            const savedUser = await UserRepository.save(newUser);
            return {
                data: { ...savedUser, password: undefined },
                error: "",
                statusCode: StatusCodes.CREATED,
            };
        } catch (e) {
            return {
                data: undefined,
                error: e,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    async signIn(signInData: SignInDataDTO): Promise<IApiReturn> {
        const dbConnection = await getConnection();
        const UserRepository = dbConnection.getRepository(User);

        try {
            const user = await UserRepository.findOne({
                where: [
                    { username: signInData.username },
                    { email: signInData.email },
                ],
            });

            if (!user) {
                throw new Error("wrongUserOrPasswordExcepion");
            }

            const doPasswordsMatch = await comparePasswords(
                signInData.password,
                user.password
            );

            if (!doPasswordsMatch) {
                throw new Error("wrongUserOrPasswordExcepion");
            }

            const userToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
                expiresIn: "1 day",
            });

            return {
                data: { ...user, password: undefined, token: userToken },
                error: "",
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: "",
                error: err.message,
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }
    }
}

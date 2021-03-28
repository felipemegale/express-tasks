import { getConnection } from 'typeorm';
import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import SignUpDataDTO from '../../interfaces/SignUpDataDTO';
import { BCRYPT_ROUNDS } from '../../utils/constants';
import User from '../../entity/User';
import IApiReturn from '../../interfaces/IApiReturn';
import SignInDataDTO from '../../interfaces/SignInDataDTO';
import { SignInDataResponse } from '../../interfaces/SignInDataResponse';

export default class AccountService {
    async signUp(signUpData: SignUpDataDTO): Promise<IApiReturn<User, string>> {
        const dbConnection = await getConnection();
        const UserRepository = dbConnection.getRepository(User);

        const existingUser = await UserRepository.findOne({
            username: signUpData.username,
            email: signUpData.email,
        });

        if (!!existingUser) {
            return {
                data: undefined,
                error: 'UsernameOrEmailInUseException',
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }

        const hashedPasswd = await hashPassword(signUpData.password, BCRYPT_ROUNDS);

        const newUser = new User();

        newUser.email = signUpData.email;
        newUser.username = signUpData.username;
        newUser.name = signUpData.name;
        newUser.password = hashedPasswd;
        newUser.createdAt = new Date();

        try {
            const savedUser = await UserRepository.save(newUser);
            delete savedUser.password;
            return {
                data: savedUser,
                error: '',
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

    async signIn(signInData: SignInDataDTO): Promise<IApiReturn<SignInDataResponse, string>> {
        const dbConnection = await getConnection();
        const UserRepository = dbConnection.getRepository(User);

        try {
            const user = await UserRepository.findOne({
                where: [{ username: signInData.username }, { email: signInData.email }],
            });

            if (!user) {
                throw new Error('WrongUserOrPasswordExcepion');
            }

            const doPasswordsMatch = await comparePasswords(signInData.password, user.password);

            if (!doPasswordsMatch) {
                throw new Error('WrongUserOrPasswordExcepion');
            }

            const now = new Date().getTime();

            delete user.password;

            const userToken = jwt.sign(
                {
                    ...user,
                    iat: now,
                    exp: now + 60 * 60 * 1000,
                },
                process.env.JWT_SECRET,
            );

            return {
                data: { ...user, token: userToken },
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }
    }

    async changePassword(
        username: string,
        newPassword: string,
    ): Promise<IApiReturn<string, string>> {
        const dbConnection = await getConnection();
        const UserRepository = dbConnection.getRepository(User);

        try {
            const user = await UserRepository.findOne({
                where: [{ username: username }],
            });

            const doPasswordsMatch = await comparePasswords(newPassword, user.password);

            if (doPasswordsMatch) {
                let errDesc = {
                    message: 'InvalidPasswordException',
                    statusCode: StatusCodes.BAD_REQUEST,
                };
                throw new Error(JSON.stringify(errDesc));
            }

            const newPasswdHash = await hashPassword(newPassword, BCRYPT_ROUNDS);

            user.updatedAt = new Date();
            user.password = newPasswdHash;

            const updatedUser = await UserRepository.save(user);

            if (!updatedUser) {
                let errDesc = {
                    message: 'CouldNotChangePasswordException',
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                };
                throw new Error(JSON.stringify(errDesc));
            }

            return {
                data: 'password changed successfully',
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            const errorObj = JSON.parse(err.message);
            return {
                data: undefined,
                error: errorObj.message,
                statusCode: errorObj.statusCode,
            };
        }
    }
}

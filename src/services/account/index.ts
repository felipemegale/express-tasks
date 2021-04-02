import { getConnection, Repository } from 'typeorm';
import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import SignUpDataDTO from '../../interfaces/SignUpDataDTO';
import { BCRYPT_ROUNDS } from '../../utils/constants';
import User from '../../entity/User';
import IApiReturn from '../../interfaces/IApiReturn';
import SignInDataDTO from '../../interfaces/SignInDataDTO';
import { SignInDataResponse } from '../../types/SignInDataResponse';
import UnauthorizedError from '../../types/errors/UnauthorizedError';
import UnavailableUsernameOrEmailError from '../../types/errors/UnavailableUsernameOrEmailError';
import InternalServerError from '../../types/errors/InternalServerError';
import InvalidPasswordError from '../../types/errors/InvalidPasswordError';
import sharp = require('sharp');

export default class AccountService {
    UserRepository: Repository<User>;

    constructor() {
        const dbConnection = getConnection();
        this.UserRepository = dbConnection.getRepository(User);
    }

    async signUp(signUpData: SignUpDataDTO): Promise<IApiReturn<User, string>> {
        try {
            const existingUser = await this.UserRepository.findOne({
                where: [{ username: signUpData.username }, { email: signUpData.email }],
            });

            if (!!existingUser) {
                throw new UnavailableUsernameOrEmailError();
            }

            const hashedPasswd = await hashPassword(signUpData.password, BCRYPT_ROUNDS);

            const newUser = new User();

            newUser.email = signUpData.email;
            newUser.username = signUpData.username;
            newUser.name = signUpData.name;
            newUser.password = hashedPasswd;
            newUser.createdAt = new Date();

            const savedUser = await this.UserRepository.save(newUser);

            if (!savedUser) {
                throw new InternalServerError();
            }

            delete savedUser.password;
            return {
                data: savedUser,
                error: '',
                statusCode: StatusCodes.CREATED,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: err.statusCode,
            };
        }
    }

    async signIn(signInData: SignInDataDTO): Promise<IApiReturn<SignInDataResponse, string>> {
        try {
            const user = await this.UserRepository.findOne({
                where: [{ username: signInData.username }, { email: signInData.email }],
            });

            if (!user) {
                throw new UnauthorizedError();
            }

            const doPasswordsMatch = await comparePasswords(signInData.password, user.password);

            if (!doPasswordsMatch) {
                throw new UnauthorizedError();
            }

            const now = new Date().getTime();

            delete user.password;
            delete user.avatar;

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
                statusCode: err.statusCode,
            };
        }
    }

    async changePassword(
        username: string,
        newPassword: string,
    ): Promise<IApiReturn<string, string>> {
        try {
            const user = await this.UserRepository.findOne({
                where: [{ username: username }],
            });

            const doPasswordsMatch = await comparePasswords(newPassword, user.password);

            if (doPasswordsMatch) {
                throw new InvalidPasswordError();
            }

            const newPasswdHash = await hashPassword(newPassword, BCRYPT_ROUNDS);

            user.updatedAt = new Date();
            user.password = newPasswdHash;

            const updatedUser = await this.UserRepository.save(user);

            if (!updatedUser) {
                throw new InternalServerError();
            }

            return {
                data: 'password changed successfully',
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: err.statusCode,
            };
        }
    }

    async addOrChangeAvatar(
        username: string,
        avatar: Express.Multer.File,
    ): Promise<IApiReturn<string, string>> {
        try {
            const user = await this.UserRepository.findOne({
                where: [{ username: username }],
            });

            const avatarBuffer = await sharp(avatar.buffer)
                .resize({ height: 250, width: 250 })
                .png()
                .toBuffer();

            user.avatar = avatarBuffer;

            const updatedUser = await this.UserRepository.save(user);

            if (!updatedUser) {
                throw new InternalServerError();
            }

            return {
                data: 'avatar updated successfully',
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: err.statusCode,
            };
        }
    }

    async getAvatar(username: string): Promise<IApiReturn<Buffer, string>> {
        try {
            const user = await this.UserRepository.findOne({
                where: [{ username: username }],
            });

            return {
                data: user.avatar,
                error: undefined,
                statusCode: StatusCodes.OK,
            };
        } catch (err) {
            return {
                data: undefined,
                error: err.message,
                statusCode: err.statusCode,
            };
        }
    }
}

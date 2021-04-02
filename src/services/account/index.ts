import { getConnection, Repository } from 'typeorm';
import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import sharp = require('sharp');
import SignUpDataDTO from '../../interfaces/SignUpDataDTO';
import { BCRYPT_ROUNDS } from '../../utils/constants';
import User from '../../entity/User';
import IApiResponse from '../../types/IApiResponse';
import SignInDataDTO from '../../interfaces/SignInDataDTO';
import UnauthorizedError from '../../types/errors/UnauthorizedError';
import UnavailableUsernameOrEmailError from '../../types/errors/UnavailableUsernameOrEmailError';
import InternalServerError from '../../types/errors/InternalServerError';
import InvalidPasswordError from '../../types/errors/InvalidPasswordError';
import CreatedResponse from '../../types/responses/CreatedResponse';
import APIErrorResponse from '../../types/responses/APIErrorResponse';
import OkResponse from '../../types/responses/OkResponse';

export default class AccountService {
    UserRepository: Repository<User>;

    constructor() {
        const dbConnection = getConnection();
        this.UserRepository = dbConnection.getRepository(User);
    }

    async signUp(signUpData: SignUpDataDTO): Promise<IApiResponse> {
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
            delete savedUser.avatar;

            return new CreatedResponse(savedUser);
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }

    async signIn(signInData: SignInDataDTO): Promise<IApiResponse> {
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

            const token = jwt.sign(
                {
                    ...user,
                    iat: now,
                    exp: now + 60 * 60 * 1000,
                },
                process.env.JWT_SECRET,
            );

            return new OkResponse({ ...user, token });
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }

    async changePassword(username: string, newPassword: string): Promise<IApiResponse> {
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

            return new OkResponse('password changed successfully');
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }

    async addOrChangeAvatar(username: string, avatar: Express.Multer.File): Promise<IApiResponse> {
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

            return new OkResponse('avatar updated successfully');
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }

    async getAvatar(username: string): Promise<IApiResponse> {
        try {
            const user = await this.UserRepository.findOne({
                where: [{ username: username }],
            });

            if (!user) {
                throw new InternalServerError();
            }

            return new OkResponse(user.avatar);
        } catch (err) {
            return new APIErrorResponse(err.statusCode, err.message);
        }
    }
}

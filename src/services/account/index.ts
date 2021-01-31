import { getConnection } from "typeorm";
import { hash } from "bcrypt";
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

        const hashedPasswd = await hash(signUpData.password, BCRYPT_ROUNDS);

        const newUser = new User();

        newUser.email = signUpData.email;
        newUser.username = signUpData.username;
        newUser.name = signUpData.name;
        newUser.password = hashedPasswd;

        try {
            const savedUser = await UserRepository.save(newUser);
            return {
                data: { ...savedUser, password: "" },
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
        console.log(signInData);
        return {data: '', error: '', statusCode: 200};
    }
}

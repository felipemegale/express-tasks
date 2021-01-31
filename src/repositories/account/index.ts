import SignUpDataDTO from "../../interfaces/SignUpDataDTO";

export default class AccountRepository {
    async signUp(signUpData: SignUpDataDTO) {
        console.log(signUpData);
        return signUpData;
    }
}

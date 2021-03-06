import { Router } from "express";
import SignUpDataDTO from "../../interfaces/SignUpDataDTO";
import SignInDataDTO from "../../interfaces/SignInDataDTO";
import AccountService from "../../services/account";

const wrapper = (): Router => {
    const router = Router();
    const _accountService = new AccountService();

    router.post("/signup", async (req, res) => {
        const signUpData: SignUpDataDTO = req.body;
        const ret = await _accountService.signUp(signUpData);

        res.status(ret.statusCode).json(ret);
    });

    router.post("/signin", async (req, res) => {
        const signInData: SignInDataDTO = req.body;
        const loggedIn = await _accountService.signIn(signInData);
        res.status(loggedIn.statusCode).json(loggedIn);
    });

    router;

    return router;
};

export default wrapper;

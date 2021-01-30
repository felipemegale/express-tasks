import { Router } from "express";
import SignUpDataDTO from "../../interfaces/SignUpDataDTO";

const wrapper = (): Router => {
    const router = Router();

    router.get("/", (req, res) => {
        res.send("oie from auth middleware");
    });

    router.post("/signup", async (req, res) => {
        const signUpData = req.body as SignUpDataDTO;

        console.log(signUpData);
        res.json(signUpData);
    });

    return router;
};

export default wrapper;

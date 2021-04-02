import { Router } from 'express';
import UploadMiddleware from '../upload';
import AuthMiddleware from '../auth';
import SignUpDataDTO from '../../interfaces/SignUpDataDTO';
import SignInDataDTO from '../../interfaces/SignInDataDTO';
import AccountService from '../../services/account';

const routerWrapper = (): Router => {
    const router = Router();
    const _accountService = new AccountService();

    const uploadMiddleware = UploadMiddleware;

    router.post('/signup', async (req, res) => {
        const signUpData: SignUpDataDTO = req.body;
        const signUpResult = await _accountService.signUp(signUpData);

        res.status(signUpResult.statusCode).json(signUpResult);
    });

    router.post('/signin', async (req, res) => {
        const signInData: SignInDataDTO = req.body;
        const signInResult = await _accountService.signIn(signInData);

        res.status(signInResult.statusCode).json(signInResult);
    });

    router.patch('/changePassword', AuthMiddleware, async (req, res) => {
        const { jwtPayload } = res.locals;
        const { username } = jwtPayload;
        const { newPassword } = req.body;
        const passwordChangeResult = await _accountService.changePassword(username, newPassword);

        res.status(passwordChangeResult.statusCode).json(passwordChangeResult);
    });

    router.post('/avatar', AuthMiddleware, uploadMiddleware.single('avatar'), async (req, res) => {
        const { jwtPayload } = res.locals;
        const { username } = jwtPayload;
        const avatar = req.file;
        const addOrChangeAvatarResult = await _accountService.addOrChangeAvatar(username, avatar);

        res.status(addOrChangeAvatarResult.statusCode).json(addOrChangeAvatarResult);
    });

    router.get('/avatar', AuthMiddleware, async (req, res) => {
        const { jwtPayload } = res.locals;
        const { username } = jwtPayload;
        const getAvatarResult = await _accountService.getAvatar(username);

        res.set('Content-Type', 'image/png');
        res.status(getAvatarResult.statusCode).send(getAvatarResult.data);
    });

    router;

    return router;
};

export default routerWrapper;

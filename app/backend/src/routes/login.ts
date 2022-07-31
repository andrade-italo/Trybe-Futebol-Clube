import { Router } from 'express';
import LoginController from '../controller/loginController';
import LoginDataValidate from '../middleware/loginDataValidate';

const router: Router = Router();

const login = new LoginController();
const loginDataValidate = new LoginDataValidate();

router.post('/', loginDataValidate.validateAtributes, login.validUserController);

export default router;

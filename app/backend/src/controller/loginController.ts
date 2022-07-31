import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import LoginService from '../services/loginService';
// import { userInfo } from 'os';

class LoginController {
  loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public validUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const loginResponse = await this.loginService.validUser(email, password);
    if (loginResponse.message) return res.status(StatusCodes.BAD_REQUEST).json(loginResponse);
    return res.status(StatusCodes.OK).json(loginResponse);
  };

  public getValidate = async (req: any, res: Response) => {
    const { role } = req.userInfo;
    return res.status(StatusCodes.OK).json({ role });
  };
}

export default LoginController;

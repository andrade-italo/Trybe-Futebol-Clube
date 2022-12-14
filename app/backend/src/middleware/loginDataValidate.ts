import Joi = require('joi');
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import jwt = require('jsonwebtoken');

class LoginDataValidate {
  private jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

  private joiValidate = (attributes: { password: string, email: string }) => {
    const message = {
      'any.required': 'All fields must be filled',
      'string.empty': 'All fields must be filled',
    };
    const { error } = Joi.object({
      password: Joi.string().min(6).required().messages(message),
      email: Joi.string().email().required().messages(message),
    }).validate(attributes);
    return error;
  };

  public validateAtributes = (req: Request, res: Response, next: NextFunction) => {
    const attributes = req.body;
    const error = this.joiValidate(attributes);
    if (error) {
      const teste = error.message.match('fields');
      if (teste?.input) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: 'Incorrect email or password',
      });
    }
    return next();
  };

  public authToken = async (req: Request | any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token not found' });

    try {
      const { role, email }: any = jwt.verify(token, this.jwtSecret);
      req.userInfo = { role, email };
      return next();
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token must be a valid token' });
    }
  };
}

export default LoginDataValidate;

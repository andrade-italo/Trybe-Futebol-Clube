import Joi = require('joi');
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

class LoginDataValidate {
  validateAtributes(req: Request, res: Response, next: NextFunction) {
  const attributes = req.body;

  const { error } = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  }).validate(attributes);

  if (error) {
    if (error.message.match(/required/i)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message });
  }
  return next();
};
}

export default LoginDataValidate;

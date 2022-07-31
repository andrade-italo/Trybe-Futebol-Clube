import jwt = require('jsonwebtoken');
import { compareSync } from 'bcryptjs';
import User from '../database/models/UserModel';

class LoginService {
  private JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
  private jwtConfig = {
  expiresIn: '1h',
};
 
  public async validUser(email:string, password:string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { message: 'Email não cadastrado' };
    }
    const isValidPass = compareSync(password, user.password);
    const token = jwt.sign({ email }, this.JWT_SECRET, this.jwtConfig);

    if (!isValidPass) {
      return { message: 'password invalida' };
    }

    return { token };
  }
};

export default LoginService;

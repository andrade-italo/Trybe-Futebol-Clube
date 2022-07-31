import jwt = require('jsonwebtoken');
import { compareSync } from 'bcryptjs';
import User from '../database/models/UserModel';

class LoginService {
  private jwtSecret = process.env.JWT_SECRET || 'jwt_secret';
  private jwtConfig = {
    expiresIn: '1h',
  };

  public async validUser(email:string, password:string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { message: 'Incorrect email or password' };
    }
    const isValidPass = compareSync(password, user.password);
    const token = jwt.sign({ email, role: user.role }, this.jwtSecret, this.jwtConfig);

    if (!isValidPass) {
      return { message: 'Incorrect email or password' };
    }

    return { token };
  }
}

export default LoginService;

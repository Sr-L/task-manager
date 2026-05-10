import { successResponse } from '../../../shared/utils/response.handler.js';

export class AuthController {
  constructor(registerUseCase, loginUseCase) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
  }

  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const { token, user } = await this.registerUseCase.execute({ name, email, password });
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      successResponse(res, { user }, 201);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.loginUseCase.execute({ email, password });
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      successResponse(res, { user });
    } catch (err) {
      next(err);
    }
  };

  logout = (_req, res) => {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    successResponse(res, { message: 'Logged out' });
  };
}

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
      successResponse(res, { token, user }, 201);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.loginUseCase.execute({ email, password });
      successResponse(res, { token, user });
    } catch (err) {
      next(err);
    }
  };
}

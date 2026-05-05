import bcrypt from 'bcryptjs';
import { InvalidCredentialsError } from '../../../shared/domain/domain.error.js';

export class LoginUserUseCase {
  constructor(userRepository, jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.jwtService.signToken({ id: user.id, email: user.email });
    return { token, user };
  }
}

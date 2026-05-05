import { InvalidCredentialsError } from '../../../shared/domain/domain.error.js';

export class LoginUserUseCase {
  constructor(userRepository, jwtService, passwordHasher) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordHasher = passwordHasher;
  }

  async execute({ email, password }) {
    const found = await this.userRepository.findCredentialsByEmail(email);
    if (!found) throw new InvalidCredentialsError();

    const valid = await this.passwordHasher.compare(password, found.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.jwtService.signToken({ id: found.user.id, email: found.user.email });
    return { token, user: found.user };
  }
}

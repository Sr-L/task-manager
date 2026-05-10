import { ConflictError, WeakPasswordError } from '../../../shared/domain/domain.error.js';

export class RegisterUserUseCase {
  constructor(userRepository, jwtService, passwordHasher) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password }) {
    if (!password || password.length < 6) throw new WeakPasswordError();

    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await this.passwordHasher.hash(password);
    const user = await this.userRepository.save({ name, email, passwordHash });
    const token = this.jwtService.signToken({ id: user.id, email: user.email });
    return { token, user };
  }
}

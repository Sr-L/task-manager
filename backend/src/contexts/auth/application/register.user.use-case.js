import { ConflictError, WeakPasswordError } from '../../../shared/domain/domain.error.js';

export class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password }) {
    if (!password || password.length < 6) throw new WeakPasswordError();

    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await this.passwordHasher.hash(password);
    return this.userRepository.save({ name, email, passwordHash });
  }
}

import { ConflictError, WeakPasswordError } from '../../../shared/domain/domain.error.js';
import { UserEntity } from '../domain/user.entity.js';

export class RegisterUserUseCase {
  constructor(userRepository, jwtService, passwordHasher) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.passwordHasher = passwordHasher;
  }

  async execute({ name, email, password }) {
    if (!password || password.length < 6) throw new WeakPasswordError();

    const user = new UserEntity({ id: null, name, email, createdAt: new Date() });

    const existing = await this.userRepository.findByEmail(user.email);
    if (existing) throw new ConflictError('Email already in use');

    const passwordHash = await this.passwordHasher.hash(password);
    const saved = await this.userRepository.save(user, passwordHash);
    const token = this.jwtService.signToken({ id: saved.id, email: saved.email });
    return { token, user: saved };
  }
}

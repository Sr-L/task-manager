import bcrypt from 'bcryptjs';
import { UserEntity } from '../domain/user.entity.js';
import { ConflictError } from '../../../shared/domain/domain.error.js';

export class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already in use');

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserEntity({ id: null, name, email, password: hashed, createdAt: new Date() });
    return this.userRepository.save(user);
  }
}

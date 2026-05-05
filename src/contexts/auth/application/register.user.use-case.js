import bcrypt from 'bcryptjs';
import { UserEntity } from '../domain/user.entity.js';

export class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already in use');
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserEntity({ id: null, name, email, password: hashed, createdAt: new Date() });
    const saved = await this.userRepository.save(user);
    return saved;
  }
}

import { EmptyNameError, InvalidEmailError } from '../../../shared/domain/domain.error.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
  constructor({ id, name, email, createdAt }) {
    if (!name || !name.trim()) throw new EmptyNameError();
    if (!email || !EMAIL_REGEX.test(email)) throw new InvalidEmailError();

    this.id = id;
    this.name = name.trim();
    this.email = email;
    this.createdAt = createdAt;
  }
}

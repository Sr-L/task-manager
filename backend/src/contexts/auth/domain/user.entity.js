import { InvalidEmailError } from '../../../shared/domain/domain.error.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
  constructor({ id, name, email, createdAt }) {
    if (!email || !EMAIL_REGEX.test(email)) throw new InvalidEmailError();

    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }
}

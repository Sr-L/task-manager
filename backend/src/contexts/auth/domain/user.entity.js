import { InvalidEmailError } from '../../../shared/domain/domain.error.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
  constructor({ id, name, email, password, createdAt }) {
    if (!email || !EMAIL_REGEX.test(email)) throw new InvalidEmailError();

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  toPublic() {
    return { id: this.id, name: this.name, email: this.email };
  }
}

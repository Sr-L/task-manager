import bcrypt from 'bcryptjs';

export class BcryptPasswordHasher {
  constructor(rounds = 12) {
    this.rounds = rounds;
  }

  async hash(plain) {
    return bcrypt.hash(plain, this.rounds);
  }

  async compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

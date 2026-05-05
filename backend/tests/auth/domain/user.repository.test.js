import { describe, it, expect } from '@jest/globals';
import { UserRepository } from '../../../src/contexts/auth/domain/user.repository.js';
import { MongoUserRepository } from '../../../src/contexts/auth/infrastructure/mongo.user.repository.js';

describe('UserRepository', () => {
  const port = new UserRepository();

  it.each([
    ['findByEmail', () => port.findByEmail('a@b.com')],
    ['findCredentialsByEmail', () => port.findCredentialsByEmail('a@b.com')],
    ['save', () => port.save({})],
  ])('%s throws Not implemented when not overridden', async (name, call) => {
    await expect(call()).rejects.toThrow(`UserRepository.${name} not implemented`);
  });
});

describe('MongoUserRepository', () => {
  it('is an instance of the UserRepository', () => {
    const adapter = new MongoUserRepository();
    expect(adapter).toBeInstanceOf(UserRepository);
  });

  it('overrides every abstract method (no method falls)', () => {
    const adapter = new MongoUserRepository();
    const methods = ['findByEmail', 'findCredentialsByEmail', 'save'];
    for (const m of methods) {
      const own = Object.getPrototypeOf(adapter)[m];
      const fromPort = UserRepository.prototype[m];
      expect(own).not.toBe(fromPort);
    }
  });
});

import { describe, it, expect } from '@jest/globals';
import { UserEntity } from '../../../src/contexts/auth/domain/user.entity.js';

describe('UserEntity', () => {
  const valid = {
    id: '1',
    name: 'Luis',
    email: 'luis@test.com',
    password: 'hash',
    createdAt: new Date(),
  };

  it('builds with valid data', () => {
    const user = new UserEntity(valid);
    expect(user.email).toBe('luis@test.com');
  });

  it('toPublic strips the password hash', () => {
    const user = new UserEntity(valid);
    expect(user.toPublic()).toEqual({ id: '1', name: 'Luis', email: 'luis@test.com' });
  });

  it.each([
    'not-an-email',
    'missing@dot',
    '@nodomain.com',
    'spaces in@email.com',
    '',
    undefined,
  ])('rejects invalid email: %s', (email) => {
    expect(() => new UserEntity({ ...valid, email }))
      .toThrow(expect.objectContaining({ status: 400, name: 'InvalidEmailError' }));
  });
});

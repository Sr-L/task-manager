import { describe, it, expect } from '@jest/globals';
import { UserEntity } from '../../../src/contexts/auth/domain/user.entity.js';

describe('UserEntity', () => {
  const valid = {
    id: '1',
    name: 'Luis',
    email: 'luis@test.com',
    createdAt: new Date(),
  };

  it('builds with valid data', () => {
    const user = new UserEntity(valid);
    expect(user.email).toBe('luis@test.com');
    expect(user.name).toBe('Luis');
  });

  it('does not carry a password field', () => {
    const user = new UserEntity({ ...valid, password: 'should-be-ignored' });
    expect(user.password).toBeUndefined();
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

  it.each(['', '   ', undefined, null])('rejects empty name: %p', (name) => {
    expect(() => new UserEntity({ ...valid, name }))
      .toThrow(expect.objectContaining({ status: 400, name: 'EmptyNameError' }));
  });

  it('trims surrounding whitespace from name', () => {
    const user = new UserEntity({ ...valid, name: '  Luis  ' });
    expect(user.name).toBe('Luis');
  });
});

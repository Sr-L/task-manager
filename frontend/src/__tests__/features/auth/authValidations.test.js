import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  validateLoginForm,
  validateRegisterForm,
  hasErrors,
} from '../../../features/auth/domain/authValidations.js';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('alice@example.com')).toBe(true);
    expect(isValidEmail('a+b@co.io')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('missing@')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts passwords of 6+ chars', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('longpassword')).toBe(true);
  });

  it('rejects short passwords', () => {
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });
});

describe('validateLoginForm', () => {
  it('returns no errors for valid input', () => {
    const errors = validateLoginForm({ email: 'a@b.com', password: 'secret' });
    expect(hasErrors(errors)).toBe(false);
  });

  it('returns email error for invalid email', () => {
    const errors = validateLoginForm({ email: 'bad', password: 'secret' });
    expect(errors.email).toBeDefined();
  });

  it('returns password error when password is empty', () => {
    const errors = validateLoginForm({ email: 'a@b.com', password: '' });
    expect(errors.password).toBeDefined();
  });
});

describe('validateRegisterForm', () => {
  it('returns no errors for valid input', () => {
    const errors = validateRegisterForm({ name: 'Alice', email: 'a@b.com', password: 'password' });
    expect(hasErrors(errors)).toBe(false);
  });

  it('returns name error when name is blank', () => {
    const errors = validateRegisterForm({ name: '', email: 'a@b.com', password: 'password' });
    expect(errors.name).toBeDefined();
  });

  it('returns password error when password is too short', () => {
    const errors = validateRegisterForm({ name: 'Alice', email: 'a@b.com', password: '123' });
    expect(errors.password).toBeDefined();
  });
});

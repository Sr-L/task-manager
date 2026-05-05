import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { JwtService } from '../../../src/contexts/auth/infrastructure/jwt.service.js';

describe('JwtService', () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalExp = process.env.JWT_EXPIRES_IN;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
    if (originalExp === undefined) delete process.env.JWT_EXPIRES_IN;
    else process.env.JWT_EXPIRES_IN = originalExp;
  });

  it('signToken produces a token verifiable with the configured secret', () => {
    const svc = new JwtService();
    const token = svc.signToken({ id: 'u1', email: 'luis@test.com' });

    const decoded = jwt.verify(token, 'test-secret');
    expect(decoded.id).toBe('u1');
    expect(decoded.email).toBe('luis@test.com');
  });

  it('verifyToken returns the payload when the secret matches', () => {
    const svc = new JwtService();
    const token = jwt.sign({ id: 'u1' }, 'test-secret', { expiresIn: '1h' });

    const decoded = svc.verifyToken(token);
    expect(decoded.id).toBe('u1');
  });

  it('verifyToken throws when the token was signed with a different secret', () => {
    const svc = new JwtService();
    const token = jwt.sign({ id: 'u1' }, 'other-secret', { expiresIn: '1h' });

    expect(() => svc.verifyToken(token)).toThrow();
  });

  it('verifyToken throws on a malformed token', () => {
    const svc = new JwtService();

    expect(() => svc.verifyToken('not.a.token')).toThrow();
  });

  it('honors JWT_EXPIRES_IN from the environment', () => {
    process.env.JWT_EXPIRES_IN = '2h';
    const svc = new JwtService();
    const token = svc.signToken({ id: 'u1' });

    const decoded = jwt.verify(token, 'test-secret');
    expect(decoded.exp - decoded.iat).toBe(2 * 60 * 60);
  });

  it('defaults to 7d when JWT_EXPIRES_IN is not set', () => {
    delete process.env.JWT_EXPIRES_IN;
    const svc = new JwtService();
    const token = svc.signToken({ id: 'u1' });

    const decoded = jwt.verify(token, 'test-secret');
    expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60);
  });
});

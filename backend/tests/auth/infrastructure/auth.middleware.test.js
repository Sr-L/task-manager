import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createAuthMiddleware } from '../../../src/contexts/auth/infrastructure/auth.middleware.js';

function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {
  let jwtService;
  let middleware;

  beforeEach(() => {
    jwtService = { verifyToken: jest.fn() };
    middleware = createAuthMiddleware(jwtService);
  });

  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} };
    const res = buildRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header does not start with Bearer', () => {
    const req = { headers: { authorization: 'Basic foo' } };
    const res = buildRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid or expired', () => {
    jwtService.verifyToken.mockImplementation(() => { throw new Error('jwt expired'); });
    const req = { headers: { authorization: 'Bearer bad-token' } };
    const res = buildRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches payload to req.user and calls next on valid token', () => {
    const payload = { id: 'u1', email: 'luis@test.com' };
    jwtService.verifyToken.mockReturnValue(payload);
    const req = { headers: { authorization: 'Bearer good-token' } };
    const res = buildRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(jwtService.verifyToken).toHaveBeenCalledWith('good-token');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

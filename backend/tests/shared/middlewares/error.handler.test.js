import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { errorHandler } from '../../../src/shared/middlewares/error.handler.js';
import { NotFoundError, ConflictError } from '../../../src/shared/domain/domain.error.js';
import logger from '../../../src/shared/infrastructure/logger/logger.js';

function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler', () => {
  let res;
  let next;
  let originalEnv;
  let logSpy;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    res = buildRes();
    next = jest.fn();
    logSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    logSpy.mockRestore();
  });

  it('maps a DomainError to its status, message, and name', () => {
    const err = new NotFoundError('Task not found');
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Task not found',
      error: 'NotFoundError',
    });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('uses the DomainError subclass name in the response', () => {
    errorHandler(new ConflictError('Email already in use'), {}, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email already in use',
      error: 'ConflictError',
    });
  });

  it('forwards a legacy 4xx error from .status as-is', () => {
    const err = new Error('No token provided');
    err.status = 401;
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No token provided',
    });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('forwards a legacy 4xx error from .statusCode as-is', () => {
    const err = new Error('Bad request');
    err.statusCode = 422;
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Bad request',
    });
  });

  it('returns a generic 500 in production when no status is set', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('database exploded');
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
    expect(logSpy).toHaveBeenCalledWith(err);
  });

  it('exposes the original message in development but never the stack', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('boom');
    err.stack = 'fake-stack';
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'boom',
    });
    const payload = res.json.mock.calls[0][0];
    expect(payload).not.toHaveProperty('stack');
    expect(logSpy).toHaveBeenCalledWith(err);
  });

  it('treats a legacy 5xx error as unexpected (logs, hides message in prod)', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('SQL syntax error');
    err.status = 503;
    errorHandler(err, {}, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
    expect(logSpy).toHaveBeenCalledWith(err);
  });
});

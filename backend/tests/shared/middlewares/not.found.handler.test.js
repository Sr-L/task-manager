import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { notFoundHandler } from '../../../src/shared/middlewares/not.found.handler.js';

function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('notFoundHandler', () => {
  let res;

  beforeEach(() => {
    res = buildRes();
  });

  it('responds 404 with the method and originalUrl in the message', () => {
    notFoundHandler({ method: 'GET', originalUrl: '/api/v1/missing' }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Route GET /api/v1/missing not found',
    });
  });

  it.each([
    ['POST', '/api/v1/auth/oops'],
    ['PUT', '/api/v1/tasks/1'],
    ['DELETE', '/api/v1/tasks/abc'],
    ['PATCH', '/api/v1/users/me'],
  ])('reports the route for any HTTP verb (%s %s)', (method, originalUrl) => {
    notFoundHandler({ method, originalUrl }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: `Route ${method} ${originalUrl} not found`,
    });
  });

  it('always returns success: false', () => {
    notFoundHandler({ method: 'GET', originalUrl: '/' }, res);

    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
  });
});

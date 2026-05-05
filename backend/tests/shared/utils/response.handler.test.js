import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { successResponse, messageResponse } from '../../../src/shared/utils/response.handler.js';

function buildRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('successResponse', () => {
  let res;

  beforeEach(() => {
    res = buildRes();
  });

  it('defaults to status 200 and wraps the payload as { success, data }', () => {
    successResponse(res, { id: '1', name: 'Luis' });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: '1', name: 'Luis' } });
  });

  it('uses the explicit status when provided', () => {
    successResponse(res, { id: '1' }, 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: '1' } });
  });

  it('chains status() and json() on the response', () => {
    successResponse(res, []);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('passes data through verbatim when it is null', () => {
    successResponse(res, null);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
  });
});

describe('messageResponse', () => {
  let res;

  beforeEach(() => {
    res = buildRes();
  });

  it('defaults to status 200 and wraps the message as { success, message }', () => {
    messageResponse(res, 'Task deleted successfully');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Task deleted successfully' });
  });

  it('uses the explicit status when provided', () => {
    messageResponse(res, 'Accepted', 202);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Accepted' });
  });

  it('does not include a data field', () => {
    messageResponse(res, 'OK');

    const body = res.json.mock.calls[0][0];
    expect(body).not.toHaveProperty('data');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createHttpClient } from '../../shared/infrastructure/httpClient.js';

/**
 * The axios instance exposes its registered interceptors as
 * `client.interceptors.{request,response}.handlers[i].{fulfilled,rejected}`.
 * That lets us drive the handlers directly without standing up a real
 * network round-trip.
 */
function getRequestHandler(client) {
  return client.interceptors.request.handlers[0].fulfilled;
}
function getResponseHandlers(client) {
  return client.interceptors.response.handlers[0];
}

describe('createHttpClient', () => {
  it('adds Authorization: Bearer <token> when a token is available', () => {
    const client = createHttpClient(() => 'abc.def.ghi');
    const onRequest = getRequestHandler(client);

    const config = onRequest({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('does not set Authorization when getToken() returns null', () => {
    const client = createHttpClient(() => null);
    const onRequest = getRequestHandler(client);

    const config = onRequest({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('invokes onUnauthorized on 401 responses and rejects the original error', async () => {
    const onUnauthorized = vi.fn();
    const client = createHttpClient(() => 'tok', onUnauthorized);
    const { rejected } = getResponseHandlers(client);
    const error = { response: { status: 401, data: { message: 'expired' } } };

    await expect(rejected(error)).rejects.toBe(error);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onUnauthorized on non-401 responses', async () => {
    const onUnauthorized = vi.fn();
    const client = createHttpClient(() => 'tok', onUnauthorized);
    const { rejected } = getResponseHandlers(client);
    const error = { response: { status: 500 } };

    await expect(rejected(error)).rejects.toBe(error);
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('unwraps { success, data } payloads on successful responses', () => {
    const client = createHttpClient(() => null);
    const { fulfilled } = getResponseHandlers(client);

    const response = { data: { success: true, data: { id: '1' } } };
    const result = fulfilled(response);

    expect(result.data).toEqual({ id: '1' });
  });
});

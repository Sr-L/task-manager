import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';

// Wiring smoke tests: exercise routes/middlewares that don't reach the database.
// Auth-protected and DB-backed paths are covered by their own unit suites.

describe('createApp (wiring smoke tests)', () => {
  const originalSecret = process.env.JWT_SECRET;
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    app = createApp();
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it('returns a callable Express app', () => {
    expect(typeof app).toBe('function');
  });

  it('exposes GET /health → 200 OK', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'OK' });
  });

  it('responds to unknown routes with the notFoundHandler shape', async () => {
    const res = await request(app).get('/no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: 'Route GET /no-existe not found',
    });
  });

  it('mounts /api/v1/auth/register and runs validators (422 on empty body)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({});

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('mounts /api/v1/auth/login and runs validators (422 on empty body)', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});

    expect(res.status).toBe(422);
  });

  it('protects /api/v1/tasks behind auth → 401 without token', async () => {
    const res = await request(app).get('/api/v1/tasks');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('protects /api/v1/tasks → 401 on malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', 'Bearer not.a.real.token');

    expect(res.status).toBe(401);
  });

  it('responds to a CORS preflight with access-control-allow-origin', async () => {
    const res = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'http://example.com')
      .set('Access-Control-Request-Method', 'POST');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});

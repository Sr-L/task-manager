import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { createAuthRouter } from '../../../src/contexts/auth/infrastructure/auth.routes.js';
import { errorHandler } from '../../../src/shared/middlewares/error.handler.js';

function buildApp(authController) {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/auth', createAuthRouter(authController));
  app.use(errorHandler);
  return app;
}

describe('AuthController', () => {
  let authController;

  beforeEach(() => {
    authController = {
      register: jest.fn((req, res) => res.status(201).json({ success: true, data: { token: 'jwt', user: { id: '1', name: 'Luis', email: 'luis@test.com' } } })),
      login: jest.fn((req, res) => res.status(200).json({ success: true, data: { token: 'jwt', user: { id: '1', name: 'Luis', email: 'luis@test.com' } } })),
    };
  });

  describe('POST /api/v1/auth/register', () => {
    it('should return 201 with token on valid data', async () => {
      const app = buildApp(authController);
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Luis', email: 'luis@test.com', password: 'secret123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 422 when fields are missing', async () => {
      const app = buildApp(authController);
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'bad-email', password: '123' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 200 with token on valid credentials', async () => {
      const app = buildApp(authController);
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'luis@test.com', password: 'secret123' });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 422 on invalid email format', async () => {
      const app = buildApp(authController);
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'secret123' });

      expect(res.status).toBe(422);
    });

    it('should propagate use case errors via errorHandler', async () => {
      authController.login = jest.fn((_req, _res, next) => {
        const err = new Error('Invalid credentials');
        err.status = 401;
        next(err);
      });
      const app = buildApp(authController);
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'luis@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../src/contexts/auth/infrastructure/auth.controller.js';
import { createAuthRouter } from '../../../src/contexts/auth/infrastructure/auth.routes.js';
import { errorHandler } from '../../../src/shared/middlewares/error.handler.js';

function buildApp(controller) {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/auth', createAuthRouter(controller));
  app.use(errorHandler);
  return app;
}

describe('AuthController', () => {
  let registerUseCase;
  let loginUseCase;
  let controller;

  beforeEach(() => {
    registerUseCase = { execute: jest.fn() };
    loginUseCase = { execute: jest.fn() };
    controller = new AuthController(registerUseCase, loginUseCase);
  });

  describe('POST /api/v1/auth/register', () => {
    it('returns 201 with { token, user } on success', async () => {
      registerUseCase.execute.mockResolvedValue({
        token: 'jwt-token',
        user: { id: '1', name: 'Luis', email: 'luis@test.com' },
      });

      const res = await request(buildApp(controller)).post('/api/v1/auth/register').send({
        name: 'Luis',
        email: 'luis@test.com',
        password: 'secret123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        data: {
          token: 'jwt-token',
          user: { id: '1', name: 'Luis', email: 'luis@test.com' },
        },
      });
    });

    it('passes name/email/password to the use case verbatim', async () => {
      registerUseCase.execute.mockResolvedValue({
        token: 't',
        user: { id: '1', name: 'Luis', email: 'luis@test.com' },
      });

      await request(buildApp(controller)).post('/api/v1/auth/register').send({
        name: 'Luis',
        email: 'luis@test.com',
        password: 'secret123',
      });

      expect(registerUseCase.execute).toHaveBeenCalledWith({
        name: 'Luis',
        email: 'luis@test.com',
        password: 'secret123',
      });
    });

    it('forwards use case errors to next() so errorHandler maps them', async () => {
      const err = new Error('Email already in use');
      err.status = 409;
      registerUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller)).post('/api/v1/auth/register').send({
        name: 'Luis',
        email: 'luis@test.com',
        password: 'secret123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('returns 422 when fields are missing (validators short-circuit)', async () => {
      const res = await request(buildApp(controller)).post('/api/v1/auth/register').send({
        email: 'bad-email',
        password: '123',
      });

      expect(res.status).toBe(422);
      expect(registerUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('returns 200 with { token, user } on success', async () => {
      loginUseCase.execute.mockResolvedValue({
        token: 'jwt-token',
        user: { id: '1', name: 'Luis', email: 'luis@test.com' },
      });

      const res = await request(buildApp(controller)).post('/api/v1/auth/login').send({
        email: 'luis@test.com',
        password: 'secret123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          token: 'jwt-token',
          user: { id: '1', name: 'Luis', email: 'luis@test.com' },
        },
      });
    });

    it('passes email/password to the use case verbatim', async () => {
      loginUseCase.execute.mockResolvedValue({ token: 't', user: { id: '1' } });

      await request(buildApp(controller)).post('/api/v1/auth/login').send({
        email: 'luis@test.com',
        password: 'secret123',
      });

      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: 'luis@test.com',
        password: 'secret123',
      });
    });

    it('forwards use case errors to next()', async () => {
      const err = new Error('Invalid credentials');
      err.status = 401;
      loginUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller)).post('/api/v1/auth/login').send({
        email: 'luis@test.com',
        password: 'wrong',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 422 on invalid email format', async () => {
      const res = await request(buildApp(controller)).post('/api/v1/auth/login').send({
        email: 'not-an-email',
        password: 'secret123',
      });

      expect(res.status).toBe(422);
      expect(loginUseCase.execute).not.toHaveBeenCalled();
    });
  });
});

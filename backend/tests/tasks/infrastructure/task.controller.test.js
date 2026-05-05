import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { TaskController } from '../../../src/contexts/tasks/infrastructure/task.controller.js';
import { createTaskRouter } from '../../../src/contexts/tasks/infrastructure/task.routes.js';
import { errorHandler } from '../../../src/shared/middlewares/error.handler.js';
import logger from '../../../src/shared/infrastructure/logger/logger.js';

const VALID_ID = '507f1f77bcf86cd799439011';

function stubAuth(req, _res, next) {
  req.user = { id: 'u1', email: 'luis@test.com' };
  next();
}

function buildApp(controller) {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/tasks', createTaskRouter(controller, stubAuth));
  app.use(errorHandler);
  return app;
}

describe('TaskController', () => {
  let createUseCase;
  let listUseCase;
  let completeUseCase;
  let deleteUseCase;
  let controller;
  let loggerSpy;

  beforeEach(() => {
    createUseCase = { execute: jest.fn() };
    listUseCase = { execute: jest.fn() };
    completeUseCase = { execute: jest.fn() };
    deleteUseCase = { execute: jest.fn() };
    controller = new TaskController(createUseCase, listUseCase, completeUseCase, deleteUseCase);
    // Silence the errorHandler's 5xx log output during expected-error tests.
    loggerSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  describe('GET /api/v1/tasks', () => {
    it('returns 200 with the list wrapped in { success, data }', async () => {
      listUseCase.execute.mockResolvedValue([
        { id: '1', title: 'A' },
        { id: '2', title: 'B' },
      ]);

      const res = await request(buildApp(controller)).get('/api/v1/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: [{ id: '1', title: 'A' }, { id: '2', title: 'B' }],
      });
    });

    it('passes the authenticated userId to the use case', async () => {
      listUseCase.execute.mockResolvedValue([]);

      await request(buildApp(controller)).get('/api/v1/tasks');

      expect(listUseCase.execute).toHaveBeenCalledWith({ userId: 'u1' });
    });

    it('forwards use case errors to next()', async () => {
      const err = new Error('boom');
      listUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller)).get('/api/v1/tasks');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('returns 201 with the created task', async () => {
      createUseCase.execute.mockResolvedValue({ id: '1', title: 'New', userId: 'u1' });

      const res = await request(buildApp(controller))
        .post('/api/v1/tasks')
        .send({ title: 'New', description: 'd', responsible: 'r' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        data: { id: '1', title: 'New', userId: 'u1' },
      });
    });

    it('passes title, description, responsible and userId to the use case', async () => {
      createUseCase.execute.mockResolvedValue({});

      await request(buildApp(controller)).post('/api/v1/tasks').send({
        title: 'New',
        description: 'd',
        responsible: 'r',
      });

      expect(createUseCase.execute).toHaveBeenCalledWith({
        title: 'New',
        description: 'd',
        responsible: 'r',
        userId: 'u1',
      });
    });

    it('returns 422 when title is missing (validators short-circuit)', async () => {
      const res = await request(buildApp(controller))
        .post('/api/v1/tasks')
        .send({ description: 'no title' });

      expect(res.status).toBe(422);
      expect(createUseCase.execute).not.toHaveBeenCalled();
    });

    it('forwards use case errors to next()', async () => {
      const err = new Error('boom');
      err.status = 500;
      createUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller))
        .post('/api/v1/tasks')
        .send({ title: 'New' });

      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /api/v1/tasks/:id/complete', () => {
    it('returns 200 with the completed task', async () => {
      completeUseCase.execute.mockResolvedValue({ id: VALID_ID, completed: true });

      const res = await request(buildApp(controller)).patch(`/api/v1/tasks/${VALID_ID}/complete`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: { id: VALID_ID, completed: true },
      });
    });

    it('passes taskId from params and userId from req.user', async () => {
      completeUseCase.execute.mockResolvedValue({});

      await request(buildApp(controller)).patch(`/api/v1/tasks/${VALID_ID}/complete`);

      expect(completeUseCase.execute).toHaveBeenCalledWith({ taskId: VALID_ID, userId: 'u1' });
    });

    it('returns 422 on malformed id (validators short-circuit)', async () => {
      const res = await request(buildApp(controller)).patch('/api/v1/tasks/not-an-id/complete');

      expect(res.status).toBe(422);
      expect(completeUseCase.execute).not.toHaveBeenCalled();
    });

    it('forwards use case errors to next()', async () => {
      const err = new Error('Task not found');
      err.status = 404;
      completeUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller)).patch(`/api/v1/tasks/${VALID_ID}/complete`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('returns 200 with the success message on delete', async () => {
      deleteUseCase.execute.mockResolvedValue();

      const res = await request(buildApp(controller)).delete(`/api/v1/tasks/${VALID_ID}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: 'Task deleted successfully' });
    });

    it('passes taskId and userId to the use case', async () => {
      deleteUseCase.execute.mockResolvedValue();

      await request(buildApp(controller)).delete(`/api/v1/tasks/${VALID_ID}`);

      expect(deleteUseCase.execute).toHaveBeenCalledWith({ taskId: VALID_ID, userId: 'u1' });
    });

    it('returns 422 on malformed id', async () => {
      const res = await request(buildApp(controller)).delete('/api/v1/tasks/not-an-id');

      expect(res.status).toBe(422);
      expect(deleteUseCase.execute).not.toHaveBeenCalled();
    });

    it('forwards use case errors to next()', async () => {
      const err = new Error('Task not found');
      err.status = 404;
      deleteUseCase.execute.mockRejectedValue(err);

      const res = await request(buildApp(controller)).delete(`/api/v1/tasks/${VALID_ID}`);

      expect(res.status).toBe(404);
    });
  });
});

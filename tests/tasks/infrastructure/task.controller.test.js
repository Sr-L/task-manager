import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Router } from 'express';
import { createTaskValidators } from '../../../src/contexts/tasks/infrastructure/task.validators.js';
import { validateRequest } from '../../../src/shared/middlewares/validate.request.js';
import { errorHandler } from '../../../src/shared/middlewares/error.handler.js';

const VALID_TOKEN = 'Bearer valid-token';

// Stub authMiddleware: injects req.user without real JWT
function stubAuth(req, _res, next) {
  req.user = { id: 'u1', email: 'luis@test.com' };
  next();
}

function buildApp(taskController) {
  const app = express();
  app.use(express.json());

  const router = Router();
  router.use(stubAuth);
  router.get('/', taskController.list);
  router.post('/', createTaskValidators, validateRequest, taskController.create);
  router.patch('/:id/complete', taskController.complete);
  router.delete('/:id', taskController.delete);

  app.use('/api/v1/tasks', router);
  app.use(errorHandler);
  return app;
}

describe('TaskController', () => {
  let taskController;

  beforeEach(() => {
    taskController = {
      list: jest.fn((req, res) => res.json({ success: true, data: [] })),
      create: jest.fn((req, res) => res.status(201).json({ success: true, data: { id: '1', title: req.body.title } })),
      complete: jest.fn((req, res) => res.json({ success: true, data: { id: req.params.id, completed: true } })),
      delete: jest.fn((req, res) => res.json({ success: true, message: 'Task deleted successfully' })),
    };
  });

  it('GET /tasks - should return list of tasks', async () => {
    const app = buildApp(taskController);
    const res = await request(app).get('/api/v1/tasks').set('Authorization', VALID_TOKEN);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('POST /tasks - should create a task', async () => {
    const app = buildApp(taskController);
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', VALID_TOKEN)
      .send({ title: 'New task' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('New task');
  });

  it('POST /tasks - should return 422 when title is missing', async () => {
    const app = buildApp(taskController);
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', VALID_TOKEN)
      .send({ description: 'no title' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('PATCH /tasks/:id/complete - should complete a task', async () => {
    const app = buildApp(taskController);
    const res = await request(app)
      .patch('/api/v1/tasks/abc123/complete')
      .set('Authorization', VALID_TOKEN);

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it('DELETE /tasks/:id - should delete a task', async () => {
    const app = buildApp(taskController);
    const res = await request(app)
      .delete('/api/v1/tasks/abc123')
      .set('Authorization', VALID_TOKEN);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  it('PATCH /tasks/:id/complete - should propagate 404 via errorHandler', async () => {
    taskController.complete = jest.fn((_req, _res, next) => {
      const err = new Error('Task not found');
      err.status = 404;
      next(err);
    });
    const app = buildApp(taskController);
    const res = await request(app)
      .patch('/api/v1/tasks/nonexistent/complete')
      .set('Authorization', VALID_TOKEN);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

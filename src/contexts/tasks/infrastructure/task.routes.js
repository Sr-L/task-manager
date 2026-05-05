import { Router } from 'express';
import { authMiddleware } from '../../auth/infrastructure/auth.middleware.js';
import { createTaskValidators } from './task.validators.js';
import { validateRequest } from '../../../shared/middlewares/validate.request.js';

export function createTaskRouter(taskController) {
  const router = Router();

  router.use(authMiddleware);

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: List all tasks for the authenticated user
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized
   */
  router.get('/', taskController.list);

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title]
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               responsible:
   *                 type: string
   *     responses:
   *       201:
   *         description: Task created
   *       401:
   *         description: Unauthorized
   *       422:
   *         description: Validation error
   */
  router.post('/', createTaskValidators, validateRequest, taskController.create);

  /**
   * @swagger
   * /tasks/{id}/complete:
   *   patch:
   *     summary: Mark a task as completed
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task marked as completed
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Task not found
   */
  router.patch('/:id/complete', taskController.complete);

  /**
   * @swagger
   * /tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', taskController.delete);

  return router;
}

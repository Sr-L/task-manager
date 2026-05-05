import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../../shared/middlewares/validate.request.js';

export function createAuthRouter(authController) {
  const router = Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *                 minLength: 6
   *     responses:
   *       201:
   *         description: User registered successfully
   *       409:
   *         description: Email already in use
   *       422:
   *         description: Validation error
   */
  router.post(
    '/register',
    [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validateRequest,
    authController.register
  );

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login and obtain JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful, returns JWT
   *       401:
   *         description: Invalid credentials
   *       422:
   *         description: Validation error
   */
  router.post(
    '/login',
    [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    validateRequest,
    authController.login
  );

  return router;
}

import { body } from 'express-validator';

export const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('responsible').optional().isString(),
];

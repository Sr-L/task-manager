import { body, param } from 'express-validator';

export const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('responsible').optional().isString(),
];

export const taskIdParamValidators = [
  param('id').isMongoId().withMessage('Invalid task id'),
];

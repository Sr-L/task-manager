import { successResponse, messageResponse } from '../../../shared/utils/response.handler.js';

export class TaskController {
  constructor(createUseCase, listUseCase, completeUseCase, deleteUseCase) {
    this.createUseCase = createUseCase;
    this.listUseCase = listUseCase;
    this.completeUseCase = completeUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  create = async (req, res, next) => {
    try {
      const { title, description, responsible } = req.body;
      const userId = req.user.id;
      const task = await this.createUseCase.execute({ title, description, responsible, userId });
      successResponse(res, task, 201);
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const tasks = await this.listUseCase.execute({ userId });
      successResponse(res, tasks);
    } catch (err) {
      next(err);
    }
  };

  complete = async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
      const task = await this.completeUseCase.execute({ taskId, userId });
      successResponse(res, task);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
      await this.deleteUseCase.execute({ taskId, userId });
      messageResponse(res, 'Task deleted successfully');
    } catch (err) {
      next(err);
    }
  };
}

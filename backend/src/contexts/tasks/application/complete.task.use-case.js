import { NotFoundError, ForbiddenError } from '../../../shared/domain/domain.error.js';

export class CompleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundError('Task not found');
    if (task.userId !== userId) throw new ForbiddenError();

    return this.taskRepository.markCompleted(taskId);
  }
}

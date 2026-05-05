import { NotFoundError } from '../../../shared/domain/domain.error.js';

export class CompleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.markCompleted(taskId, userId);
    if (!task) throw new NotFoundError('Task not found');
    return task;
  }
}

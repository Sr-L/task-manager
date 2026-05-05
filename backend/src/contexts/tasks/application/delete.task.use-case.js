import { NotFoundError, ForbiddenError } from '../../../shared/domain/domain.error.js';

export class DeleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundError('Task not found');
    if (task.userId !== userId) throw new ForbiddenError();

    await this.taskRepository.delete(taskId);
  }
}

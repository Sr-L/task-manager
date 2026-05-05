import { NotFoundError } from '../../../shared/domain/domain.error.js';

export class DeleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, userId }) {
    const deleted = await this.taskRepository.delete(taskId, userId);
    if (!deleted) throw new NotFoundError('Task not found');
  }
}

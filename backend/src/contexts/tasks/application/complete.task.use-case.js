export class CompleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, userId }) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      const err = new Error('Task not found');
      err.status = 404;
      throw err;
    }

    if (task.userId !== userId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }

    return this.taskRepository.markCompleted(taskId);
  }
}

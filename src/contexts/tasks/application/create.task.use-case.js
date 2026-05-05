import { TaskEntity } from '../domain/task.entity.js';

export class CreateTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ title, description, responsible, userId }) {
    const task = new TaskEntity({ id: null, title, description, responsible, completed: false, userId, createdAt: new Date(), updatedAt: new Date() });
    return this.taskRepository.save(task);
  }
}

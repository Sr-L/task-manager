export class ListTasksUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ userId }) {
    return this.taskRepository.findByUserId(userId);
  }
}

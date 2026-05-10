export class TaskRepository {

  async save(_task) {
    throw new Error('TaskRepository.save not implemented');
  }

  async findByUserId(_userId) {
    throw new Error('TaskRepository.findByUserId not implemented');
  }

  async markCompleted(_id, _userId) {
    throw new Error('TaskRepository.markCompleted not implemented');
  }

  async delete(_id, _userId) {
    throw new Error('TaskRepository.delete not implemented');
  }
}

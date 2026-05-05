export class TaskEntity {
  constructor({ id, title, description, responsible, completed, userId, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.responsible = responsible || '';
    this.completed = completed ?? false;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

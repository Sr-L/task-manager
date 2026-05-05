import { EmptyTaskTitleError } from '../../../shared/domain/domain.error.js';

export class TaskEntity {
  constructor({ id, title, description, responsible, completed, userId, createdAt, updatedAt }) {
    if (!title || !title.trim()) throw new EmptyTaskTitleError();

    this.id = id;
    this.title = title.trim();
    this.description = description || '';
    this.responsible = responsible || '';
    this.completed = completed ?? false;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

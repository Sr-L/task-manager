import { TaskModel } from './task.model.js';
import { TaskEntity } from '../domain/task.entity.js';
import { TaskRepository } from '../domain/task.repository.js';

function toEntity(doc) {
  return new TaskEntity({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    responsible: doc.responsible,
    completed: doc.completed,
    userId: doc.userId.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export class MongoTaskRepository extends TaskRepository{
  async save(task) {
    const doc = await TaskModel.create({
      title: task.title,
      description: task.description,
      responsible: task.responsible,
      completed: task.completed,
      userId: task.userId,
    });
    return toEntity(doc);
  }

  async findByUserId(userId) {
    const docs = await TaskModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(toEntity);
  }

  async markCompleted(id, userId) {
    const doc = await TaskModel.findOneAndUpdate(
      { _id: id, userId },
      { completed: true },
      { new: true }
    );
    return doc ? toEntity(doc) : null;
  }

  async delete(id, userId) {
    const doc = await TaskModel.findOneAndDelete({ _id: id, userId });
    return doc !== null;
  }
}

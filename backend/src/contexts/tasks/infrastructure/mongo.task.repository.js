import { TaskModel } from './task.model.js';
import { TaskEntity } from '../domain/task.entity.js';

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

export class MongoTaskRepository {
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

  async findById(id) {
    const doc = await TaskModel.findById(id);
    if (!doc) return null;
    return toEntity(doc);
  }

  async markCompleted(id) {
    const doc = await TaskModel.findByIdAndUpdate(id, { completed: true }, { new: true });
    return toEntity(doc);
  }

  async delete(id) {
    await TaskModel.findByIdAndDelete(id);
  }
}

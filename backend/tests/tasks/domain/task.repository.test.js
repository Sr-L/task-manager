import { describe, it, expect } from '@jest/globals';
import { TaskRepository } from '../../../src/contexts/tasks/domain/task.repository.js';
import { MongoTaskRepository } from '../../../src/contexts/tasks/infrastructure/mongo.task.repository.js';

describe('TaskRepository', () => {
  const port = new TaskRepository();

  it.each([
    ['save', () => port.save({})],
    ['findByUserId', () => port.findByUserId('u1')],
    ['findById', () => port.findById('1')],
    ['markCompleted', () => port.markCompleted('1', 'u1')],
    ['delete', () => port.delete('1', 'u1')],
  ])('%s throws Not implemented when not overridden', async (name, call) => {
    await expect(call()).rejects.toThrow(`TaskRepository.${name} not implemented`);
  });
});

describe('MongoTaskRepository', () => {
  it('is an instance of the TaskRepository', () => {
    const adapter = new MongoTaskRepository();
    expect(adapter).toBeInstanceOf(TaskRepository);
  });

  it('overrides every abstract method (no method falls)', async () => {
    const adapter = new MongoTaskRepository();
    const methods = ['save', 'findByUserId', 'findById', 'markCompleted', 'delete'];
    for (const m of methods) {
      const own = Object.getPrototypeOf(adapter)[m];
      const fromPort = TaskRepository.prototype[m];
      expect(own).not.toBe(fromPort);
    }
  });
});

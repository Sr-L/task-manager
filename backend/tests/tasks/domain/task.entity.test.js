import { describe, it, expect } from '@jest/globals';
import { TaskEntity } from '../../../src/contexts/tasks/domain/task.entity.js';

describe('TaskEntity', () => {
  const valid = {
    id: '1',
    title: 'Buy milk',
    description: 'whole',
    responsible: 'Luis',
    completed: false,
    userId: 'u1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('builds with valid data and trims the title', () => {
    const task = new TaskEntity({ ...valid, title: '  Buy milk  ' });
    expect(task.title).toBe('Buy milk');
  });

  it('defaults description, responsible, completed when missing', () => {
    const task = new TaskEntity({
      id: '1',
      title: 'X',
      userId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(task.description).toBe('');
    expect(task.responsible).toBe('');
    expect(task.completed).toBe(false);
  });

  it.each([undefined, '', '   '])('rejects empty title: %j', (title) => {
    expect(() => new TaskEntity({ ...valid, title }))
      .toThrow(expect.objectContaining({ status: 400, name: 'EmptyTaskTitleError' }));
  });
});

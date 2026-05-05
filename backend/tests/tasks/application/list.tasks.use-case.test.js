import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ListTasksUseCase } from '../../../src/contexts/tasks/application/list.tasks.use-case.js';

describe('ListTasksUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = { findByUserId: jest.fn() };
    useCase = new ListTasksUseCase(taskRepository);
  });

  it('should return tasks for the user', async () => {
    const tasks = [{ id: '1', title: 'Task 1', userId: 'u1' }, { id: '2', title: 'Task 2', userId: 'u1' }];
    taskRepository.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute({ userId: 'u1' });

    expect(taskRepository.findByUserId).toHaveBeenCalledWith('u1');
    expect(result).toHaveLength(2);
  });

  it('should return empty array when user has no tasks', async () => {
    taskRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute({ userId: 'u1' });

    expect(result).toEqual([]);
  });
});

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CompleteTaskUseCase } from '../../../src/contexts/tasks/application/complete.task.use-case.js';

describe('CompleteTaskUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = {
      markCompleted: jest.fn(),
    };
    useCase = new CompleteTaskUseCase(taskRepository);
  });

  it('should mark task as completed when owner requests it', async () => {
    taskRepository.markCompleted.mockResolvedValue({ id: '1', userId: 'u1', completed: true });

    const result = await useCase.execute({ taskId: '1', userId: 'u1' });

    expect(taskRepository.markCompleted).toHaveBeenCalledWith('1', 'u1');
    expect(result.completed).toBe(true);
  });

  it('should throw 404 when task does not exist', async () => {
    taskRepository.markCompleted.mockResolvedValue(null);

    await expect(useCase.execute({ taskId: 'nonexistent', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Task not found', status: 404 });
  });

  it('should throw 404 when task belongs to another user (no existence leak)', async () => {
    taskRepository.markCompleted.mockResolvedValue(null);

    await expect(useCase.execute({ taskId: '1', userId: 'u1' }))
      .rejects.toMatchObject({ status: 404 });

    expect(taskRepository.markCompleted).toHaveBeenCalledWith('1', 'u1');
  });
});

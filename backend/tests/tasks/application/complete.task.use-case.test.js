import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CompleteTaskUseCase } from '../../../src/contexts/tasks/application/complete.task.use-case.js';

describe('CompleteTaskUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = {
      findById: jest.fn(),
      markCompleted: jest.fn(),
    };
    useCase = new CompleteTaskUseCase(taskRepository);
  });

  it('should mark task as completed when owner requests it', async () => {
    taskRepository.findById.mockResolvedValue({ id: '1', userId: 'u1', completed: false });
    taskRepository.markCompleted.mockResolvedValue({ id: '1', userId: 'u1', completed: true });

    const result = await useCase.execute({ taskId: '1', userId: 'u1' });

    expect(taskRepository.markCompleted).toHaveBeenCalledWith('1');
    expect(result.completed).toBe(true);
  });

  it('should throw 404 when task does not exist', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ taskId: 'nonexistent', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Task not found', status: 404 });

    expect(taskRepository.markCompleted).not.toHaveBeenCalled();
  });

  it('should throw 403 when task belongs to another user', async () => {
    taskRepository.findById.mockResolvedValue({ id: '1', userId: 'u2', completed: false });

    await expect(useCase.execute({ taskId: '1', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Forbidden', status: 403 });

    expect(taskRepository.markCompleted).not.toHaveBeenCalled();
  });
});

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DeleteTaskUseCase } from '../../../src/contexts/tasks/application/delete.task.use-case.js';

describe('DeleteTaskUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = {
      delete: jest.fn(),
    };
    useCase = new DeleteTaskUseCase(taskRepository);
  });

  it('should delete task when owner requests it', async () => {
    taskRepository.delete.mockResolvedValue(true);

    await useCase.execute({ taskId: '1', userId: 'u1' });

    expect(taskRepository.delete).toHaveBeenCalledWith('1', 'u1');
  });

  it('should throw 404 when task does not exist', async () => {
    taskRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute({ taskId: 'nonexistent', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Task not found', status: 404 });
  });

  it('should throw 404 when task belongs to another user (no existence leak)', async () => {
    taskRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute({ taskId: '1', userId: 'u1' }))
      .rejects.toMatchObject({ status: 404 });

    expect(taskRepository.delete).toHaveBeenCalledWith('1', 'u1');
  });
});

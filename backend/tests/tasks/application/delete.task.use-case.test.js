import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DeleteTaskUseCase } from '../../../src/contexts/tasks/application/delete.task.use-case.js';

describe('DeleteTaskUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteTaskUseCase(taskRepository);
  });

  it('should delete task when owner requests it', async () => {
    taskRepository.findById.mockResolvedValue({ id: '1', userId: 'u1' });
    taskRepository.delete.mockResolvedValue();

    await useCase.execute({ taskId: '1', userId: 'u1' });

    expect(taskRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw 404 when task does not exist', async () => {
    taskRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ taskId: 'nonexistent', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Task not found', status: 404 });

    expect(taskRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw 403 when task belongs to another user', async () => {
    taskRepository.findById.mockResolvedValue({ id: '1', userId: 'u2' });

    await expect(useCase.execute({ taskId: '1', userId: 'u1' }))
      .rejects.toMatchObject({ message: 'Forbidden', status: 403 });

    expect(taskRepository.delete).not.toHaveBeenCalled();
  });
});

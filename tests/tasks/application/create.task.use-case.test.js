import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateTaskUseCase } from '../../../src/contexts/tasks/application/create.task.use-case.js';

describe('CreateTaskUseCase', () => {
  let taskRepository;
  let useCase;

  beforeEach(() => {
    taskRepository = { save: jest.fn() };
    useCase = new CreateTaskUseCase(taskRepository);
  });

  it('should create a task with required fields only', async () => {
    const task = { id: '1', title: 'Fix bug', description: '', responsible: '', completed: false, userId: 'u1' };
    taskRepository.save.mockResolvedValue(task);

    const result = await useCase.execute({ title: 'Fix bug', userId: 'u1' });

    expect(taskRepository.save).toHaveBeenCalledTimes(1);
    expect(result.title).toBe('Fix bug');
    expect(result.completed).toBe(false);
  });

  it('should create a task with all fields', async () => {
    const task = { id: '1', title: 'Fix bug', description: 'Details', responsible: 'Luis', completed: false, userId: 'u1' };
    taskRepository.save.mockResolvedValue(task);

    const result = await useCase.execute({ title: 'Fix bug', description: 'Details', responsible: 'Luis', userId: 'u1' });

    const saved = taskRepository.save.mock.calls[0][0];
    expect(saved.description).toBe('Details');
    expect(saved.responsible).toBe('Luis');
    expect(result.title).toBe('Fix bug');
  });
});

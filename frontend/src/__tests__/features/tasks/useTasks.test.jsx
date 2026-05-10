import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DependenciesProvider } from '../../../context/DependenciesProvider.jsx';
import { AuthProvider } from '../../../context/AuthContext.jsx';
import { createNoopNotifier } from '../../../shared/notifications/notifier.js';
import { useTasks } from '../../../features/tasks/application/useTasks.js';

const mockTask = { id: '1', title: 'Test task', description: '', responsible: '', completed: false, createdAt: new Date().toISOString() };

function makeWrapper(taskApiService) {
  const deps = { taskApiService, authApiService: {}, notifier: createNoopNotifier() };
  return function Wrapper({ children }) {
    return (
      <MemoryRouter>
        <AuthProvider>
          <DependenciesProvider value={deps}>
            {children}
          </DependenciesProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };
}

describe('useTasks', () => {
  let taskApiService;

  beforeEach(() => {
    taskApiService = {
      getAll: vi.fn().mockResolvedValue([mockTask]),
      create: vi.fn().mockResolvedValue({ ...mockTask, id: '2', title: 'New' }),
      complete: vi.fn().mockResolvedValue({ ...mockTask, completed: true }),
      remove: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('fetches tasks on mount', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(taskApiService) });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test task');
  });

  it('adds task to the list after createTask', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(taskApiService) });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createTask({ title: 'New', description: '', responsible: '' });
    });

    expect(result.current.tasks).toHaveLength(2);
  });

  it('returns fieldErrors when title is empty', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(taskApiService) });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response;
    await act(async () => {
      response = await result.current.createTask({ title: '', description: '', responsible: '' });
    });

    expect(response.fieldErrors.title).toBeDefined();
    expect(taskApiService.create).not.toHaveBeenCalled();
  });

  it('marks task as completed after completeTask', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(taskApiService) });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.completeTask('1'); });

    expect(result.current.tasks[0].completed).toBe(true);
  });

  it('removes task from list after deleteTask', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(taskApiService) });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.deleteTask('1'); });

    expect(result.current.tasks).toHaveLength(0);
  });
});

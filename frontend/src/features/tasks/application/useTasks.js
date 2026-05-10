import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../../../context/DependenciesProvider.jsx';
import { validateTaskForm, hasErrors } from '../domain/taskDomain.js';

export function useTasks() {
  const { taskApiService, notifier } = useDependencies();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await taskApiService.getAll();
      setTasks(data);
    } catch {
      setLoadError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [taskApiService]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (formData) => {
    const errors = validateTaskForm(formData);
    if (hasErrors(errors)) return { fieldErrors: errors };

    try {
      const task = await taskApiService.create(formData);
      setTasks((prev) => [task, ...prev]);
      notifier.success('Task created');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to create task';
      return { error: msg };
    }
  }, [taskApiService, notifier]);

  const completeTask = useCallback(async (id) => {
    try {
      const updated = await taskApiService.complete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      notifier.success('Task completed');
    } catch {
      notifier.error('Failed to update task');
    }
  }, [taskApiService, notifier]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskApiService.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      notifier.success('Task deleted');
    } catch {
      notifier.error('Failed to delete task');
    }
  }, [taskApiService, notifier]);

  return { tasks, loading, loadError, createTask, completeTask, deleteTask, refresh: fetchTasks };
}

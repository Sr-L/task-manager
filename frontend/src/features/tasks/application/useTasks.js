import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../../../context/DependenciesProvider.jsx';
import { validateTaskForm, hasErrors } from '../domain/taskDomain.js';

export function useTasks() {
  const { taskApiService, notifier } = useDependencies();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApiService.getAll();
      setTasks(data);
    } catch {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [taskApiService]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function createTask(formData) {
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
  }

  async function completeTask(id) {
    try {
      const updated = await taskApiService.complete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      notifier.success('Task completed');
    } catch {
      setError('Failed to update task');
    }
  }

  async function deleteTask(id) {
    try {
      await taskApiService.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      notifier.success('Task deleted');
    } catch {
      setError('Failed to delete task');
    }
  }

  return { tasks, loading, error, createTask, completeTask, deleteTask, refresh: fetchTasks };
}

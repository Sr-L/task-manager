import { lazy, Suspense, useState } from 'react';
import { useTasks } from '../application/useTasks.js';
import {
  filterCompleted,
  filterPending,
  sortByCreatedAt,
} from '../domain/taskDomain.js';
import { TaskList } from './TaskList.jsx';
import { Spinner } from '../../../shared/ui/components/Spinner.jsx';
import styles from './TasksPage.module.css';

const TaskForm = lazy(() =>
  import('./TaskForm.jsx').then((m) => ({ default: m.TaskForm }))
);

export function TasksPage() {
  const { tasks, loading, loadError, createTask, completeTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'

  const ordered = sortByCreatedAt(tasks);
  const filtered =
    filter === 'pending' ? filterPending(ordered)
    : filter === 'done' ? filterCompleted(ordered)
    : ordered;

  const pendingCount = filterPending(tasks).length;

  async function handleCreate(data) {
    const result = await createTask(data);
    if (result?.success) setShowForm(false);
    return result;
  }

  return (
    <>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>My Tasks</h1>
          <p className={styles.subtitle}>
            {pendingCount === 0
              ? 'All done — great work!'
              : `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
        <button
          className={styles.newBtn}
          onClick={() => setShowForm((v) => !v)}
          type="button"
        >
          {showForm ? '✕ Cancel' : '+ New task'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formWrapper}>
          <Suspense fallback={<Spinner size={20} label="Cargando formulario…" />}>
            <TaskForm onSubmit={handleCreate} />
          </Suspense>
        </div>
      )}

      <div className={styles.filters}>
        {['all', 'pending', 'done'].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            type="button"
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loadError && <p className={styles.error} role="alert">{loadError}</p>}

      <TaskList
        tasks={filtered}
        loading={loading}
        onComplete={completeTask}
        onDelete={deleteTask}
      />
    </>
  );
}

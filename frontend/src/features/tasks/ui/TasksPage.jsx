import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext.jsx';
import { useTasks } from '../application/useTasks.js';
import { TaskForm } from './TaskForm.jsx';
import { TaskList } from './TaskList.jsx';
import styles from './TasksPage.module.css';

export function TasksPage() {
  const { user, logout } = useAuthContext();
  const { tasks, loading, error, createTask, completeTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  async function handleCreate(data) {
    const result = await createTask(data);
    if (result?.success) setShowForm(false);
    return result;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>Taskr</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{user?.name ?? user?.email}</span>
          <button className={styles.logoutBtn} onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
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
            <TaskForm onSubmit={handleCreate} />
          </div>
        )}

        <div className={styles.filters}>
          {['all', 'pending', 'done'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
              type="button"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <TaskList
          tasks={filtered}
          loading={loading}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}

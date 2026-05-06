import { TaskItem } from './TaskItem.jsx';
import styles from './TaskList.module.css';

export function TaskList({ tasks, loading, onComplete, onDelete }) {
  if (loading) {
    return (
      <ul className={styles.list}>
        {[1, 2, 3].map((n) => (
          <li key={n} className={styles.skeleton} aria-hidden="true" />
        ))}
      </ul>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>○</span>
        <p>No tasks here</p>
      </div>
    );
  }

  return (
    <ul className={styles.list} role="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </ul>
  );
}

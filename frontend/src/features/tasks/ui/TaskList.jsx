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

function TaskItem({ task, onComplete, onDelete }) {
  return (
    <li className={`${styles.item} ${task.completed ? styles.itemDone : ''}`}>
      <button
        className={styles.check}
        onClick={() => !task.completed && onComplete(task.id)}
        aria-label={task.completed ? 'Completed' : 'Mark as complete'}
        type="button"
        disabled={task.completed}
      >
        {task.completed && <span className={styles.checkMark}>✓</span>}
      </button>

      <div className={styles.body}>
        <p className={styles.itemTitle}>{task.title}</p>
        {task.description && (
          <p className={styles.itemDesc}>{task.description}</p>
        )}
        {task.responsible && (
          <p className={styles.responsible}>
            <span className={styles.avatar}>{task.responsible[0].toUpperCase()}</span>
            {task.responsible}
          </p>
        )}
      </div>

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        type="button"
      >
        ✕
      </button>
    </li>
  );
}

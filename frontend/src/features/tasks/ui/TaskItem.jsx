import { memo } from 'react';
import styles from './TaskItem.module.css';

export const TaskItem = memo(function TaskItem({ task, onComplete, onDelete }) {
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
          <p className={styles.responsible} aria-label={`Responsible: ${task.responsible}`}>
            <span className={styles.avatar} aria-hidden="true">
              {task.responsible.charAt(0).toUpperCase()}
            </span>
            <span>{task.responsible}</span>
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
});

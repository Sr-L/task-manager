import styles from './Input.module.css';

export function Input({ label, error, id, ...props }) {
  const inputId = id ?? props.name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

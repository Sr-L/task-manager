import styles from './Button.module.css';

export function Button({ variant = 'primary', loading, children, className = '', ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? '…' : children}
    </button>
  );
}

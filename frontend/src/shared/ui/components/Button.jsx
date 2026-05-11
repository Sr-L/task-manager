import { Spinner } from './Spinner.jsx';
import styles from './Button.module.css';

export function Button({ variant = 'primary', loading, children, className = '', ...props }) {
  
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Spinner size={14} label="Loading…" /> : children}
    </button>
  );
}

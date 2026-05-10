import { Spinner } from '../ui/components/Spinner.jsx';
import styles from './RouteFallback.module.css';

export function RouteFallback() {
  return (
    <div className={styles.fallback}>
      <Spinner size={24} label="Cargando…" />
    </div>
  );
}

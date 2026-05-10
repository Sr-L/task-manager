import { useAuthContext } from '../../context/AuthContext.jsx';
import { useAuth } from '../../features/auth/application/useAuth.js';
import { Button } from '../ui/components/Button.jsx';
import styles from './Layout.module.css';

export function Layout({ children }) {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <span className={styles.brandName}>Taskr</span>
        </div>
        <div className={styles.right}>
          <span className={styles.user}>{user?.name ?? user?.email}</span>
          <Button variant="secondary" onClick={logout}>Sign out</Button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

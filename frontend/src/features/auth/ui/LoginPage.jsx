import { useState } from 'react';
import { useAuth } from '../application/useAuth.js';
import { Input } from '../../../shared/ui/components/Input.jsx';
import { Button } from '../../../shared/ui/components/Button.jsx';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const action = mode === 'login' ? login : register;
    const result = await action(form);
    if (result?.fieldErrors) setFieldErrors(result.fieldErrors);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Taskr</span>
        </div>

        <h1 className={styles.heading}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setMode('login'); setFieldErrors({}); }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setMode('register'); setFieldErrors({}); }}
            type="button"
          >
            Register
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <Input
              label="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              error={fieldErrors.name}
              placeholder="Alice"
              autoComplete="name"
            />
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && <p className={styles.globalError} role="alert">{error}</p>}

          <Button type="submit" loading={loading} className={styles.submit}>
            {mode === 'login' ? 'Sign in →' : 'Create account →'}
          </Button>
        </form>
      </div>
    </div>
  );
}

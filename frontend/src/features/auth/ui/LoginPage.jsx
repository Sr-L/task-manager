import { useState } from 'react';
import { useAuth } from '../application/useAuth.js';
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
            <Field label="Name" name="name" type="text" value={form.name}
              onChange={handleChange} error={fieldErrors.name} placeholder="Alice" />
          )}
          <Field label="Email" name="email" type="email" value={form.email}
            onChange={handleChange} error={fieldErrors.email} placeholder="you@example.com" />
          <Field label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} error={fieldErrors.password} placeholder="••••••••" />

          {error && <p className={styles.globalError}>{error}</p>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type, value, onChange, error, placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>{label}</label>
      <input
        id={name}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : name}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

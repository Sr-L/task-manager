import { useState } from 'react';
import { useAuth } from '../application/useAuth.js';
import {
  validateLoginForm,
  validateRegisterForm,
} from '../domain/authValidations.js';
import { useFormFeedback } from '../../../shared/ui/hooks/useFormFeedback.js';
import { Input } from '../../../shared/ui/components/Input.jsx';
import { Button } from '../../../shared/ui/components/Button.jsx';
import styles from './LoginPage.module.css';

const REGISTER_FIELDS = ["name", "email", "password"];
const LOGIN_FIELDS = ["email", "password"];
const INITIAL_FORM = { name: "", email: "", password: "" };

export function LoginPage() {
  const { login, register, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  const validate = mode === "login" ? validateLoginForm : validateRegisterForm;

  const {
    form,
    shake,
    allErrors,
    visibleErrors,
    handleChange,
    handleBlur,
    triggerShake,
    touchFields,
    markFieldErrors,
    reset,
  } = useFormFeedback(INITIAL_FORM, validate);

  async function handleSubmit(e) {
    e.preventDefault();

    const fields = mode === "login" ? LOGIN_FIELDS : REGISTER_FIELDS;
    touchFields(fields);

    if (Object.keys(allErrors).length > 0) {
      triggerShake();
      return;
    }

    const action = mode === "login" ? login : register;
    const result = await action(form);

    if (result?.fieldErrors) {
      markFieldErrors(result.fieldErrors);
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    reset();
    clearError();
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Taskr</span>
        </div>

        <h1 className={styles.heading}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        <div className={styles.tabs} role="tablist">
          <button
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => switchMode("login")}
            role="tab"
            aria-selected={mode === "login"}
            aria-controls="login-form"
            type="button"
          >
            Sign in
          </button>
          <button
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => switchMode("register")}
            role="tab"
            aria-selected={mode === "register"}
            aria-controls="login-form"
            type="button"
          >
            Register
          </button>
        </div>

        <form
          id="login-form"
          className={`${styles.form} ${shake ? styles.shake : ""}`}
          onSubmit={handleSubmit}
          noValidate
        >
          {mode === "register" && (
            <Input
              label="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleErrors.name}
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
            onBlur={handleBlur}
            error={visibleErrors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={visibleErrors.password}
            placeholder="••••••••"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />

          {error && (
            <p className={styles.globalError} role="alert">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className={styles.submit}>
            {mode === "login" ? "Sign in →" : "Create account →"}
          </Button>
        </form>
      </div>
    </div>
  );
}

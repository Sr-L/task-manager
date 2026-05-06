import { useState } from 'react';
import styles from './TaskForm.module.css';

export function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', responsible: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);
    if (result?.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    } else if (result?.error) {
      setApiError(result.error);
    } else {
      setForm({ title: '', description: '', responsible: '' });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.formTitle}>New task</h2>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Title *</label>
          <input
            id="title"
            className={`${styles.input} ${fieldErrors.title ? styles.inputError : ''}`}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
          />
          {fieldErrors.title && <span className={styles.fieldError}>{fieldErrors.title}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="responsible">Responsible</label>
          <input
            id="responsible"
            className={styles.input}
            name="responsible"
            value={form.responsible}
            onChange={handleChange}
            placeholder="Who owns this?"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description"
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details…"
          rows={3}
        />
      </div>

      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create task'}
      </button>
    </form>
  );
}

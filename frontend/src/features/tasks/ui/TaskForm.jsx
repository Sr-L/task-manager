import { useState } from 'react';
import { validateTaskForm } from '../domain/taskDomain.js';
import { useFormFeedback } from '../../../shared/ui/hooks/useFormFeedback.js';
import { Input } from '../../../shared/ui/components/Input.jsx';
import { Button } from '../../../shared/ui/components/Button.jsx';
import styles from './TaskForm.module.css';

const INITIAL_FORM = { title: "", description: "", responsible: "" };

export function TaskForm({ onSubmit }) {
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
  } = useFormFeedback(INITIAL_FORM, validateTaskForm);

  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);

    touchFields(["title"]);

    if (Object.keys(allErrors).length > 0) {
      triggerShake();
      return;
    }

    setLoading(true);
    const result = await onSubmit(form);
    setLoading(false);

    if (result?.fieldErrors) {
      markFieldErrors(result.fieldErrors);
    } else if (result?.error) {
      setApiError(result.error);
      triggerShake();
    } else {
      reset();
    }
  }

  return (
    <form
      className={`${styles.form} ${shake ? styles.shake : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className={styles.formTitle}>New task</h2>

      <div className={styles.grid}>
        <Input
          label="Title *"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={visibleErrors.title}
          placeholder="What needs to be done?"
        />
        <Input
          label="Responsible"
          id="responsible"
          name="responsible"
          value={form.responsible}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Who owns this?"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description"
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Optional details…"
          rows={3}
        />
      </div>

      {apiError && (
        <p className={styles.apiError} role="alert">
          {apiError}
        </p>
      )}

      <Button type="submit" loading={loading} className={styles.submit}>
        Create task
      </Button>
    </form>
  );
}

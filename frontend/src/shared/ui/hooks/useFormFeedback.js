import { useState } from 'react';

export function useFormFeedback(initialValues, validate) {
  const [form, setForm] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [shake, setShake] = useState(false);

  const allErrors = validate(form);
  const visibleErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([key]) => touched[key]),
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function touchFields(fields) {
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
  }

  function markFieldErrors(fieldErrors) {
    touchFields(Object.keys(fieldErrors));
    triggerShake();
  }

  function reset() {
    setForm(initialValues);
    setTouched({});
  }

  return {
    form,
    setForm,
    shake,
    allErrors,
    visibleErrors,
    handleChange,
    handleBlur,
    triggerShake,
    touchFields,
    markFieldErrors,
    reset,
  };
}

export function validateTaskForm({ title }) {
  const errors = {};
  if (!title || title.trim().length === 0) errors.title = 'Title is required';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

export function sortByCreatedAt(tasks) {
  return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function filterPending(tasks) {
  return tasks.filter((t) => !t.completed);
}

export function filterCompleted(tasks) {
  return tasks.filter((t) => t.completed);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateRegisterForm({ name, email, password }) {
  const errors = {};
  if (!name || name.trim().length === 0) errors.name = 'Name is required';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email';
  if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

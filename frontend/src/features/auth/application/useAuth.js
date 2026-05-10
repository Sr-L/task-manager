import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext.jsx';
import { useDependencies } from '../../../context/DependenciesProvider.jsx';
import { validateLoginForm, validateRegisterForm, hasErrors } from '../domain/authValidations.js';

export function useAuth() {
  const { authApiService, notifier } = useDependencies();
  const { login: saveAuth, logout: clearAuth } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(credentials) {
    const errors = validateLoginForm(credentials);
    if (hasErrors(errors)) return { fieldErrors: errors };

    setLoading(true);
    setError(null);
    try {
      const result = await authApiService.login(credentials);
      saveAuth(result);
      navigate('/');
      notifier.success('Welcome back');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Login failed';
      setError(msg);
      return { error: msg };
    } finally {
      setLoading(false);
    }
  }

  async function register(data) {
    const errors = validateRegisterForm(data);
    if (hasErrors(errors)) return { fieldErrors: errors };

    setLoading(true);
    setError(null);
    try {
      const result = await authApiService.register(data);
      saveAuth(result);
      navigate('/');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registration failed';
      setError(msg);
      return { error: msg };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return { login, register, logout, loading, error };
}

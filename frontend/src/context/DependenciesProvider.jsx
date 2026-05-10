import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpClient } from '../shared/infrastructure/httpClient.js';
import { createAuthApiService } from '../features/auth/infrastructure/AuthApiService.js';
import { createTaskApiService } from '../features/tasks/infrastructure/TaskApiService.js';
import { useAuthContext } from './AuthContext.jsx';

const DependenciesContext = createContext(null);

function createDependencies(onUnauthorized) {
  const getToken = () => localStorage.getItem('tm_token');
  const http = createHttpClient(getToken, onUnauthorized);
  return {
    authApiService: createAuthApiService(http),
    taskApiService: createTaskApiService(http),
  };
}

export function DependenciesProvider({ children, value }) {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const deps = useMemo(() => {
    if (value) return value;
    return createDependencies(() => {
      logout();
      navigate('/login', { replace: true });
    });
  }, [value, logout, navigate]);
  return (
    <DependenciesContext.Provider value={deps}>
      {children}
    </DependenciesContext.Provider>
  );
}

export function useDependencies() {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error('useDependencies must be used inside DependenciesProvider');
  return ctx;
}

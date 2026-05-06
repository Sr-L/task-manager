import { createContext, useContext, useMemo } from 'react';
import { createHttpClient } from '../shared/infrastructure/httpClient.js';
import { createAuthApiService } from '../features/auth/infrastructure/AuthApiService.js';
import { createTaskApiService } from '../features/tasks/infrastructure/TaskApiService.js';

const DependenciesContext = createContext(null);

/**
 * Creates all dependencies wired together.
 * Pass a custom value prop in tests to inject mocks.
 */
function createDependencies() {
  const getToken = () => localStorage.getItem('tm_token');
  const onUnauthorized = () => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    window.location.href = '/login';
  };
  const http = createHttpClient(getToken, onUnauthorized);
  return {
    authApiService: createAuthApiService(http),
    taskApiService: createTaskApiService(http),
  };
}

export function DependenciesProvider({ children, value }) {
  const deps = useMemo(() => value ?? createDependencies(), [value]);
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

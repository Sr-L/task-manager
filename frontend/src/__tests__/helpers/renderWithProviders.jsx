import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DependenciesProvider } from '../../context/DependenciesProvider.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

/**
 * Renders a component wrapped with all required providers.
 * @param {import('react').ReactElement} ui
 * @param {{ deps?: object, initialEntries?: string[], authValue?: object }} options
 */
export function renderWithProviders(ui, { deps, initialEntries = ['/'], authValue } = {}) {
  // Wrap AuthProvider so we can inject an auth state if needed
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <DependenciesProvider value={deps}>
          <AuthProvider>
            {authValue ? <AuthInjector value={authValue}>{children}</AuthInjector> : children}
          </AuthProvider>
        </DependenciesProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

// Helper to force a specific auth state in tests
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';

function AuthInjector({ value, children }) {
  const { login } = useAuthContext();
  useEffect(() => {
    if (value?.token) login(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return children;
}

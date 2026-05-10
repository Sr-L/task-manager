import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  DependenciesProvider,
  useDependencies,
} from '../../context/DependenciesProvider.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

describe('DependenciesProvider', () => {
  it('throws when useDependencies is called outside the provider', () => {
    // Silence the React error boundary console noise from the throw.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDependencies())).toThrow(
      /useDependencies must be used inside DependenciesProvider/,
    );
    spy.mockRestore();
  });

  it('exposes the injected value when one is passed as a prop', () => {
    const mocks = {
      authApiService: { login: vi.fn(), register: vi.fn() },
      taskApiService: { getAll: vi.fn() },
    };

    const wrapper = ({ children }) => (
      <MemoryRouter>
        <AuthProvider>
          <DependenciesProvider value={mocks}>{children}</DependenciesProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useDependencies(), { wrapper });

    expect(result.current).toBe(mocks);
    expect(result.current.authApiService.login).toBe(mocks.authApiService.login);
  });
});

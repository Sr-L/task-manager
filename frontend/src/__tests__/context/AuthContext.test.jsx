import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../../context/AuthContext.jsx';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login() sets user state', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    act(() => {
      result.current.login({
        user: { id: '1', name: 'Alice', email: 'alice@test.com' },
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.email).toBe('alice@test.com');
  });

  it('logout() clears user state', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    act(() => {
      result.current.login({
        user: { id: '1', name: 'Alice', email: 'alice@test.com' },
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('isAuthenticated reflects the presence of the user', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      result.current.login({ user: { id: '1' } });
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});

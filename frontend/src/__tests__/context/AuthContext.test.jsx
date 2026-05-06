import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../../context/AuthContext.jsx';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated when localStorage is empty', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('login() persists token and user to localStorage', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    act(() => {
      result.current.login({
        token: 'abc.def.ghi',
        user: { id: '1', name: 'Alice', email: 'alice@test.com' },
      });
    });

    expect(localStorage.getItem('tm_token')).toBe('abc.def.ghi');
    expect(JSON.parse(localStorage.getItem('tm_user'))).toEqual({
      id: '1',
      name: 'Alice',
      email: 'alice@test.com',
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.email).toBe('alice@test.com');
  });

  it('logout() clears token and user from localStorage', () => {
    localStorage.setItem('tm_token', 'abc');
    localStorage.setItem('tm_user', JSON.stringify({ id: '1' }));

    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('tm_token')).toBeNull();
    expect(localStorage.getItem('tm_user')).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('isAuthenticated reflects the presence of the token', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);

    act(() => {
      result.current.login({ token: 't', user: { id: '1' } });
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});

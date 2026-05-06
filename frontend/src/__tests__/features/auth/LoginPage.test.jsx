import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';
import { LoginPage } from '../../../features/auth/ui/LoginPage.jsx';

// The submit button is index [1]; index [0] is the "Sign in" tab
const getSubmit = () => screen.getAllByRole('button', { name: /sign in/i })[1];

function makeDeps(authOverrides = {}) {
  return {
    authApiService: {
      login: vi.fn().mockResolvedValue({ token: 'tok', user: { id: '1', name: 'Alice', email: 'alice@test.com' } }),
      register: vi.fn().mockResolvedValue({ token: 'tok', user: { id: '1', name: 'Alice', email: 'alice@test.com' } }),
      ...authOverrides,
    },
    taskApiService: { getAll: vi.fn().mockResolvedValue([]) },
  };
}

describe('LoginPage', () => {
  let user;
  beforeEach(() => { user = userEvent.setup(); });

  it('renders sign in form by default', () => {
    renderWithProviders(<LoginPage />, { deps: makeDeps(), initialEntries: ['/login'] });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(getSubmit()).toBeInTheDocument();
  });

  it('shows field errors when submitting empty form', async () => {
    renderWithProviders(<LoginPage />, { deps: makeDeps(), initialEntries: ['/login'] });
    await user.click(getSubmit());
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('calls login service with entered credentials', async () => {
    const loginFn = vi.fn().mockResolvedValue({ token: 'tok', user: { id: '1', name: 'Alice', email: 'alice@test.com' } });
    const deps = makeDeps({ login: loginFn });  // loginFn overrides authApiService.login
    renderWithProviders(<LoginPage />, { deps, initialEntries: ['/login'] });

    await user.type(screen.getByLabelText(/email/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(getSubmit());

    await waitFor(() => {
      // Login is called; form passes all fields including name (empty in login mode)
      expect(loginFn).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'alice@test.com', password: 'password123' })
      );
    });
  });

  it('shows error message when login fails', async () => {
    const loginFn = vi.fn().mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    const deps = makeDeps({ login: loginFn });
    renderWithProviders(<LoginPage />, { deps, initialEntries: ['/login'] });

    await user.type(screen.getByLabelText(/email/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(getSubmit());

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('switches to register form when clicking Register tab', async () => {
    renderWithProviders(<LoginPage />, { deps: makeDeps(), initialEntries: ['/login'] });
    await user.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});

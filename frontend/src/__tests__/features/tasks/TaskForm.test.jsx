import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../../features/tasks/ui/TaskForm.jsx';

describe('TaskForm', () => {
  it('renders all fields', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsible/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting without title', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ fieldErrors: { title: 'Title is required' } });
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title \*/i), 'Fix login bug');
    await user.type(screen.getByLabelText(/responsible/i), 'Alice');
    await user.type(screen.getByLabelText(/description/i), 'Critical fix');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Fix login bug',
        responsible: 'Alice',
        description: 'Critical fix',
      });
    });
  });

  it('resets form after successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title \*/i), 'My task');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/title \*/i)).toHaveValue('');
    });
  });

  it('shows API error message on failure', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ error: 'Server error' });
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title \*/i), 'My task');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});

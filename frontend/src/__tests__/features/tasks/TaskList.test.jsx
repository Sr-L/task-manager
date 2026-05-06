import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../../features/tasks/ui/TaskList.jsx';

const tasks = [
  { id: '1', title: 'Fix bug', description: 'Urgent', responsible: 'Alice', completed: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Write tests', description: '', responsible: '', completed: true, createdAt: new Date().toISOString() },
];

describe('TaskList', () => {
  it('renders skeleton rows while loading', () => {
    render(<TaskList tasks={[]} loading={true} onComplete={vi.fn()} onDelete={vi.fn()} />);
    // Skeletons are aria-hidden
    const skeletons = document.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} loading={false} onComplete={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no tasks here/i)).toBeInTheDocument();
  });

  it('renders task titles', () => {
    render(<TaskList tasks={tasks} loading={false} onComplete={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('renders task description and responsible when present', () => {
    render(<TaskList tasks={tasks} loading={false} onComplete={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls onComplete when clicking the check button of an incomplete task', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={tasks} loading={false} onComplete={onComplete} onDelete={vi.fn()} />);
    const completeBtn = screen.getByRole('button', { name: /mark as complete/i });
    await user.click(completeBtn);
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('does not call onComplete for already completed tasks (button disabled)', async () => {
    const onComplete = vi.fn();
    render(<TaskList tasks={tasks} loading={false} onComplete={onComplete} onDelete={vi.fn()} />);
    const completedBtn = screen.getByRole('button', { name: /completed/i });
    expect(completedBtn).toBeDisabled();
  });

  it('calls onDelete when clicking delete button', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={tasks} loading={false} onComplete={vi.fn()} onDelete={onDelete} />);
    const deleteBtns = screen.getAllByRole('button', { name: /delete task/i });
    await user.click(deleteBtns[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});

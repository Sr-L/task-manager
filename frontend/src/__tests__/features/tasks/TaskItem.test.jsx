import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from '../../../features/tasks/ui/TaskItem.jsx';

const baseTask = {
  id: '1',
  title: 'Fix login bug',
  description: 'Critical issue in /login',
  responsible: 'Alice',
  completed: false,
};

function renderItem(overrides = {}, handlers = {}) {
  const onComplete = handlers.onComplete ?? vi.fn();
  const onDelete = handlers.onDelete ?? vi.fn();
  const utils = render(
    <ul>
      <TaskItem task={{ ...baseTask, ...overrides }} onComplete={onComplete} onDelete={onDelete} />
    </ul>,
  );
  return { ...utils, onComplete, onDelete };
}

describe('TaskItem', () => {
  it('renders title, description and responsible', () => {
    renderItem();
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    expect(screen.getByText('Critical issue in /login')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('calls onComplete with the task id when the check button is clicked', async () => {
    const user = userEvent.setup();
    const { onComplete } = renderItem();

    await user.click(screen.getByRole('button', { name: /mark as complete/i }));

    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('calls onDelete with the task id when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderItem();

    await user.click(screen.getByRole('button', { name: /delete task/i }));

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('marks the row as done when task.completed is true', () => {
    renderItem({ completed: true });

    const checkBtn = screen.getByRole('button', { name: /completed/i });
    expect(checkBtn).toBeDisabled();

    // The "done" visual state is applied via the itemDone CSS module class
    // on the <li>. CSS modules expose the original name as part of the
    // hashed class, so a regex match is the stable contract here.
    const li = checkBtn.closest('li');
    expect(li.className).toMatch(/itemDone/);
  });

  it('does not call onComplete when the task is already completed', async () => {
    const user = userEvent.setup();
    const { onComplete } = renderItem({ completed: true });

    await user.click(screen.getByRole('button', { name: /completed/i }));

    expect(onComplete).not.toHaveBeenCalled();
  });
});

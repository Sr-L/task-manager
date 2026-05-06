import { describe, it, expect } from 'vitest';
import {
  validateTaskForm,
  hasErrors,
  sortByCreatedAt,
  filterPending,
  filterCompleted,
} from '../../../features/tasks/domain/taskDomain.js';

describe('validateTaskForm', () => {
  it('returns no errors for valid input', () => {
    expect(hasErrors(validateTaskForm({ title: 'Fix bug' }))).toBe(false);
  });

  it('returns title error when title is empty', () => {
    const errors = validateTaskForm({ title: '' });
    expect(errors.title).toBeDefined();
  });

  it('returns title error when title is whitespace only', () => {
    const errors = validateTaskForm({ title: '   ' });
    expect(errors.title).toBeDefined();
  });
});

const tasks = [
  { id: '1', title: 'A', completed: false, createdAt: '2024-01-01T10:00:00Z' },
  { id: '2', title: 'B', completed: true,  createdAt: '2024-01-03T10:00:00Z' },
  { id: '3', title: 'C', completed: false, createdAt: '2024-01-02T10:00:00Z' },
];

describe('sortByCreatedAt', () => {
  it('sorts tasks newest first', () => {
    const sorted = sortByCreatedAt(tasks);
    expect(sorted[0].id).toBe('2');
    expect(sorted[2].id).toBe('1');
  });

  it('does not mutate the original array', () => {
    const original = [...tasks];
    sortByCreatedAt(tasks);
    expect(tasks).toEqual(original);
  });
});

describe('filterPending', () => {
  it('returns only incomplete tasks', () => {
    const pending = filterPending(tasks);
    expect(pending.every((t) => !t.completed)).toBe(true);
    expect(pending).toHaveLength(2);
  });
});

describe('filterCompleted', () => {
  it('returns only completed tasks', () => {
    const done = filterCompleted(tasks);
    expect(done.every((t) => t.completed)).toBe(true);
    expect(done).toHaveLength(1);
  });
});

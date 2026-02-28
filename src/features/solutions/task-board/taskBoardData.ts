export type ColumnKey = 'todo' | 'inProgress' | 'done';

export type Task = {
  id: string;
  title: string;
  timestamp: number;
};

export const COLUMN_CONFIG: Array<{
  key: ColumnKey;
  title: string;
  placeholder: string;
}> = [
  {
    key: 'todo',
    title: 'To Do',
    placeholder: 'Add task to To Do',
  },
  {
    key: 'inProgress',
    title: 'In Progress',
    placeholder: 'Add task to In Progress',
  },
  {
    key: 'done',
    title: 'Done',
    placeholder: 'Add task to Done',
  },
];

export function createInitialColumns(): Record<ColumnKey, Task[]> {
  return {
    todo: [
      { id: 'wash-the-dishes', title: 'Wash the dishes', timestamp: Date.now() },
      { id: 'walk-the-dog', title: 'Walk the dog', timestamp: Date.now() + 1 },
      { id: 'read-a-book', title: 'Read a book', timestamp: Date.now() + 2 },
      { id: 'reply-to-emails', title: 'Reply to emails', timestamp: Date.now() + 3 },
      { id: 'plan-grocery-list', title: 'Plan grocery list', timestamp: Date.now() + 4 },
    ],
    inProgress: [
      { id: 'take-a-rest', title: 'Take a rest', timestamp: Date.now() + 5 },
      { id: 'wipe-the-glass', title: 'Wipe the glass', timestamp: Date.now() + 6 },
      { id: 'prep-dinner', title: 'Prep dinner', timestamp: Date.now() + 7 },
      { id: 'review-notes', title: 'Review notes', timestamp: Date.now() + 8 },
    ],
    done: [
      { id: 'wash-the-car', title: 'Wash the car', timestamp: Date.now() + 9 },
      {
        id: 'book-dentist-appointment',
        title: 'Book dentist appointment',
        timestamp: Date.now() + 10,
      },
      { id: 'submit-expense-report', title: 'Submit expense report', timestamp: Date.now() + 11 },
    ],
  };
}

export function createInitialDrafts(): Record<ColumnKey, string> {
  return {
    todo: '',
    inProgress: '',
    done: '',
  };
}

export function createTask(title: string): Task {
  const normalized = title.trim();

  return {
    id: `${normalized.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    title: normalized,
    timestamp: Date.now(),
  };
}

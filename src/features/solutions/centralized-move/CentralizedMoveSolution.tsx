import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  COLUMN_CONFIG,
  createInitialColumns,
  createTask,
  type ColumnKey,
  type Task,
} from '../task-board/taskBoardData';

function getNextMoveTarget(from: ColumnKey): ColumnKey {
  return from === 'todo' ? 'inProgress' : from === 'inProgress' ? 'done' : 'todo';
}

function getColumnTitle(columnKey: ColumnKey): string {
  return COLUMN_CONFIG.find((column) => column.key === columnKey)?.title ?? columnKey;
}

function getColumnAccent(columnKey: ColumnKey): string {
  if (columnKey === 'todo') {
    return 'from-sky-50 via-white to-white';
  }

  if (columnKey === 'inProgress') {
    return 'from-amber-50 via-white to-white';
  }

  return 'from-emerald-50 via-white to-white';
}

function getColumnBadge(columnKey: ColumnKey): string {
  if (columnKey === 'todo') {
    return 'bg-sky-100 text-sky-700';
  }

  if (columnKey === 'inProgress') {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-emerald-100 text-emerald-700';
}

type DropdownOption = {
  value: ColumnKey;
  label: string;
};

type ColumnDropdownProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: ColumnKey) => void;
  options: DropdownOption[];
  value: ColumnKey;
};

function ColumnDropdown({
  disabled = false,
  id,
  label,
  onChange,
  options,
  value,
}: ColumnDropdownProps) {
  const [open, setOpen] = useState(false);
  const activeLabel = options.find((option) => option.value === value)?.label ?? label;

  function handleSelect(nextValue: ColumnKey) {
    onChange(nextValue);
    setOpen(false);
  }

  function handleToggle() {
    if (disabled) {
      return;
    }

    setOpen((current) => !current);
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          className="inline-flex min-h-[50px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-5 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={handleToggle}
          disabled={disabled}
        >
          <span>{activeLabel}</span>
          <svg
            className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6.5L8 10L12 6.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.25)]">
            <div className="grid gap-1" role="listbox" aria-labelledby={id}>
              {options.map((option) => {
                const isActive = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`inline-flex min-h-[42px] items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <span
                      className={`text-xs ${isActive ? 'text-sky-500' : 'invisible'}`}
                      aria-hidden="true"
                    >
                      check
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CentralizedMoveSolution() {
  const [columns, setColumns] = useState<Record<ColumnKey, Task[]>>(createInitialColumns);
  const [activeColumn, setActiveColumn] = useState<ColumnKey>('todo');
  const [moveTo, setMoveTo] = useState<ColumnKey>('inProgress');
  const [addTo, setAddTo] = useState<ColumnKey>('todo');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const activeColumnTitle = useMemo(() => getColumnTitle(activeColumn), [activeColumn]);
  const addOptions = useMemo(
    () => COLUMN_CONFIG.map((column) => ({ value: column.key, label: column.title })),
    []
  );
  const moveOptions = useMemo(
    () =>
      COLUMN_CONFIG.filter((column) => column.key !== activeColumn).map((column) => ({
        value: column.key,
        label: column.title,
      })),
    [activeColumn]
  );
  const canAddTask = newTaskTitle.trim().length > 0;
  const canMoveTask = selectedTaskIds.length > 0 && activeColumn !== moveTo;

  function handleAddTask() {
    const value = newTaskTitle.trim();
    if (!value) {
      return;
    }

    const task = createTask(value);

    setColumns((current) => ({
      ...current,
      [addTo]: [...current[addTo], task],
    }));

    setNewTaskTitle('');
  }

  function syncMoveTarget(column: ColumnKey) {
    setMoveTo((current) => (current === column ? getNextMoveTarget(column) : current));
  }

  function handleSelectTask(column: ColumnKey, taskId: string) {
    syncMoveTarget(column);

    if (column !== activeColumn) {
      setActiveColumn(column);
      setSelectedTaskIds([taskId]);
      return;
    }

    setSelectedTaskIds((current) =>
      current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]
    );
  }

  function handleSelectAllInColumn(column: ColumnKey) {
    const columnTaskIds = columns[column].map((task) => task.id);
    const columnHasAllSelected =
      columnTaskIds.length > 0 && columnTaskIds.every((taskId) => selectedTaskIds.includes(taskId));

    setActiveColumn(column);
    syncMoveTarget(column);
    setSelectedTaskIds(columnHasAllSelected ? [] : columnTaskIds);
  }

  function handleClearSelection() {
    setSelectedTaskIds([]);
  }

  function handleMoveTask() {
    if (!canMoveTask) {
      return;
    }

    setColumns((current) => {
      const tasksToMove = current[activeColumn].filter((item) => selectedTaskIds.includes(item.id));
      if (tasksToMove.length === 0) {
        return current;
      }

      return {
        ...current,
        [activeColumn]: current[activeColumn].filter((item) => !selectedTaskIds.includes(item.id)),
        [moveTo]: [...current[moveTo], ...tasksToMove],
      };
    });

    setSelectedTaskIds([]);
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1),_transparent_34%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Centralized Workflow
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Central Control Board
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Add tasks in one place, then select cards directly on the board to move them in a
                  single action. The controls now live in a dedicated side pane so the board remains
                  the main focus.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                Back to Solutions
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-stretch">
          <aside className="xl:sticky xl:top-6 xl:self-stretch">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.18)] sm:p-5 xl:h-full">
              <section className="rounded-3xl border border-sky-100 bg-sky-50/70 p-5">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Create
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">Add a new task</h2>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <label
                        className="text-sm font-medium text-slate-700"
                        htmlFor="new-task-title"
                      >
                        Task title
                      </label>
                      <input
                        id="new-task-title"
                        className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                        value={newTaskTitle}
                        type="text"
                        onChange={(event) => setNewTaskTitle(event.target.value)}
                        placeholder="Enter a short task name"
                      />
                    </div>
                    <ColumnDropdown
                      id="add-to"
                      label="Add to"
                      onChange={setAddTo}
                      options={addOptions}
                      value={addTo}
                    />
                    <button
                      type="button"
                      className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      onClick={handleAddTask}
                      disabled={!canAddTask}
                    >
                      Add task
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Move
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950">Move selected</h2>
                    </div>
                    <div className="inline-flex min-w-[112px] items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold tabular-nums text-slate-600 shadow-sm">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      {selectedTaskIds.length} selected
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <span className="text-sm font-medium text-slate-600">From</span>
                      <div className="inline-flex min-h-[50px] min-w-[144px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
                        {activeColumnTitle}
                      </div>
                    </div>
                    <ColumnDropdown
                      id="move-to"
                      label="To"
                      onChange={setMoveTo}
                      options={moveOptions}
                      value={moveTo}
                      disabled={selectedTaskIds.length === 0}
                    />
                    <button
                      type="button"
                      className="inline-flex min-h-[50px] min-w-[156px] items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      onClick={handleMoveTask}
                      disabled={!canMoveTask}
                    >
                      Move {selectedTaskIds.length > 1 ? `${selectedTaskIds.length} tasks` : 'task'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-700">
                      Select cards on the board, then move them in one step.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                      onClick={handleClearSelection}
                      disabled={selectedTaskIds.length === 0}
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.18)] sm:p-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Board
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Task stages</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    The board stays visible while your controls remain pinned in the side pane.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
                  Active source: {activeColumnTitle}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3" aria-label="task board">
              {COLUMN_CONFIG.map((column) => {
                const isActiveColumn = activeColumn === column.key;
                const isAllSelected =
                  columns[column.key].length > 0 &&
                  columns[column.key].every((task) => selectedTaskIds.includes(task.id)) &&
                  isActiveColumn;

                return (
                  <section
                    key={column.key}
                    className={`rounded-[1.75rem] border bg-gradient-to-br p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.18)] transition sm:p-5 ${getColumnAccent(column.key)} ${
                      isActiveColumn ? 'border-slate-300 ring-2 ring-slate-200' : 'border-white/80'
                    }`}
                    aria-label={column.title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <h2 className="truncate whitespace-nowrap text-xl font-semibold text-slate-950">
                          {column.title}
                        </h2>
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${getColumnBadge(
                            column.key
                          )}`}
                        >
                          {columns[column.key].length}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`inline-flex min-w-0 shrink-0 items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          isAllSelected
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                        } disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-white disabled:text-slate-400`}
                        onClick={() => handleSelectAllInColumn(column.key)}
                        disabled={columns[column.key].length === 0}
                      >
                        {isAllSelected ? 'Unselect all' : 'Select all'}
                      </button>
                    </div>

                    <ul className="mt-4 grid gap-3">
                      {columns[column.key].map((item) => {
                        const isSelected = selectedTaskIds.includes(item.id);

                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              className={`grid min-h-[124px] w-full grid-rows-[1fr_auto] gap-2 rounded-2xl border px-4 py-4 text-left transition ${
                                isSelected
                                  ? 'border-sky-200 bg-sky-100 text-slate-900 shadow-sm'
                                  : 'border-white/70 bg-white/90 text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white'
                              }`}
                              onClick={() => handleSelectTask(column.key, item.id)}
                              aria-pressed={isSelected}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <span className="block max-h-[56px] overflow-hidden font-semibold leading-7">
                                  {item.title}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    isSelected
                                      ? 'bg-sky-500 text-white'
                                      : 'invisible bg-transparent text-transparent'
                                  }`}
                                >
                                  Selected
                                </span>
                              </div>
                              <span className="text-xs font-medium text-slate-500">
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

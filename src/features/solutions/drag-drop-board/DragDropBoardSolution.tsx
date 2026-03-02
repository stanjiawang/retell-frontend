import { useMemo, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  COLUMN_CONFIG,
  createInitialColumns,
  createTask,
  type ColumnKey,
  type Task,
} from '../task-board/taskBoardData';

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

function getColumnTitle(columnKey: ColumnKey): string {
  return COLUMN_CONFIG.find((column) => column.key === columnKey)?.title ?? columnKey;
}

type DragState = {
  from: ColumnKey;
  taskId: string;
} | null;

type DropTarget = {
  column: ColumnKey;
  index: number;
} | null;

type DropdownOption = {
  value: ColumnKey;
  label: string;
};

type ColumnDropdownProps = {
  id: string;
  label: string;
  onChange: (value: ColumnKey) => void;
  options: DropdownOption[];
  value: ColumnKey;
};

function ColumnDropdown({ id, label, onChange, options, value }: ColumnDropdownProps) {
  const [open, setOpen] = useState(false);
  const activeLabel = options.find((option) => option.value === value)?.label ?? label;

  function handleSelect(nextValue: ColumnKey) {
    onChange(nextValue);
    setOpen(false);
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
          className="inline-flex min-h-[50px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-5 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((current) => !current)}
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
                      Selected
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

export default function DragDropBoardSolution() {
  const [columns, setColumns] = useState<Record<ColumnKey, Task[]>>(createInitialColumns);
  const [addTo, setAddTo] = useState<ColumnKey>('todo');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [dragState, setDragState] = useState<DragState>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);

  const canAddTask = newTaskTitle.trim().length > 0;
  const addOptions = useMemo(
    () => COLUMN_CONFIG.map((column) => ({ value: column.key, label: column.title })),
    []
  );
  const dragSummary = useMemo(() => {
    if (!dragState) {
      return 'Drag any card to another column or between cards to reorder within the same column.';
    }

    if (!dropTarget) {
      return `Moving from ${getColumnTitle(dragState.from)}. Drop on a column or card position to place it.`;
    }

    return `Drop into ${getColumnTitle(dropTarget.column)} at the highlighted position.`;
  }, [dragState, dropTarget]);

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

  function moveTask(from: ColumnKey, to: ColumnKey, taskId: string, targetIndex: number) {
    setColumns((current) => {
      const sourceItems = current[from];
      const task = sourceItems.find((item) => item.id === taskId);
      if (!task) {
        return current;
      }

      const sourceIndex = sourceItems.findIndex((item) => item.id === taskId);
      const nextSourceItems = sourceItems.filter((item) => item.id !== taskId);
      const destinationItems = from === to ? nextSourceItems : current[to];
      const boundedIndex = Math.max(0, Math.min(targetIndex, destinationItems.length));
      const adjustedIndex =
        from === to && sourceIndex >= 0 && sourceIndex < boundedIndex
          ? boundedIndex - 1
          : boundedIndex;
      const nextDestinationItems = [...destinationItems];

      nextDestinationItems.splice(adjustedIndex, 0, task);

      if (from === to) {
        return {
          ...current,
          [from]: nextDestinationItems,
        };
      }

      return {
        ...current,
        [from]: nextSourceItems,
        [to]: nextDestinationItems,
      };
    });
  }

  function handleDragStart(from: ColumnKey, taskId: string) {
    setDragState({ from, taskId });
    setDropTarget(null);
  }

  function handleDragEnd() {
    setDragState(null);
    setDropTarget(null);
  }

  function handleColumnDragOver(event: DragEvent<HTMLElement>, column: ColumnKey) {
    event.preventDefault();
    event.dataTransfer.dropEffect = dragState ? 'move' : 'none';

    if (!dragState) {
      return;
    }

    setDropTarget({ column, index: columns[column].length });
  }

  function handleCardDragOver(event: DragEvent<HTMLElement>, column: ColumnKey, index: number) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = dragState ? 'move' : 'none';

    if (!dragState) {
      return;
    }

    setDropTarget({ column, index });
  }

  function handleDrop(event: DragEvent<HTMLElement>, to: ColumnKey, fallbackIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    if (!dragState) {
      return;
    }

    const targetIndex = dropTarget && dropTarget.column === to ? dropTarget.index : fallbackIndex;

    moveTask(dragState.from, to, dragState.taskId, targetIndex);
    setDragState(null);
    setDropTarget(null);
  }

  function handleDragLeave(column: ColumnKey) {
    if (dropTarget?.column === column) {
      setDropTarget(null);
    }
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.1),_transparent_34%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Drag And Drop
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Drag Drop Board
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Create tasks from the top control bar, then drag cards between columns directly.
                  This version removes explicit move controls and makes the board itself the primary
                  interaction surface.
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

        <section className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.18)] sm:p-5">
          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.8fr_auto] xl:items-end">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="drag-drop-new-task">
                Create task
              </label>
              <input
                id="drag-drop-new-task"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                value={newTaskTitle}
                type="text"
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Add a task, then drag cards to reorder stages"
              />
            </div>
            <ColumnDropdown
              id="drag-drop-add-to"
              label="Start in"
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

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-700">{dragSummary}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
              {dragState ? 'Dragging card' : 'Drop to move'}
            </span>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3" aria-label="drag drop task board">
          {COLUMN_CONFIG.map((column) => {
            const isDropTarget = dropTarget?.column === column.key;

            return (
              <section
                key={column.key}
                className={`rounded-[1.75rem] border bg-gradient-to-br p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.18)] transition sm:p-5 ${getColumnAccent(column.key)} ${
                  isDropTarget ? 'border-sky-300 ring-2 ring-sky-200' : 'border-white/80'
                }`}
                aria-label={column.title}
                onDragOver={(event) => handleColumnDragOver(event, column.key)}
                onDrop={(event) => handleDrop(event, column.key, columns[column.key].length)}
                onDragLeave={() => handleDragLeave(column.key)}
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
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    Drop zone
                  </span>
                </div>

                <ul className="mt-4 grid gap-3">
                  {columns[column.key].map((item, index) => {
                    const isDragging =
                      dragState?.from === column.key && dragState.taskId === item.id;
                    const isInsertionPoint =
                      dropTarget?.column === column.key &&
                      dropTarget.index === index &&
                      (!isDragging || dragState?.from !== column.key);

                    return (
                      <li key={item.id}>
                        {isInsertionPoint ? (
                          <div className="mb-3 h-2 rounded-full bg-sky-300/80" aria-hidden="true" />
                        ) : null}
                        <button
                          type="button"
                          draggable
                          onDragStart={() => handleDragStart(column.key, item.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(event) => handleCardDragOver(event, column.key, index)}
                          onDrop={(event) => handleDrop(event, column.key, index)}
                          className={`grid min-h-[124px] w-full grid-rows-[1fr_auto] gap-2 rounded-2xl border px-4 py-4 text-left transition ${
                            isDragging
                              ? 'cursor-grabbing border-sky-300 bg-sky-100 text-slate-900 opacity-60 shadow-sm'
                              : 'cursor-grab border-white/70 bg-white/90 text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white'
                          }`}
                          aria-label={`Drag ${item.title}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="block max-h-[56px] overflow-hidden font-semibold leading-7">
                              {item.title}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                              Drag
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  {dropTarget?.column === column.key &&
                  dropTarget.index === columns[column.key].length ? (
                    <li aria-hidden="true">
                      <div className="h-2 rounded-full bg-sky-300/80" />
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </section>
      </div>
    </main>
  );
}

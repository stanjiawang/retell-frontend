import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  COLUMN_CONFIG,
  createInitialColumns,
  createInitialDrafts,
  createTask,
  type ColumnKey,
  type Task,
} from './taskBoardData';

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

export default function TaskBoardSolution() {
  const [columns, setColumns] = useState<Record<ColumnKey, Task[]>>(createInitialColumns);
  const [drafts, setDrafts] = useState<Record<ColumnKey, string>>(createInitialDrafts);

  function handleDraftChange(column: ColumnKey, value: string) {
    setDrafts((current) => ({
      ...current,
      [column]: value,
    }));
  }

  function handleAddTask(column: ColumnKey) {
    const value = drafts[column].trim();
    if (!value) {
      return;
    }

    const task = createTask(value);

    setColumns((current) => ({
      ...current,
      [column]: [...current[column], task],
    }));

    setDrafts((current) => ({
      ...current,
      [column]: '',
    }));
  }

  function handleMoveTask(from: ColumnKey, to: ColumnKey, taskId: string) {
    setColumns((current) => {
      const task = current[from].find((item) => item.id === taskId);
      if (!task) {
        return current;
      }

      return {
        ...current,
        [from]: current[from].filter((item) => item.id !== taskId),
        [to]: [...current[to], task],
      };
    });
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.1),_transparent_34%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                  Inline Workflow
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Inline Move Board
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                  Each column owns its own add flow, and every task card exposes direct move
                  actions. This is the most explicit version of the interaction.
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

        <section className="grid gap-4 xl:grid-cols-3" aria-label="task board">
          {COLUMN_CONFIG.map((column) => (
            <section
              key={column.key}
              className={`rounded-[1.75rem] border border-white/80 bg-gradient-to-br p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.18)] sm:p-5 ${getColumnAccent(
                column.key
              )}`}
              aria-label={column.title}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-950">{column.title}</h2>
                  <span
                    className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${getColumnBadge(
                      column.key
                    )}`}
                  >
                    {columns[column.key].length}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor={`draft-${column.key}`}
                >
                  Add a task
                </label>
                <input
                  id={`draft-${column.key}`}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                  value={drafts[column.key]}
                  type="text"
                  onChange={(event) => handleDraftChange(column.key, event.target.value)}
                  placeholder={column.placeholder}
                />
                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  onClick={() => handleAddTask(column.key)}
                  disabled={!drafts[column.key].trim()}
                >
                  Add task
                </button>
              </div>

              <ul className="mt-4 grid gap-3">
                {columns[column.key].map((item) => (
                  <li
                    key={item.id}
                    className="grid gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm"
                  >
                    <div className="grid gap-1">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {COLUMN_CONFIG.filter((targetColumn) => targetColumn.key !== column.key).map(
                        (targetColumn) => (
                          <button
                            key={targetColumn.key}
                            type="button"
                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                            onClick={() => handleMoveTask(column.key, targetColumn.key, item.id)}
                          >
                            Move to {targetColumn.title}
                          </button>
                        )
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}

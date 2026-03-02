import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  COLUMN_CONFIG,
  createInitialColumns,
  createInitialDrafts,
  createTask,
  type ColumnKey,
  type Task,
} from '../../../shared/task-board/taskBoardData';
import { BoardColumn } from '../../../shared/task-board/BoardColumn';
import { TaskCard } from '../../../shared/task-board/TaskCard';
import { getColumnAccent, getColumnBadge } from '../../../shared/task-board/boardUi';
import { PageHero } from '../../../shared/ui/PageHero';
import {
  BACK_LINK_BUTTON,
  CARD_LIST,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PRIMARY_BUTTON,
  SECTION_LABEL,
  TEXT_INPUT,
} from '../../../shared/ui/tokens';

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
    <main className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <PageHero
          action={
            <Link to="/" className={BACK_LINK_BUTTON}>
              Back to Solutions
            </Link>
          }
          backgroundClassName="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.1),_transparent_34%)]"
          body="Each column owns its own add flow, and every task card exposes direct move actions. This is the most explicit version of the interaction."
          eyebrow="Inline Workflow"
          title="Inline Move Board"
        />

        <section className="grid gap-4 xl:grid-cols-3" aria-label="task board">
          {COLUMN_CONFIG.map((column) => (
            <BoardColumn
              key={column.key}
              accentClassName={getColumnAccent(column.key)}
              badge={
                <span className={getColumnBadge(column.key)}>{columns[column.key].length}</span>
              }
              className="border-white/80"
              aria-label={column.title}
              title={column.title}
            >
              <form
                className="mt-4 grid gap-3 rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleAddTask(column.key);
                }}
              >
                <label className={SECTION_LABEL} htmlFor={`draft-${column.key}`}>
                  Add a task
                </label>
                <input
                  id={`draft-${column.key}`}
                  className={TEXT_INPUT}
                  value={drafts[column.key]}
                  type="text"
                  onChange={(event) => handleDraftChange(column.key, event.target.value)}
                  placeholder={column.placeholder}
                />
                <button
                  type="submit"
                  className={`${PRIMARY_BUTTON} min-h-[48px] px-4`}
                  disabled={!drafts[column.key].trim()}
                >
                  Add task
                </button>
              </form>

              <ul className={CARD_LIST}>
                {columns[column.key].map((item) => (
                  <li key={item.id}>
                    <TaskCard
                      title={item.title}
                      timestamp={item.timestamp}
                      className="border-white/80 bg-white/90 p-4 shadow-sm"
                      footer={
                        <div className="grid gap-2 sm:grid-cols-2">
                          {COLUMN_CONFIG.filter(
                            (targetColumn) => targetColumn.key !== column.key
                          ).map((targetColumn) => (
                            <button
                              key={targetColumn.key}
                              type="button"
                              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                              onClick={() => handleMoveTask(column.key, targetColumn.key, item.id)}
                            >
                              Move to {targetColumn.title}
                            </button>
                          ))}
                        </div>
                      }
                    />
                  </li>
                ))}
              </ul>
            </BoardColumn>
          ))}
        </section>
      </div>
    </main>
  );
}

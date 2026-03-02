import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  COLUMN_CONFIG,
  createInitialColumns,
  createTask,
  type ColumnKey,
  type Task,
} from '../../../shared/task-board/taskBoardData';
import {
  getColumnAccent,
  getColumnBadge,
  getColumnTitle,
} from '../../../shared/task-board/boardUi';
import { ColumnDropdown } from '../../../shared/ui/ColumnDropdown';
import { PageHero } from '../../../shared/ui/PageHero';
import {
  BACK_LINK_BUTTON,
  CARD_LIST,
  COLUMN_PANEL,
  COLUMN_TITLE,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PANEL_HEADER,
  PANEL_HEADER_TITLE_WRAP,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SECTION_LABEL,
  SMALL_OUTLINE_BUTTON,
  SUCCESS_BUTTON,
  SURFACE_PANEL,
  TASK_CARD,
  TASK_CARD_DEFAULT,
  TASK_TIME,
  TASK_TITLE,
  TEXT_INPUT,
} from '../../../shared/ui/tokens';

function getNextMoveTarget(from: ColumnKey): ColumnKey {
  return from === 'todo' ? 'inProgress' : from === 'inProgress' ? 'done' : 'todo';
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
    <main className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <PageHero
          action={
            <Link to="/" className={BACK_LINK_BUTTON}>
              Back to Solutions
            </Link>
          }
          backgroundClassName="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1),_transparent_34%)]"
          body="Add tasks in one place, then select cards directly on the board to move them in a single action. The controls now live in a dedicated side pane so the board remains the main focus."
          eyebrow="Centralized Workflow"
          title="Central Control Board"
        />

        <section className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-stretch">
          <aside className="xl:sticky xl:top-6 xl:self-stretch">
            <div className={`flex flex-col gap-4 xl:h-full ${SURFACE_PANEL}`}>
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
                      <label className={SECTION_LABEL} htmlFor="new-task-title">
                        Task title
                      </label>
                      <input
                        id="new-task-title"
                        className={TEXT_INPUT}
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
                      className={PRIMARY_BUTTON}
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
                      className={`${SUCCESS_BUTTON} min-w-[156px]`}
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
                      className={SECONDARY_BUTTON}
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

          <section className={SURFACE_PANEL}>
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
                    className={`${COLUMN_PANEL} ${getColumnAccent(column.key)} ${
                      isActiveColumn ? 'border-slate-300 ring-2 ring-slate-200' : 'border-white/80'
                    }`}
                    aria-label={column.title}
                  >
                    <div className={PANEL_HEADER}>
                      <div className={PANEL_HEADER_TITLE_WRAP}>
                        <h2 className={COLUMN_TITLE}>{column.title}</h2>
                        <span className={getColumnBadge(column.key)}>
                          {columns[column.key].length}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={
                          isAllSelected
                            ? 'inline-flex min-w-0 shrink-0 items-center justify-center rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-200 disabled:text-white/70'
                            : SMALL_OUTLINE_BUTTON
                        }
                        onClick={() => handleSelectAllInColumn(column.key)}
                        disabled={columns[column.key].length === 0}
                      >
                        {isAllSelected ? 'Unselect all' : 'Select all'}
                      </button>
                    </div>

                    <ul className={CARD_LIST}>
                      {columns[column.key].map((item) => {
                        const isSelected = selectedTaskIds.includes(item.id);

                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              className={`${TASK_CARD} ${
                                isSelected
                                  ? 'border-sky-200 bg-sky-100 text-slate-900 shadow-sm'
                                  : TASK_CARD_DEFAULT
                              }`}
                              onClick={() => handleSelectTask(column.key, item.id)}
                              aria-pressed={isSelected}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <span className={TASK_TITLE}>{item.title}</span>
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
                              <span className={TASK_TIME}>
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

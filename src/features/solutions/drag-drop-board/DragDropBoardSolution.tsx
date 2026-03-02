import { useMemo, useState, type DragEvent } from 'react';
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
  INFO_STRIP,
  PAGE_CONTAINER,
  PAGE_SHELL,
  PANEL_HEADER,
  PANEL_HEADER_TITLE_WRAP,
  PRIMARY_BUTTON,
  SECTION_LABEL,
  STATUS_PILL,
  SURFACE_PANEL,
  TASK_CARD,
  TASK_CARD_DEFAULT,
  TASK_TIME,
  TASK_TITLE,
  TEXT_INPUT,
} from '../../../shared/ui/tokens';

type DragState = {
  from: ColumnKey;
  taskId: string;
} | null;

type DropTarget = {
  column: ColumnKey;
  index: number;
} | null;

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
    <main className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <PageHero
          action={
            <Link to="/" className={BACK_LINK_BUTTON}>
              Back to Solutions
            </Link>
          }
          backgroundClassName="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.1),_transparent_34%)]"
          body="Create tasks from the top control bar, then drag cards between columns directly. This version removes explicit move controls and makes the board itself the primary interaction surface."
          eyebrow="Drag And Drop"
          title="Drag Drop Board"
        />

        <section className={SURFACE_PANEL}>
          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.8fr_auto] xl:items-end">
            <div className="grid gap-2">
              <label className={SECTION_LABEL} htmlFor="drag-drop-new-task">
                Create task
              </label>
              <input
                id="drag-drop-new-task"
                className={TEXT_INPUT}
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
              className={PRIMARY_BUTTON}
              onClick={handleAddTask}
              disabled={!canAddTask}
            >
              Add task
            </button>
          </div>

          <div className={INFO_STRIP}>
            <span className="font-medium text-slate-700">{dragSummary}</span>
            <span className={STATUS_PILL}>
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
                className={`${COLUMN_PANEL} ${getColumnAccent(column.key)} ${
                  isDropTarget ? 'border-sky-300 ring-2 ring-sky-200' : 'border-white/80'
                }`}
                aria-label={column.title}
                onDragOver={(event) => handleColumnDragOver(event, column.key)}
                onDrop={(event) => handleDrop(event, column.key, columns[column.key].length)}
                onDragLeave={() => handleDragLeave(column.key)}
              >
                <div className={PANEL_HEADER}>
                  <div className={PANEL_HEADER_TITLE_WRAP}>
                    <h2 className={COLUMN_TITLE}>{column.title}</h2>
                    <span className={getColumnBadge(column.key)}>{columns[column.key].length}</span>
                  </div>
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    Drop zone
                  </span>
                </div>

                <ul className={CARD_LIST}>
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
                          className={`${TASK_CARD} ${
                            isDragging
                              ? 'cursor-grabbing border-sky-300 bg-sky-100 text-slate-900 opacity-60 shadow-sm'
                              : `cursor-grab ${TASK_CARD_DEFAULT}`
                          }`}
                          aria-label={`Drag ${item.title}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className={TASK_TITLE}>{item.title}</span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                              Drag
                            </span>
                          </div>
                          <span className={TASK_TIME}>
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

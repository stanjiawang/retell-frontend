import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

const SolutionsHome = lazy(() => import('../features/home/SolutionsHome'));
const TaskBoardSolution = lazy(() => import('../features/solutions/task-board/TaskBoardSolution'));
const CentralizedMoveSolution = lazy(
  () => import('../features/solutions/centralized-move/CentralizedMoveSolution')
);
const DragDropBoardSolution = lazy(
  () => import('../features/solutions/drag-drop-board/DragDropBoardSolution')
);

export function AppRouter() {
  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-100 px-6 py-8 text-slate-800">Loading...</div>
        }
      >
        <Routes>
          <Route path="/" element={<SolutionsHome />} />
          <Route path="/solutions/inline-move-board" element={<TaskBoardSolution />} />
          <Route path="/solutions/central-control-board" element={<CentralizedMoveSolution />} />
          <Route path="/solutions/drag-drop-board" element={<DragDropBoardSolution />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

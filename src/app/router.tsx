import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const SolutionsHome = lazy(() => import('../features/home/SolutionsHome'));
const TaskBoardSolution = lazy(() => import('../features/solutions/task-board/TaskBoardSolution'));
const CentralizedMoveSolution = lazy(
  () => import('../features/solutions/centralized-move/CentralizedMoveSolution')
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-100 px-6 py-8 text-slate-800">Loading...</div>
        }
      >
        <Routes>
          <Route path="/" element={<SolutionsHome />} />
          <Route path="/solutions/inline-move-board" element={<TaskBoardSolution />} />
          <Route path="/solutions/central-control-board" element={<CentralizedMoveSolution />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

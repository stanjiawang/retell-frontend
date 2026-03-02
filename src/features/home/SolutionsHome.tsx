import { Link } from 'react-router-dom';
import { PageHero } from '../../shared/ui/PageHero';
import { PAGE_SHELL, PAGE_CONTAINER, PRIMARY_BUTTON } from '../../shared/ui/tokens';

type SolutionDefinition = {
  id: string;
  title: string;
  summary: string;
  status: string;
  to: string;
};

const SOLUTIONS: SolutionDefinition[] = [
  {
    id: 'solution-1',
    title: 'Inline Move Board',
    summary: 'Three-column task board with direct move actions on each task card.',
    status: 'Available',
    to: '/solutions/inline-move-board',
  },
  {
    id: 'solution-2',
    title: 'Central Control Board',
    summary: 'Three-column task board with centralized add and move controls above the board.',
    status: 'Available',
    to: '/solutions/central-control-board',
  },
  {
    id: 'solution-3',
    title: 'Drag Drop Board',
    summary: 'Top-aligned create bar with direct drag-and-drop between columns.',
    status: 'Available',
    to: '/solutions/drag-drop-board',
  },
];

export default function SolutionsHome() {
  return (
    <main className={PAGE_SHELL}>
      <div className={PAGE_CONTAINER}>
        <PageHero
          backgroundClassName="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_34%)]"
          body="Explore interaction patterns for the same task-board problem. Each entry demonstrates a different control model you can evolve into more advanced solutions later."
          contentClassName="py-8 sm:px-8"
          eyebrow="Pattern Library"
          eyebrowClassName="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          title="Solution Gallery"
          titleClassName="mt-4 text-4xl font-semibold tracking-tight text-slate-950"
          bodyClassName="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base"
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="solutions list">
          {SOLUTIONS.map((solution) => (
            <article
              key={solution.id}
              className="group grid min-h-72 content-start gap-5 rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.28)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_-30px_rgba(15,23,42,0.32)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {solution.id.replace('solution-', 'Pattern ')}
                </span>
                <span className="inline-flex min-w-[84px] justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {solution.status}
                </span>
              </div>

              <div className="grid gap-3">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {solution.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600">{solution.summary}</p>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Open live demo
                </span>
                <Link
                  to={solution.to}
                  className={`${PRIMARY_BUTTON} min-h-0 rounded-xl px-4 py-2.5 group-hover:bg-sky-400`}
                >
                  Open
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default function PostLaunchTrafficOverview({ pagePerformance = [] }) {
  const totalVisits = pagePerformance.reduce((sum, row) => sum + (row.visits ?? 0), 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Traffic Overview</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Site Traffic (Placeholder)</h3>
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-metallic">
        Analytics platform not connected yet. Connect Google Analytics, Plausible, or Vercel Analytics to populate visit
        trends. Current tracked visits: <strong className="text-charcoal">{totalVisits || '—'}</strong>.
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {pagePerformance.slice(0, 4).map((row) => (
          <li key={row.path} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
            <span className="font-medium text-charcoal">{row.page}</span>
            <span className="ml-2 text-metallic">Visits: {row.visits ?? '—'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

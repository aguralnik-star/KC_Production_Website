export default function PostLaunchPagePerformance({ rows = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Page Performance</p>
          <h3 className="mt-1 text-lg font-bold text-charcoal">Page Engagement Review</h3>
        </div>
        <p className="text-xs text-metallic">Placeholder until analytics platform is connected</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-metallic">
              <th className="px-3 py-2 font-semibold">Page</th>
              <th className="px-3 py-2 font-semibold">Visits</th>
              <th className="px-3 py-2 font-semibold">CTA Clicks</th>
              <th className="px-3 py-2 font-semibold">RFQ Starts</th>
              <th className="px-3 py-2 font-semibold">RFQ Submissions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.path} className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-charcoal">{row.page}</td>
                <td className="px-3 py-3 text-metallic">{row.visits ?? '—'}</td>
                <td className="px-3 py-3 text-metallic">{row.ctaClicks ?? '—'}</td>
                <td className="px-3 py-3 text-metallic">{row.rfqStarts ?? '—'}</td>
                <td className="px-3 py-3 text-metallic">{row.rfqSubmissions ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const PRIORITY_STYLES = {
  critical: 'border-red-200 bg-red-50 text-red-800',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

export default function PostLaunchRecommendationCenter({ recommendations = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Recommendations</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Optimization Recommendations</h3>
      </div>

      <ul className="space-y-3">
        {recommendations.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.medium}`}>
                {item.priority}
              </span>
              <p className="text-sm font-semibold text-charcoal">{item.title}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-metallic">{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

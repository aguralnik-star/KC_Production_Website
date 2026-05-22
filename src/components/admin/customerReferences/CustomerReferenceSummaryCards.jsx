const CARDS = [
  { key: 'totalReferences', label: 'Total References' },
  { key: 'approvedReferences', label: 'Approved References' },
  { key: 'pendingPermissions', label: 'Pending Permissions' },
  { key: 'declinedPermissions', label: 'Declined Permissions' },
  { key: 'activePublishedContent', label: 'Active Published Content' },
  { key: 'doNotContact', label: 'Do Not Contact' },
];

export default function CustomerReferenceSummaryCards({ stats }) {
  return (
    <section aria-labelledby="reference-summary-heading">
      <h2 id="reference-summary-heading" className="sr-only">Customer reference summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(({ key, label }) => (
          <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{stats?.[key] ?? 0}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

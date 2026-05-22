function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function CustomerReferenceActivityFeed({ activity }) {
  if (!activity?.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">Activity Feed</h3>
        <p className="mt-2 text-sm text-metallic">No activity recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="activity-feed-heading">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 id="activity-feed-heading" className="text-lg font-bold text-charcoal">Activity Feed</h3>
        <p className="mt-1 text-sm text-metallic">Chronological audit trail for this customer reference.</p>
      </div>
      <ol className="divide-y divide-slate-100">
        {activity.map((item) => (
          <li key={item.id} className="px-6 py-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-charcoal">{item.activity_summary}</p>
              <time className="text-xs text-metallic" dateTime={item.created_at}>{formatDateTime(item.created_at)}</time>
            </div>
            <p className="mt-1 text-xs capitalize text-metallic">{item.activity_type.replace(/_/g, ' ')}</p>
            {item.notes ? <p className="mt-2 text-sm text-charcoal">{item.notes}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

const EVENT_LABELS = {
  rfq_received: 'RFQ received',
  rfq_reviewed: 'RFQ reviewed',
  quote_draft_generated: 'Quote draft generated',
  quote_sent: 'Quote sent',
  follow_up_scheduled: 'Follow-up scheduled',
  follow_up_completed: 'Follow-up completed',
  additional_info_requested: 'Additional info requested',
  additional_info_received: 'Additional info received',
  rfq_won: 'RFQ won',
  rfq_lost: 'RFQ lost',
  issue_created: 'Issue created',
  issue_resolved: 'Issue resolved',
  rfq_status_changed: 'RFQ status changed',
  follow_up_created: 'Follow-up created',
  additional_info_request: 'Additional info request',
};

function formatEventType(type) {
  if (EVENT_LABELS[type]) return EVENT_LABELS[type];
  return type?.replace(/_/g, ' ') ?? 'Activity';
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function GoLiveActivityFeed({ activity = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Go-live activity feed">
      <h3 className="text-lg font-bold text-charcoal">Activity Feed</h3>
      {!activity.length ? (
        <p className="mt-3 text-sm text-metallic">No activity recorded yet.</p>
      ) : (
        <ul className="mt-4 max-h-[480px] space-y-3 overflow-y-auto">
          {activity.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-charcoal">{formatEventType(item.type)}</p>
                <time className="text-xs text-metallic">{formatDate(item.at)}</time>
              </div>
              <p className="mt-1 text-sm text-metallic">{item.summary}</p>
              {item.referenceNumber ? (
                <p className="mt-1 text-xs font-medium text-accent">Ref: {item.referenceNumber}</p>
              ) : null}
              {item.company ? <p className="text-xs text-metallic">{item.company}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { CUSTOMER_STATUS_LABELS } from '../../services/customerStatusEmailService';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  ready: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  sent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
      {status}
    </span>
  );
}

export default function CustomerStatusEmailHistory({
  drafts,
  events,
  onLoadDraft,
  onArchiveDraft,
  archivingId,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-charcoal">Draft History</h3>
        </div>
        {!drafts.length ? (
          <p className="px-4 py-6 text-sm text-metallic">No status email drafts yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {drafts.map((draft) => (
              <li key={draft.id} className="px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-charcoal">
                        {CUSTOMER_STATUS_LABELS[draft.public_status] || draft.public_status}
                      </p>
                      <StatusBadge status={draft.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-metallic">{draft.subject}</p>
                    <dl className="mt-2 grid gap-1 text-xs text-metallic sm:grid-cols-2">
                      <div><span className="font-medium">Created:</span> {formatDate(draft.created_at)}</div>
                      <div><span className="font-medium">Sent:</span> {formatDate(draft.sent_at)}</div>
                    </dl>
                    {draft.status === 'failed' && draft.send_error && (
                      <p className="mt-2 text-xs text-red-700">{draft.send_error}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadDraft?.(draft)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                    >
                      Load Draft
                    </button>
                    {draft.status !== 'archived' && draft.status !== 'sent' && (
                      <button
                        type="button"
                        onClick={() => onArchiveDraft?.(draft.id)}
                        disabled={archivingId === draft.id}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-metallic hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-charcoal">Email Event History</h3>
        </div>
        {!events.length ? (
          <p className="px-4 py-6 text-sm text-metallic">No status update emails sent yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {events.map((event) => (
              <li key={event.id} className="px-4 py-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={event.status === 'sent' ? 'sent' : 'failed'} />
                  <span className="font-medium text-charcoal">{event.sent_to_email}</span>
                </div>
                <p className="mt-1 text-metallic">{event.subject}</p>
                <p className="mt-1 text-xs text-metallic">
                  {CUSTOMER_STATUS_LABELS[event.public_status]} · {formatDate(event.created_at)}
                </p>
                {event.error_message && (
                  <p className="mt-2 text-xs text-red-700">{event.error_message}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import RFQStatusBadge from './RFQStatusBadge';

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

function draftTypeLabel(type) {
  return type?.replace(/_/g, ' ') ?? 'draft';
}

export default function QuoteDraftHistory({ drafts, onLoadDraft, onArchiveDraft, loadingId }) {
  if (!drafts.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-metallic">
        No saved quote drafts yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-charcoal">Draft History</h3>
      </div>
      <ul className="divide-y divide-slate-100">
        {drafts.map((draft) => (
          <li key={draft.id} className="px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium capitalize text-charcoal">{draftTypeLabel(draft.draft_type)}</p>
                  <RFQStatusBadge status={draft.status} />
                </div>
                <p className="mt-1 truncate text-sm text-metallic">{draft.subject}</p>
                <dl className="mt-2 grid gap-1 text-xs text-metallic sm:grid-cols-3">
                  <div><span className="font-medium">Created:</span> {formatDate(draft.created_at)}</div>
                  <div><span className="font-medium">Copied:</span> {formatDate(draft.copied_at)}</div>
                  <div><span className="font-medium">Sent:</span> {formatDate(draft.manual_sent_at)}</div>
                </dl>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onLoadDraft?.(draft)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
                >
                  View / Load
                </button>
                {draft.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => onArchiveDraft?.(draft.id)}
                    disabled={loadingId === draft.id}
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
    </div>
  );
}

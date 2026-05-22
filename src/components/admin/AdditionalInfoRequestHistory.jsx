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

function statusClass(status) {
  switch (status) {
    case 'sent':
    case 'viewed':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    case 'submitted':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'failed':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'canceled':
    case 'expired':
      return 'border-slate-200 bg-slate-100 text-slate-700';
    default:
      return 'border-amber-200 bg-amber-50 text-amber-800';
  }
}

export default function AdditionalInfoRequestHistory({ requests = [] }) {
  if (!requests.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-metallic">
        No additional information requests yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-charcoal">{request.subject}</p>
              <p className="mt-1 text-xs text-metallic">
                Created {formatDate(request.created_at)}
                {request.sent_at ? ` · Sent ${formatDate(request.sent_at)}` : ''}
                {request.completed_at ? ` · Submitted ${formatDate(request.completed_at)}` : ''}
              </p>
            </div>
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass(request.status)}`}>
              {request.status.replaceAll('_', ' ')}
            </span>
          </div>
          {request.requested_items && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-charcoal">{request.requested_items}</p>
          )}
          {request.send_error && (
            <p className="mt-2 text-xs text-red-700">{request.send_error}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

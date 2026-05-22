import { Mail, Send, FileText, Clock, AlertTriangle } from 'lucide-react';

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

export default function RFQQuoteSummary({ request }) {
  if (!request) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-charcoal">Quote Summary</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Drafts Created</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-charcoal">
            <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
            {request.quote_email_draft_count ?? 0}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Last Draft</dt>
          <dd className="mt-1 text-sm text-charcoal">{formatDate(request.last_quote_draft_at)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Manually Sent</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-charcoal">
            <Send className="h-4 w-4 text-accent" aria-hidden="true" />
            {formatDate(request.quote_manually_sent_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Send Method</dt>
          <dd className="mt-1 text-sm text-charcoal">{request.quote_send_method?.replace('_', ' ') || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Next Follow-Up</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-charcoal">
            <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
            {formatDate(request.next_follow_up_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Customer Email</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-charcoal">
            <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
            {request.email}
          </dd>
        </div>
      </dl>
      {request.quote_send_notes && (
        <p className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-metallic">
          {request.quote_send_notes}
        </p>
      )}
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Quotes are copied and sent manually outside this system. The website does not email customers automatically.
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AlertTriangle, Loader2, Mail, RefreshCw, Send, FileText, Clock } from 'lucide-react';

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

function confirmationStatusLabel(status) {
  if (status === 'sent') return 'Sent';
  if (status === 'failed') return 'Failed';
  return 'Not Sent';
}

function ConfirmationStatusBadge({ status }) {
  const styles = {
    sent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    not_sent: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? styles.not_sent}`}>
      {confirmationStatusLabel(status)}
    </span>
  );
}

export default function RFQQuoteSummary({ request, onResendConfirmation, resending = false }) {
  const [resendError, setResendError] = useState('');

  if (!request) return null;

  const confirmationStatus = request.customer_confirmation_email_status ?? 'not_sent';
  const confirmationFailed = confirmationStatus === 'failed';

  const handleResend = async () => {
    if (!onResendConfirmation) return;
    setResendError('');
    try {
      await onResendConfirmation();
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Unable to resend confirmation email.');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-charcoal">Quote Summary</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Reference Number</dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-charcoal">
            {request.reference_number || '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Confirmation Email</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2">
            <ConfirmationStatusBadge status={confirmationStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Confirmation Sent</dt>
          <dd className="mt-1 text-sm text-charcoal">
            {formatDate(request.customer_confirmation_email_sent_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Customer Email</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-charcoal">
            <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
            {request.email}
          </dd>
        </div>
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
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Next Follow-Up</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-charcoal">
            <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
            {formatDate(request.next_follow_up_at)}
          </dd>
        </div>
      </dl>

      {confirmationFailed && request.customer_confirmation_email_error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{request.customer_confirmation_email_error}</span>
        </div>
      )}

      {onResendConfirmation && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {resending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Resend Confirmation Email
          </button>
          {resendError && (
            <p className="mt-2 text-xs text-red-700">{resendError}</p>
          )}
        </div>
      )}

      {request.quote_send_notes && (
        <p className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-metallic">
          {request.quote_send_notes}
        </p>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
        <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        RFQ submission confirmations are emailed automatically. Quote responses are still copied and sent manually outside this system.
      </div>
    </div>
  );
}

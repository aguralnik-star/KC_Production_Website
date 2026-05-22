import { useState } from 'react';
import { AlertTriangle, Loader2, Mail } from 'lucide-react';

export default function CustomerStatusEmailSendButton({
  customerEmail,
  draft,
  onSend,
  sending,
  sendResult,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const canSend = Boolean(
    draft?.id
    && draft?.subject?.trim()
    && draft?.body?.trim()
    && customerEmail
    && ['draft', 'ready', 'failed'].includes(draft.status),
  );

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    await onSend?.();
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-sm text-amber-900">
          This email will be sent to the customer only after you click Send.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={!canSend || sending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send Email
            </>
          )}
        </button>
        {!customerEmail && (
          <p className="text-xs text-red-700">Customer email is missing. Send is disabled.</p>
        )}
      </div>

      {sendResult?.success && (
        <p className="mt-3 text-sm text-emerald-700">Customer status update email sent successfully.</p>
      )}
      {sendResult?.error && (
        <p className="mt-3 text-sm text-red-700">{sendResult.error}</p>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
            <h4 className="text-lg font-semibold text-charcoal">Send Customer Email</h4>
            <p className="mt-3 text-sm text-metallic">
              This will send an email to {customerEmail}. Continue?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-charcoal hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

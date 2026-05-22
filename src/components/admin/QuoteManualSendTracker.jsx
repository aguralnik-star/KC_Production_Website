import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { SEND_METHODS } from '../../services/quoteDraftService';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

function toLocalInputValue(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function QuoteManualSendTracker({
  request,
  draft,
  onSaveSendEvent,
  saving,
  successMessage,
}) {
  const [form, setForm] = useState({
    sent_to_email: request?.email ?? '',
    send_method: 'manual_email',
    sent_at: toLocalInputValue(),
    notes: '',
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      sent_to_email: request?.email ?? '',
    }));
  }, [request?.email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSendEvent?.({
      sent_to_email: form.sent_to_email,
      send_method: form.send_method,
      sent_at: new Date(form.sent_at).toISOString(),
      notes: form.notes,
      sent_subject: draft?.subject ?? null,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Send className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-charcoal">Manual Send Tracker</h3>
      </div>
      <p className="mt-2 text-xs text-metallic">
        Record when you send the quote outside the system. No email is sent from this website.
      </p>

      {successMessage && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="sent-to-email" className="block text-xs font-medium text-metallic">Sent To Email</label>
          <input
            id="sent-to-email"
            type="email"
            required
            value={form.sent_to_email}
            onChange={(e) => setForm((prev) => ({ ...prev, sent_to_email: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="send-method" className="block text-xs font-medium text-metallic">Send Method</label>
            <select
              id="send-method"
              value={form.send_method}
              onChange={(e) => setForm((prev) => ({ ...prev, send_method: e.target.value }))}
              className={`${inputClass} bg-white`}
            >
              {SEND_METHODS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sent-at" className="block text-xs font-medium text-metallic">Sent Date/Time</label>
            <input
              id="sent-at"
              type="datetime-local"
              required
              value={form.sent_at}
              onChange={(e) => setForm((prev) => ({ ...prev, sent_at: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="send-notes" className="block text-xs font-medium text-metallic">Send Notes</label>
          <textarea
            id="send-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className={inputClass}
            placeholder="Optional internal notes about how the quote was sent..."
          />
        </div>
        <button
          type="submit"
          disabled={saving || !draft?.id}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Manual Send Event'}
        </button>
        {!draft?.id && (
          <p className="text-xs text-metallic">Save a draft first, then record the manual send.</p>
        )}
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  CUSTOMER_STATUS_LABELS,
  DEFAULT_CUSTOMER_STATUS_MESSAGES,
  PUBLIC_STATUSES,
  getDefaultCustomerStatusMessage,
  getSuggestedPublicStatus,
  mapInternalStatusToPublicStatus,
  updatePublicCustomerStatus,
} from '../../services/rfqWorkflowService';
import RFQPublicStatusBadge from '../RFQPublicStatusBadge';

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

export default function RFQPublicStatusEditor({ request, onRequestUpdated }) {
  const [publicStatus, setPublicStatus] = useState('received');
  const [customerMessage, setCustomerMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!request) return;
    setPublicStatus(request.public_status || getSuggestedPublicStatus(request));
    setCustomerMessage(
      request.customer_status_message
      || getDefaultCustomerStatusMessage(getSuggestedPublicStatus(request)),
    );
    setError('');
    setSuccessMessage('');
  }, [request]);

  const suggestedStatus = mapInternalStatusToPublicStatus(request?.status);

  const handleSave = async () => {
    if (!request?.id) return;
    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const updated = await updatePublicCustomerStatus(request.id, {
        public_status: publicStatus,
        customer_status_message: customerMessage,
      });
      onRequestUpdated?.(updated);
      setSuccessMessage('Customer-facing status updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update customer-facing status.');
    } finally {
      setSaving(false);
    }
  };

  const handleUseSuggested = () => {
    setPublicStatus(suggestedStatus);
    if (!customerMessage.trim()) {
      setCustomerMessage(getDefaultCustomerStatusMessage(suggestedStatus));
    }
  };

  if (!request) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-charcoal">Customer-Facing Status</h3>
          <p className="mt-1 text-xs text-metallic">
            Controls what customers see on the public status lookup page.
          </p>
        </div>
        <RFQPublicStatusBadge
          status={publicStatus}
          label={CUSTOMER_STATUS_LABELS[publicStatus]}
        />
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Last Viewed By Customer</dt>
          <dd className="mt-1 text-sm text-charcoal">{formatDate(request.last_customer_status_viewed_at)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-metallic">Suggested From Internal Status</dt>
          <dd className="mt-1 text-sm text-charcoal">{CUSTOMER_STATUS_LABELS[suggestedStatus]}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="public-status" className="block text-sm font-medium text-charcoal">
            Public Status
          </label>
          <select
            id="public-status"
            value={publicStatus}
            onChange={(e) => setPublicStatus(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {PUBLIC_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CUSTOMER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customer-status-message" className="block text-sm font-medium text-charcoal">
            Customer Status Message
          </label>
          <textarea
            id="customer-status-message"
            rows={4}
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="mt-1 text-xs text-metallic">
            Plain text only. Default: {DEFAULT_CUSTOMER_STATUS_MESSAGES[publicStatus]}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700">{error}</p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-emerald-700">{successMessage}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save Public Status
        </button>
        <button
          type="button"
          onClick={handleUseSuggested}
          disabled={saving}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:bg-slate-50 disabled:opacity-50"
        >
          Use Suggested Status
        </button>
      </div>
    </section>
  );
}

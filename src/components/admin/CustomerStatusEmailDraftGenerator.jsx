import { Sparkles } from 'lucide-react';
import { PUBLIC_STATUSES, CUSTOMER_STATUS_LABELS, STATUS_EMAIL_MESSAGES } from '../../services/customerStatusEmailService';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function CustomerStatusEmailDraftGenerator({
  publicStatus,
  customerMessage,
  onPublicStatusChange,
  onCustomerMessageChange,
  onGenerate,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-charcoal">Generate Status Email Draft</h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status-email-public-status" className="block text-xs font-medium text-metallic">
            Public Status
          </label>
          <select
            id="status-email-public-status"
            value={publicStatus}
            onChange={(e) => onPublicStatusChange(e.target.value)}
            className={`${inputClass} bg-white`}
          >
            {PUBLIC_STATUSES.map((status) => (
              <option key={status} value={status}>{CUSTOMER_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="status-email-message" className="block text-xs font-medium text-metallic">
          Customer Status Message
        </label>
        <textarea
          id="status-email-message"
          rows={4}
          value={customerMessage}
          onChange={(e) => onCustomerMessageChange(e.target.value)}
          className={inputClass}
          placeholder={STATUS_EMAIL_MESSAGES[publicStatus]}
        />
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
      >
        Generate Email Draft
      </button>
    </div>
  );
}

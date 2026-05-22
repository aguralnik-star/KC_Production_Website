import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { DRAFT_TYPES, DEFAULT_DRAFT_OPTIONS, generateQuoteDraft } from '../../services/quoteDraftService';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function QuoteEmailDraftGenerator({ request, files, onGenerate }) {
  const [options, setOptions] = useState({ ...DEFAULT_DRAFT_OPTIONS });

  const handleChange = (field, value) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    const draft = generateQuoteDraft(request, options, files);
    onGenerate?.({ ...draft, generatorOptions: options });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-charcoal">Generate Quote Email Draft</h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="draft-type" className="block text-xs font-medium text-metallic">Draft Type</label>
          <select
            id="draft-type"
            value={options.draft_type}
            onChange={(e) => handleChange('draft_type', e.target.value)}
            className={`${inputClass} bg-white`}
          >
            {DRAFT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quoted-amount" className="block text-xs font-medium text-metallic">Quoted Amount</label>
          <input
            id="quoted-amount"
            type="text"
            value={options.quoted_amount}
            onChange={(e) => handleChange('quoted_amount', e.target.value)}
            className={inputClass}
            placeholder="2500.00"
          />
        </div>
        <div>
          <label htmlFor="lead-time" className="block text-xs font-medium text-metallic">Estimated Lead Time</label>
          <input
            id="lead-time"
            type="text"
            value={options.estimated_lead_time}
            onChange={(e) => handleChange('estimated_lead_time', e.target.value)}
            className={inputClass}
            placeholder="2-3 weeks"
          />
        </div>
        <div>
          <label htmlFor="validity-days" className="block text-xs font-medium text-metallic">Quote Validity (days)</label>
          <input
            id="validity-days"
            type="number"
            min="1"
            value={options.validity_days}
            onChange={(e) => handleChange('validity_days', Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="payment-terms" className="block text-xs font-medium text-metallic">Payment Terms</label>
          <input
            id="payment-terms"
            type="text"
            value={options.payment_terms}
            onChange={(e) => handleChange('payment_terms', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="delivery-terms" className="block text-xs font-medium text-metallic">Delivery Terms</label>
          <input
            id="delivery-terms"
            type="text"
            value={options.delivery_terms}
            onChange={(e) => handleChange('delivery_terms', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="customer-notes" className="block text-xs font-medium text-metallic">Notes to Customer</label>
        <textarea
          id="customer-notes"
          rows={3}
          value={options.notes_to_customer}
          onChange={(e) => handleChange('notes_to_customer', e.target.value)}
          className={inputClass}
          placeholder="Optional message to include in the email body..."
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.include_file_reference}
            onChange={(e) => handleChange('include_file_reference', e.target.checked)}
            className="rounded border-slate-300 text-accent focus:ring-accent"
          />
          Include file reference
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.include_next_steps}
            onChange={(e) => handleChange('include_next_steps', e.target.checked)}
            className="rounded border-slate-300 text-accent focus:ring-accent"
          />
          Include next steps
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
      >
        Generate Draft
      </button>
    </div>
  );
}

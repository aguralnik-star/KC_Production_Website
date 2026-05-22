import { APPROVAL_METHODS, ALLOWED_USAGE_OPTIONS, DISPLAY_MODES } from '../../../data/testimonialWorkflowData';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function TestimonialEditor({ testimonial, onChange }) {
  if (!testimonial) {
    return <p className="text-sm text-metallic">Select or create a testimonial to edit.</p>;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Field label="Quote">
        <textarea value={testimonial.quote ?? ''} onChange={(e) => onChange({ quote: e.target.value })} rows={4} className={inputClass} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Customer Name (internal)">
          <input type="text" value={testimonial.customer_name ?? ''} onChange={(e) => onChange({ customer_name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Customer Company (internal)">
          <input type="text" value={testimonial.customer_company ?? ''} onChange={(e) => onChange({ customer_company: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Customer Role (internal)">
          <input type="text" value={testimonial.customer_role ?? ''} onChange={(e) => onChange({ customer_role: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Display Mode">
          <select value={testimonial.display_mode ?? 'anonymous'} onChange={(e) => onChange({ display_mode: e.target.value })} className={inputClass}>
            {DISPLAY_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Approved Display Name">
          <input type="text" value={testimonial.approved_display_name ?? ''} onChange={(e) => onChange({ approved_display_name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Approved Company Display">
          <input type="text" value={testimonial.approved_company_display ?? ''} onChange={(e) => onChange({ approved_company_display: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Approved Role Display">
          <input type="text" value={testimonial.approved_role_display ?? ''} onChange={(e) => onChange({ approved_role_display: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Industry">
          <input type="text" value={testimonial.industry ?? ''} onChange={(e) => onChange({ industry: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Related Service">
          <input type="text" value={testimonial.related_service ?? ''} onChange={(e) => onChange({ related_service: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Status">
          <select value={testimonial.status ?? 'draft'} onChange={(e) => onChange({ status: e.target.value })} className={inputClass}>
            {['draft', 'pending_approval', 'approved', 'published', 'needs_revision', 'rejected', 'archived'].map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Allowed Usage">
        <div className="mt-1 flex flex-wrap gap-2">
          {ALLOWED_USAGE_OPTIONS.map((usage) => (
            <label key={usage} className="flex items-center gap-1 text-xs text-charcoal">
              <input
                type="checkbox"
                checked={(testimonial.allowed_usage ?? []).includes(usage)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...(testimonial.allowed_usage ?? []), usage]
                    : (testimonial.allowed_usage ?? []).filter((u) => u !== usage);
                  onChange({ allowed_usage: next });
                }}
              />
              {usage.replace(/_/g, ' ')}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={Boolean(testimonial.approval_received)} onChange={(e) => onChange({ approval_received: e.target.checked })} />
          Approval received
        </label>
        <Field label="Approval Date">
          <input type="date" value={testimonial.approval_date ?? ''} onChange={(e) => onChange({ approval_date: e.target.value || null })} className={inputClass} />
        </Field>
        <Field label="Approval Method">
          <select value={testimonial.approval_method ?? ''} onChange={(e) => onChange({ approval_method: e.target.value || null })} className={inputClass}>
            <option value="">Select method</option>
            {APPROVAL_METHODS.map((method) => (
              <option key={method} value={method}>{method.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={Boolean(testimonial.confidentiality_review_complete)} onChange={(e) => onChange({ confidentiality_review_complete: e.target.checked })} />
          Confidentiality review complete
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input type="checkbox" checked={Boolean(testimonial.approved_for_public_use)} onChange={(e) => onChange({ approved_for_public_use: e.target.checked })} />
          Approved for public use
        </label>
      </div>

      <Field label="Internal Notes">
        <textarea value={testimonial.internal_notes ?? ''} onChange={(e) => onChange({ internal_notes: e.target.value })} rows={3} className={inputClass} />
      </Field>
    </section>
  );
}

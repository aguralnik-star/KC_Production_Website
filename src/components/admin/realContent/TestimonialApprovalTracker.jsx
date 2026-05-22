import { ALLOWED_USAGE_OPTIONS, TESTIMONIAL_SAFETY_CHECKLIST } from '../../../data/realContentReplacementData';
import AccessibleButton from '../../AccessibleButton';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import ContentRiskChecklist from './ContentRiskChecklist';

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

export default function TestimonialApprovalTracker({
  testimonials,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <section className="space-y-6" aria-label="Customer testimonial approval tracker">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Customer Testimonials</h3>
          <p className="mt-1 text-sm text-metallic">
            Do not publish real customer names, quotes, or logos without explicit written approval.
          </p>
        </div>
        <AccessibleButton type="button" onClick={onAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Add Testimonial
        </AccessibleButton>
      </div>

      {!testimonials.length ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-metallic">
          No real testimonials tracked yet. Representative testimonials remain visible on the public site.
        </p>
      ) : null}

      {testimonials.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <ApprovalStatusBadge status={item.status} />
            <ApprovalStatusBadge status={item.riskLevel} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Customer Name">
              <input type="text" value={item.customerName} onChange={(e) => onUpdate(item.id, { customerName: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Customer Company">
              <input type="text" value={item.customerCompany} onChange={(e) => onUpdate(item.id, { customerCompany: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Customer Role">
              <input type="text" value={item.customerRole} onChange={(e) => onUpdate(item.id, { customerRole: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Approval Date">
              <input type="date" value={item.approvalDate} onChange={(e) => onUpdate(item.id, { approvalDate: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Approved Display Name">
              <input type="text" value={item.approvedDisplayName} onChange={(e) => onUpdate(item.id, { approvedDisplayName: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Approved Company Display">
              <input type="text" value={item.approvedCompanyDisplay} onChange={(e) => onUpdate(item.id, { approvedCompanyDisplay: e.target.value })} className={inputClass} />
            </Field>
          </div>

          <Field label="Testimonial Quote">
            <textarea value={item.testimonialQuote} onChange={(e) => onUpdate(item.id, { testimonialQuote: e.target.value })} rows={3} className={inputClass} />
          </Field>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Status">
              <select value={item.status} onChange={(e) => onUpdate(item.id, { status: e.target.value })} className={inputClass}>
                {['draft', 'pending_customer_approval', 'approved', 'needs_revision', 'rejected', 'published', 'archived'].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
            <Field label="Allowed Usage">
              <div className="mt-1 flex flex-wrap gap-2">
                {ALLOWED_USAGE_OPTIONS.map((usage) => (
                  <label key={usage} className="flex items-center gap-1 text-xs text-charcoal">
                    <input
                      type="checkbox"
                      checked={(item.allowedUsage ?? []).includes(usage)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...(item.allowedUsage ?? []), usage]
                          : (item.allowedUsage ?? []).filter((u) => u !== usage);
                        onUpdate(item.id, { allowedUsage: next });
                      }}
                    />
                    {usage}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={item.permissionReceived} onChange={(e) => onUpdate(item.id, { permissionReceived: e.target.checked, isCustomerApproved: e.target.checked })} />
              Permission received
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={item.confidentialityReviewed} onChange={(e) => onUpdate(item.id, { confidentialityReviewed: e.target.checked })} />
              Confidentiality reviewed
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={item.publishReady} onChange={(e) => onUpdate(item.id, { publishReady: e.target.checked })} />
              Publish ready
            </label>
          </div>

          <Field label="Notes">
            <textarea value={item.notes} onChange={(e) => onUpdate(item.id, { notes: e.target.value })} rows={2} className={inputClass} />
          </Field>

          <div className="mt-4">
            <ContentRiskChecklist
              title="Testimonial Safety Checklist"
              items={TESTIMONIAL_SAFETY_CHECKLIST}
              checklist={item.safetyChecklist}
              riskLevel={item.riskLevel}
              onToggle={(checkId, value) =>
                onUpdate(item.id, {
                  safetyChecklist: { ...item.safetyChecklist, [checkId]: value },
                })
              }
            />
          </div>

          <AccessibleButton type="button" onClick={() => onRemove(item.id)} className="mt-4 text-sm text-red-600">
            Remove
          </AccessibleButton>
        </article>
      ))}
    </section>
  );
}

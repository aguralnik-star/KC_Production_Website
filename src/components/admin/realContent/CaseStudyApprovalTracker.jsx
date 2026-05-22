import { CASE_STUDY_SAFETY_CHECKLIST } from '../../../data/realContentReplacementData';
import AccessibleButton from '../../AccessibleButton';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import ContentRiskChecklist from './ContentRiskChecklist';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-metallic">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function CaseStudyApprovalTracker({ caseStudies, onAdd, onUpdate, onRemove }) {
  return (
    <section className="space-y-6" aria-label="Case study approval tracker">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Real Case Studies</h3>
          <p className="mt-1 text-sm text-metallic">
            Do not publish confidential dimensions, protected drawings, pricing, or unsupported performance claims.
          </p>
        </div>
        <AccessibleButton type="button" onClick={onAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Add Case Study
        </AccessibleButton>
      </div>

      {!caseStudies.length ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-metallic">
          No real case studies tracked yet. Representative project examples remain visible on the public site.
        </p>
      ) : null}

      {caseStudies.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <ApprovalStatusBadge status={item.approvalStatus} />
            <ApprovalStatusBadge status={item.publicationStatus} />
            <ApprovalStatusBadge status={item.riskLevel} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Case Study Title">
              <input type="text" value={item.caseStudyTitle} onChange={(e) => onUpdate(item.id, { caseStudyTitle: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Customer Approved Name">
              <input type="text" value={item.customerApprovedName} onChange={(e) => onUpdate(item.id, { customerApprovedName: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Anonymous or Named">
              <select value={item.anonymousOrNamed} onChange={(e) => onUpdate(item.id, { anonymousOrNamed: e.target.value })} className={inputClass}>
                <option value="anonymous">Anonymous</option>
                <option value="named">Named</option>
              </select>
            </Field>
            <Field label="Industry">
              <input type="text" value={item.industry} onChange={(e) => onUpdate(item.id, { industry: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Capability">
              <input type="text" value={item.capability} onChange={(e) => onUpdate(item.id, { capability: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Material">
              <input type="text" value={item.material} onChange={(e) => onUpdate(item.id, { material: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Approval Status">
              <select value={item.approvalStatus} onChange={(e) => onUpdate(item.id, { approvalStatus: e.target.value, status: e.target.value })} className={inputClass}>
                {['draft', 'pending_customer_approval', 'approved', 'needs_revision', 'rejected', 'published', 'archived'].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
            <Field label="Publication Status">
              <select value={item.publicationStatus} onChange={(e) => onUpdate(item.id, { publicationStatus: e.target.value })} className={inputClass}>
                {['draft', 'pending_customer_approval', 'approved', 'published', 'archived'].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4 grid gap-4">
            <Field label="Challenge">
              <textarea value={item.challenge} onChange={(e) => onUpdate(item.id, { challenge: e.target.value })} rows={2} className={inputClass} />
            </Field>
            <Field label="Solution">
              <textarea value={item.solution} onChange={(e) => onUpdate(item.id, { solution: e.target.value })} rows={2} className={inputClass} />
            </Field>
            <Field label="Result">
              <textarea value={item.result} onChange={(e) => onUpdate(item.id, { result: e.target.value })} rows={2} className={inputClass} />
            </Field>
            <Field label="Project Photos">
              <input type="text" value={item.projectPhotos} onChange={(e) => onUpdate(item.id, { projectPhotos: e.target.value })} placeholder="Comma-separated filenames or IDs" className={inputClass} />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={item.isCustomerApproved} onChange={(e) => onUpdate(item.id, { isCustomerApproved: e.target.checked })} />
              Customer approved
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
              title="Case Study Safety Checklist"
              items={CASE_STUDY_SAFETY_CHECKLIST}
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

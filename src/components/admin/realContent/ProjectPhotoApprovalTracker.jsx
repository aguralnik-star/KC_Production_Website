import { ALLOWED_USAGE_OPTIONS, PHOTO_SAFETY_CHECKLIST } from '../../../data/realContentReplacementData';
import { PHOTO_CATEGORIES } from '../../../data/photoLibraryConfig';
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

export default function ProjectPhotoApprovalTracker({ photos, onAdd, onUpdate, onRemove }) {
  return (
    <section className="space-y-6" aria-label="Project photo approval tracker">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Project Photography</h3>
          <p className="mt-1 text-sm text-metallic">
            Do not publish photos showing customer drawings, part numbers, proprietary labels, or confidential fixtures.
          </p>
        </div>
        <AccessibleButton type="button" onClick={onAdd} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
          Add Photo
        </AccessibleButton>
      </div>

      {!photos.length ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-metallic">
          No project photos tracked yet. Industrial placeholders remain visible until approved photos are available.
        </p>
      ) : null}

      {photos.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <ApprovalStatusBadge status={item.status} />
            <ApprovalStatusBadge status={item.riskLevel} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Photo Title">
              <input type="text" value={item.photoTitle} onChange={(e) => onUpdate(item.id, { photoTitle: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Category">
              <select value={item.category} onChange={(e) => onUpdate(item.id, { category: e.target.value })} className={inputClass}>
                <option value="">Select category</option>
                {PHOTO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </Field>
            <Field label="Image Filename">
              <input type="text" value={item.imageFilename} onChange={(e) => onUpdate(item.id, { imageFilename: e.target.value })} placeholder="fixtures-aluminum-plate-001.jpg" className={inputClass} />
            </Field>
            <Field label="Related Capability">
              <input type="text" value={item.relatedCapability} onChange={(e) => onUpdate(item.id, { relatedCapability: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Related Project">
              <input type="text" value={item.relatedProject} onChange={(e) => onUpdate(item.id, { relatedProject: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Status">
              <select value={item.status} onChange={(e) => onUpdate(item.id, { status: e.target.value, approvalStatus: e.target.value })} className={inputClass}>
                {['draft', 'pending_customer_approval', 'approved', 'needs_revision', 'rejected', 'published', 'archived'].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Approved Usage">
              <div className="mt-1 flex flex-wrap gap-2">
                {ALLOWED_USAGE_OPTIONS.map((usage) => (
                  <label key={usage} className="flex items-center gap-1 text-xs text-charcoal">
                    <input
                      type="checkbox"
                      checked={(item.approvedUsage ?? []).includes(usage)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...(item.approvedUsage ?? []), usage]
                          : (item.approvedUsage ?? []).filter((u) => u !== usage);
                        onUpdate(item.id, { approvedUsage: next });
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
              <input type="checkbox" checked={item.customerApprovalRequired} onChange={(e) => onUpdate(item.id, { customerApprovalRequired: e.target.checked })} />
              Customer approval required
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={item.approvalReceived} onChange={(e) => onUpdate(item.id, { approvalReceived: e.target.checked, isCustomerApproved: e.target.checked })} />
              Approval received
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
              title="Photo Safety Checklist"
              items={PHOTO_SAFETY_CHECKLIST}
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

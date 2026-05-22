import ApprovalStatusBadge from '../realContent/ApprovalStatusBadge';

const CHECKLIST_STATUS = ['pending', 'passed', 'failed', 'not_applicable'];

export default function CaseStudyApprovalChecklist({ checklist, onUpdate, saving }) {
  const grouped = checklist.reduce((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    customer_approval: 'Customer Approval',
    photo_approval: 'Photo Approval',
    content_accuracy: 'Content Accuracy',
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:break-inside-avoid" aria-label="Confidentiality review">
      <h3 className="text-lg font-bold text-charcoal">5. Confidentiality Review — Approval Checklist</h3>
      <div className="mt-4 space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-metallic">{categoryLabels[category] ?? category}</h4>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-charcoal">{item.checklist_item}</p>
                    <ApprovalStatusBadge status={item.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CHECKLIST_STATUS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={saving}
                        onClick={() => onUpdate(item.id, { status })}
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${
                          item.status === status ? 'border-accent bg-accent text-white' : 'border-slate-200 text-charcoal'
                        }`}
                      >
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={item.evidence ?? ''}
                    onChange={(e) => onUpdate(item.id, { evidence: e.target.value })}
                    placeholder="Evidence / notes"
                    rows={2}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

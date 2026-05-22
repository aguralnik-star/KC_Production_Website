import { CONFIDENTIALITY_REVIEW_ITEMS } from '../../../data/realContentReplacementData';
import ApprovalStatusBadge from './ApprovalStatusBadge';

export default function ContentRiskChecklist({
  title = 'Confidentiality Review',
  items = CONFIDENTIALITY_REVIEW_ITEMS,
  checklist,
  onToggle,
  riskLevel,
  printFriendly = false,
}) {
  const completed = Object.values(checklist ?? {}).filter(Boolean).length;
  const total = items.length;

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${printFriendly ? 'print:break-inside-avoid print:shadow-none' : ''}`}
      aria-label={title}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-charcoal">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-metallic">{completed}/{total} complete</span>
          {riskLevel ? <ApprovalStatusBadge status={riskLevel} /> : null}
        </div>
      </div>

      {riskLevel === 'high' || riskLevel === 'critical' ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          High-risk content must not be published until all safety checks pass and customer approval is documented.
        </p>
      ) : null}

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={Boolean(checklist?.[item.id])}
                onChange={(event) => onToggle?.(item.id, event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
              />
              <span className="text-sm text-charcoal">{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

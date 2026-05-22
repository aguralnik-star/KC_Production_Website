import { AUDIT_CATEGORIES } from '../../../data/contentQAAuditData';
import QAStatusBadge from '../mobileQA/QAStatusBadge';

export default function ContentQAChecklist({ categoryChecks = {}, onUpdateCategory }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">Content QA Categories</p>
        <h3 className="mt-1 text-lg font-bold text-charcoal">Production Content Checklist</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {AUDIT_CATEGORIES.map((category) => {
          const check = categoryChecks[category.id] ?? { status: 'pending', notes: '' };

          return (
            <article key={category.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-charcoal">{category.title}</h4>
                <QAStatusBadge status={check.status === 'reviewed' ? 'passed' : 'pending'} />
              </div>

              <ul className="mt-3 space-y-1.5">
                {category.checks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-metallic">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
                <select
                  value={check.status}
                  onChange={(event) => onUpdateCategory(category.id, { status: event.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  aria-label={`${category.title} review status`}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                </select>
                <textarea
                  value={check.notes}
                  onChange={(event) => onUpdateCategory(category.id, { notes: event.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Category notes"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import { ChevronDown, ChevronUp } from 'lucide-react';
import RFQReadinessStatusBadge from './RFQReadinessStatusBadge';

function categoryStatus(checks = []) {
  if (checks.some((check) => check.status === 'failed')) return 'failed';
  if (checks.some((check) => check.status === 'pending')) return 'pending';
  if (checks.every((check) => check.status === 'not_applicable')) return 'not_applicable';
  return 'passed';
}

export default function RFQReadinessCategoryCard({
  category,
  checks = [],
  expanded = false,
  onToggle,
}) {
  const passed = checks.filter((check) => check.status === 'passed').length;
  const applicable = checks.filter((check) => check.status !== 'not_applicable').length;
  const progress = applicable > 0 ? Math.round((passed / applicable) * 100) : 100;
  const status = categoryStatus(checks);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-charcoal">{category}</h3>
            <RFQReadinessStatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-metallic">
            {passed} passed · {checks.length} total
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                status === 'failed'
                  ? 'bg-red-500'
                  : status === 'passed'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-metallic" aria-hidden="true" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-metallic" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {checks.map((check) => (
            <li key={check.id} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-charcoal">{check.check_name}</p>
                {check.check_description && (
                  <p className="mt-0.5 text-xs text-metallic">{check.check_description}</p>
                )}
              </div>
              <RFQReadinessStatusBadge status={check.status} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

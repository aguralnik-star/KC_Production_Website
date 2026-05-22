const STATUS_STYLES = {
  pending: 'border-slate-200 bg-slate-100 text-slate-700',
  in_progress: 'border-amber-200 bg-amber-50 text-amber-800',
  passed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  failed: 'border-red-200 bg-red-50 text-red-800',
  not_applicable: 'border-slate-200 bg-slate-50 text-slate-600',
};

export default function RFQReadinessStatusBadge({ status, label }) {
  const display = label ?? String(status ?? 'pending').replaceAll('_', ' ');
  const className = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}>
      {display}
    </span>
  );
}

export function ProductionReadyBadge({ productionReady, completionPercentage = 0 }) {
  if (productionReady) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
        Production Ready
      </span>
    );
  }

  if (completionPercentage >= 80) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
        Review Required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-red-300 bg-red-100 px-3 py-1 text-sm font-semibold text-red-900">
      Production Not Ready
    </span>
  );
}

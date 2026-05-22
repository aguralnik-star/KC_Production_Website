const STATUS_STYLES = {
  healthy: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  attention: 'border-amber-200 bg-amber-50 text-amber-800',
  critical: 'border-red-200 bg-red-50 text-red-800',
  critical_alert: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  watch: 'border-blue-200 bg-blue-50 text-blue-800',
  default: 'border-slate-200 bg-slate-100 text-slate-700',
};

export default function RFQOperationsStatusBadge({ status, label }) {
  const display = label ?? String(status ?? 'default').replaceAll('_', ' ');
  const className = STATUS_STYLES[status] ?? STATUS_STYLES.default;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}>
      {display}
    </span>
  );
}

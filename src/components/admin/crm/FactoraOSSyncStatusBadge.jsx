const STATUS_STYLES = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  sent: 'border-blue-200 bg-blue-50 text-blue-800',
  accepted: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  failed: 'border-red-200 bg-red-50 text-red-800',
  skipped: 'border-slate-200 bg-slate-100 text-slate-700',
};

export default function FactoraOSSyncStatusBadge({ status }) {
  const label = String(status ?? 'pending').replace(/_/g, ' ');
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
      {label}
    </span>
  );
}

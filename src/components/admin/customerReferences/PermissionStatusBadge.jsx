const STATUS_STYLES = {
  not_requested: 'border-slate-200 bg-slate-100 text-slate-700',
  missing: 'border-slate-200 bg-slate-50 text-slate-500',
  requested: 'border-amber-200 bg-amber-50 text-amber-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  declined: 'border-red-200 bg-red-50 text-red-800',
  expired: 'border-orange-200 bg-orange-50 text-orange-800',
  revoked: 'border-red-300 bg-red-100 text-red-900',
};

export default function PermissionStatusBadge({ status }) {
  const label = String(status ?? 'not_requested').replace(/_/g, ' ');
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.not_requested}`}>
      {label}
    </span>
  );
}

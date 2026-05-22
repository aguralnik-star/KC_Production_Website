const STATUS_STYLES = {
  draft: 'border-slate-200 bg-slate-100 text-slate-700',
  copied: 'border-blue-200 bg-blue-50 text-blue-800',
  sent_manually: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  awaiting_response: 'border-amber-200 bg-amber-50 text-amber-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  declined: 'border-red-200 bg-red-50 text-red-800',
  archived: 'border-slate-300 bg-slate-200 text-slate-600',
};

export default function ApprovalStatusBadge({ status }) {
  const label = String(status ?? 'draft').replace(/_/g, ' ');
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

const STATUS_STYLES = {
  draft: 'border-slate-200 bg-slate-100 text-slate-700',
  pending_customer_approval: 'border-amber-200 bg-amber-50 text-amber-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  needs_revision: 'border-orange-200 bg-orange-50 text-orange-800',
  rejected: 'border-red-200 bg-red-50 text-red-800',
  published: 'border-blue-200 bg-blue-50 text-blue-800',
  archived: 'border-slate-300 bg-slate-200 text-slate-600',
  low: 'border-slate-200 bg-slate-100 text-slate-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  critical: 'border-red-200 bg-red-50 text-red-800',
};

const STATUS_LABELS = {
  draft: 'Draft',
  pending_customer_approval: 'Pending Approval',
  approved: 'Approved',
  needs_revision: 'Needs Revision',
  rejected: 'Rejected',
  published: 'Published',
  archived: 'Archived',
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

export default function ApprovalStatusBadge({ status, className = '' }) {
  const label = STATUS_LABELS[status] ?? status?.replace(/_/g, ' ') ?? 'Unknown';
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft} ${className}`.trim()}
    >
      {label}
    </span>
  );
}

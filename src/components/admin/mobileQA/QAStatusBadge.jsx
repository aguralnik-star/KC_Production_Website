const STATUS_STYLES = {
  pending: 'border-slate-200 bg-slate-100 text-slate-700',
  passed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  needs_fix: 'border-amber-200 bg-amber-50 text-amber-800',
  blocked: 'border-red-200 bg-red-50 text-red-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  needs_revision: 'border-amber-200 bg-amber-50 text-amber-800',
  reviewed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  issue_found: 'border-red-200 bg-red-50 text-red-800',
  resolved: 'border-blue-200 bg-blue-50 text-blue-800',
  open: 'border-blue-200 bg-blue-50 text-blue-800',
  investigating: 'border-purple-200 bg-purple-50 text-purple-800',
  low: 'border-slate-200 bg-slate-100 text-slate-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  critical: 'border-red-200 bg-red-50 text-red-800',
};

const STATUS_LABELS = {
  pending: 'Pending',
  passed: 'Passed',
  needs_fix: 'Needs Fix',
  blocked: 'Blocked',
  approved: 'Approved',
  needs_revision: 'Needs Revision',
  reviewed: 'Reviewed',
  issue_found: 'Issue Found',
  resolved: 'Resolved',
  open: 'Open',
  investigating: 'Investigating',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export default function QAStatusBadge({ status, className = '' }) {
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.pending} ${className}`.trim()}
    >
      {label}
    </span>
  );
}

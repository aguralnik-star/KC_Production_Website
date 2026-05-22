const STATUS_STYLES = {
  received: 'bg-blue-100 text-blue-800 border-blue-200',
  under_review: 'bg-amber-100 text-amber-800 border-amber-200',
  additional_info_needed: 'bg-orange-100 text-orange-800 border-orange-200',
  quote_in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  quote_sent: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function RFQPublicStatusBadge({ status, label, className = '' }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.received;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style} ${className}`}>
      {label || status?.replace(/_/g, ' ') || 'Unknown'}
    </span>
  );
}

export { STATUS_STYLES };

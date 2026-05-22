const STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  in_review: { label: 'In Review', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  quoted: { label: 'Quoted', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function RFQStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status ?? 'Unknown',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${config.className}`}>
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };

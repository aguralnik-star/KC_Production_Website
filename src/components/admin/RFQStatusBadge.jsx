const STATUS_CONFIG = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  in_review: { label: 'In Review', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  quote_ready: { label: 'Quote Ready', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  quoted: { label: 'Quoted', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  waiting_on_customer: { label: 'Waiting on Customer', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  follow_up_needed: { label: 'Follow-Up Needed', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  won: { label: 'Won', className: 'bg-green-100 text-green-800 border-green-200' },
  lost: { label: 'Lost', className: 'bg-rose-100 text-rose-800 border-rose-200' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  copied: { label: 'Copied', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  manually_sent: { label: 'Manually Sent', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-500 border-slate-200' },
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

const LEVEL_CONFIG = {
  watch: {
    label: 'Watch',
    className: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  warning: {
    label: 'Warning',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800 border-red-300 ring-1 ring-red-200',
  },
  none: {
    label: 'None',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

export default function RFQAlertBadge({ level, className = '' }) {
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.none;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

export { LEVEL_CONFIG };

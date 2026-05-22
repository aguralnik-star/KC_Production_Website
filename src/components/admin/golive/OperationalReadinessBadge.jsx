const TONE_STYLES = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  yellow: 'border-amber-200 bg-amber-50 text-amber-800',
  red: 'border-red-200 bg-red-50 text-red-800',
};

const DOT_STYLES = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function OperationalReadinessBadge({ label, tone = 'yellow' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${TONE_STYLES[tone] ?? TONE_STYLES.yellow}`}
    >
      <span className={`h-2 w-2 rounded-full ${DOT_STYLES[tone] ?? DOT_STYLES.yellow}`} aria-hidden="true" />
      {label}
    </span>
  );
}

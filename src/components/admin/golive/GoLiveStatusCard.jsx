import OperationalReadinessBadge from './OperationalReadinessBadge';

const CARD_TONES = {
  green: 'border-emerald-200 bg-emerald-50',
  yellow: 'border-amber-200 bg-amber-50',
  red: 'border-red-200 bg-red-50',
  default: 'border-slate-200 bg-white',
};

export default function GoLiveStatusCard({ label, value, tone = 'default', showBadge = false, badgeLabel = '' }) {
  const badgeTone = tone === 'green' ? 'green' : tone === 'red' ? 'red' : 'yellow';

  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${CARD_TONES[tone] ?? CARD_TONES.default}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-metallic">{label}</p>
        {showBadge ? <OperationalReadinessBadge label={badgeLabel} tone={badgeTone} /> : null}
      </div>
      <p className="mt-2 text-3xl font-bold text-charcoal">{value}</p>
    </article>
  );
}

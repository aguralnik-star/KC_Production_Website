import { CREDIBILITY_BAND_ITEMS } from '../../data/trustSignalsData';

export default function CredibilityBand({ compact = false, className = '' }) {
  return (
    <section
      className={`kc-credibility-band ${compact ? 'kc-credibility-band--compact' : ''} ${className}`.trim()}
      aria-label="K&C credibility highlights"
    >
      <div className="kc-credibility-band__pattern" aria-hidden="true" />
      <div className="section-container relative">
        <ul className="kc-credibility-band__list">
          {CREDIBILITY_BAND_ITEMS.map(({ label }) => (
            <li key={label} className="kc-credibility-band__item">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

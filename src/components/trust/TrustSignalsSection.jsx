import { TRUST_SIGNALS } from '../../data/trustSignalsData';
import TrustSignalCard from './TrustSignalCard';
import TrustCTA from './TrustCTA';

export default function TrustSignalsSection({
  signals = TRUST_SIGNALS,
  variant = 'light',
  limit,
  showCTA = false,
  eyebrow = 'Why K&C',
  title = 'Manufacturing Credibility You Can Plan Around',
  description = 'Conservative, experience-based trust signals that reflect how K&C supports precision machining, tooling, fixtures, gauges, and production customers.',
  className = '',
}) {
  const items = limit ? signals.slice(0, limit) : signals;
  const isDark = variant === 'dark';

  return (
    <section
      className={`kc-trust-signals kc-trust-signals--${variant} section-padding ${className}`.trim()}
      aria-labelledby="trust-signals-heading"
    >
      <div className="kc-trust-signals__pattern" aria-hidden="true" />
      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-brand-accent' : 'text-accent'}`}>
            {eyebrow}
          </p>
          <h2
            id="trust-signals-heading"
            className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-charcoal'}`}
          >
            {title}
          </h2>
          {description ? (
            <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-metallic'}`}>
              {description}
            </p>
          ) : null}
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((signal) => (
            <li key={signal.id}>
              <TrustSignalCard signal={signal} variant={variant} />
            </li>
          ))}
        </ul>

        {showCTA ? (
          <div className="mt-10">
            <TrustCTA
              variant={isDark ? 'inline-light' : 'inline'}
              headline="Ready to discuss your next project?"
              body="Send your RFQ with drawings, specifications, and timeline requirements."
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

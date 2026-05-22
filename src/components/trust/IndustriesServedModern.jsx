import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';
import { INDUSTRIES_SERVED } from '../../data/industriesData';
import IndustryCapabilityCard from './IndustryCapabilityCard';

export default function IndustriesServedModern({
  industries = INDUSTRIES_SERVED,
  limit,
  showDescriptions = true,
  showCTA = false,
  showHeader = true,
  variant = 'light',
  eyebrow = 'Industries Served',
  title = 'Manufacturing Support Across Demanding Industrial Markets',
  description = 'K&C supports customers across transportation, medical, automotive, hydraulics, valves, heavy equipment, material handling, electronics, food service, military, and custom inspection applications.',
  ctaLabel = 'View All Industries',
  ctaTo = '/industries',
  className = '',
}) {
  const items = limit ? industries.slice(0, limit) : industries;
  const isDark = variant === 'dark';

  return (
    <section
      className={`kc-industries-modern kc-industries-modern--${variant} section-padding ${className}`.trim()}
      aria-labelledby={showHeader && title ? 'industries-served-heading' : undefined}
      aria-label={!showHeader || !title ? 'Industries served' : undefined}
    >
      <div className="section-container">
        {showHeader ? (
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              {eyebrow ? (
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-brand-accent' : 'text-accent'}`}>
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h2
                  id="industries-served-heading"
                  className={`${eyebrow ? 'mt-3' : ''} text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-charcoal'}`}
                >
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className={`mt-4 text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-metallic'}`}>
                  {description}
                </p>
              ) : null}
            </div>

            {showCTA ? (
              <CTAButton
                to={ctaTo}
                variant={isDark ? 'light' : 'secondary'}
                className="shrink-0"
                analyticsLabel={ctaLabel}
                analyticsLocation="industries_preview"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
            ) : null}
          </div>
        ) : null}

        <ul className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ${showHeader ? 'mt-10' : ''}`}>
          {items.map((industry) => (
            <li key={industry.id}>
              <IndustryCapabilityCard industry={industry} showDescription={showDescriptions} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

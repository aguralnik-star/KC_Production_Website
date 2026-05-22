import { ArrowRight, Crosshair, RefreshCw, ScanLine, ShieldCheck } from 'lucide-react';
import CTAButton from '../CTAButton';
import HeroTrustBadge from '../HeroTrustBadge';

const HERO_BADGES = [
  { label: 'Precision Inspection', icon: ScanLine },
  { label: 'Repeatable Results', icon: RefreshCw },
  { label: 'CMM Capability', icon: Crosshair },
  { label: 'Customer-First Quality', icon: ShieldCheck },
];

export default function QualityHero() {
  return (
    <section className="hero-kc !min-h-[min(720px,88vh)]" aria-labelledby="quality-hero-heading">
      <div className="hero-kc__background" aria-hidden="true">
        <div className="hero-kc__grid" />
        <div className="hero-kc__lines" />
        <div className="hero-kc__glow" />
        <div className="hero-kc__overlay" />
      </div>

      <div className="section-padding relative">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-2xl">
              <p className="hero-kc__eyebrow">Quality</p>
              <h1 id="quality-hero-heading" className="hero-kc__headline">
                Inspection-Driven Precision Manufacturing
              </h1>
              <p className="hero-kc__subheadline">
                K&C Design and Manufacturing is committed to first-class quality, repeatability, documentation,
                responsiveness, and customer trust throughout every machining, tooling, fixture, and gauge project.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTAButton to="/contact" className="hero-kc__cta-primary">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton to="/equipment" variant="light">
                  View Equipment
                </CTAButton>
              </div>
            </div>

            <div className="hero-kc__visual-wrap">
              <div className="hero-industrial-card" aria-label="Quality and inspection focus areas">
                <div className="hero-industrial-card__glow" aria-hidden="true" />
                <div className="hero-industrial-card__lines" aria-hidden="true" />
                <div className="hero-industrial-card__content">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                    Quality Focus
                  </p>
                  <ul className="hero-industrial-card__services mt-4 !border-t-0 !pt-0">
                    {HERO_BADGES.map(({ label, icon: Icon }) => (
                      <li key={label}>
                        <Icon className="h-5 w-5 shrink-0 text-brand-accent" aria-hidden="true" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Quality highlights">
            {HERO_BADGES.map(({ label, icon }) => (
              <li key={`badge-${label}`}>
                <HeroTrustBadge icon={icon}>{label}</HeroTrustBadge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

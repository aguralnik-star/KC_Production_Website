import { ArrowRight, Award, Factory, MapPin, ShieldCheck } from 'lucide-react';
import CTAButton from './CTAButton';
import HeroTrustBadge from './HeroTrustBadge';
import Logo from './Logo';
import { HERO_CONTENT } from '../config/siteConfig';

const TRUST_BADGES = [
  { label: 'Founded in 1987', icon: Award },
  { label: 'Midwest Manufacturing Partner', icon: MapPin },
  { label: 'CNC Machining & Tooling', icon: Factory },
  { label: 'Quality-Driven Inspection', icon: ShieldCheck },
];

const VISUAL_SERVICES = [
  'CNC Machining',
  'Fixtures & Gauges',
  'Production Tooling',
  'Inspection-Ready Quality',
];

const VISUAL_STATS = [
  { value: '1987', label: 'Founded' },
  { value: 'Addison, IL', label: 'Location' },
  { value: 'Precision', label: 'Manufacturing' },
];

export default function Hero() {
  return (
    <section className="hero-kc" aria-labelledby="home-hero-heading">
      <div className="hero-kc__background" aria-hidden="true">
        <div className="hero-kc__grid" />
        <div className="hero-kc__lines" />
        <div className="hero-kc__watermark" />
        <div className="hero-kc__glow" />
        <div className="hero-kc__overlay" />
      </div>

      <div className="section-padding relative">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <div className="max-w-2xl">
              <p className="hero-kc__eyebrow">{HERO_CONTENT.eyebrow}</p>
              <h1 id="home-hero-heading" className="hero-kc__headline">
                {HERO_CONTENT.headline}
              </h1>
              <p className="hero-kc__subheadline">{HERO_CONTENT.subheadline}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTAButton to="/contact" className="hero-kc__cta-primary">
                  {HERO_CONTENT.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton to="/capabilities" variant="light" className="hero-kc__cta-secondary">
                  {HERO_CONTENT.secondaryCta}
                </CTAButton>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Company trust indicators">
                {TRUST_BADGES.map(({ label, icon }) => (
                  <li key={label}>
                    <HeroTrustBadge icon={icon}>{label}</HeroTrustBadge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-kc__visual-wrap">
              <div className="hero-industrial-card" aria-label="K&C manufacturing capabilities overview">
                <div className="hero-industrial-card__glow" aria-hidden="true" />
                <div className="hero-industrial-card__lines" aria-hidden="true" />

                <div className="hero-industrial-card__content">
                  <Logo variant="mark" showText={false} className="hero-industrial-card__mark" />

                  <ul className="hero-industrial-card__services">
                    {VISUAL_SERVICES.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>

                  <div className="hero-industrial-card__stats">
                    {VISUAL_STATS.map(({ value, label }) => (
                      <div key={label} className="hero-industrial-card__stat">
                        <p className="hero-industrial-card__stat-value">{value}</p>
                        <p className="hero-industrial-card__stat-label">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

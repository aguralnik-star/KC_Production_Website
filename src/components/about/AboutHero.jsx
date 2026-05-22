import { ArrowRight, Award, Factory, Handshake, MapPin } from 'lucide-react';
import CTAButton from '../CTAButton';
import HeroTrustBadge from '../HeroTrustBadge';

const HERO_BADGES = [
  { label: 'Founded in 1987', icon: Award },
  { label: 'Addison, Illinois', icon: MapPin },
  { label: 'Precision Manufacturing', icon: Factory },
  { label: 'Long-Term Customer Relationships', icon: Handshake },
];

export default function AboutHero() {
  return (
    <section className="hero-kc !min-h-[min(720px,88vh)]" aria-labelledby="about-hero-heading">
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
              <p className="hero-kc__eyebrow">About K&amp;C</p>
              <h1 id="about-hero-heading" className="hero-kc__headline">
                Family-Owned Precision Manufacturing Since 1987
              </h1>
              <p className="hero-kc__subheadline">
                K&amp;C Design and Manufacturing has built its reputation on quality precision machining, responsive
                service, competitive pricing, prompt quotations, first-class quality, industry expertise, and on-time
                delivery.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTAButton to="/contact" className="hero-kc__cta-primary">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton to="/capabilities" variant="light">
                  View Capabilities
                </CTAButton>
              </div>
            </div>

            <div className="hero-kc__visual-wrap">
              <div className="hero-industrial-card" aria-label="K&C company highlights">
                <div className="hero-industrial-card__glow" aria-hidden="true" />
                <div className="hero-industrial-card__lines" aria-hidden="true" />
                <div className="hero-industrial-card__content">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                    Company Highlights
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

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="About K&C highlights">
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

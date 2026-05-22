import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';
import Logo from '../Logo';

const CAPABILITY_PILLS = ['CNC Milling', 'CNC Turning', 'Fixtures', 'Gauges', 'Tooling', 'Inspection'];

const MINI_STATS = [
  { value: 'Founded in 1987', label: 'Heritage' },
  { value: 'Addison, IL', label: 'Location' },
  { value: 'Midwest Manufacturing Partner', label: 'Service Area' },
  { value: 'Quality-Driven', label: 'Focus' },
];

export default function HomeHeroV2() {
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
              <p className="hero-kc__eyebrow">Precision CNC Machining • Tooling • Fixtures • Gauges</p>
              <h1 id="home-hero-heading" className="hero-kc__headline">
                Precision Manufacturing Built on Quality, Service, and Long-Term Trust
              </h1>
              <p className="hero-kc__subheadline">
                K&amp;C Design and Manufacturing provides CNC machining, production tooling, inspection fixtures,
                gauges, prototypes, and custom manufactured components for Midwest manufacturers.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTAButton to="/contact" className="hero-kc__cta-primary" analyticsLabel="Request a Quote" analyticsLocation="home_hero">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <CTAButton to="/capabilities" variant="light" analyticsLabel="View Capabilities" analyticsLocation="home_hero">
                  View Capabilities
                </CTAButton>
              </div>
            </div>

            <div className="hero-kc__visual-wrap">
              <div className="hero-industrial-card home-hero-v2__card" aria-label="K&C manufacturing capabilities overview">
                <div className="hero-industrial-card__glow" aria-hidden="true" />
                <div className="hero-industrial-card__lines" aria-hidden="true" />
                <div className="home-hero-v2__watermark" aria-hidden="true">
                  <Logo variant="mark" showText={false} className="h-full w-full object-contain opacity-20" />
                </div>

                <div className="hero-industrial-card__content relative">
                  <Logo variant="mark" showText={false} className="hero-industrial-card__mark" />

                  <div className="home-hero-v2__pills mt-6">
                    {CAPABILITY_PILLS.map((pill) => (
                      <span key={pill} className="home-hero-v2__pill">
                        {pill}
                      </span>
                    ))}
                  </div>

                  <div className="home-hero-v2__stats mt-8">
                    {MINI_STATS.map(({ value, label }) => (
                      <div key={label} className="hero-industrial-card__stat">
                        <p className="hero-industrial-card__stat-value text-xs sm:text-sm">{value}</p>
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

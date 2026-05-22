import { ArrowRight, Cpu, Factory, Gauge, Layers, Ruler, Wrench } from 'lucide-react';
import CTAButton from '../CTAButton';
import HeroTrustBadge from '../HeroTrustBadge';

const HERO_BADGES = [
  { label: 'CNC Machining', icon: Cpu },
  { label: 'Fixtures', icon: Layers },
  { label: 'Gauges', icon: Ruler },
  { label: 'Tooling', icon: Wrench },
  { label: 'Prototypes', icon: Factory },
  { label: 'Production Components', icon: Gauge },
];

export default function ProjectsHero() {
  return (
    <section className="hero-kc !min-h-[min(680px,82vh)]" aria-labelledby="projects-hero-heading">
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
              <p className="hero-kc__eyebrow">Project Showcase</p>
              <h1 id="projects-hero-heading" className="hero-kc__headline">
                Representative Manufacturing Projects and Capabilities
              </h1>
              <p className="hero-kc__subheadline">
                Explore representative examples of machining, tooling, fixtures, gauges, and custom manufactured
                components that reflect the types of work K&amp;C Design and Manufacturing supports.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Representative examples only — not actual customer projects or proprietary details.
              </p>
              <div className="mt-8">
                <CTAButton to="/contact" className="hero-kc__cta-primary">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </CTAButton>
              </div>
            </div>

            <div className="hero-kc__visual-wrap">
              <div className="hero-industrial-card" aria-label="Representative project categories">
                <div className="hero-industrial-card__glow" aria-hidden="true" />
                <div className="hero-industrial-card__lines" aria-hidden="true" />
                <div className="hero-industrial-card__content">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                    Project Types
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

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-label="Showcase highlights">
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

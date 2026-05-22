import { ArrowRight, Cpu, Factory, Gauge, Layers, RotateCw, Ruler, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICE_NAV_LINKS } from '../../data/seoServicePages';

const ICONS = {
  'cnc-machining': Cpu,
  'cnc-milling': Layers,
  'cnc-turning': RotateCw,
  tooling: Wrench,
  fixtures: Factory,
  gauges: Ruler,
  'prototype-machining': Gauge,
  'production-machining': Factory,
};

export default function HomeServicesPreview() {
  return (
    <section className="section-padding" aria-labelledby="home-services-heading">
      <div className="section-container">
        <h2
          id="home-services-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Precision Manufacturing Services
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-metallic">
          Explore K&amp;C machining, tooling, fixture, gauge, prototype, and production services designed to support
          Midwest manufacturers from RFQ through delivery.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_NAV_LINKS.map(({ slug, label }) => {
            const Icon = ICONS[slug] ?? Cpu;
            return (
              <article key={slug} className="card group h-full">
                <div className="capability-feature-card__icon" aria-hidden="true">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">{label}</h3>
                <Link
                  to={`/services/${slug}`}
                  className="home-preview-link mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary group-hover:text-brand-accent"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

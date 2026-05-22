import { ArrowRight, Cpu, Factory, FlaskConical, RotateCw, Ruler, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CAPABILITIES } from '../../data/company';

const ICONS = [Cpu, RotateCw, FlaskConical, Factory, Ruler, Wrench];

export default function HomeCapabilitiesPreview() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="home-capabilities-heading">
      <div className="section-container">
        <h2
          id="home-capabilities-heading"
          className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          Manufacturing Capabilities Built Around Your Project
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability, index) => {
            const Icon = ICONS[index];
            return (
              <article key={capability.title} className="card group h-full">
                <div className="capability-feature-card__icon" aria-hidden="true">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">{capability.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metallic">{capability.description}</p>
                <Link
                  to="/capabilities"
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

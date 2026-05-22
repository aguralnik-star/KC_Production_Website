import { Award, Clock, DollarSign, Handshake, MapPin, ShieldCheck } from 'lucide-react';
import { SHARED_WHY_KC } from '../../data/seoServicePages';

const ICONS = [Award, MapPin, Clock, DollarSign, ShieldCheck, Handshake];

export default function ServiceWhyKC() {
  return (
    <section className="section-padding bg-brand-light" aria-labelledby="service-why-kc-heading">
      <div className="section-container">
        <h2 id="service-why-kc-heading" className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          Why K&amp;C
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHARED_WHY_KC.map(({ title, description }, index) => {
            const Icon = ICONS[index];
            return (
              <article key={title} className="card h-full">
                <div className="capability-feature-card__icon" aria-hidden="true">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

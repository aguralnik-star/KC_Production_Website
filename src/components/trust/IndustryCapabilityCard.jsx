import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function IndustryCapabilityCard({ industry, showDescription = true }) {
  const Icon = industry.icon;

  return (
    <article className="kc-industry-capability-card card h-full">
      <div className="kc-industry-capability-card__icon" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="kc-industry-capability-card__title">{industry.name}</h3>

      {showDescription ? (
        <p className="kc-industry-capability-card__description">{industry.description}</p>
      ) : null}

      {industry.commonProjectTypes?.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-metallic">Common Project Types</h4>
          <ul className="mt-2 space-y-1.5">
            {industry.commonProjectTypes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {industry.relatedServices?.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-metallic">Related Services</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {industry.relatedServices.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  {service.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

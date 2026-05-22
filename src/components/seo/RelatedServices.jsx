import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelatedServiceLinks } from '../../data/internalLinksData';

export default function RelatedServices({
  serviceSlug,
  title = 'Related Manufacturing Services',
  description = 'Explore additional K&C services commonly requested alongside this capability.',
  limit = 5,
  className = 'bg-brand-light',
}) {
  const links = getRelatedServiceLinks(serviceSlug, limit);
  if (!links.length) return null;

  return (
    <section className={`section-padding ${className}`.trim()} aria-labelledby="related-services-heading">
      <div className="section-container">
        <h2 id="related-services-heading" className="text-center text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-metallic">{description}</p>
        ) : null}

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="kc-related-service-card group">
                <span className="kc-related-service-card__title">{link.label}</span>
                <span className="kc-related-service-card__action">
                  View service
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

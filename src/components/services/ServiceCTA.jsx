import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTAButton from '../CTAButton';
import { SHARED_CTA } from '../../data/seoServicePages';
import { trackCTAClick } from '../../utils/analytics';

export default function ServiceCTA({ relatedServices = [], serviceSlug = '' }) {
  const serviceLocation = serviceSlug ? `service_${serviceSlug}` : 'service_page';

  return (
    <>
      {relatedServices.length > 0 ? (
        <section className="section-padding bg-brand-light" aria-labelledby="service-related-heading">
          <div className="section-container">
            <h2 id="service-related-heading" className="text-center text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Related Services
            </h2>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {relatedServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={service.path}
                    className="inline-flex rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition-colors hover:border-brand-accent hover:text-brand-accent"
                    onClick={() => trackCTAClick(service.eyebrow, `${serviceLocation}_related`, service.path)}
                  >
                    {service.eyebrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section-padding bg-charcoal" aria-labelledby="service-cta-heading">
        <div className="section-container text-center">
          <h2 id="service-cta-heading" className="text-3xl font-bold text-white sm:text-4xl">
            {SHARED_CTA.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">{SHARED_CTA.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton
              to={SHARED_CTA.buttonLink}
              analyticsLabel={SHARED_CTA.buttonLabel}
              analyticsLocation={serviceLocation}
            >
              {SHARED_CTA.buttonLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CTAButton>
            <CTAButton to="/capabilities" variant="light" analyticsLabel="View Capabilities" analyticsLocation={serviceLocation}>
              View Capabilities
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}

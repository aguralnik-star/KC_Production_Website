import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';
import { SHARED_CTA } from '../../data/seoServicePages';

export default function ServiceCTA({ serviceSlug = '' }) {
  const serviceLocation = serviceSlug ? `service_${serviceSlug}` : 'service_page';

  return (
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
  );
}

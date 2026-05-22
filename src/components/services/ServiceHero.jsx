import { ArrowRight } from 'lucide-react';
import CTAButton from '../CTAButton';

export default function ServiceHero({ eyebrow, h1, overview, serviceSlug = '' }) {
  const location = serviceSlug ? `service_${serviceSlug}_hero` : 'service_hero';
  return (
    <section className="hero-kc !min-h-[min(680px,82vh)]" aria-labelledby="service-hero-heading">
      <div className="hero-kc__background" aria-hidden="true">
        <div className="hero-kc__grid" />
        <div className="hero-kc__lines" />
        <div className="hero-kc__glow" />
        <div className="hero-kc__overlay" />
      </div>

      <div className="section-padding relative">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="hero-kc__eyebrow">{eyebrow}</p>
            <h1 id="service-hero-heading" className="hero-kc__headline">
              {h1}
            </h1>
            <p className="hero-kc__subheadline">{overview}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CTAButton to="/contact" className="hero-kc__cta-primary" analyticsLabel="Request a Quote" analyticsLocation={location}>
                Request a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton to="/capabilities" variant="light" analyticsLabel="View Capabilities" analyticsLocation={location}>
                View Capabilities
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
